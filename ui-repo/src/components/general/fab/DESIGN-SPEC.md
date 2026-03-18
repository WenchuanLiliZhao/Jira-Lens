# FAB Component - Design Specification

This document defines the design specifications for the FAB component.

---

## Design Tokens

### Colors
- **Primary**: `background: var(--chart-rainbow-blue-100)`, `color: white`
- **Secondary**: `background: var(--chart-black-alpha-15-hex)`, `color: var(--use-text-secondary-trans)`
- **Success**: `background: var(--chart-rainbow-green-100)`, `color: white`
- **Error**: `background: var(--chart-rainbow-red-100)`, `color: white`
- **Disabled**: `background: var(--chart-black-alpha-6-hex)`, `color: var(--use-text-disabled)`

### Elevation (Shadows)
- **Resting**: `0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12)`
- **Hover/Active**: `0 7px 8px -4px rgba(0,0,0,0.2), 0 12px 17px 2px rgba(0,0,0,0.14), 0 5px 22px 4px rgba(0,0,0,0.12)`

### Spacing & Dimensions
- **Small**: 40px (Circular), 40px height (Extended)
- **Medium**: 56px (Circular), 56px height (Extended)
- **Large**: 72px (Circular), 72px height (Extended)

---

## Visual Variants

### Circular
- Shape: Perfect circle (`border-radius: 50%`)
- Content: Centered icon

### Extended
- Shape: Pill shape (`border-radius: 48px`)
- Content: Icon + Label (8px gap)

---

## State Specifications

### Hover
- Uses `HoverOverlay` with `currentColor`
- Increases shadow depth slightly

### Active (Pressed)
- Scale transform: `scale(0.96)`
- Maximum shadow depth

### Focused
- Visible outline for keyboard users

### Disabled
- Background: Gray scale
- No shadow
- No pointer events

---

## Accessibility Requirements

- **WCAG 2.1 Compliance**: Ensure color contrast for icons and text labels.
- **Screen Readers**: Icon-only FABs MUST have an `aria-label`.
- **Touch Targets**: Standard size (56px) exceeds the 48px minimum requirement.

---

## Implementation Notes

- Uses CSS Modules for scoped styling.
- Dynamically renders as `button` or `a` based on props.
- Integrates with `HoverOverlay` for interaction feedback.
