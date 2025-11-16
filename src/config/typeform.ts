// Typeform Configuration
// Update this ID with your actual Typeform form ID
export const TYPEFORM_CONFIG = {
  // This is a placeholder ID - replace with your actual Typeform ID
  FORM_ID: '01KA5X0AM1KH7WRX1ZB994N2TG',
  
  // Environment detection - enable Typeform in all environments
  ENABLED: true,
  
  // Typeform popup options
  POPUP_OPTIONS: {
    mode: 'popup' as const,
    hideHeaders: true,
    hideFooter: true,
    medium: '10cent-club',
    transitiveSearchParams: true,
  },
  
  // Fallback URL for when popup doesn't work
  FALLBACK_URL: (formId: string) => `https://form.typeform.com/to/${formId}`,
}