'use client'

import { PopupButton } from '@typeform/embed-react'
import { TYPEFORM_CONFIG } from '@/config/typeform'

interface TypeformPopupButtonProps {
  formId?: string
  children: React.ReactNode
  className?: string
  size?: number
  opacity?: number
  hideHeaders?: boolean
  hideFooter?: boolean
  medium?: string
  onSubmit?: () => void
  onReady?: () => void
  onClose?: () => void
}

export default function TypeformPopupButton({
  formId = TYPEFORM_CONFIG.FORM_ID,
  children,
  className = '',
  size = 100,
  opacity = 100,
  hideHeaders = true,
  hideFooter = true,
  medium = TYPEFORM_CONFIG.POPUP_OPTIONS.medium,
  onSubmit,
  onReady,
  onClose
}: TypeformPopupButtonProps) {
  // Only render Typeform in production environment or when enabled
  if (!TYPEFORM_CONFIG.ENABLED) {
    return (
      <button
        className={className}
        disabled
        title="Typeform is only available in production"
      >
        {children}
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
      medium={medium}
      onSubmit={onSubmit}
      onReady={onReady}
      onClose={onClose}
    >
      {children}
    </PopupButton>
  )
}