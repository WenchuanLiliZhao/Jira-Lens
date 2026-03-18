# Badge Component - Design Specification

This document defines the design specifications for the Badge component based on Material Design 3.

---

## Design Tokens

### Colors

Use CSS variables from `color.scss`. Badge background colors align with FAB:

| Color | Background | Text |
|-------|------------|------|
| default | `var(--chart-black-alpha-15-hex)` | `var(--use-text-prime)` |
| primary | `var(--chart-rainbow-blue-100)` | white |
| error | `var(--chart-rainbow-red-100)` | white |
| info | `var(--chart-rainbow-blue-100)` | white |
| warning | `var(--chart-rainbow-orange-100)` | white |

### Typography (Standard variant only)

- **Font Size**: 12px (0.75rem)
- **Font Weight**: 500
- **Line Height**: 16px

### Spacing

**Dot variant:**
- Diameter: 8px
- No padding

**Standard variant:**
- Min height: 16px
- Padding: 0 6px
- Border radius: 10px (stadium shape)

### Positioning

- Badge uses `position: absolute` relative to the wrapper
- Default anchor: top-right (`top: 0`, `right: 0`)
- Offset: -4px from edge (half of dot size for dot variant; adjusted for standard)
- z-index: `var(--z-index-badge)`

---

## Visual Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| dot | Small circle, no text | "Has unread" indicator without count |
| standard | Shows number or text | Message count, cart quantity, etc. |

---

## Anchor Origin

| Vertical | Horizontal | CSS equivalent |
|----------|------------|----------------|
| top | right | top: 0; right: 0 |
| top | left | top: 0; left: 0 |
| bottom | right | bottom: 0; right: 0 |
| bottom | left | bottom: 0; left: 0 |

---

## Accessibility

### ARIA Attributes

- When badge is visible: `role="status"` and `aria-label` describing the count (e.g., "5 unread messages")
- When badge is invisible: `aria-hidden="true"` or do not render badge DOM

### Screen Reader

- Badge content should be announced; use descriptive `aria-label` when wrapping interactive elements
- For numeric badges: "X items" or "X unread" context

---

## Implementation Notes

### CSS Modules

- BEM naming: `badge`, `badge__content`, `badge--variant-dot`, `badge--variant-standard`, `badge--color-*`, `badge--anchor-*`
- Anchor origin maps to modifier classes: `badge--anchor-topRight`, etc.

### Visibility Logic

- `invisible={true}`: hide badge regardless of content
- `badgeContent === 0` and `showZero={false}`: hide badge
- Dot variant: show dot when content is non-zero (or showZero with 0)

---

## AI Implementation Notes

**When implementing this component, AI must:**
- Follow all design specifications defined in this document
- Use design tokens consistently (no arbitrary values)
- Ensure WCAG 2.1 accessibility compliance
- Include appropriate ARIA attributes for badge content
- Test across all variants, colors, and anchor positions

---

**Note**: This document should be updated whenever design tokens or specifications change to reflect the current design system.
