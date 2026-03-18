---
status:
  - done
created: 2026-02-02
updated: 2026-02-02
category: data-visualization
complexity: A
aliases:
  - DistributionBar
dependencies: []
externalDependencies:
  - react
aiContext: |
  Use DistributionBar to show proportional segments in a single horizontal bar (e.g. budget allocation, vote share, category mix). Pass an array of segments with value and optional label/color; segment widths are computed from values or percentages. Prefer design tokens from DESIGN-SPEC.md for colors.
---

# DistributionBar Component

## Quick Summary

<!-- Write 2-3 sentences describing the component:
- What it is
- Primary use case
- Key distinguishing features
-->

**AI Hint**: <!-- Add explicit instruction for AI, e.g., "When user says 'X', use prop Y with value Z" -->

---

## When to Use

✅ **DO use DistributionBar when:**
<!-- Add specific use cases here -->

❌ **DON'T use DistributionBar when:**
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

<!-- Define the component's props here -->

<!-- Suggested organization:
### Content Props
- Props that control what content is displayed

### Design Props
- Props that control visual appearance (variants, sizes, colors, etc.)

### Behavior Props
- Props that control behavior (disabled, onClick, etc.)
-->

```typescript
// Define your component props here
```

---

## Quick Start

### Basic Usage

```tsx
// Add basic usage examples here
<DistributionBar />
```

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
