'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { BaseHeading, BaseHeadingProps } from './BaseHeading'

export interface HeroSubHeadingProps extends Omit<BaseHeadingProps, 'as'> {
  background: 'dark' | 'light' | 'editorial'
  delay?: number
}

export const HeroSubHeading: React.FC<HeroSubHeadingProps> = ({
  children,
  background = 'dark',
  delay = 0,
  className = '',
  ...props
}) => {
  const getVariant = () => {
    switch (props.variant) {
      case 'accent':
        return 'accent'
      case 'secondary':
        return 'secondary'
      case 'white':
        return 'white'
      default:
        return background === 'dark' ? 'white' : 'primary'
    }
  }

  return (
    <BaseHeading
      as="h2"
      variant={getVariant()}
      size={props.size || 'lg'}
      weight={props.weight || 'light'}
      animation={{
        type: props.animation?.type || 'fade-in',
        delay: delay,
        duration: props.animation?.duration || 1000
      }}
      className={cn(
        'leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </BaseHeading>
  )
}