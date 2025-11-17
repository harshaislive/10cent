'use client'

import React from 'react'
import { cn } from '@/utils/cn'

// Animation types
export type AnimationType = 'none' | 'fade-in' | 'slide-up' | 'slide-right' | 'slide-left'

// Base props for all heading components
export interface BaseHeadingProps {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span'
  variant?: 'primary' | 'secondary' | 'accent' | 'white'
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  weight?: 'light' | 'normal' | 'medium' | 'bold'
  className?: string
  style?: React.CSSProperties
  animation?: {
    type?: AnimationType
    delay?: number
    duration?: number
    stagger?: number
  }
  responsive?: boolean
}

// Size classes mapping
const sizeClasses = {
  sm: 'text-lg md:text-xl lg:text-2xl',
  md: 'text-xl md:text-2xl lg:text-3xl',
  lg: 'text-2xl md:text-3xl lg:text-4xl',
  xl: 'text-3xl md:text-4xl lg:text-5xl',
  '2xl': 'text-4xl md:text-5xl lg:text-6xl',
  '3xl': 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
}

// Weight classes mapping
const weightClasses = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  bold: 'font-bold'
}

// Variant classes mapping
const variantClasses = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  accent: 'text-brand-red',
  white: 'text-white'
}

// Animation classes mapping
const animationClasses = {
  'fade-in': 'animate-fade-in',
  'slide-up': 'animate-slide-up',
  'slide-right': 'animate-slide-right',
  'slide-left': 'animate-slide-left',
  'none': ''
}

// Line height classes
const lineHeightClasses = {
  sm: 'leading-tight',
  md: 'leading-normal',
  lg: 'leading-relaxed'
}

export const BaseHeading: React.FC<BaseHeadingProps> = ({
  children,
  as: Component = 'h2',
  variant = 'primary',
  size = 'lg',
  weight = 'light',
  className = '',
  animation,
  responsive = true
}) => {
  const baseClasses = cn(
    'font-arizona',
    sizeClasses[size],
    weightClasses[weight],
    variantClasses[variant],
    lineHeightClasses[size === '3xl' ? 'sm' : 'md'],
    responsive && sizeClasses[size],
    animation && animationClasses[animation.type || 'none'],
    className
  )

  const animationStyles = animation ? {
    animationDelay: animation.delay ? `${animation.delay}ms` : undefined,
    animationDuration: animation.duration ? `${animation.duration}ms` : undefined
  } : {}

  return (
    <Component 
      className={baseClasses}
      style={animationStyles}
    >
      {children}
    </Component>
  )
}