'use client'

import { SliderButton } from '@typeform/embed-react'
import { TYPEFORM_CONFIG } from '@/config/typeform'

interface TypeformSliderProps {
  formId?: string
  buttonText?: string
  className?: string
  position?: 'left' | 'right'
  width?: number
  hideHeaders?: boolean
  hideFooter?: boolean
  medium?: string
  onSubmit?: () => void
  onReady?: () => void
  onClose?: () => void
}

export default function TypeformSlider({
  formId = TYPEFORM_CONFIG.FORM_ID,
  buttonText = 'Open Form',
  className = '',
  position = 'right',
  width = 800,
  hideHeaders = true,
  hideFooter = true,
  medium = TYPEFORM_CONFIG.POPUP_OPTIONS.medium,
  onSubmit,
  onReady,
  onClose
}: TypeformSliderProps) {
  // Only render Typeform in production environment or when enabled
  if (!TYPEFORM_CONFIG.ENABLED) {
    return (
      <button
        className={className}
        disabled
        title="Typeform is only available in production"
      >
        {buttonText}
      </button>
    )
  }

  return (
    <SliderButton
      id={formId}
      className={className}
      position={position}
      width={width}
      hideHeaders={hideHeaders}
      hideFooter={hideFooter}
      medium={medium}
      onSubmit={onSubmit}
      onReady={onReady}
      onClose={onClose}
    >
      {buttonText}
    </SliderButton>
  )
}