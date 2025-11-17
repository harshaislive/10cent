'use client'

import { PopupButton } from '@typeform/embed-react'
import { TYPEFORM_CONFIG } from '@/config/typeform'

interface TypeformButtonProps {
  formId?: string
  buttonText?: string
  className?: string
  children?: React.ReactNode
  onSubmit?: () => void
  onReady?: () => void
  onClose?: () => void
}

export default function TypeformButton({
  formId = TYPEFORM_CONFIG.FORM_ID,
  buttonText,
  className = '',
  children,
  onSubmit,
  onReady,
  onClose
}: TypeformButtonProps) {
  // Only render if form ID is provided and enabled
  if (!TYPEFORM_CONFIG.ENABLED || !formId) {
    return (
      <button
        className={`${className} opacity-50 cursor-not-allowed`}
        disabled
        title="Typeform is disabled"
      >
        {children || buttonText}
      </button>
    )
  }

  return (
    <PopupButton
      id={formId}
      className={className}
      onReady={onReady}
      onSubmit={onSubmit}
      onClose={onClose}
      hideHeaders={true}
      hideFooter={true}
      transitiveSearchParams={true}
    >
      {children || buttonText}
    </PopupButton>
  )
}