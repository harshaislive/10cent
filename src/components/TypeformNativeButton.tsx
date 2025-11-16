'use client'

import { useEffect, useRef } from 'react'

export default function TypeformNativeButton({
  className = '',
  children,
  formId = '01KA5X0AM1KH7WRX1ZB994N2TG'
}) {
  const buttonRef = useRef(null)

  useEffect(() => {
    // Load Typeform script if not already loaded
    if (!window.tf) {
      const script = document.createElement('script')
      script.src = 'https://embed.typeform.com/next/embed.js'
      script.async = true
      script.onload = () => {
        console.log('Typeform script loaded')
        initializeButton()
      }
      document.head.appendChild(script)
    } else {
      initializeButton()
    }

    function initializeButton() {
      if (buttonRef.current && window.tf && window.tf.createPopupButton) {
        console.log('Initializing Typeform popup button with form ID:', formId)

        try {
          // Clear any existing Typeform elements
          const existingPopup = buttonRef.current.querySelector('.tf-v1-popover')
          if (existingPopup) {
            existingPopup.remove()
          }

          // Create new popup button
          window.tf.createPopupButton(buttonRef.current, {
            formId: formId,
            buttonProps: {
              style: {
                display: 'none'
              }
            },
            hidden: {
              foo: 'bar' // Example hidden field
            },
            transitiveSearchParams: true,
            enableSandbox: true
          })

          console.log('Typeform popup button initialized successfully')
        } catch (error) {
          console.error('Error initializing Typeform popup:', error)
        }
      } else {
        console.log('Typeform createPopupButton not available, using fallback')
      }
    }
  }, [formId])

  const handleClick = () => {
    console.log('Button clicked, attempting to open Typeform popup')

    if (window.tf && window.tf.createPopupButton) {
      // Try to trigger the popup directly
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      })

      // Find and click the hidden Typeform button
      const typeformButton = buttonRef.current?.querySelector('.tf-v1-popover')
      if (typeformButton) {
        typeformButton.dispatchEvent(event)
      } else {
        // Fallback: open form in new tab
        console.log('Fallback: opening form in new tab')
        window.open(`https://form.typeform.com/to/${formId}`, '_blank')
      }
    } else {
      // Fallback: open form in new tab
      console.log('Typeform not loaded, opening in new tab')
      window.open(`https://form.typeform.com/to/${formId}`, '_blank')
    }
  }

  return (
    <div ref={buttonRef} className="inline-block">
      <button
        onClick={handleClick}
        className={className}
      >
        {children}
      </button>
    </div>
  )
}