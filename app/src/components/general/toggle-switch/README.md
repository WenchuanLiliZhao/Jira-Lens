---
status:
  - done
figma:
  - draft
created: 2026-02-04
updated: 2026-02-04
category: general
complexity: A
aliases:
  - ToggleSwitch
  - Switch
  - Toggle
dependencies: []
externalDependencies:
  - react
aiContext: |
  A standalone toggle switch component for binary on/off settings. Label is optional - use when descriptive text is needed.
  Use for settings, preferences, and feature toggles. Supports keyboard navigation (Space to toggle) and full accessibility.
---

# ToggleSwitch Component

## Quick Summary

The ToggleSwitch component is a standalone toggle switch control for binary on/off states. It can be used with or without a label, making it flexible for various UI contexts. The component supports keyboard navigation, accessibility attributes, and disabled states. It was extracted from the dropdown-menu's ItemWithSwitch to be usable anywhere in the UI.

**AI Hint**: Use ToggleSwitch for binary settings and preferences. When user says "toggle" or "switch", use this component. Label is optional - include it when you need descriptive text next to the switch.

---

## When to Use

✅ **DO use ToggleSwitch when:**
- You need a binary on/off control for settings or preferences
- You want a toggle switch that works independently (not just in menus)
- You need keyboard-accessible toggle functionality
- You want consistent switch styling across the application

❌ **DON'T use ToggleSwitch when:**
- You need a checkbox for form inputs (use Checkbox component)
- You need radio buttons for single selection (use Radio component)
- You need a switch inside a dropdown menu (use DropdownMenu.ItemWithSwitch)
- You need a button-style toggle (use Button with active state)

---

## Props API

### Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| undefined` | `undefined` | Optional label text displayed next to the switch |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | - | Whether the switch is checked (required) |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when checked state changes (required) |
| `disabled` | `boolean` | `false` | Whether the switch is disabled |
| `className` | `string \| undefined` | `undefined` | Custom class name for the container |

```typescript
export interface ToggleSwitchProps {
  /** Optional label text */
  label?: string;
  
  /** Whether the switch is checked */
  checked: boolean;
  
  /** Callback when checked state changes */
  onCheckedChange: (checked: boolean) => void;
  
  /** Whether the switch is disabled */
  disabled?: boolean;
  
  /** Custom class name */
  className?: string;
}
```

---

## Quick Start

### Basic Usage (No Label)

```tsx
import { ToggleSwitch } from '@/components';

const [enabled, setEnabled] = useState(false);

<ToggleSwitch
  checked={enabled}
  onCheckedChange={setEnabled}
/>
```

### With Label

```tsx
const [darkMode, setDarkMode] = useState(false);

<ToggleSwitch
  label="Dark mode"
  checked={darkMode}
  onCheckedChange={setDarkMode}
/>
```

### Disabled State

```tsx
<ToggleSwitch
  label="Feature unavailable"
  checked={false}
  onCheckedChange={() => {}}
  disabled
/>
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Accessibility

- **Keyboard Navigation**: Space key toggles the switch
- **ARIA Attributes**: Uses `role="switch"` and `aria-checked` for screen readers
- **Focus Indicators**: Visible focus outline using `focus-visible`
- **Disabled State**: Properly disabled with `aria-disabled` and visual feedback
- **Touch Target**: Switch is 36px × 20px, meeting minimum touch target requirements
- **Color Contrast**: Uses design tokens that meet WCAG contrast requirements

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns.
