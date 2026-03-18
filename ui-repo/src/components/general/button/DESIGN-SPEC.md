# Button Component - Design Specification

This document defines the design specifications for the Button component based on Material UI design patterns.

---

## Design Tokens

### Typography
- **Font Family**: System font stack (inherited)
- **Font Weight**: 500 (medium)
- **Text Transform**: Uppercase
- **Letter Spacing**: 0.02857em

**Size-specific Typography:**
- Small: 0.8125rem (13px)
- Medium: 0.875rem (14px)
- Large: 0.9375rem (15px)

### Spacing
**Padding (Text variant):**
- Small: 4px 5px
- Medium: 6px 8px
- Large: 8px 11px

**Padding (Contained variant):**
- Small: 4px 10px
- Medium: 6px 16px
- Large: 8px 22px

**Padding (Outlined variant):**
- Small: 3px 9px
- Medium: 5px 15px
- Large: 7px 21px

**Icon Spacing:**
- Gap between icon and text: 8px
- Icon negative margin (to align with padding): -4px

### Border
- **Border Radius**: 4px
- **Border Width** (Outlined): 1px
- **Border Style**: solid

### Effects
**Elevation (Contained variant only):**
- Default: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)
- Hover: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)
- Active: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)

**Transitions:**
- Duration: 250ms
- Timing Function: cubic-bezier(0.4, 0, 0.2, 1)
- Properties: background-color, box-shadow, border-color, color

---

## Color Specifications

### Primary (Blue)
- **Main**: #1976d2
- **Hover**: #1565c0
- **Background Hover (Text/Outlined)**: rgba(25, 118, 210, 0.04)
- **Border (Outlined)**: rgba(25, 118, 210, 0.5)

### Secondary (Purple)
- **Main**: #9c27b0
- **Hover**: #7b1fa2
- **Background Hover**: rgba(156, 39, 176, 0.04)
- **Border**: rgba(156, 39, 176, 0.5)

### Success (Green)
- **Main**: #2e7d32
- **Hover**: #1b5e20
- **Background Hover**: rgba(46, 125, 50, 0.04)
- **Border**: rgba(46, 125, 50, 0.5)

### Error (Red)
- **Main**: #d32f2f
- **Hover**: #c62828
- **Background Hover**: rgba(211, 47, 47, 0.04)
- **Border**: rgba(211, 47, 47, 0.5)

### Info (Light Blue)
- **Main**: #0288d1
- **Hover**: #01579b
- **Background Hover**: rgba(2, 136, 209, 0.04)
- **Border**: rgba(2, 136, 209, 0.5)

### Warning (Orange)
- **Main**: #ed6c02
- **Hover**: #e65100
- **Background Hover**: rgba(237, 108, 2, 0.04)
- **Border**: rgba(237, 108, 2, 0.5)

---

## Visual Variants

### Text Variant
- No background or border by default
- Shows subtle background on hover (4% opacity of color)
- Lowest visual hierarchy
- Use for: tertiary actions, less important actions

### Contained Variant
- Solid background color
- White text color
- Elevated with box-shadow
- Highest visual hierarchy
- Use for: primary actions, CTAs

### Outlined Variant
- Transparent background
- Colored border and text
- Shows subtle background on hover
- Medium visual hierarchy
- Use for: secondary actions, alternative options

---

## Size Specifications

### Small
- **Height**: ~30px
- **Padding**: See spacing tokens above
- **Font Size**: 0.8125rem
- **Icon Size**: 1rem
- **Use Case**: Dense UIs, toolbar buttons, table actions

### Medium (Default)
- **Height**: ~36px
- **Padding**: See spacing tokens above
- **Font Size**: 0.875rem
- **Icon Size**: 1.25rem
- **Use Case**: Most common use case, standard forms

### Large
- **Height**: ~42px
- **Padding**: See spacing tokens above
- **Font Size**: 0.9375rem
- **Icon Size**: 1.5rem
- **Use Case**: Hero sections, important CTAs

---

## State Specifications

### Default
- Base colors and styles as defined above
- Cursor: pointer

### Hover
- Background color changes (darker for contained, subtle overlay for text/outlined)
- Elevation increases for contained variant
- Border becomes fully opaque for outlined variant
- Smooth transition (250ms)

### Active (Pressed)
- Maximum elevation for contained variant
- Further darkened background
- Immediate visual feedback

### Focus
- 2px solid outline in current color
- 2px outline offset for clear separation
- Visible only when focused via keyboard (`:focus-visible`)

### Disabled
- Text color: rgba(0, 0, 0, 0.26)
- Cursor: default
- Pointer events: none
- **Contained**: Background rgba(0, 0, 0, 0.12), no shadow
- **Outlined**: Border color rgba(0, 0, 0, 0.12)
- No hover or active states

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance
✅ **Color Contrast**: All color combinations meet 4.5:1 minimum ratio
✅ **Touch Targets**: Minimum 44x44px clickable area
✅ **Keyboard Navigation**: Full keyboard support
✅ **Focus Indicators**: Clear 2px outline with offset
✅ **Semantic HTML**: Proper `<button>` or `<a>` tags

### Screen Reader Support
- Descriptive text content required
- Support for `aria-label` when text is not sufficient
- Disabled state properly communicated
- Link buttons announce as links with href

### Keyboard Navigation
- Tab: Focus navigation
- Enter/Space: Activation
- When disabled, cannot receive focus

---

## Animation Specifications

### Transitions
- **Properties**: background-color, box-shadow, border-color, color
- **Duration**: 250ms
- **Timing**: cubic-bezier(0.4, 0, 0.2, 1) (Material Design standard easing)

### Hover Animation
- Smooth background color change
- Elevation change for contained variant
- No abrupt jumps

### Click/Active Animation
- Immediate visual feedback
- Enhanced elevation for contained
- No delay in activation

---

## Implementation Notes

### CSS Modules Structure
```scss
.button { /* base styles */ }
.button--variant-{name} { /* variant-specific styles */ }
.button--color-{name} { /* color-specific styles */ }
.button--size-{name} { /* size-specific styles */ }
.button--disabled { /* disabled state */ }
.button--full-width { /* full width modifier */ }
.button__label { /* text content wrapper */ }
.button__start-icon { /* start icon wrapper */ }
.button__end-icon { /* end icon wrapper */ }
```

### Component Prop-to-Style Mapping
- `variant` → `.button--variant-{variant}`
- `color` → `.button--color-{color}`
- `size` → `.button--size-{size}`
- `fullWidth` → `.button--full-width`
- `disabled` → `.button--disabled`

### State Handling Patterns
- Disabled state uses CSS `pointer-events: none` to block all interactions
- Focus state uses `:focus-visible` to show outline only for keyboard navigation
- Hover/Active states use pseudo-classes for automatic browser handling
- Icons are wrapped in spans with specific classes for consistent spacing

---

## AI Implementation Notes

**When implementing this component, AI must:**
- ✅ Follow all design specifications defined in this document
- ✅ Use design tokens consistently (no arbitrary values)
- ✅ Ensure WCAG 2.1 AA accessibility compliance (minimum)
- ✅ Implement proper keyboard navigation
- ✅ Include appropriate ARIA attributes support
- ✅ Test across all specified variants, sizes, and states
- ✅ Maintain Material Design elevation patterns
- ✅ Use CSS Modules for style isolation
- ✅ Support both button and anchor (link) rendering
- ✅ Provide TypeScript types for all props

---

**Note**: This document should be updated whenever design tokens or specifications change to reflect the current design system.
