# AGENTS.md - Development Guidelines for 10cent Project

## Overview

This is a Next.js 14 landing page project for the "Beforest 10cent Club". The app is built with TypeScript, React 18, Tailwind CSS, and Framer Motion. It features a marketing landing page with multiple sections including hero, problem/solution, webinar, validation, and access sections.

## Project Structure

```
10cent/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Main landing page
│   │   ├── layout.tsx    # Root layout
│   │   └── micro/        # Micro landing page variant
│   └── components/       # React components (18+ components)
├── public/               # Static assets (images, fonts)
├── tailwind.config.js    # Tailwind configuration with custom theme
├── next.config.js        # Next.js configuration
└── tsconfig.json         # TypeScript configuration
```

## Commands

### Development
```bash
npm run dev     # Start dev server on 0.0.0.0:3000
```

### Build & Production
```bash
npm run build   # Build for production
npm run start   # Start production server
```

### Linting
```bash
npm run lint    # Run Next.js linter (ESLint)
```

### Testing
- This project does not currently have a test suite configured
- No single test command available

## Code Style Guidelines

### TypeScript

- **Strict Mode**: Enabled in `tsconfig.json` - all strict type checking options are on
- **Type Usage**: Always define explicit types for props, state, and function parameters
- **No `any`**: Avoid `any` type; use `unknown` if type is truly unknown
- **Module Resolution**: Use `bundler` module resolution strategy

### Imports

- **Path Aliases**: Use `@/` for imports (mapped to `./src/`)
  ```typescript
  import ScrollProgress from '@/components/ScrollProgress'
  import { useState, useEffect } from 'react'
  ```
- **Ordering**: Standard library → External → Internal → Relative
- **Named Exports**: Prefer named exports for components

### Naming Conventions

- **Components**: PascalCase (e.g., `HeroSection.tsx`, `ScrollProgress.tsx`)
- **Files**: kebab-case for non-component files, PascalCase for components
- **Variables**: camelCase
- **Constants**: SCREAMING_SNAKE_CASE for true constants
- **Interfaces/Types**: PascalCase with `I` prefix for interfaces (e.g., `IUserProps`)

### React Patterns

- **Client Components**: Use `'use client'` directive for components using hooks (useState, useEffect, etc.)
- **Component Structure**: 
  ```typescript
  'use client'
  
  import { useState, useEffect } from 'react'
  import Image from 'next/image'
  
  export default function ComponentName() {
    const [state, setState] = useState(false)
  
    useEffect(() => {
      // effect logic
    }, [])
  
    return (
      <section>
        {/* JSX */}
      </section>
    )
  }
  ```
- **Props**: Destructure props in function parameters
- **State**: Use `useState` for local state, avoid unnecessary `useEffect` for derived state

### Tailwind CSS

- **Custom Colors**: Use semantic color names defined in tailwind.config.js
  - `brand-red`, `brand-dark` (primary brand)
  - `sustainable-green`, `sustainable-dark` (accent)
  - `text-primary`, `text-secondary`
- **Custom Fonts**: Use `font-arizona` for serif headings, default sans for body
- **Classes**: Prefer utility classes over custom CSS
- **Responsive**: Use `md:`, `lg:` prefixes for responsive design

### Error Handling

- **Client Components**: Implement proper loading states with useState
- **No Error Boundaries**: Currently not implemented; consider adding for production
- **Console**: Avoid `console.log` in production code; use appropriate error handling

### Accessibility

- Use semantic HTML elements (`<section>`, `<main>`, `<footer>`)
- Include `alt` text for all images
- Ensure proper heading hierarchy (h1 → h2 → h3)
- Use `aria-*` attributes when needed

### Animations

- **Library**: Framer Motion is installed for complex animations
- **Tailwind**: Use built-in animations (`animate-fade-in`, `animate-slide-up`)
- **CSS Transitions**: Use `transition-colors`, `transition-all` for hover states

## Brand Guidelines

Always reference `brand_guide.md` for:
- Color palette (primary, secondary, accent colors)
- Typography (ABC Arizona Flare for headings)
- Logo usage rules
- Visual style (assertive, authentic, approachable)

Additional documentation:
- `Landing_Page_Copy_Documentation.md` - Content and structure guidelines
- `video-script.md` - Video/marketing content reference
- `beforst_emotional_hooks.md` - Copywriting guidance

## Key Design Patterns

### Section Components
- Each major page section is a separate component in `src/components/`
- Components are self-contained with no shared state
- Use section IDs for anchor navigation (e.g., `id="hero"`, `id="problem"`)

### Scroll Progress
- `ScrollProgress.tsx` provides global scroll indicator and section navigation
- All sections must have unique `id` attributes

### Next.js Image Component
- Always use `next/image` for images with `fill` or explicit dimensions
- Include `alt` text for accessibility

## Claude Agent Specializations

The project includes specialized Claude agents in `.claude/agents/`:
- **shadcn-ui-developer**: For UI component development using shadcn/ui patterns
- **web-design-director**: For art direction and design review
- **assertive-copywriter**: For copywriting and content
- **vision-analyzer**: For analyzing design/mockups

## Configuration Files

### tailwind.config.js
- Custom colors: `brand`, `sustainable`, `warm`, `text`
- Custom fonts: `arizona` (serif), `sans` (Inter)
- Custom animations: `fade-in`, `slide-up`, `float`

### next.config.js
- `reactStrictMode: true`
- `swcMinify: false`
- Remote image patterns allowed

### tsconfig.json
- Strict mode enabled
- Path aliases: `@/*` → `./src/*`
- JSX: preserve mode
- Module resolution: bundler
