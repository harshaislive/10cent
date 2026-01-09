/**
 * Supabase Image Optimization Utility
 *
 * Supabase supports image transformation via URL parameters:
 * - width: Resize image to specified width
 * - height: Resize image to specified height
 * - quality: JPEG/WebP quality (1-100, default 80)
 * - format: Output format (webp, avif, jpg, png)
 * - resize: Cover, contain, fill, etc.
 * - dpi: For retina displays
 *
 * @see https://supabase.com/docs/guides/storage/image-transformations
 */

export interface SupabaseImageOptions {
  width?: number
  height?: number
  quality?: number // 1-100, default 80
  format?: 'webp' | 'avif' | 'jpg' | 'png' | 'origin'
  resize?: 'cover' | 'contain' | 'fill'
  dpi?: number
}

/**
 * Adds Supabase image optimization parameters to a URL
 *
 * @param url - Original Supabase storage URL
 * @param options - Optimization options
 * @returns Optimized URL with transformation parameters
 */
export function getOptimizedImageUrl(url: string, options: SupabaseImageOptions = {}): string {
  try {
    const urlObj = new URL(url)

    // Set default values
    const {
      width,
      height,
      quality = 70, // Default to 70% quality for balance
      format = 'origin',
      resize,
      dpi,
    } = options

    // Add parameters only if specified
    if (width) urlObj.searchParams.set('width', width.toString())
    if (height) urlObj.searchParams.set('height', height.toString())
    if (quality !== undefined) urlObj.searchParams.set('quality', quality.toString())
    if (format !== 'origin') urlObj.searchParams.set('format', format)
    if (resize) urlObj.searchParams.set('resize', resize)
    if (dpi) urlObj.searchParams.set('dpi', dpi.toString())

    return urlObj.toString()
  } catch (error) {
    // If URL parsing fails, return original URL
    console.warn('Failed to optimize image URL:', url, error)
    return url
  }
}

/**
 * Pre-configured optimization presets
 */
export const imagePresets = {
  // Hero images - high quality, responsive width
  heroDesktop: (url: string) => getOptimizedImageUrl(url, {
    width: 1920,
    quality: 75,
    format: 'webp',
  }),

  heroMobile: (url: string) => getOptimizedImageUrl(url, {
    width: 1080,
    quality: 70,
    format: 'webp',
  }),

  // Hero images with higher compression for faster loading
  heroDesktopFast: (url: string) => getOptimizedImageUrl(url, {
    width: 1600,
    quality: 65,
    format: 'webp',
  }),

  heroMobileFast: (url: string) => getOptimizedImageUrl(url, {
    width: 900,
    quality: 65,
    format: 'webp',
  }),

  // Thumbnail - smaller, lower quality
  thumbnail: (url: string) => getOptimizedImageUrl(url, {
    width: 400,
    quality: 60,
    format: 'webp',
  }),

  // Full quality - no optimization
  original: (url: string) => url,

  // Card/image gallery - balanced
  card: (url: string) => getOptimizedImageUrl(url, {
    width: 800,
    quality: 70,
    format: 'webp',
  }),

  // Logo - high quality, smaller size
  logo: (url: string) => getOptimizedImageUrl(url, {
    width: 200,
    quality: 80,
    format: 'webp',
  }),
}

/**
 * Checks if a URL is a Supabase storage URL
 */
export function isSupabaseUrl(url: string): boolean {
  return url.includes('supabase.co/storage/v1/object/public')
}
