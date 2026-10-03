'use client'

import { usePathname } from 'next/navigation'
import { TYPEFORM_CONFIG } from '@/config/typeform'

export function TypeformScripts() {
  const pathname = usePathname()
  if (!TYPEFORM_CONFIG.ENABLED || pathname === '/envision' || pathname.startsWith('/my-year/')) return null
  return <>
    <script src="https://embed.typeform.com/next/embed.js" async />
    <script dangerouslySetInnerHTML={{ __html: `
      window.tfAsyncInit = function() {
        window.tf = window.tf || {};
        window.tf.createWidget = window.tf.createWidget || function(){};
      };
    ` }} />
  </>
}
