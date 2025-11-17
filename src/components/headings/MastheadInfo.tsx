'use client'

import React from 'react'
import { cn } from '@/utils/cn'

export interface MastheadInfoProps {
  isLoaded: boolean
  title: string
  subtitle: string
  className?: string
}

export const MastheadInfo: React.FC<MastheadInfoProps> = ({
  isLoaded,
  title,
  subtitle,
  className = ''
}) => {
  return (
    <div className={cn(
      className,
      isLoaded ? 'opacity-100' : 'opacity-0',
      'transition-opacity duration-1500 ease-in'
    )}>
      <div className="mb-8">
        <div className="text-xs font-serif tracking-[0.3em] uppercase text-text-secondary mb-2">
          {title}
        </div>
        <div className="w-24 h-px bg-stone-400 mx-auto mb-2" />
        <div className="text-xs font-serif tracking-wide uppercase text-text-secondary">
          {subtitle}
        </div>
      </div>
    </div>
  )
}