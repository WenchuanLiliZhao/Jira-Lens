---
status:
  - done
  - redesign-needed
created: 2026-01-31
updated: 2026-01-31
category: general
complexity: A
aliases:
  - Label
  - Badge
  - Tag
dependencies:
  - icon
externalDependencies:
  - react
aiContext: |
  Use Label for status indicators, tags, and badges with direct color control.
  Supports textColor and backgroundColor props for custom styling, plus startIcon and endIcon.
  Default medium size is 24px height. Use filled variant for solid backgrounds, outlined for borders.
---

# Label Component

## Quick Summary

The Label component is a flexible UI element for displaying status indicators, tags, badges, and category labels. Unlike other components, Label provides direct control over text and background colors, making it ideal for dynamic color schemes. It supports optional icons on both sides and can be made removable with the `onRemove` callback.

**AI Hint**: When users need status labels, priority badges, or removable tags, use Label with `textColor` and `backgroundColor` props. For DataTable-style labels, use small size with both `startIcon` and `endIcon`. Always use CSS variables from `color.scss` when possible (e.g., `var(--chart-rainbow-blue-100)`).

---

## When to Use

✅ **DO use Label when:**
- Displaying status indicators (e.g., "In Progress", "Done", "To Do")
- Showing priority levels (e.g., "High", "Medium", "Low")
- Creating removable tags or filters
- Displaying categories or classification labels
- Building custom badge systems with specific colors
- Need both text and background color customization

❌ **DON'T use Label when:**
- You need a clickable button → use `Button` component instead
- Displaying notification counts → use `Badge` component (notification indicator)
- Need complex interactive states → consider custom component
- Displaying long text content → use `Chip` or custom component

---

## Visual Variants

### size
- **"small"**: 20px height - Use for compact UIs, data tables, inline labels
  - AI hint: Choose for dense information displays
- **"medium"** (default): 24px height - Standard size for most use cases
  - AI hint: Default choice, balances readability and space
- **"large"**: 28px height - Use for prominent labels or low-density UIs
  - AI hint: Choose for hero sections or emphasis

### variant
- **"filled"**: Solid background color - Primary label style
  - Use cases: Status indicators, primary tags, category labels
  - AI hint: Default choice for most labels
- **"outlined"**: Border only, transparent background - Subtle style
  - Use cases: Secondary labels, filter options, non-critical info
  - AI hint: Use when you want less visual weight

---

## Props API

### Content Props

- **`children`**: `React.ReactNode` - The text content of the label

### Design Props

- **`textColor`**: `string` (optional) - Direct text color
  - Accepts CSS color values or CSS variables from `color.scss`
  - Example: `"var(--chart-rainbow-blue-100)"` or `"#1364E6"`
  
- **`backgroundColor`**: `string` (optional) - Direct background color
  - Accepts CSS color values or CSS variables from `color.scss`
  - Example: `"var(--chart-rainbow-blue-20)"` or `"rgba(19, 100, 230, 0.2)"`
  
- **`borderColor`**: `string` (optional) - Border color for outlined variant
  - Falls back to `textColor` if not specified
  - Example: `"var(--chart-rainbow-blue-100)"`
  
- **`size`**: `"small" | "medium" | "large"` (optional, default: `"medium"`)
  - Controls the height and padding of the label
  
- **`variant`**: `"filled" | "outlined"` (optional, default: `"filled"`)
  - Visual style of the label

- **`startIcon`**: `string` (optional) - Material icon name for left icon
  - Example: `"check"`, `"info"`, `"star"`, `"flag"`
  
- **`endIcon`**: `string` (optional) - Material icon name for right icon
  - Example: `"cancel"`, `"close"`, `"arrow_forward"`

### Behavior Props

- **`onRemove`**: `() => void` (optional) - Callback when remove icon is clicked
  - If provided without `endIcon`, automatically shows 'cancel' icon
  - Makes the endIcon clickable
  
- **`className`**: `string` (optional) - Additional CSS classes

```typescript
export type LabelSize = "small" | "medium" | "large";
export type LabelVariant = "filled" | "outlined";

export interface LabelProps {
  children: React.ReactNode;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  size?: LabelSize;
  variant?: LabelVariant;
  startIcon?: string;
  endIcon?: string;
  onRemove?: () => void;
  className?: string;
}
```

---

## Quick Start

### Basic Usage

```tsx
import { Label } from '@/components';

// Default label
<Label>Default</Label>

// Colored label with CSS variables
<Label 
  textColor="var(--chart-rainbow-blue-100)"
  backgroundColor="var(--chart-rainbow-blue-20)"
>
  Blue Label
</Label>

// With icons
<Label 
  startIcon="check"
  endIcon="cancel"
  textColor="var(--chart-rainbow-green-100)"
  backgroundColor="var(--chart-rainbow-green-20)"
>
  Task Complete
</Label>

// Removable tag
<Label 
  startIcon="label"
  onRemove={() => console.log('Removed')}
>
  Removable Tag
</Label>

// Different sizes
<Label size="small">Small</Label>
<Label size="medium">Medium</Label>
<Label size="large">Large</Label>

// Outlined variant
<Label 
  variant="outlined"
  textColor="var(--chart-rainbow-blue-100)"
  borderColor="var(--chart-rainbow-blue-100)"
>
  Outlined
</Label>
```

### Status Labels (DataTable style)

```tsx
<Label
  size="small"
  startIcon="pending"
  endIcon="cancel"
  textColor="var(--chart-rainbow-blue-100)"
  backgroundColor="var(--chart-rainbow-blue-20)"
>
  In Progress
</Label>

<Label
  size="small"
  startIcon="check_circle"
  endIcon="cancel"
  textColor="var(--chart-rainbow-green-100)"
  backgroundColor="var(--chart-rainbow-green-20)"
>
  Done
</Label>
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Accessibility

<!-- Document accessibility features here -->

<!-- Consider including:
- Keyboard navigation support
- Focus indicators
- Screen reader support
- ARIA attributes
- Color contrast compliance
- Touch target sizes
-->

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns.
