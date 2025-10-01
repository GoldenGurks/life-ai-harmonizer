import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { compressImageForUpload } from '@/services/imageCompressionService';
import { toast } from 'sonner';

export const usePantryScanning = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const scanImage = useCallback(async (file: File) => {
    setIsScanning(true);
    setProgress(10);

    try {
      // Compress image
      setProgress(20);
      const compressedFile = await compressImageForUpload(file, (compressionProgress) => {
        setProgress(20 + compressionProgress * 0.2); // 20-40%
      });

      // Upload to storage
      setProgress(40);
      const fileName = `pantry-scan-${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pantry-scans')
        .upload(fileName, compressedFile);

      if (uploadError) throw uploadError;

      // Call edge function to parse
      setProgress(60);
      const { data: parseData, error: parseError } = await supabase.functions.invoke(
        'parse-pantry',
        {
          body: { imageUrl: uploadData.path },
        }
      );

      if (parseError) throw parseError;

      setProgress(100);
      toast.success('Image scanned successfully!');
      
      return parseData;
    } catch (error) {
      console.error('Scanning error:', error);
      toast.error('Failed to scan image');
      throw error;
    } finally {
      setIsScanning(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, []);

  return { scanImage, isScanning, progress };
};
