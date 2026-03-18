# ButtonGroup Component - Design Specification

This document defines the design specifications for the ButtonGroup component.

---

## Design Tokens

### Layout
- **Display**: inline-flex
- **Direction**: row (horizontal) or column (vertical)
- **Gap (non-segmented)**: 8px

### Segmented Style
- **Gap**: 0 (buttons touch)
- **Overlap**: -1px margin on adjacent edges (horizontal: margin-left; vertical: margin-top) so borders merge
- **Border radius**: First child keeps leading radius; last child keeps trailing radius; middle children have no radius on shared sides

### Accessibility
- **Role**: group
- **Optional**: aria-label when group has semantic meaning

---

## States

- Default: normal layout
- Focus: handled by individual Button focus-visible (no group-level focus ring)

---

## Dependencies

- Relies on child components (typically Button) for size, variant, and color. ButtonGroup does not pass design tokens to children; consumers should use consistent Button props.
