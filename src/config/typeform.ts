// Typeform Configuration
// Production-safe Typeform embedding
export const TYPEFORM_CONFIG = {
  // Your Typeform form ID from environment variable or fallback to demo
  FORM_ID: process.env.NEXT_PUBLIC_TYPEFORM_ID || 'moe6bb',

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