import { supabase } from '@/integrations/supabase/client';

export interface ParsedPantryItem {
  name: string;
  quantity?: number;
  unit?: string;
  confidence?: number;
}

/**
 * Service for AI-powered pantry scanning from images
 * Handles both receipt and fridge photo processing
 */
export class PantryScanService {
  
  /**
   * Scans images and returns parsed pantry items
   * @param files Array of image files to scan
   * @param scanType Type of scan - 'receipt' or 'fridge'
   * @returns Promise with parsed pantry items
   */
  static async scanImages(files: File[], scanType: 'receipt' | 'fridge' = 'receipt'): Promise<ParsedPantryItem[]> {
    try {
      // Create FormData to send files
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`image_${index}`, file);
      });
      formData.append('scan_type', scanType);

      // Call the Supabase edge function
      const { data, error } = await supabase.functions.invoke('parse-pantry', {
        body: formData,
      });

      if (error) {
        console.error('Error calling parse-pantry function:', error);
        throw new Error(`Failed to parse images: ${error.message}`);
      }

      if (!data || !data.items) {
        throw new Error('Invalid response from pantry parsing service');
      }

      return data.items as ParsedPantryItem[];
    } catch (error) {
      console.error('Error in scanImages:', error);
      throw error;
    }
  }

  /**
   * Validates and cleans parsed pantry items
   * @param items Raw parsed items from the API
   * @returns Cleaned and validated items
   */
  static validateParsedItems(items: ParsedPantryItem[]): ParsedPantryItem[] {
    return items.filter(item => {
      // Basic validation - item must have a name
      if (!item.name || item.name.trim().length === 0) {
        return false;
      }

      // Ensure reasonable confidence level (if provided)
      if (item.confidence !== undefined && item.confidence < 0.5) {
        return false;
      }

      return true;
    }).map(item => ({
      ...item,
      name: item.name.trim(),
      quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
      unit: item.unit?.trim() || 'piece',
      confidence: item.confidence || 0.8
    }));
  }

  /**
   * Converts parsed items to pantry format for storage
   * @param items Parsed pantry items
   * @returns Items formatted for pantry storage
   */
  static convertToPantryItems(items: ParsedPantryItem[]) {
    return items.map((item, index) => ({
      id: `scanned_${Date.now()}_${index}`,
      name: item.name,
      quantity: item.quantity || 1,
      unit: item.unit || 'piece',
      category: 'scanned', // Mark as scanned items
      addedAt: new Date().toISOString(),
      expiryDate: null // No expiry date for scanned items
    }));
  }
}

export default PantryScanService;