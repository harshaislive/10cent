'use client'

import { PopupButton } from '@typeform/embed-react'
import { TYPEFORM_CONFIG } from '@/config/typeform'

interface TypeformButtonProps {
  formId?: string
  buttonText?: string
  className?: string
  children?: React.ReactNode
  size?: number
  opacity?: number
  hideHeaders?: boolean
  hideFooter?: boolean
  onSubmit?: () => void
  onReady?: () => void
  onClose?: () => void
}

export default function TypeformButton({
  formId = TYPEFORM_CONFIG.FORM_ID,
  buttonText,
  className = '',
  children,
  size = 100,
  opacity = 100,
  hideHeaders = true,
  hideFooter = true,
  onSubmit,
  onReady,
  onClose
}: TypeformButtonProps) {
  // Only render Typeform in production environment
  if (!TYPEFORM_CONFIG.ENABLED) {
    return (
      <button
        className={className}
        disabled
        title="Typeform is only available in production"
      >
        {children || buttonText}
      </button>
    )
  }

  return (
    <PopupButton
      id={formId}
      className={className}
      size={size}
      opacity={opacity}
      hideHeaders={hideHeaders}
      hideFooter={hideFooter}
      medium={TYPEFORM_CONFIG.POPUP_OPTIONS.medium}
      onSubmit={onSubmit}
      onReady={onReady}
      onClose={onClose}
    >
      {children || buttonText}
    </PopupButton>
  )
}