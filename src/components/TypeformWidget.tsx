'use client'

import { Widget } from '@typeform/embed-react'
import { TYPEFORM_CONFIG } from '@/config/typeform'

interface TypeformWidgetProps {
  formId?: string
  style?: React.CSSProperties
  className?: string
  width?: string | number
  height?: string | number
  hideHeaders?: boolean
  hideFooter?: boolean
  opacity?: number
  onSubmit?: () => void
  onReady?: () => void
  onClose?: () => void
}

export default function TypeformWidget({
  formId = TYPEFORM_CONFIG.FORM_ID,
  style = {},
  className = '',
  width = '100%',
  height = 500,
  hideHeaders = true,
  hideFooter = true,
  opacity = 100,
  onSubmit,
  onReady,
  onClose
}: TypeformWidgetProps) {
  // Only render Typeform in production environment or when enabled
  if (!TYPEFORM_CONFIG.ENABLED) {
    return (
      <div 
        className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="text-center p-6">
          <p className="text-gray-600 mb-2">Typeform Widget</p>
          <p className="text-sm text-gray-500">Form ID: {formId}</p>
          <p className="text-xs text-gray-400 mt-2">Typeform is disabled in development</p>
        </div>
      </div>
    )
  }

  const widgetStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style
  }

  return (
    <div className={className}>
      <Widget
        id={formId}
        style={widgetStyle}
        className="typeform-widget"
        hideHeaders={hideHeaders}
        hideFooter={hideFooter}
        opacity={opacity}
        onSubmit={onSubmit}
        onReady={onReady}
        onClose={onClose}
      />
    </div>
  )
}