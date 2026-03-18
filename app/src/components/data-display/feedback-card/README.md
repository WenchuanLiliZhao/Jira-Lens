---
status: [draft]
figma: [draft]
created: 2026-02-24
updated: 2026-02-24
category: data-display
complexity: A
aliases: [FeedbackCard]
dependencies: []
externalDependencies: ['react']
aiContext: |
  FeedbackCard displays a feedback list item with sentiment icon, comment, score, datetime, optional metaContent, and chevron. Border and padding are NOT built-in; user defines via wrapper or className. Use metaContent for status indicators; recommend Label component. See DESIGN-SPEC.md.
---

# FeedbackCard Component

## Quick Summary

<!-- Write 2-3 sentences describing the component:
- What it is
- Primary use case
- Key distinguishing features
-->

**AI Hint**: <!-- Add explicit instruction for AI, e.g., "When user says 'X', use prop Y with value Z" -->

---

## When to Use

✅ **DO use FeedbackCard when:**
<!-- Add specific use cases here -->

❌ **DON'T use FeedbackCard when:**
<!-- Add anti-use-cases here, suggest alternatives -->

---

## Visual Variants

<!-- Document visual variants here if applicable -->

<!-- Example structure:
### variantName
- **"value1"**: [Description]
  - Use cases: [Specific scenarios]
  - AI hint: [When to choose this value]
-->

---

## Props API

### Content Props

| Prop | Type | Description |
|------|------|-------------|
| `comment` | `string` | Comment text |
| `score` | `number?` | NPS score (0–10) |
| `datetime` | `string?` | Date and time string |
| `metaContent` | `ReactNode \| ReactNode[]?` | Optional content in the meta row (between datetime and chevron) |

**metaContent**: Renders between datetime and chevron. **Recommended: use the Label component** for status indicators (e.g. "需回访", "已处理"). See [DESIGN-SPEC.md](./DESIGN-SPEC.md#metacontent-usage) for usage examples.

**Note**: The component has no built-in border or padding. Define these via a wrapper or `className`. See [DESIGN-SPEC.md](./DESIGN-SPEC.md#layout-and-spacing).

### Design Props

| Prop | Type | Description |
|------|------|-------------|
| `sentimentIcon` | `string?` | Material icon name (e.g. "sentiment_satisfied") |
| `sentimentColor` | `string?` | CSS color for sentiment icon |
| `className` | `string?` | Additional CSS classes |

### Behavior Props

| Prop | Type | Description |
|------|------|-------------|
| `onClick` | `() => void?` | Click callback; when provided, shows chevron and interactive styling |

---

## Quick Start

### Basic Usage

```tsx
import { FeedbackCard } from '@/components/data-display/feedback-card';
import { Label } from '@/components/general/label';

<FeedbackCard
  comment="都很好，很满意的购物体验！"
  score={10}
  datetime="2025/12/10 15:30"
  sentimentIcon="sentiment_satisfied"
  metaContent={[
    <Label key="1" size="small" variant="outlined">需回访</Label>,
  ]}
  onClick={() => {}}
/>
```

**Note**: For `metaContent`, use the Label component for status tags. See [DESIGN-SPEC.md](./DESIGN-SPEC.md#metacontent-usage) for recommended patterns.

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
