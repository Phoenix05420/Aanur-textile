/**
 * Product image and variant helpers
 */

/**
 * Returns an array of image URLs for a product, handling various product schemas:
 * - product.images array
 * - product.variants[].image array
 * - product.image fallback
 */
export function getProductImages(product) {
  if (!product) return [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const variantImgs = product.variants.map((v) => v?.image).filter(Boolean);
    if (variantImgs.length > 0) return variantImgs;
  }
  return product.image ? [product.image] : [];
}

/**
 * Resolves the display image for a product given a specific color/variant index.
 */
export function getVariantImage(product, colorIndex = 0) {
  if (!product) return '';
  const images = getProductImages(product);
  return images[colorIndex] || product.image || images[0] || '';
}
