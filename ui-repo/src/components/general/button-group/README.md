---
status:
  - done
created: 2026-01-30
updated: 2026-01-30
category: general
complexity: A
aliases:
  - ButtonGroup
dependencies: []
externalDependencies:
  - react
aiContext: |
  Use ButtonGroup to group related buttons (e.g. toolbar actions, filter options, segmented controls).
  Supports horizontal/vertical orientation and segmented (merged borders) or spaced layout.
  Supports all Button color options (primary, secondary, success, error, info, warning).
  Selected buttons use the specified color, unselected buttons use default color.
  Pass Button children with the same variant/size for consistent appearance.
figma:
  - done
---

# ButtonGroup Component

## Quick Summary

ButtonGroup is a layout wrapper that groups related buttons together. It supports horizontal or vertical orientation and an optional segmented style where buttons share borders with no gap. Use it for toolbars, filter chips, or segmented controls.

**AI Hint**: When grouping primary actions (e.g. Save / Cancel), use ButtonGroup with `variant="outlined"` or `variant="contained"` Button children. For segmented controls (e.g. Bold / Italic / Underline), use `segmented={true}` (default).

---

## When to Use

✅ **DO use ButtonGroup when:**
- You have 2+ related actions that belong together (Save / Cancel, Yes / No)
- You need a toolbar or filter bar with multiple buttons
- You want a segmented control (one-of-many selection) look
- You want consistent spacing and merged borders between buttons

❌ **DON'T use ButtonGroup when:**
- You have a single button (use Button alone)
- Actions are unrelated (use separate Buttons with spacing)
- You need a dropdown or menu (use Select or Menu)

---

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Layout direction |
| `segmented` | `boolean` | `true` | If true, buttons share borders (no gap) |
| `mode` | `"single"` \| `"multiple"` | `"single"` | Selection mode (radio-like or checkbox-like) |
| `variant` | `"outlined"` \| `"ghost"` \| `"contained"` | `"outlined"` | Style variant for the button group |
| `color` | `"default"` \| `"primary"` \| `"secondary"` \| `"success"` \| `"error"` \| `"info"` \| `"warning"` | `"primary"` | Color theme for selected buttons (secondary falls back to primary) |
| `size` | `"small"` \| `"medium"` \| `"large"` | `"medium"` | Uniform size for all buttons |
| `value` | `string` \| `string[]` | — | Controlled selected value(s) |
| `defaultValue` | `string` \| `string[]` | — | Default selected value(s) for uncontrolled mode |
| `onChange` | `(value: string \| string[]) => void` | — | Callback fired when selection changes |
| `disabled` | `boolean` | `false` | If true, all buttons are disabled |
| `exclusive` | `boolean` | `false` | In single mode, allow deselection by clicking active button |
| `fullWidth` | `boolean` | `false` | If true, buttons take up full width |
| `children` | `ReactNode` | — | Typically Button components with value props |
| `className` | `string` | — | Additional CSS class |
| … | `HTMLAttributes<HTMLDivElement>` | — | Other div props (e.g. `aria-label`) |

---

## Examples

### Horizontal segmented (default)

```tsx
<ButtonGroup>
  <Button variant="outlined">One</Button>
  <Button variant="outlined">Two</Button>
  <Button variant="outlined">Three</Button>
</ButtonGroup>
```

### Vertical segmented

```tsx
<ButtonGroup orientation="vertical">
  <Button variant="outlined">First</Button>
  <Button variant="outlined">Second</Button>
</ButtonGroup>
```

### Spaced (not segmented)

```tsx
<ButtonGroup segmented={false}>
  <Button variant="contained">Save</Button>
  <Button variant="outlined">Cancel</Button>
</ButtonGroup>
```

### Color Options

ButtonGroup supports all Button color options. Selected buttons use the specified color, while unselected buttons use `default` color.

```tsx
// Primary (default)
<ButtonGroup color="primary" mode="single" defaultValue="a">
  <Button value="a">Option A</Button>
  <Button value="b">Option B</Button>
</ButtonGroup>

// Success color
<ButtonGroup color="success" mode="single" defaultValue="a">
  <Button value="a">Option A</Button>
  <Button value="b">Option B</Button>
</ButtonGroup>

// Note: secondary color is not supported and will fallback to primary

// Error color
<ButtonGroup color="error" mode="multiple" defaultValue={["a", "c"]}>
  <Button value="a">Option A</Button>
  <Button value="b">Option B</Button>
  <Button value="c">Option C</Button>
</ButtonGroup>
```

---

## Implementation Notes

- The component uses `role="group"` for accessibility. Add `aria-label` when the group has a semantic meaning (e.g. "Formatting options").
- For best visual results, use the same `variant` and `size` on all Button children.
- Segmented styling is applied via CSS to direct children (border-radius and margin overrides).
- **Color behavior**: 
  - Selected/active buttons use the color specified by the `color` prop (defaults to `"primary"`).
  - Unselected/inactive buttons always use `"default"` color regardless of the `color` prop.
  - **Note**: `"secondary"` color is not supported for selected buttons and will automatically fallback to `"primary"`.
  - This ensures visual consistency where selected buttons stand out with the specified color theme, while unselected buttons remain neutral.
- The component automatically manages button colors, variants, and sizes based on selection state - do not override these props on Button children.