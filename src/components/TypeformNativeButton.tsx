'use client'

import { useEffect, useRef } from 'react'
import { ReactNode } from 'react'

interface TypeformNativeButtonProps {
  className?: string
  children: ReactNode
  formId?: string
}

export default function TypeformNativeButton({
  className = '',
  children,
  formId = '01KA5X0AM1KH7WRX1ZB994N2TG'
}: TypeformNativeButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)

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
      if (buttonRef.current && window.tf) {
        console.log('Initializing Typeform with form ID:', formId)

        // Check if modern makePopup API is available
        if (window.tf.makePopup) {
          console.log('Modern Typeform makePopup API available')
        } else if (window.tf.createPopupButton) {
          console.log('Using legacy createPopupButton API')
          try {
            // Clear any existing Typeform elements
            const existingPopup = buttonRef.current.querySelector('.tf-v1-popover')
            if (existingPopup) {
              existingPopup.remove()
            }

            // Create new popup button (legacy method)
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
          console.log('Typeform popup methods not available')
        }
      } else {
        console.log('Typeform not loaded yet')
      }
    }
  }, [formId])

  const handleClick = () => {
    console.log('Button clicked, attempting to open Typeform popup')

    if (window.tf && window.tf.makePopup) {
      // Use the modern makePopup API instead of createPopupButton
      console.log('Using modern Typeform makePopup API')

      try {
        const popup = window.tf.makePopup(`https://form.typeform.com/to/${formId}`, {
          mode: 'popup',
          hideHeaders: true,
          hideFooter: true,
          onSubmit: () => {
            console.log('Form submitted')
            popup.close()
          },
          onClose: () => {
            console.log('Popup closed')
          }
        })

        popup.open()
      } catch (error) {
        console.error('Error with makePopup, trying fallback:', error)
        // Fallback to direct popup open
        tryDirectPopup()
      }
    } else if (window.tf && window.tf.createPopupButton) {
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
        console.log('Hidden button not found, trying direct popup')
        tryDirectPopup()
      }
    } else {
      console.log('Typeform not loaded, waiting for it to load...')
      // Wait a moment and try again
      setTimeout(() => {
        if (window.tf && window.tf.makePopup) {
          handleClick()
        } else {
          console.error('Typeform failed to load')
        }
      }, 1000)
    }
  }

  const tryDirectPopup = () => {
    // Try to open popup directly using the embed URL
    try {
      const popup = window.open(`https://form.typeform.com/to/${formId}?typeform-source=popup`,
        'typeform-popup',
        'width=600,height=700,scrollbars=yes,resizable=yes')

      if (popup) {
        console.log('Popup opened directly')
        // Focus on the popup
        popup.focus()
      } else {
        console.error('Popup blocked by browser')
      }
    } catch (error) {
      console.error('Failed to open popup:', error)
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