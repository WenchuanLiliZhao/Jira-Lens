---
status:
  - done
created: 2026-01-31
updated: 2026-01-31
category: dev-tools
complexity: A
aliases:
  - DevToolsFAB
  - DevTools
dependencies:
  - general/fab
  - general/dropdown-menu
externalDependencies:
  - react
aiContext: |
  Development tools FAB for theme switching (light/dark/system) with localStorage persistence and reset functionality.
---

# DevToolsFAB Component

## Quick Summary

A development tools floating action button that provides quick access to theme switching and other development utilities. The component automatically persists user preferences to localStorage and provides a reset function to restore defaults.

**AI Hint**: Use this component globally in the App.tsx to provide consistent access to dev tools throughout the application.

---

## When to Use

✅ **DO use DevToolsFAB when:**
- You need global theme switching functionality in a development environment.
- You want to persist user preferences across sessions.
- You need quick access to development utilities.

❌ **DON'T use DevToolsFAB when:**
- In production builds (should be conditionally rendered based on environment).
- You need production-ready settings UI (use a proper settings page instead).

---

## Features

### Theme Switching
- **Light Mode**: Forces light theme
- **Dark Mode**: Forces dark theme  
- **System Mode**: Follows system preference (`prefers-color-scheme`)

### Persistence
- Automatically saves settings to `localStorage` under key `dev-tools-settings`
- Persists across page reloads and browser sessions
- Handles storage errors gracefully

### Reset Functionality
- One-click reset to default settings
- Clears localStorage and restores system theme mode

---

## Props API

The component currently doesn't accept any props as it's self-contained.

```typescript
export interface DevToolsFABProps {
  // No props - component is fully self-contained
}
```

---

## Quick Start

### Basic Usage

```tsx
import { DevToolsFAB } from '@ui-repo/components/dev-tools/dev-tools-fab';

function App() {
  return (
    <div>
      {/* Your app content */}
      <DevToolsFAB />
    </div>
  );
}
```

### With Conditional Rendering (Production)

```tsx
import { DevToolsFAB } from '@ui-repo/components/dev-tools/dev-tools-fab';

function App() {
  return (
    <div>
      {/* Your app content */}
      {process.env.NODE_ENV === 'development' && <DevToolsFAB />}
    </div>
  );
}
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

---

## Accessibility

- **Keyboard Navigation**: Fully accessible via keyboard
- **Focus Indicators**: Clear visible focus states
- **ARIA**: Proper ARIA labels for screen readers
- **Fixed Positioning**: Positioned at bottom-right with high z-index to remain accessible

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo
