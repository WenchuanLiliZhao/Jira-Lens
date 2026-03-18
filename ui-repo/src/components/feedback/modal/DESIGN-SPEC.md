# Modal Component - Design Specification

This document defines the design specifications for the Modal component.

---

## Design Tokens

### Colors

| Token | Usage |
|-------|-------|
| `--use-bg-prime` | Dialog background |
| `--use-border-prime` | Dialog border, footer separator |
| `--use-text-prime` | Header and body text |
| `--use-text-secondary` | Secondary text |
| `--use-shadow-popup-default` | Dialog shadow |
| `--chart-black-alpha-50` | Overlay backdrop |
| `--use-border-darken` | Scrollbar thumb hover |

### Spacing

- Overlay padding: 24px (16px on mobile)
- Header padding: 20px 24px 0 (16px 20px 0 on mobile)
- Body padding: 16px 24px (12px 20px on mobile)
- Footer padding: 16px 24px 20px (12px 20px 16px on mobile)
- Footer gap: 12px

### Typography

- Header: 18px / 600 / 28px line-height (16px on mobile)
- Body: 14px / 22px line-height

---

## Size Variants

| Size | Max Width |
|------|-----------|
| small | 400px |
| medium | 520px |
| large | 640px |

On mobile (< 640px), all sizes use full width with padding.

---

## Animation

### Overlay

- Duration: 150ms
- Easing: ease-out
- Effect: opacity 0 → 1

### Dialog

- Duration: 200ms
- Easing: ease-out
- Effect: opacity 0 → 1, scale 0.96 → 1, translateY -8px → 0

---

## Z-Index

- Modal overlay + dialog: 1000

---

## Accessibility

### ARIA Attributes

| Element | Role | ARIA Attributes |
|---------|------|-----------------|
| Overlay | presentation | - |
| Dialog | dialog | aria-modal="true", aria-labelledby, aria-describedby |

### Keyboard

| Key | Action |
|-----|--------|
| Escape | Close modal (when closeOnEscape=true) |
| Tab | Focus trap: wraps within dialog |

### Focus Management

1. When modal opens: Focus first focusable element in dialog
2. When modal closes: Return focus to previously focused element
3. Focus trap: Tab/Shift+Tab cycles within dialog

---

## Responsive

### Mobile (< 640px)

- Overlay padding: 16px
- Max height: calc(100vh - 32px)
- Full width dialog
- Footer may wrap

---

## Print

Modal overlay and content are hidden when printing.

---

## Implementation Notes

- Uses CSS Modules (styles.module.scss)
- Design tokens from @global-styles/color.scss
- Portal rendering to document.body
- Compound component pattern: Modal, Modal.Trigger, Modal.Content, Modal.Header, Modal.Body, Modal.Footer, Modal.Close
