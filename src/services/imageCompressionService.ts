import imageCompression from 'browser-image-compression';

export const compressImageForUpload = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    onProgress: (progress: number) => {
      if (onProgress) {
        onProgress(progress);
      }
    },
  };

  try {
    const compressedFile = await imageCompression(file, options);
    console.log(
      `Compressed ${file.name} from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
    );
    return compressedFile;
  } catch (error) {
    console.warn('Image compression failed, using original file:', error);
    return file;
  }
};
