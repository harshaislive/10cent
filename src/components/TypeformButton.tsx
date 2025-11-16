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
  // Validate form ID
  if (!formId || formId === '01KA5X0AM1KH7WRX1ZB994N2TG') {
    console.warn('Using default form ID. Make sure the form is published and accessible:', formId);
  }
  // Debug: Check if Typeform is enabled
  if (!TYPEFORM_CONFIG.ENABLED) {
    console.log('Typeform is disabled', { ENABLED: TYPEFORM_CONFIG.ENABLED, formId });
    return (
      <button
        className={className}
        disabled
        title="Typeform is disabled"
      >
        {children || buttonText}
      </button>
    )
  }

  console.log('Typeform popup button rendering', { formId, config: TYPEFORM_CONFIG });

  return (
    <PopupButton
      id={formId}
      className={className}
      size={size}
      opacity={opacity}
      hideHeaders={hideHeaders}
      hideFooter={hideFooter}
      medium={TYPEFORM_CONFIG.POPUP_OPTIONS.medium}
      transitiveSearchParams={TYPEFORM_CONFIG.POPUP_OPTIONS.transitiveSearchParams}
      onSubmit={() => {
        console.log('Typeform submitted');
        onSubmit?.();
      }}
      onReady={() => {
        console.log('Typeform ready');
        onReady?.();
      }}
      onClose={() => {
        console.log('Typeform closed');
        onClose?.();
      }}
    >
      {children || buttonText}
    </PopupButton>
  )
}