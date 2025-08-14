import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParsedPantryItem {
  name: string;
  quantity?: number;
  unit?: string;
  confidence?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting pantry parsing request');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Parse multipart form data
    const formData = await req.formData();
    const scanType = formData.get('scan_type') as string || 'receipt';
    
    console.log(`Scan type: ${scanType}`);

    // Collect all image files with validation
    const imageFiles: File[] = [];
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        // Validate file size
        if (value.size > maxFileSize) {
          throw new Error(`File ${value.name} is too large. Maximum 10MB allowed.`);
        }
        
        // Validate file type
        if (!allowedTypes.includes(value.type)) {
          throw new Error(`File ${value.name} has invalid type. Only JPEG, PNG, and WebP are allowed.`);
        }
        
        imageFiles.push(value);
      }
    }

    if (imageFiles.length === 0) {
      throw new Error('No valid images provided');
    }

    if (imageFiles.length > 5) {
      throw new Error('Too many images. Maximum 5 images allowed per request.');
    }

    console.log(`Processing ${imageFiles.length} images`);

    // Process images with OpenAI Vision API
    const results: ParsedPantryItem[] = [];
    
    for (const imageFile of imageFiles) {
      try {
        // Convert image to base64
        const buffer = await imageFile.arrayBuffer();
        const base64Image = btoa(
          String.fromCharCode(...new Uint8Array(buffer))
        );
        const mimeType = imageFile.type;

        // Create appropriate prompt based on scan type
        const prompt = scanType === 'receipt' 
          ? `Analyze this grocery receipt image and extract all food items with their quantities. 
             Return a JSON array of objects with format: {"name": "item name", "quantity": number, "unit": "unit", "confidence": 0.0-1.0}.
             Only include actual food items, not non-food products. Be precise with quantities and units.
             Example: [{"name": "Tomatoes", "quantity": 1, "unit": "kg", "confidence": 0.95}]`
          : `Analyze this fridge/pantry image and identify all visible food items with estimated remaining quantities.
             Return a JSON array of objects with format: {"name": "item name", "quantity": number, "unit": "unit", "confidence": 0.0-1.0}.
             Estimate quantities based on what you can see. Use appropriate units (kg, g, L, ml, pieces, etc.).
             Example: [{"name": "Milk", "quantity": 1, "unit": "L", "confidence": 0.9}]`;

        console.log(`Sending image to OpenAI Vision API`);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: prompt
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: `data:${mimeType};base64,${base64Image}`
                    }
                  }
                ]
              }
            ],
            max_tokens: 1000,
            temperature: 0.1
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI API error:', errorText);
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
          console.log('No content returned from OpenAI');
          continue;
        }

        console.log('OpenAI response:', content);

        // Parse JSON response
        try {
          // Extract JSON from the response (in case there's additional text)
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          const jsonString = jsonMatch ? jsonMatch[0] : content;
          const parsedItems: ParsedPantryItem[] = JSON.parse(jsonString);
          
          // Validate and clean the parsed items
          const validItems = parsedItems.filter(item => 
            item.name && 
            typeof item.name === 'string' && 
            item.name.trim().length > 0
          ).map(item => ({
            name: item.name.trim(),
            quantity: typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
            unit: typeof item.unit === 'string' ? item.unit : 'piece',
            confidence: typeof item.confidence === 'number' ? 
              Math.max(0, Math.min(1, item.confidence)) : 0.8
          }));

          results.push(...validItems);
          console.log(`Extracted ${validItems.length} items from image`);
          
        } catch (parseError) {
          console.error('Error parsing JSON from OpenAI:', parseError);
          console.log('Raw content:', content);
          
          // Fallback: try to extract items manually
          const lines = content.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const match = line.match(/([^0-9]+)\s*(\d*\.?\d*)\s*(\w+)?/);
            if (match) {
              const [, name, quantity, unit] = match;
              if (name && name.trim()) {
                results.push({
                  name: name.trim(),
                  quantity: parseFloat(quantity) || 1,
                  unit: unit || 'piece',
                  confidence: 0.7
                });
              }
            }
          }
        }
        
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        // Continue with other images
      }
    }

    console.log(`Total items extracted: ${results.length}`);

    return new Response(JSON.stringify({ 
      items: results,
      scan_type: scanType,
      processed_images: imageFiles.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in parse-pantry function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      items: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});