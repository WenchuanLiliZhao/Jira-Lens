# Label Component - Design Specification

This document defines the design specifications for the Label component.

---

## Design Tokens

### Colors

**Recommended color combinations from `color.scss`:**

**Semantic Colors:**
- **Blue/Info**: 
  - Text: `var(--chart-rainbow-blue-100)` - #1364E6
  - Background: `var(--chart-rainbow-blue-20)` - rgba(19, 100, 230, 0.2)
- **Green/Success**: 
  - Text: `var(--chart-rainbow-green-100)` - #22A55B
  - Background: `var(--chart-rainbow-green-20)` - rgba(34, 165, 91, 0.2)
- **Orange/Warning**: 
  - Text: `var(--chart-rainbow-orange-100)` - #E16F24
  - Background: `var(--chart-rainbow-orange-20)` - rgba(225, 111, 36, 0.2)
- **Red/Error**: 
  - Text: `var(--chart-rainbow-red-100)` - #FF4646
  - Background: `var(--chart-rainbow-red-20)` - rgba(255, 70, 70, 0.2)
- **Purple**: 
  - Text: `var(--chart-rainbow-purple-100)` - #8250DF
  - Background: `var(--chart-rainbow-purple-20)` - rgba(130, 80, 223, 0.2)
- **Pink**: 
  - Text: `var(--chart-rainbow-pink-100)` - #E960AE
  - Background: `var(--chart-rainbow-pink-20)` - rgba(233, 96, 174, 0.2)
- **Yellow**: 
  - Text: `var(--chart-rainbow-yellow-100)` - #D69F18
  - Background: `var(--chart-rainbow-yellow-20)` - rgba(214, 159, 24, 0.2)

**Neutral/Default:**
- Text: `var(--chart-black-alpha-90-hex)` - Primary text color (theme-aware)
- Background (filled): `var(--chart-black-alpha-4-hex)` - Subtle background (theme-aware)
- Border (outlined): `var(--chart-black-alpha-15-hex)` - Border color (theme-aware)

### Typography

**Font Family**: Inherit from parent (system font stack)

**Font Weight**: 500 (medium)

**Font Sizes & Line Heights:**
- Small: 12px (0.75rem), line-height 16px
- Medium: 14px (0.875rem), line-height 16px
- Large: 16px (1rem), line-height 16px

### Spacing

**Padding (vertical × horizontal):**
- Small: 2px × 8px
- Medium: 4px × 12px
- Large: 6px × 16px

**Gap (between elements):**
- Small: 4px (between startIcon-text, text-endIcon)
- Medium: 4px
- Large: 6px

### Border Radius

- Small: 10px
- Medium: 12px
- Large: 14px

### Icon Sizes

- Small: 14px
- Medium: 16px
- Large: 18px

---

## Size Specifications

### Small (20px total height)
```
Total Height: 20px
Padding: 2px 8px (vertical 2px × 2 = 4px)
Font Size: 12px
Line Height: 16px (20px - 4px padding = 16px)
Border Radius: 10px
Icon Size: 14px
Icon-Text Gap: 4px

Calculation: 4px (padding) + 16px (line-height) = 20px
```

### Medium (24px total height) - Default
```
Total Height: 24px ⚠️ CRITICAL REQUIREMENT
Padding: 4px 12px (vertical 4px × 2 = 8px)
Font Size: 14px
Line Height: 16px (24px - 8px padding = 16px)
Border Radius: 12px
Icon Size: 16px
Icon-Text Gap: 4px

Calculation: 8px (padding) + 16px (line-height) = 24px
```

### Large (28px total height)
```
Total Height: 28px
Padding: 6px 16px (vertical 6px × 2 = 12px)
Font Size: 16px
Line Height: 16px (28px - 12px padding = 16px)
Border Radius: 14px
Icon Size: 18px
Icon-Text Gap: 6px

Calculation: 12px (padding) + 16px (line-height) = 28px
```

**Layout Structure:**
```
[startIcon] gap [Text] gap [endIcon]
```

---

## Visual Variants

### Filled (Default)
- **Background**: Solid color (from `backgroundColor` prop or default `var(--chart-black-alpha-4-hex)`)
- **Text**: Colored text (from `textColor` prop or default `var(--chart-black-alpha-90-hex)`)
- **Border**: None
- **Use Cases**: Primary labels, status indicators, main tags

### Outlined
- **Background**: Transparent
- **Text**: Colored text (from `textColor` prop)
- **Border**: 1px solid (from `borderColor` prop, falls back to `textColor`, or default `var(--chart-black-alpha-15-hex)`)
- **Use Cases**: Secondary labels, filter options, subtle indicators

