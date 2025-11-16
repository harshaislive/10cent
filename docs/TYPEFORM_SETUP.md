# Typeform Integration Setup

## Overview
This project uses Typeform for user registration and lead collection. The Typeform is integrated as a popup that opens when users click on the call-to-action buttons.

## Configuration

### 1. Update Your Typeform ID
The current Typeform ID is a placeholder. To use your actual Typeform:

1. Open `src/config/typeform.ts`
2. Replace the placeholder ID with your actual Typeform form ID:
   ```typescript
   export const TYPEFORM_CONFIG = {
     // Replace '01KA5X0AM1KH7WRX1ZB994N2TG' with your actual Typeform ID
     FORM_ID: 'your-actual-typeform-id-here',
     // ... rest of config
   }
   ```

### 2. Where to Find Your Typeform ID

#### For Popup (Recommended):
1. Go to your Typeform account
2. Open the form you want to use
3. Click on the "Share" tab
4. Look for the "Popup" option
5. The embed code will show: `data-tf-popup="YOUR_FORM_ID"`
6. Copy `YOUR_FORM_ID` and paste it in the config file

#### For Live Embed:
If you're using a live embed (like `data-tf-live`), the ID should still work with the popup method:
1. Go to your Typeform account
2. Open the form you want to use
3. Click on the "Share" tab
4. Look for the URL format: `https://form.typeform.com/to/YOUR_FORM_ID`
5. Copy `YOUR_FORM_ID` and paste it in the config file

**Note:** The same form ID works for both live embed and popup methods. The difference is in how you initialize it in your code.

## Implementation Details

### Components Using Typeform
- `TypeformTrigger.tsx` - The main component that handles Typeform popup
- `AccessSection.tsx` - Uses TypeformTrigger for the main registration button
- `ApplySection.tsx` - Uses TypeformTrigger for the application button

### Script Loading
The Typeform script is loaded in `src/app/layout.tsx`:
```html
<script
  src="https://embed.typeform.com/next/embed.js"
  async
/>
```

### Fallback Behavior
If the Typeform popup fails to load (due to network issues, ad blockers, etc.), the system automatically falls back to opening the form in a new tab.

## Customization Options

### Popup Options
You can customize the popup behavior in `src/config/typeform.ts`:
- `hideHeaders`: Hide the Typeform header
- `hideFooter`: Hide the Typeform footer
- `medium`: Tracking medium for analytics
- `transitiveSearchParams`: Pass URL parameters to the form

### Tracking
The component includes hooks for tracking form submissions:
```typescript
onSubmit: () => {
  console.log('Typeform submitted')
  // Add your tracking code here
  // Example: gtag('event', 'form_submit', { form_id: formId })
}
```

## Testing

### To Test the Integration:
1. Update the Typeform ID with a real one
2. Run the development server: `npm run dev`
3. Navigate to the site
4. Click on any CTA button that should open the Typeform
5. Verify the popup opens correctly
6. Test the fallback by disabling JavaScript or using an ad blocker

### Troubleshooting

#### Popup doesn't open:
1. Check browser console for errors
2. Verify the Typeform ID is correct
3. Ensure the embed script is loading (check Network tab)
4. Try the fallback (should open in new tab)

#### Form doesn't submit:
1. Ensure you're using a valid, published Typeform
2. Check if the form has any required fields that are hidden
3. Verify the form is not set to private

#### Performance issues:
1. The script is loaded with `async` to prevent blocking
2. The popup initialization waits for the script to be ready
3. There's a 10-second timeout for script loading

## Security Considerations
- The form opens in a popup or new tab, which is safer than iframe embedding
- No sensitive data is stored on your server
- All form submissions go directly to Typeform's secure servers