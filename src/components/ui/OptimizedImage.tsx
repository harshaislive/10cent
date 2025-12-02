'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  style?: React.CSSProperties
}

// Predefined blur data URLs for different image types
const blurPlaceholders = {
  nature: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
  gradient: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImJsdXIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWE0NzJhO3N0b3Atb3BhY2l0eToxIiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwZDI4MTg7c3RvcC1vcGFjaXR5OjEiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjYmx1cikiIC8+Cjwvc3ZnPg==',
  white: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=',
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 85,
  sizes,
  placeholder = 'blur',
  blurDataURL = blurPlaceholders.nature,
  loading = 'lazy',
  onLoad,
  style,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setError(true)
  }

  // Default sizes based on common use cases
  const defaultSizes = fill
    ? '100vw'
    : width && height
      ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      : sizes

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
        style={style}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <div className={`relative ${!isLoaded && placeholder === 'blur' ? 'animate-pulse' : ''} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes || defaultSizes}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } object-cover`}
        style={{
          ...style,
          objectPosition: 'center',
        }}
      />
    </div>
  )
}

// Specialized components for common use cases
export function HeroImage({ src, alt, ...props }: Omit<OptimizedImageProps, 'quality' | 'placeholder'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={true}
      quality={85}
      placeholder="blur"
      blurDataURL={blurPlaceholders.nature}
      {...props}
    />
  )
}

export function MobileHeroImage({ src, alt, ...props }: Omit<OptimizedImageProps, 'quality' | 'placeholder'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={true}
      quality={75}
      placeholder="blur"
      blurDataURL={blurPlaceholders.nature}
      {...props}
    />
  )
}

export function LogoImage({ src, alt, ...props }: Omit<OptimizedImageProps, 'priority' | 'quality' | 'placeholder'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={true}
      quality={90}
      placeholder="blur"
      blurDataURL={blurPlaceholders.white}
      {...props}
    />
  )
}