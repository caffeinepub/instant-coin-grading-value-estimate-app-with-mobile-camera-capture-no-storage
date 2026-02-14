/**
 * Client-side deterministic image heuristics for coin condition analysis.
 * These metrics approximate coin quality without external AI services.
 */

export interface ImageFeatures {
  sharpness: number;
  contrast: number;
  edgeClarity: number;
}

/**
 * Extract image features from a File object.
 * Returns normalized scores (0-100) for sharpness, contrast, and edge clarity.
 */
export async function extractImageFeatures(file: File): Promise<ImageFeatures> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculate features
      const sharpness = calculateSharpness(data, canvas.width, canvas.height);
      const contrast = calculateContrast(data);
      const edgeClarity = calculateEdgeClarity(data, canvas.width, canvas.height);

      resolve({
        sharpness: Math.round(sharpness),
        contrast: Math.round(contrast),
        edgeClarity: Math.round(edgeClarity),
      });

      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Calculate sharpness using edge magnitude (Sobel operator approximation).
 * Higher values indicate sharper images.
 */
function calculateSharpness(data: Uint8ClampedArray, width: number, height: number): number {
  let totalEdgeMagnitude = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      // Convert to grayscale
      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];

      // Get neighboring pixels
      const grayLeft = 0.299 * data[idx - 4] + 0.587 * data[idx - 3] + 0.114 * data[idx - 2];
      const grayRight = 0.299 * data[idx + 4] + 0.587 * data[idx + 5] + 0.114 * data[idx + 6];
      const grayTop = 0.299 * data[idx - width * 4] + 0.587 * data[idx - width * 4 + 1] + 0.114 * data[idx - width * 4 + 2];
      const grayBottom = 0.299 * data[idx + width * 4] + 0.587 * data[idx + width * 4 + 1] + 0.114 * data[idx + width * 4 + 2];

      // Sobel approximation
      const gx = grayRight - grayLeft;
      const gy = grayBottom - grayTop;
      const magnitude = Math.sqrt(gx * gx + gy * gy);

      totalEdgeMagnitude += magnitude;
      count++;
    }
  }

  const avgEdgeMagnitude = totalEdgeMagnitude / count;
  // Normalize to 0-100 scale (empirically tuned)
  return Math.min(100, (avgEdgeMagnitude / 50) * 100);
}

/**
 * Calculate contrast using luminance distribution.
 * Higher values indicate better contrast.
 */
function calculateContrast(data: Uint8ClampedArray): number {
  const luminances: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    luminances.push(luminance);
  }

  // Calculate standard deviation
  const mean = luminances.reduce((sum, val) => sum + val, 0) / luminances.length;
  const variance = luminances.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / luminances.length;
  const stdDev = Math.sqrt(variance);

  // Normalize to 0-100 scale
  return Math.min(100, (stdDev / 70) * 100);
}

/**
 * Calculate edge clarity using high-frequency edge density.
 * Higher values indicate clearer, more defined edges.
 */
function calculateEdgeClarity(data: Uint8ClampedArray, width: number, height: number): number {
  let strongEdgeCount = 0;
  let totalPixels = 0;

  const threshold = 30; // Edge strength threshold

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      const grayLeft = 0.299 * data[idx - 4] + 0.587 * data[idx - 3] + 0.114 * data[idx - 2];
      const grayRight = 0.299 * data[idx + 4] + 0.587 * data[idx + 5] + 0.114 * data[idx + 6];
      const grayTop = 0.299 * data[idx - width * 4] + 0.587 * data[idx - width * 4 + 1] + 0.114 * data[idx - width * 4 + 2];
      const grayBottom = 0.299 * data[idx + width * 4] + 0.587 * data[idx + width * 4 + 1] + 0.114 * data[idx + width * 4 + 2];

      const gx = grayRight - grayLeft;
      const gy = grayBottom - grayTop;
      const magnitude = Math.sqrt(gx * gx + gy * gy);

      if (magnitude > threshold) {
        strongEdgeCount++;
      }
      totalPixels++;
    }
  }

  const edgeDensity = strongEdgeCount / totalPixels;
  // Normalize to 0-100 scale
  return Math.min(100, (edgeDensity / 0.15) * 100);
}