---

## State Specifications

### Default
- Background and text colors as specified by props or defaults
- No hover/focus states for non-interactive labels

### With onRemove (Interactive endIcon)
- **Cursor**: Pointer on endIcon when `onRemove` is provided
- **Click Area**: Only the endIcon area is clickable
- **Visual Feedback**: Browser default (no custom hover states currently)

### Disabled
- Not applicable (Label is a display-only component, not a form control)

---

## Accessibility Requirements

### WCAG 2.1 Compliance

**Color Contrast:**
- Text color must have minimum 4.5:1 contrast ratio with background
- Recommended color combinations from `color.scss` meet this requirement
- For custom colors, developers must ensure proper contrast

**Touch Targets:**
- When using `onRemove`, the clickable endIcon should have minimum 24px tap target
- Current implementation: Medium size (24px) provides adequate touch target

**Screen Reader Support:**
- Label content is readable by screen readers
- Icons are decorative and handled by the Icon component's accessibility
- No additional ARIA attributes needed for basic labels

**Keyboard Navigation:**
- Non-interactive labels: Not focusable (correct behavior)
- Interactive labels (with onRemove): Currently not keyboard-accessible
  - **Note**: Future enhancement could add keyboard support for removable labels

### Semantic HTML
- Uses `<span>` element (inline-level)
- Appropriate for display-only content
- Parent context should provide semantic meaning (e.g., within table cells, list items)

---

## Responsive Breakpoints

**Not Applicable**: Label component is content-driven and responsive by nature. It adapts to its container without specific breakpoints.

---

## Animation Specifications

**Current Implementation**: No animations

**Future Enhancements** (optional):
- Fade-in animation when added (150ms ease)
- Fade-out + scale animation when removed (200ms ease-out)
- Hover effect on removable icon (subtle scale or opacity change)

---

## Implementation Notes

### CSS Architecture

**Direct Color Application:**
- Label uses inline styles for `textColor`, `backgroundColor`, and `borderColor`
- No opacity layers or semantic color mapping
- SCSS provides structural styles only (layout, sizing, spacing)

**CSS Modules Usage:**
```scss
.label { } // Base styles
.label--size-small { } // Size modifier
.label--size-medium { } // Size modifier
.label--size-large { } // Size modifier
.label--variant-filled { } // Variant modifier
.label--variant-outlined { } // Variant modifier
.label__icon { } // Icon element
.label__text { } // Text element
```

### Component Prop-to-Style Mapping

```tsx
// Colors applied via inline styles
style={{
  color: textColor,
  backgroundColor: variant === 'filled' ? backgroundColor : undefined,
  borderColor: variant === 'outlined' ? (borderColor || textColor) : undefined,
}}

// Size and variant via CSS classes
className={`label label--size-${size} label--variant-${variant}`}
```

### Default Values

```tsx
size = "medium"
variant = "filled"
textColor = undefined // Uses CSS default: var(--chart-black-alpha-90-hex)
backgroundColor = undefined // Uses CSS default: var(--chart-black-alpha-4-hex) for filled
borderColor = undefined // Falls back to textColor for outlined
```

---

## AI Implementation Notes

**When implementing or using this component, AI must:**

1. **Color Usage:**
   - Always recommend CSS variables from `color.scss` first
   - Use semantic color combinations (e.g., blue-100 text with blue-20 background)
   - Ensure proper contrast ratios for custom colors
   - Never hardcode colors in SCSS (use inline props instead)

2. **Size Selection:**
   - Small: For data tables, compact UIs, inline labels
   - Medium (default): For standard UI elements, cards, forms
   - Large: For hero sections, prominent labels, low-density UIs

3. **Icon Usage:**
   - Use Material Icons from the Icon component
   - Common icons: check, cancel, info, star, flag, label, close, arrow_forward
   - Both icons can be used simultaneously for rich labels

4. **Accessibility:**
   - Ensure color contrast meets WCAG AA (4.5:1)
   - Consider semantic HTML context
   - Provide alternative text context when needed (via surrounding elements)

5. **Testing:**
   - Test all size variants (small, medium, large)
   - Test both visual variants (filled, outlined)
   - Test with icons (none, startIcon only, endIcon only, both)
   - Test removable functionality (onRemove callback)
   - Test in light and dark modes

---

**Note**: This document should be updated whenever design tokens or specifications change to reflect the current design system.
