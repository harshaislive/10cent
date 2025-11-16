// Typeform Configuration
// Production-safe Typeform embedding
export const TYPEFORM_CONFIG = {
  // Your Typeform form ID - REPLACE WITH YOUR ACTUAL FORM ID
  // Current ID is invalid - it redirects to Typeform explore page
  FORM_ID: 'YOUR_ACTUAL_TYPEFORM_ID',

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