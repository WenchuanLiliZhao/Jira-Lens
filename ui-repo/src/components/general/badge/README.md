---
status: draft
created: 2026-01-30
updated: 2026-01-30
category: general
complexity: A
aliases: [Badge]
dependencies: []
externalDependencies: ['react']
aiContext: |
  Badge displays notification counts or status indicators on top of child elements (icons, buttons).
  Use variant="dot" for "has unread" without count; variant="standard" for numeric counts.
  Wrap the target element as children: <Badge badgeContent={5}><Icon /></Badge>.
---

# Badge Component

## Quick Summary

Badge is a small overlay component that displays notification counts or status indicators. It wraps child elements (icons, buttons, etc.) and shows a dot or numeric label in a corner. Based on Material Design 3.

**AI Hint**: When user says "notification count", "unread badge", or "message count on icon", use Badge with badgeContent. Use variant="dot" for presence-only; variant="standard" for numbers.

---

## When to Use

✅ **DO use Badge when:**
- Showing unread message count on a mail/chat icon
- Showing cart item count on a shopping icon
- Indicating "has new" without specific count (dot variant)
- Displaying notification counts on nav items, tabs, or app bar icons

❌ **DON'T use Badge when:**
- Displaying standalone tags or labels (use Label component)
- Showing status text without overlay (use Label or Chip)

---

## Visual Variants

### variant

- **"dot"**: Small circle, no text. Use when you only need to indicate "has unread" or "has new".
- **"standard"**: Shows number or custom text. Use for message counts, cart quantities, etc.

---

## Props API

### Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| badgeContent | number \| string \| ReactNode | - | Badge content. Numbers show count; strings/ReactNode render as-is. |
| children | ReactNode | required | The element to wrap (Icon, Button, etc.). |

### Design Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | "dot" \| "standard" | "standard" | dot = circle only; standard = number/text. |
| color | "default" \| "primary" \| "error" \| "info" \| "warning" | "error" | Badge background color. |
| anchorOrigin | { vertical, horizontal } | { vertical: "top", horizontal: "right" } | Badge position relative to child. |

### Behavior Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| max | number | 99 | Max number to display; above this shows "99+". |
| showZero | boolean | false | Show badge when badgeContent is 0. |
| invisible | boolean | false | Force hide the badge. |

---

## Quick Start

### Basic Usage

```tsx
import { Badge } from "@/components/general/badge";
import { Icon } from "@/components/general/icon";

// Numeric count on icon
<Badge badgeContent={5}>
  <Icon icon="mail" />
</Badge>

// Dot indicator (no count)
<Badge badgeContent={1} variant="dot">
  <Icon icon="notifications" />
</Badge>

// With max cap
<Badge badgeContent={150} max={99}>
  <Icon icon="shopping_cart" />
</Badge>
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Accessibility

- Badge uses `role="status"` and `aria-label` to describe the count for screen readers.
- When invisible, badge uses `aria-hidden="true"` or is not rendered.
- Ensure wrapped child has appropriate focus and keyboard support.

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns.
