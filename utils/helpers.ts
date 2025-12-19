// Input Sanitization to prevent basic SQL Injection / XSS attempts on the frontend
export const sanitizeInput = (input: string | number): string => {
  if (typeof input === 'number') return input.toString();
  if (!input) return '';
  // Remove common SQL injection characters and HTML tags
  return input
    .replace(/--/g, '') // SQL comment
    .replace(/;/g, '') // SQL statement terminator
    .replace(/[<>]/g, '') // HTML tags
    .replace(/'/g, "''"); // Escape single quotes
};

// Title Case: Capitalizes first letter of each word, preserves trailing spaces
// This allows typing spaces at the end and auto-capitalizes subsequent words.
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  
  // Allow spaces, letters, numbers and basic punctuation
  const cleaned = str.replace(/[^a-zA-Z0-9\s,.()/-]/g, '');
  
  // Split into words, but keep the spaces intact
  // Regex matches start of string OR after a space, and finds the first non-space character
  return cleaned.replace(/(^|\s)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
};

// Bio Case: Lowercase except first character of each word (after space or start)
// Preserves spaces and allows punctuation for bio text
export const toBioCase = (str: string): string => {
  if (!str) return '';
  // Capitalize first char of each word (after space or at start)
  return str.replace(/(^|\s)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
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
