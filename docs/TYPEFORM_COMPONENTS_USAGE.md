# Typeform Components Usage Guide

This guide explains how to use the various Typeform components available in the Beforest 10cent Club project.

## Installation

The project already has the `@typeform/embed-react` package installed (version 4.7.0).

## Configuration

Typeform configuration is managed in `src/config/typeform.ts`:

```typescript
export const TYPEFORM_CONFIG = {
  FORM_ID: '01KA5X0AM1KH7WRX1ZB994N2TG',
  ENABLED: true, // Set to false to disable Typeform in development
  POPUP_OPTIONS: {
    mode: 'popup' as const,
    hideHeaders: true,
    hideFooter: true,
    medium: '10cent-club',
    transitiveSearchParams: true,
  },
  FALLBACK_URL: (formId: string) => `https://form.typeform.com/to/${formId}`,
}
```

## Available Components

### 1. TypeformButton

A button that opens the Typeform in a popup modal.

**Usage:**
```tsx
import TypeformButton from '@/components/TypeformButton'

// Basic usage
<TypeformButton>
  Click to Open Form
</TypeformButton>

// With custom props
<TypeformButton
  formId="your-form-id"
  className="px-6 py-3 bg-blue-600 text-white rounded-lg"
  size={90}
  opacity={90}
  onSubmit={() => console.log('Form submitted')}
  onClose={() => console.log('Form closed')}
>
  Apply Now
</TypeformButton>
```

**Props:**
- `formId?: string` - The Typeform ID (defaults to config value)
- `className?: string` - CSS classes for styling
- `size?: number` - Popup size percentage (default: 100)
- `opacity?: number` - Background opacity (default: 100)
- `hideHeaders?: boolean` - Hide Typeform header (default: true)
- `hideFooter?: boolean` - Hide Typeform footer (default: true)
- `onSubmit?: () => void` - Callback when form is submitted
- `onReady?: () => void` - Callback when form is ready
- `onClose?: () => void` - Callback when form is closed
- `children?: React.ReactNode` - Button content

---

### 2. TypeformWidget

Embeds the Typeform directly on the page as a widget.

**Usage:**
```tsx
import TypeformWidget from '@/components/TypeformWidget'

// Basic usage
<TypeformWidget />

// With custom props
<TypeformWidget
  formId="your-form-id"
  width="100%"
  height={600}
  className="my-form-widget"
  style={{ borderRadius: '8px' }}
  hideHeaders={false}
  hideFooter={false}
  onSubmit={() => console.log('Form submitted')}
/>
```

**Props:**
- `formId?: string` - The Typeform ID (defaults to config value)
- `width?: string | number` - Widget width (default: '100%')
- `height?: string | number` - Widget height (default: 500)
- `className?: string` - CSS classes for the container
- `style?: React.CSSProperties` - Additional inline styles
- `hideHeaders?: boolean` - Hide Typeform header (default: true)
- `hideFooter?: boolean` - Hide Typeform footer (default: true)
- `opacity?: number` - Background opacity (default: 100)
- `onSubmit?: () => void` - Callback when form is submitted
- `onReady?: () => void` - Callback when form is ready
- `onClose?: () => void` - Callback when form is closed

---

### 3. TypeformPopupButton

An enhanced popup button with more customization options.

**Usage:**
```tsx
import TypeformPopupButton from '@/components/TypeformPopupButton'

<TypeformPopupButton
  formId="your-form-id"
  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
  size={80}
  opacity={80}
  medium="custom-medium"
  onSubmit={() => console.log('Form submitted')}
>
  Start Application
</TypeformPopupButton>
```

**Props:**
- `formId?: string` - The Typeform ID (defaults to config value)
- `className?: string` - CSS classes for styling
- `size?: number` - Popup size percentage (default: 100)
- `opacity?: number` - Background opacity (default: 100)
- `hideHeaders?: boolean` - Hide Typeform header (default: true)
- `hideFooter?: boolean` - Hide Typeform footer (default: true)
- `medium?: string` - Tracking medium (default: from config)
- `onSubmit?: () => void` - Callback when form is submitted
- `onReady?: () => void` - Callback when form is ready
- `onClose?: () => void` - Callback when form is closed
- `children?: React.ReactNode` - Button content

---

### 4. TypeformSlider

A button that opens the Typeform as a sliding panel from the side.

**Usage:**
```tsx
import TypeformSlider from '@/components/TypeformSlider'

<TypeformSlider
  formId="your-form-id"
  buttonText="Open Application Form"
  position="right"
  width={800}
  className="slider-button"
  onSubmit={() => console.log('Form submitted')}
