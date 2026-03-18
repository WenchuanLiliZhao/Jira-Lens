# FeedbackCard Component - Design Specification

This document defines the design specifications for the FeedbackCard component.

---

## Layout and Spacing

**Border and padding are NOT part of the component.** The component renders content structure only. The user must define outer border and padding via:

- A wrapper element (e.g. list container) that applies `padding` and `border-bottom` to each card
- Or the `className` prop to pass custom styles

### Example: List container defines spacing

```tsx
<div className="feedback-list" style={{ border: '1px solid var(--chart-black-alpha-15-hex)', borderRadius: 8 }}>
  <FeedbackCard comment="..." />
  <FeedbackCard comment="..." />
</div>

/* CSS */
.feedback-list > * {
  padding: 12px 16px;
  border-bottom: 1px solid var(--chart-black-alpha-15-hex);
}
.feedback-list > *:last-child {
  border-bottom: none;
}
```

---

## metaContent Usage

The `metaContent` prop renders optional content in the meta row (between datetime and chevron). It accepts `React.ReactNode | React.ReactNode[]` and can be any valid React content.

**Recommended: Use the Label component** from the component library for status indicators such as "需回访", "已处理", etc. Label provides consistent styling and supports `size`, `variant`, `textColor`, and `borderColor` props.

### Example

```tsx
import { FeedbackCard } from '@/components/data-display/feedback-card';
import { Label } from '@/components/general/label';
import { chartNeutral } from '@/global-styles/colors';

// Preset meta content using Label
const FEEDBACK_META = {
  needsFollowUp: (
    <Label size="small" variant="outlined" textColor={chartNeutral['9']} borderColor={chartNeutral['6']}>
      需回访
    </Label>
  ),
  processed: (
    <Label size="small" variant="outlined" textColor={chartNeutral['9']} borderColor={chartNeutral['6']}>
      已处理
    </Label>
  ),
};

<FeedbackCard
  comment="都很好，很满意的购物体验！"
  score={10}
  datetime="2025/12/10 15:30"
  sentimentIcon="sentiment_satisfied"
  metaContent={[FEEDBACK_META.needsFollowUp]}
  onClick={() => {}}
/>
```

---

<!-- Add your design specifications here -->

<!-- Recommended sections (but not limited to):
- Design Tokens (colors, spacing, typography, effects)
- Visual Variants (different visual styles)
- Size Specifications (different size options)
- State Specifications (hover, active, focus, disabled, etc.)
- Accessibility Requirements (WCAG compliance, keyboard navigation, screen reader support)
- Responsive Breakpoints (mobile, tablet, desktop)
- Animation Specifications (transitions, timing)
-->

---

## Implementation Notes

<!-- Define implementation details here -->

<!-- Consider:
- CSS Modules variables and usage
- Component prop-to-style mapping
- SCSS mixins and functions
- State handling patterns
-->

---

## AI Implementation Notes

**When implementing this component, AI must:**
- Follow all design specifications defined in this document
- Use design tokens consistently (no arbitrary values)
- Ensure WCAG 2.1 accessibility compliance
- Implement proper keyboard navigation
- Include appropriate ARIA attributes
- Test across all specified variants, sizes, and states

---

**Note**: This document should be updated whenever design tokens or specifications change to reflect the current design system.
