---
status:
  - done
  - redesign-needed
figma:
  - draft
created: 2026-02-05
updated: 2026-02-12
category: form
complexity: B
aliases:
  - Slider
  - RangeSlider
dependencies: []
externalDependencies:
  - react
aiContext: |
  Slider supports single-value mode (default) and range mode (range=true) for min/max selection.
  Use range={true} when user needs to select a range (e.g., price, date). Use default for single value (e.g., volume).
---

# Slider Component

## Quick Summary

Slider is a form control for selecting a numeric value or range. It supports two modes:
- **Single-value mode** (default): One thumb for selecting a single value (e.g., volume, brightness).
- **Range mode** (`range={true}`): Two thumbs for selecting min/max (e.g., price range, date range).

**AI Hint**: When user says "range slider", "price range", or "min/max selection", use `range={true}`.

---

## When to Use

✅ **DO use Slider when:**
- Selecting a single numeric value (volume, brightness, percentage)
- Selecting a numeric range (price filter, age range, date range)

❌ **DON'T use Slider when:**
- Discrete options from a fixed set → use Select or RadioGroup
- Continuous color/spatial selection → use ColorPicker or other specialized control

---

## Visual Variants

### range
- **false** (default): Single thumb, value is `number`
- **true**: Two thumbs, value is `[number, number]`

---

## Props API

### Single-value mode (range=false or omitted)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | number | - | Controlled value |
| defaultValue | number | - | Uncontrolled default |
| min | number | 0 | Minimum value |
| max | number | 100 | Maximum value |
| step | number | 1 | Step increment |
| onChange | (value: number) => void | - | Value change callback |

### Range mode (range=true)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| value | [number, number] | - | Controlled [min, max] |
| defaultValue | [number, number] | - | Uncontrolled default |
| min | number | 0 | Minimum value |
| max | number | 100 | Maximum value |
| step | number | 1 | Step increment |
| onChange | (value: [number, number]) => void | - | Value change callback |

### Common props

| Prop | Type | Description |
|------|------|-------------|
| variant | 'default' \| 'primary' \| 'secondary' | Design variant |
| size | 'small' \| 'medium' \| 'large' | Size |
| thumbVariant | 'circular' \| 'rectangular' | Thumb shape override. Default: circular for single, rectangular for range |
| disabled | boolean | Whether disabled |
| aria-label | string | Accessible label for screen readers (recommended) |
| aria-labelledby | string | ID of element that labels the slider |

---

## Quick Start

### Single Value

```tsx
<Slider min={0} max={100} defaultValue={50} aria-label="Volume" />
<Slider min={0} max={100} value={volume} onChange={setVolume} aria-label="Volume" />
```

### Range Mode

```tsx
<Slider range min={0} max={1000} defaultValue={[100, 500]} aria-label="Price range" />
<Slider range min={0} max={1000} value={priceRange} onChange={setPriceRange} aria-label="Price range" />
```

**Accessibility**: Always provide `aria-label` (or `aria-labelledby`) for screen reader support.

### Thumb variant override

```tsx
// Range mode with circular thumbs (default is rectangular)
<Slider range thumbVariant="circular" min={0} max={100} defaultValue={[30, 70]} aria-label="Range" />

// Single value with rectangular thumb (default is circular)
<Slider thumbVariant="rectangular" min={0} max={100} defaultValue={50} aria-label="Volume" />
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Accessibility

- Keyboard navigation (arrow keys, Home/End)
- Focus indicators
- Screen reader support via ARIA
- Touch target sizes (min 44px)

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns.
