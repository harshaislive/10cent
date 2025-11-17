'use client'

import { useState, useEffect } from 'react'
import { usePopup } from '@typeform/embed-react'
import TypeformChat from './TypeformChat'
import { TYPEFORM_CONFIG } from '@/config/typeform'

export default function TypeformChatWrapper() {
  const [isMobile, setIsMobile] = useState(false)
  const { open } = usePopup(TYPEFORM_CONFIG.FORM_ID)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!TYPEFORM_CONFIG.ENABLED) {
    return null
  }

  // Mobile: Sticky button at the bottom
  const MobileCTA = (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 md:hidden">
      <button
        onClick={() => open()}
        className="w-full bg-sustainable-green text-text-primary px-6 py-3 font-arizona text-base tracking-wide rounded-lg transition-all duration-300 hover:bg-opacity-90"
      >
        Request an Invite
      </button>
    </div>
  );

  // Desktop: Floating chat bubble
  const DesktopCTA = (
    <div className="hidden md:block">
      <TypeformChat
        tooltip="Questions about 10cent Club? Chat with us!"
        onSubmit={() => console.log('Chat form submitted')}
      />
    </div>
  );

  return (
    <>
      {isMobile ? MobileCTA : DesktopCTA}
    </>
  )
}
