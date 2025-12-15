// Input Sanitization to prevent basic SQL Injection / XSS attempts on the frontend
export const sanitizeInput = (input: string | number): string => {
  if (typeof input === 'number') return input.toString();
  if (!input) return '';
  // Remove common SQL injection characters and HTML tags
  return input
    .replace(/--/g, '') // SQL comment
    .replace(/;/g, '') // SQL statement terminator
    .replace(/[<>]/g, '') // HTML tags
    .replace(/'/g, "''") // Escape single quotes (though Supabase handles this, it's good practice for the requirement)
    .trim();
};

// Image Compression Utility
export const compressImage = async (file: File, maxWidth = 800, quality = 0.7): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression failed'));
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
