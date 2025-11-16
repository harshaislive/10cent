'use client'

import { Popover } from '@typeform/embed-react'
import { TYPEFORM_CONFIG } from '@/config/typeform'

interface TypeformChatProps {
  formId?: string
  tooltip?: string
  width?: number
  height?: number
  hideHeaders?: boolean
  hideFooter?: boolean
  medium?: string
  onSubmit?: () => void
  onReady?: () => void
  onClose?: () => void
}

export default function TypeformChat({
  formId = TYPEFORM_CONFIG.FORM_ID,
  tooltip = "Have a question? Chat with us!",
  width = 400,
  height = 600,
  hideHeaders = true,
  hideFooter = true,
  medium = TYPEFORM_CONFIG.POPUP_OPTIONS.medium,
  onSubmit,
  onReady,
  onClose
}: TypeformChatProps) {
  // Only render Typeform chat in production environment
  if (!TYPEFORM_CONFIG.ENABLED) {
    return null // Don't render the chat widget in development
  }

  return (
    <Popover
      id={formId}
      tooltip={tooltip}
      width={width}
      height={height}
      hideHeaders={hideHeaders}
      hideFooter={hideFooter}
      medium={medium}
      onSubmit={onSubmit}
      onReady={onReady}
      onClose={onClose}
    />
  )
}