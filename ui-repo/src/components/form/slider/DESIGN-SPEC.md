# Slider Component - Design Specification

This document defines the complete design specifications for the Slider component. **AI should reference this document to generate code that conforms to design standards.**

---

## Modes

### Single-value mode (default)
- One thumb on a track
- Value: `number`
- Use cases: volume, brightness, single selection

### Range mode (`range={true}`)
- Two thumbs on a track
- Value: `[number, number]` (min, max)
- Use cases: price range, date range, age range
- Track between thumbs shows selected range (highlighted)

---

## Thumb Variants

### ThumbCircular
- **Default for**: Single-value mode (`range=false`)
- **Appearance**: `border-radius: 50%`
- **Use cases**: Volume, brightness, single selection

### ThumbRectangular
- **Default for**: Range mode (`range=true`)
- **Appearance**: `border-radius: 4px`
- **Use cases**: Price range, date range, age range

### thumbVariant override
- **Default behavior**: `thumbVariant ?? (range ? 'rectangular' : 'circular')`
- **Override**: Pass `thumbVariant="circular"` or `thumbVariant="rectangular"` to force a shape regardless of mode

---

## Design Tokens

### Color Palette

```scss
// Track
--slider-track-bg: var(--use-bg-tool-bg);           // chart-black-alpha-15-hex
--slider-track-fill: var(--chart-rainbow-blue-100); // #1364E6

// Thumb
--slider-thumb-bg: var(--chart-black-alpha-0-hex);           // #FFFFFF
--slider-thumb-border: var(--use-border-prime);      // chart-black-alpha-15-hex
--slider-thumb-shadow: var(--use-shadow-popup-default);

// Focus
--slider-focus-ring-color: var(--chart-rainbow-blue-100);
--slider-focus-ring-width: 2px;
--slider-focus-ring-offset: 2px;

// Disabled
--slider-opacity-disabled: 0.5;
```

### Spacing

```scss
// Track dimensions
--slider-track-height-small: 4px;
--slider-track-height-medium: 4px;
--slider-track-height-large: 6px;

// Thumb dimensions (WCAG 2.1 AAA: min 44px touch target)
--slider-thumb-size-small: 20px;
--slider-thumb-size-medium: 24px;
--slider-thumb-size-large: 28px;

// Touch target padding (achieve 44px minimum)
--slider-thumb-touch-padding: 10px;  // (44 - 24) / 2 for medium
```

### Effects

```scss
// Border radius
--slider-track-radius: 2px;
--slider-thumb-radius-circular: 50%;
--slider-thumb-radius-rectangular: 4px;

// Transitions
--slider-transition-duration: 120ms;
--slider-transition-timing: ease;
```

---

## Size Specifications

### Small

```scss
// Track
height: 4px;

// Thumb
width: 20px;
height: 20px;
min-width: 44px;
min-height: 44px;
padding: 12px;  // (44 - 20) / 2
```

**Use cases**: Dense UIs, compact forms

### Medium (Default)

```scss
// Track
height: 4px;

// Thumb
width: 24px;
height: 24px;
min-width: 44px;
min-height: 44px;
padding: 10px;  // (44 - 24) / 2
```

**Use cases**: Standard forms, most common

### Large

```scss
// Track
height: 6px;

// Thumb
width: 28px;
height: 28px;
min-width: 44px;
min-height: 44px;
padding: 8px;   // (44 - 28) / 2
```

**Use cases**: Hero sections, prominent settings

---

## State Specifications

### Default
```scss
// Track
background: var(--slider-track-bg);

// Track fill
background: var(--slider-track-fill);

// Thumb
background: var(--slider-thumb-bg);
border: 1px solid var(--slider-thumb-border);
box-shadow: 0 1px 3px var(--slider-thumb-shadow);
cursor: pointer;
```

### Hover
```scss
// Thumb (via HoverOverlay)
// Subtle overlay; no structural change
```

### Active (Dragging)
```scss
// Thumb
// Same as default; drag feedback via cursor
cursor: grabbing;
```

### Focus (Keyboard)
```scss
// Thumb
outline: 2px solid var(--slider-focus-ring-color);
outline-offset: 2px;
// Only visible with :focus-visible
```

### Disabled
```scss
// Root
opacity: var(--slider-opacity-disabled);
pointer-events: none;
cursor: not-allowed;
```

---

## Accessibility Specifications

### WCAG 2.1 Compliance

#### Touch Target Size (Level AAA)
```
Minimum touch target: 44px × 44px
Small: 44px × 44px (via padding) [OK]
Medium: 44px × 44px (via padding) [OK]
Large: 44px × 44px (via padding) [OK]
```

#### Color Contrast (Level AA)
```
Track fill on track bg: 3:1+ [OK]
Thumb on track: 4.5:1+ [OK]
Focus ring: 3:1 with adjacent [OK]
```

#### Focus Indicators (Level AA)
```
Focus ring: 2px solid var(--chart-rainbow-blue-100)
Offset: 2px
:focus-visible only
```

### Keyboard Navigation

```
ArrowLeft / ArrowDown: Decrease value by step
ArrowRight / ArrowUp: Increase value by step
Home: Set to min
End: Set to max
Tab: Move focus to next thumb (range mode) or out
```

### Screen Reader Support

```html
<!-- Single value -->
<div role="slider"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-valuenow="50"
     aria-label="Volume">

<!-- Range mode - min thumb -->
<div role="slider"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-valuenow="20"
     aria-valuetext="20 to 80">

<!-- Range mode - max thumb -->
<div role="slider"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-valuenow="80"
     aria-valuetext="20 to 80">
```

---

## Implementation Notes

### BEM Structure
```scss
.slider { }
.slider__track { }
.slider__track-fill { }
.slider__thumb { }
```

### Data Attributes
```scss
.slider[data-range="true"] { }
.slider[data-size="small"] { }
.slider[data-size="large"] { }
.slider[data-disabled="true"] { }
```

### CSS Modules
- Use `var(--slider-*)` and `var(--use-*)` tokens
- No hardcoded hex values

---

## AI Implementation Guide

### DO:

1. **Use design tokens**
   ```scss
   background: var(--slider-track-bg);
   background: var(--chart-rainbow-blue-100);
   ```

2. **Ensure 44px touch target**
   ```scss
   .slider__thumb {
     min-width: 44px;
     min-height: 44px;
     padding: 10px;  // Centers visual thumb
   }
   ```

3. **Include ARIA attributes**
   ```tsx
   role="slider"
   aria-valuemin={min}
   aria-valuemax={max}
   aria-valuenow={value}
   aria-label={ariaLabel}
   ```

4. **Handle keyboard**
   ```tsx
   onKeyDown: ArrowLeft/Right, Home, End
   ```

### DON'T:

1. **Don't use arbitrary values**
   ```scss
   /* BAD */
   background: #e0e0e0;
   width: 24px;
   ```

2. **Don't skip focus-visible**
   ```scss
   /* BAD */
   .slider__thumb:focus { outline: ...; }
   /* GOOD */
   .slider__thumb:focus-visible { outline: ...; }
   ```

3. **Don't forget disabled**
   ```tsx
   // BAD: thumb still focusable when disabled
   // GOOD: tabIndex={disabled ? -1 : 0}, aria-disabled={disabled}
   ```

---

**Note**: This document should be updated whenever design tokens or specifications change to reflect the current design system.
