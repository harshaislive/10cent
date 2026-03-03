'use client'

import { PopupButton } from '@typeform/embed-react'
import { TYPEFORM_CONFIG } from '@/config/typeform'
import { useEffect, useState } from 'react'

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
  const [hiddenFields, setHiddenFields] = useState<Record<string, string>>({})

  useEffect(() => {
    // Get tracking data from global function
    if (typeof window !== 'undefined' && window.__getTypeformData) {
      try {
        const data = (window as any).__getTypeformData()
        setHiddenFields(data)
      } catch (e) {
        console.log('Typeform tracking data error:', e)
      }
    }
  }, [])

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
      hidden={hiddenFields}
    >
      {children || buttonText}
    </PopupButton>
  )
}