/>
```

**Props:**
- `formId?: string` - The Typeform ID (defaults to config value)
- `buttonText?: string` - Text displayed on the button (default: 'Open Form')
- `className?: string` - CSS classes for styling
- `position?: 'left' | 'right'` - Side from which slider appears (default: 'right')
- `width?: number` - Slider width in pixels (default: 800)
- `hideHeaders?: boolean` - Hide Typeform header (default: true)
- `hideFooter?: boolean` - Hide Typeform footer (default: true)
- `medium?: string` - Tracking medium (default: from config)
- `onSubmit?: () => void` - Callback when form is submitted
- `onReady?: () => void` - Callback when form is ready
- `onClose?: () => void` - Callback when form is closed

---

### 5. TypeformChat

A popover-style chat widget that appears in the corner of the page.

**Usage:**
```tsx
import TypeformChat from '@/components/TypeformChat'

// Basic usage - add to any page component
<TypeformChat />

// With custom props
<TypeformChat
  formId="your-form-id"
  tooltip="Have questions? Ask us!"
  width={400}
  height={600}
  onSubmit={() => console.log('Chat form submitted')}
/>
```

**Props:**
- `formId?: string` - The Typeform ID (defaults to config value)
- `tooltip?: string` - Tooltip text on hover (default: "Have a question? Chat with us!")
- `width?: number` - Chat window width (default: 400)
- `height?: number` - Chat window height (default: 600)
- `hideHeaders?: boolean` - Hide Typeform header (default: true)
- `hideFooter?: boolean` - Hide Typeform footer (default: true)
- `medium?: string` - Tracking medium (default: from config)
- `onSubmit?: () => void` - Callback when form is submitted
- `onReady?: () => void` - Callback when form is ready
- `onClose?: () => void` - Callback when form is closed

**Note:** The chat widget is not added globally by default. You can add it to specific pages or components as needed.

---

## Implementation Examples

### Example 1: Application Form Button

```tsx
import TypeformButton from '@/components/TypeformButton'

export default function ApplySection() {
  return (
    <section className="py-16">
      <h2>Apply to 10cent Club</h2>
      <p>Join our exclusive wilderness community</p>
      <TypeformButton
        formId="01KA5X0AM1KH7WRX1ZB994N2TG"
        className="px-8 py-4 bg-amber-600 text-white font-serif text-lg rounded-lg hover:bg-amber-700 transition-colors"
        onSubmit={() => {
          // Track submission in analytics
          gtag('event', 'form_submit', { form_name: 'application' })
        }}
      >
        Begin Application
      </TypeformButton>
    </section>
  )
}
```

### Example 2: Full-Page Form Widget

```tsx
import TypeformWidget from '@/components/TypeformWidget'

export default function ApplicationPage() {
  return (
    <div className="min-h-screen">
      <header>
        <h1>10cent Club Application</h1>
      </header>
      <main className="container mx-auto py-8">
        <TypeformWidget
          formId="01KA5X0AM1KH7WRX1ZB994N2TG"
          height={700}
          onSubmit={() => {
            console.log('Application submitted')
            // Redirect to thank you page
            window.location.href = '/thank-you'
          }}
        />
      </main>
    </div>
  )
}
```

### Example 3: Multiple Form Types

```tsx
import TypeformButton from '@/components/TypeformButton'
import TypeformSlider from '@/components/TypeformSlider'

export default function ContactSection() {
  return (
    <section className="py-16">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3>Quick Inquiry</h3>
          <p>Have a quick question? Send us a message.</p>
          <TypeformButton
            formId="inquiry-form-id"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Send Quick Message
          </TypeformButton>
        </div>
        
        <div>
          <h3>Detailed Application</h3>
          <p>Ready to join? Complete our full application.</p>
          <TypeformSlider
            formId="application-form-id"
            buttonText="Start Full Application"
            className="px-6 py-3 bg-green-600 text-white rounded-lg"
          />
        </div>
      </div>
    </section>
  )
}
```

## Best Practices

1. **Form IDs**: Always use the correct form ID from your Typeform account
2. **Event Handling**: Implement proper callbacks for tracking and user experience
3. **Styling**: Use Tailwind classes for consistent styling
4. **Responsive Design**: Test forms on different screen sizes
5. **Loading States**: Components automatically handle loading states
6. **Development Mode**: Forms are disabled when `TYPEFORM_CONFIG.ENABLED` is false

## Troubleshooting

### Form Not Loading
1. Check that `TYPEFORM_CONFIG.ENABLED` is set to `true`
2. Verify the form ID is correct
3. Check browser console for errors

### Styling Issues
1. Ensure Tailwind classes are properly applied
2. Check for conflicting CSS styles
3. Test on different browsers

### Event Handlers Not Working
1. Verify callback functions are properly defined
2. Check for JavaScript errors in console
3. Ensure the form is submitted successfully

## Current Implementation in Project

The project currently uses:
- `TypeformButton` in `ApplySection.tsx` and `AccessSection.tsx`
- `TypeformChat` globally in `layout.tsx`
- Configuration in `src/config/typeform.ts`

All components are set up and ready to use throughout the application.