---
status: done
created: 2026-01-30
updated: 2026-01-30
category: general
complexity: A
aliases:
  - Button
  - Btn
dependencies: []
externalDependencies:
  - react
aiContext: |
  A versatile button component based on Material UI design patterns.
  Supports multiple variants (text, contained, outlined), colors, sizes, and states.
  Use variant="contained" for primary actions, "outlined" for secondary, "text" for tertiary.
figma:
  - done
---

# Button Component

## Quick Summary

The Button component is a flexible, accessible button implementation based on Material UI design patterns. It supports three visual variants (text, contained, outlined), six semantic colors, three sizes, and can optionally render as a link. The component includes support for icons, disabled states, and full-width layouts.

**AI Hint**: When user says "submit button", use `variant="contained" color="primary"`. For cancel actions, use `variant="outlined"` or `variant="text"`. For destructive actions, use `color="error"`.

---

## When to Use

✅ **DO use Button when:**
- You need a clickable action trigger
- You want consistent button styling across your application
- You need different visual hierarchies (primary, secondary, tertiary actions)
- You need semantic color coding (success, error, warning, info)
- You need a link that looks like a button

❌ **DON'T use Button when:**
- You need a plain text link (use `<a>` tag instead)
- You're navigating between pages (consider using a proper router Link component)
- You need a toggle or switch (use Switch/Toggle component)
- You need a checkbox or radio input (use respective form components)

---

## Visual Variants

### variant
- **"text"**: Minimal button with no background or border
  - Use cases: Tertiary actions, less emphasis, dialog actions
  - AI hint: Default variant, lowest visual weight

- **"contained"**: Button with solid background and shadow
  - Use cases: Primary actions, form submissions, call-to-action
  - AI hint: Highest visual weight, use for main actions

- **"outlined"**: Button with border, no background
  - Use cases: Secondary actions, alternative choices
  - AI hint: Medium visual weight, secondary importance

### color
- **"primary"**: Main brand color (blue)
- **"secondary"**: Secondary brand color (purple)
- **"success"**: Success state (green)
- **"error"**: Error/destructive actions (red)
- **"info"**: Informational (light blue)
- **"warning"**: Warning state (orange)

### size
- **"small"**: Compact button for dense UIs
- **"medium"**: Default size for most use cases
- **"large"**: Prominent button for important actions

---

## Props API

### Content Props
- `children` (ReactNode): The content of the button
- `startIcon` (ReactNode): Element placed before the children
- `endIcon` (ReactNode): Element placed after the children

### Design Props
- `variant` ("text" | "contained" | "outlined"): The variant to use (default: "text")
- `color` ("primary" | "secondary" | "success" | "error" | "info" | "warning"): The color (default: "primary")
- `size` ("small" | "medium" | "large"): The size (default: "medium")
- `fullWidth` (boolean): If true, button takes full width of container (default: false)

### Behavior Props
- `disabled` (boolean): If true, the button is disabled (default: false)
- `onClick` (function): Click event handler
- `href` (string): URL to link to (renders as `<a>` instead of `<button>`)
- `component` (ElementType): Custom component for root node
- All standard HTML button attributes (type, name, value, etc.)

```typescript
export type ButtonVariant = "text" | "contained" | "outlined";
export type ButtonColor = "primary" | "secondary" | "success" | "error" | "info" | "warning";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  component?: React.ElementType;
}
```

---

## Quick Start

### Basic Usage

```tsx
import { Button } from '@/components/general/button';

// Text button (default)
<Button>Click me</Button>

// Contained button (primary action)
<Button variant="contained" color="primary">
  Submit
</Button>

// Outlined button (secondary action)
<Button variant="outlined" color="secondary">
  Cancel
</Button>

// With icons
<Button variant="contained" startIcon="🚀">
  Launch
</Button>

// As a link
<Button variant="contained" href="https://example.com">
  Visit Site
</Button>

// Disabled
<Button variant="contained" disabled>
  Cannot Click
</Button>

// Full width
<Button variant="contained" fullWidth>
  Full Width Button
</Button>
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Accessibility

The Button component is designed with accessibility in mind:

- **Keyboard Navigation**: Full support for Enter and Space key activation
- **Focus Indicators**: Clear focus outline for keyboard users (2px solid outline with 2px offset)
- **Screen Reader Support**: Proper semantic HTML (`<button>` or `<a>` tags)
- **ARIA Attributes**: Supports all standard ARIA attributes through spread props
- **Disabled State**: Properly disables interaction with `pointer-events: none` and visual indicators
- **Touch Targets**: Minimum 44px height for all sizes (per WCAG 2.1 guidelines)
- **Color Contrast**: All color combinations meet WCAG AA standards (4.5:1 minimum)

**Keyboard Shortcuts:**
- `Enter` or `Space`: Activates the button
- `Tab`: Moves focus to/from the button

**Best Practices:**
- Always provide descriptive text content
- Use `disabled` prop instead of hiding important actions
- For icon-only buttons, add `aria-label` for screen readers
- Use semantic colors (error for destructive, success for positive actions)

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns.

---

## Common Patterns

### Form Submission
```tsx
<Button 
  variant="contained" 
  color="primary" 
  type="submit"
>
  Submit Form
</Button>
```

### Action Pair (Submit/Cancel)
```tsx
<>
  <Button 
    variant="contained" 
    color="primary"
    onClick={handleSubmit}
  >
    Save
  </Button>
  <Button 
    variant="outlined" 
    onClick={handleCancel}
  >
    Cancel
  </Button>
</>
```

### Loading State
```tsx
<Button 
  variant="contained" 
  disabled={isLoading}
  startIcon={isLoading ? "⏳" : "✓"}
>
  {isLoading ? "Processing..." : "Submit"}
</Button>
```
