---
status: done
created: 2026-01-30
updated: 2026-02-21
category: feedback
complexity: B
aliases: [Modal, Dialog]
dependencies: []
externalDependencies: ['react']
aiContext: |
  Modal is a compound component for dialogs. Use Modal.Trigger to open, Modal.Content for the dialog,
  Modal.Header/Body/Footer for structure, Modal.Close for close buttons. Supports controlled and
  uncontrolled modes. AI: When user says "dialog" or "popup", use Modal.
---

# Modal Component

## Quick Summary

Modal is a compound component for displaying dialogs. It renders an overlay and centered dialog in a portal, with focus trap, Escape key support, and optional overlay click to close. Use for confirmations, forms, or any blocking content.

**AI Hint**: When user says "dialog", "popup", or "modal", use this Modal component.

---

## When to Use

✅ **DO use Modal when:**
- User must acknowledge or complete an action before continuing
- Confirmation dialogs (delete, discard changes)
- Form entry in a focused context
- Critical information that requires attention

❌ **DON'T use Modal when:**
- Non-blocking feedback → use Toast
- Simple selections → use DropdownMenu
- Long forms → consider full-page or drawer

---

## Props API

### Modal (Root)

| Prop | Type | Default | Description |
|------|------|--------|-------------|
| open | boolean | - | Controlled open state |
| defaultOpen | boolean | false | Uncontrolled default |
| onOpenChange | (open: boolean) => void | - | Called when open state changes |
| closeOnOverlayClick | boolean | true | Close when clicking backdrop |
| closeOnEscape | boolean | true | Close on Escape key |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Dialog max width |
| disabled | boolean | false | Prevents opening |

### Modal.Trigger

Wraps a child (e.g. Button). Click opens the modal.

### Modal.Content

The dialog container. Renders in portal. Accepts `aria-labelledby` and `aria-describedby` for accessibility.

### Modal.Header, Modal.Body, Modal.Footer

Structure sub-components. Header provides title for aria-labelledby.

### Modal.Close

Wraps a child (e.g. Button). Click closes the modal.

---

## Quick Start

### Basic Usage

```tsx
<Modal>
  <Modal.Trigger>
    <Button variant="contained">Open</Button>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Header>Title</Modal.Header>
    <Modal.Body>Content here.</Modal.Body>
    <Modal.Footer>
      <Modal.Close>
        <Button variant="contained">Close</Button>
      </Modal.Close>
    </Modal.Footer>
  </Modal.Content>
</Modal>
```

### Controlled Mode

```tsx
const [open, setOpen] = useState(false);
<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} onOpenChange={setOpen}>
  <Modal.Content>
    <Modal.Header>Controlled</Modal.Header>
    <Modal.Body>...</Modal.Body>
    <Modal.Footer>
      <Modal.Close><Button>Close</Button></Modal.Close>
    </Modal.Footer>
  </Modal.Content>
</Modal>
```

---

## Design Specifications

See **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** for colors, spacing, animation, and accessibility.

---

## Accessibility

- role="dialog", aria-modal="true"
- aria-labelledby from Modal.Header, aria-describedby from Modal.Body
- Focus trap within dialog
- Escape key closes (configurable)
- Focus returns to trigger on close

---

## Code Examples

See **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** for runnable examples.
