---
status:
  - done
created: 2026-01-30
updated: 2026-01-31
category: general
complexity: A
aliases:
  - FAB
  - FloatingActionButton
dependencies: []
externalDependencies:
  - react
aiContext: |
  A Floating Action Button (FAB) for primary screen actions. Supports circular and extended variants, multiple sizes, and theme colors.
---

# FAB Component

## Quick Summary

A Floating Action Button (FAB) performs the primary, or most common, action on a screen. It appears in front of all screen content, typically as a circular shape with an icon in its center.

**AI Hint**: Use `variant="extended"` with the `label` prop when you need to display text alongside the icon.

---

## When to Use

✅ **DO use FAB when:**
- There is a primary, constructive action on the screen (e.g., "Create", "Add", "Compose").
- The action should be persistent and easily accessible.
- Only one FAB is present per screen for maximum emphasis.

❌ **DON'T use FAB when:**
- There are multiple equally important actions (use regular Buttons).
- The action is destructive, like "Delete" (unless it's the primary purpose of the view).
- The screen lacks a clear primary action.

---

## Visual Variants

### variant
- **"circular"** (default): The classic round FAB, usually containing only an icon.
- **"extended"**: A pill-shaped FAB that includes both an icon and a text label.

---

## Props API

### Content Props
- **icon**: `string` - The name of the icon to display.
- **label**: `string` - The text label to display (required for `extended` variant).

### Design Props
- **variant**: `'circular' | 'extended'` - The visual style. Default is `'circular'`.
- **size**: `'small' | 'medium' | 'large'` - The size of the button. Default is `'medium'`.
- **color**: `'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'` - The theme color. Default is `'primary'`.

### Behavior Props
- **disabled**: `boolean` - If `true`, the button will be disabled.
- **href**: `string` - If provided, the button renders as an anchor (`<a>`) tag.
- **target**: `string` - The target for the link (if `href` is provided).
- **onClick**: `(event: React.MouseEvent) => void` - Callback for click events.

---

## Quick Start

### Basic Usage

```tsx
import { FAB } from '@ui-repo/components/general/fab';

// Standard Circular FAB
<FAB icon="add" onClick={() => console.log('Add')} />

// Extended FAB with Label
<FAB 
  variant="extended" 
  icon="edit" 
  label="Edit Project" 
  onClick={() => console.log('Edit')} 
/>
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

---

## Accessibility

- **Keyboard Navigation**: Fully accessible via `Tab` key. Supports `Enter` and `Space` to trigger.
- **Focus Indicators**: Clear visible focus ring.
- **ARIA**: Uses standard button and link ARIA roles. `aria-label` is automatically set if `label` is provided, otherwise ensure `aria-label` is passed for icon-only buttons.
- **Touch Targets**: Minimum 48x48px touch target for medium/large sizes.

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo
