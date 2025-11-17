'use client'

import { PopupButton } from '@typeform/embed-react'
import { TYPEFORM_CONFIG } from '@/config/typeform'

export default function TypeformChatWrapper() {
  if (!TYPEFORM_CONFIG.ENABLED) {
    return null
  }

  return (
    <>
      {/* Mobile: Sticky button at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 md:hidden">
        <PopupButton
          id={TYPEFORM_CONFIG.FORM_ID}
          className="w-full bg-sustainable-green text-text-primary px-6 py-3 font-arizona text-base tracking-wide rounded-lg transition-all duration-300 hover:bg-opacity-90"
        >
          Request an Invite
        </PopupButton>
      </div>

      {/* Desktop: Floating chat bubble has been removed as per your request. */}
    </>
  )
}
