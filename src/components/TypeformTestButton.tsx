'use client'

import { PopupButton } from '@typeform/embed-react'

// Known working Typeform demo form
const DEMO_FORM_ID = 'moe6aa'

export default function TypeformTestButton() {
  console.log('Test Typeform button rendering with demo form');

  return (
    <div className="mb-4 p-4 border-2 border-blue-500 rounded">
      <p className="text-sm text-gray-600 mb-2">Test with known working Typeform:</p>
      <PopupButton
        id={DEMO_FORM_ID}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onReady={() => console.log('Demo Typeform ready')}
        onClose={() => console.log('Demo Typeform closed')}
      >
        Test Typeform (Demo)
      </PopupButton>
    </div>
  )
}