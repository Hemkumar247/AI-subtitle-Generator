export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result looks like "data:audio/mpeg;base64,....."
      // We need to extract just the base64 part
      const base64String = result.split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error("Failed to read file as base64."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    const objectUrl = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
      URL.revokeObjectURL(objectUrl);
    });

    audio.addEventListener('error', (e) => {
      reject(new Error(`Failed to load audio metadata. Error: ${e.message}`));
      URL.revokeObjectURL(objectUrl);
    });
    
    audio.src = objectUrl;
  });
};