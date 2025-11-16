'use client'

import { useEffect, useState } from 'react'
import { TYPEFORM_CONFIG } from '@/config/typeform'

interface TypeformTriggerProps {
  children: React.ReactNode
  className?: string
  formId?: string
}

export default function TypeformTrigger({ children, className, formId = TYPEFORM_CONFIG.FORM_ID }: TypeformTriggerProps) {
  const [isReady, setIsReady] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [popupInstance, setPopupInstance] = useState<any>(null)

  useEffect(() => {
    // Only load Typeform in production environment
    if (!TYPEFORM_CONFIG.ENABLED) {
      return
    }

    // Function to check if Typeform is ready
    const checkTypeformReady = () => {
      if (window.typeform) {
        setIsReady(true)
        return true
      }
      return false
    }

    // Initial check
    if (checkTypeformReady()) {
      return
    }

    // Set up a listener for when Typeform becomes available
    const interval = setInterval(() => {
      if (checkTypeformReady()) {
        clearInterval(interval)
      }
    }, 100)

    // Cleanup interval after 10 seconds max
    const timeout = setTimeout(() => {
      clearInterval(interval)
      console.warn('Typeform script not found after 10 seconds')
    }, 10000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [])

  const openTypeform = () => {
    // Only open Typeform in production environment
    if (!TYPEFORM_CONFIG.ENABLED) {
      console.log('Typeform is disabled in development mode')
      return
    }

    if (isOpen) return // Prevent multiple opens
    setIsOpen(true)

    // Method 1: Try to use the data attributes approach (simpler)
    const element = document.createElement('div')
    element.setAttribute('data-tf-popup', formId)
    element.setAttribute('data-tf-hide-headers', '')
    element.setAttribute('data-tf-hide-footer', '')
    element.setAttribute('data-tf-medium', TYPEFORM_CONFIG.POPUP_OPTIONS.medium)
    element.setAttribute('data-tf-transitive-search-params', '')
    element.style.display = 'none'
    document.body.appendChild(element)

    try {
      // Trigger the popup by clicking the element
      element.click()
      
      // Remove the element after a short delay
      setTimeout(() => {
        document.body.removeChild(element)
      }, 100)
      
      setIsOpen(false)
    } catch (error) {
      console.error('Error with data attribute approach:', error)
      document.body.removeChild(element)
      
      // Method 2: Fallback to makePopup API
      if (window.typeform) {
        try {
          const popup = window.typeform.makePopup(formId, {
            ...TYPEFORM_CONFIG.POPUP_OPTIONS,
            onSubmit: () => {
              console.log('Typeform submitted')
            },
            onClose: () => {
              console.log('Typeform closed')
              setIsOpen(false)
            }
          })
          setPopupInstance(popup)
          popup.open()
        } catch (apiError) {
          console.error('Error with makePopup API:', apiError)
          // Method 3: Final fallback - open in new window
          window.open(TYPEFORM_CONFIG.FALLBACK_URL(formId), '_blank')
          setIsOpen(false)
        }
      } else {
        // Method 3: Final fallback - open in new window
        window.open(TYPEFORM_CONFIG.FALLBACK_URL(formId), '_blank')
        setIsOpen(false)
      }
    }
  }

  return (
    <div
      className={className}
      role="button"
      tabIndex={TYPEFORM_CONFIG.ENABLED ? 0 : -1}
      style={{ cursor: TYPEFORM_CONFIG.ENABLED ? 'pointer' : 'not-allowed' }}
      onClick={openTypeform}
      onKeyDown={(e) => {
        if (TYPEFORM_CONFIG.ENABLED && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          openTypeform()
        }
      }}
      title={TYPEFORM_CONFIG.ENABLED ? undefined : 'Typeform is only available in production'}
    >
      {children}
    </div>
  )
}

// Add Typeform to window object
declare global {
  interface Window {
    typeform?: {
      makePopup: (formId: string, options?: any) => any
      makeSlider: (formId: string, options?: any) => any
      makeWidget: (element: HTMLElement, formId: string, options?: any) => any
    }
  }
}