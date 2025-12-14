/**
 * Optimizes Cloudinary URLs for performance
 * @param {string} url - The original image URL
 * @param {object} options - Optimization options (width, height, etc.)
 * @returns {string} - The optimized URL
 */
// 🚀 Optimized defaults: Auto format (WebP/AVIF), Auto quality (good balance), Auto width
export const getOptimizedImageUrl = (url, { width = 'auto', quality = 'auto', format = 'auto' } = {}) => {
    if (!url || !url.includes('cloudinary.com')) return url;

    // Split URL to insert transformations
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url; // Unexpected format

    const transformations = [];
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    transformations.push('dpr_auto'); // 🌟 High-res (Retina) support
    if (width && width !== 'auto') transformations.push(`w_${width}`);

    return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
};
