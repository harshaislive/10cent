'use client'

import { useEffect, useState } from 'react'
import { TYPEFORM_CONFIG } from '@/config/typeform'

interface TypeformEmbedProps {
  formId?: string
  buttonText?: string
  className?: string
}

export default function TypeformEmbed({
  formId = '01KA5X0AM1KH7WRX1ZB994N2TG',
  buttonText = 'Open Form',
  className = ''
}: TypeformEmbedProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    // Only load Typeform script in production environment
    if (!TYPEFORM_CONFIG.ENABLED) {
      return
    }

    // Check if Typeform script is already loaded
    const checkScript = () => {
      const script = document.querySelector('script[src*="embed.typeform.com"]')
      if (script) {
        setIsScriptLoaded(true)
        return true
      }
      return false
    }

    if (checkScript()) {
      return
    }

    // Load the Typeform script if not already loaded
    const script = document.createElement('script')
    script.src = '//embed.typeform.com/next/embed.js'
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    document.head.appendChild(script)

    return () => {
      // Don't remove the script as other components might be using it
    }
  }, [])

  // If Typeform is disabled, show a disabled button
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

  if (!isScriptLoaded) {
    // Show a loading state or fallback button
    return (
      <button
        className={className}
        disabled
      >
        Loading...
      </button>
    )
  }

  return (
    <button
      className={className}
      data-tf-popup={formId}
      data-tf-hide-headers
      data-tf-hide-footer
      data-tf-medium="10cent-club"
    >
      {buttonText}
    </button>
  )
}