# AmapMap — Design Specifications

> **AI Warning**: `onAmapLoad` is called with `null` when `amapKey` is cleared. Always check `if (inst)` before updating UI state. See [Known Issues](#known-issues).

## Overview

Design specifications for the `AmapMap` component — a dual-mode map component using MapLibre GL JS (no key required) with optional AMap overlay (requires key).

---

## Layout & Structure

### Full-screen Map Composition

```
┌──────────────────────────────────────────────────────┐
│  [Header: Logo + Mode Indicator + Key Input + Btn]   │
├──────────────────────────────────────────────────────┤
│                                                      │
│   ┌────────────────────────────────────────────┐     │
│   │  Map Area (position: relative)             │     │
│   │                                            │     │
│   │   [MapLibre container] ─┐  switch on key  │     │
│   │   [AMap container]    ──┘  (not destroy)   │     │
│   │                                            │     │
│   │   [AmapStyleDebugPanel — absolute right]   │     │
│   │   [Features Panel — absolute left]         │     │
│   └────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
```

### Container Rules

- `AmapMap` outer `div` is `position: relative`; size controlled by consumer via `style` prop
- MapLibre and AMap containers are both `position: absolute; inset: 0`
- When switching map mode, MapLibre container `display: none` (instance not destroyed), AMap container `display: block`
- `AmapStyleDebugPanel` floats above map layer (`z-index: 800`), `AbsoluteLayout: top: 12px; right: 12px`

### Debug Panel

- **Width**: 272px
- **Position**: `top: 12px; right: 12px`
- **Border radius**: 12px
- **Padding (panelBody)**: 14px
- **Max height**: `calc(100vh - 100px)`, scroll when overflow

---

## Colors

### Map Element Colors (Defaults)

These colors are used for the MapLibre base map and can be modified in real time via the debug panel ("By element type" section):

| Element | Color Key | Default |
|---------|------------|---------|
| Ground | `background` | `rgba(240, 237, 232, 1)` |
| Water | `water` | `rgba(184, 212, 241, 1)` |
| Green | `green` | `rgba(200, 230, 201, 1)` |
| Building | `building` | `rgba(221, 214, 204, 1)` |
| Road | `road` | `rgba(255, 255, 255, 1)` |
| Highway | `highway` | `rgba(249, 199, 79, 1)` |
| Rail | `rail` | `rgba(120, 120, 120, 1)` |
| Boundary | `boundary` | `rgba(160, 160, 160, 1)` |
| Label | `label` | `rgba(51, 51, 51, 1)` |

### UI Chrome Colors

All non-map colors use global design system variables:

| Element | Token |
|------|-------|
| Panel background | `color-mix(in srgb, var(--use-bg-prime) 92%, transparent)` |
| Panel border | `var(--use-border-prime)` |
| Panel shadow | `var(--chart-black-alpha-6)` |
| Primary text | `var(--use-text-prime)` |
| Secondary text | `var(--use-text-secondary)` |
| Accent (icons, focus border, slider) | `var(--chart-rainbow-blue-100)` |
| Active background (preset/button selected) | `var(--chart-rainbow-blue-20)` |
| Mode active indicator dot | `var(--chart-rainbow-green-100)` |
| Mode inactive indicator dot | `var(--use-icon-secondary)` |
| Header hover background | `var(--use-hover-box-hover)` |

---

## AMap Official Themes (AMap mode only)

When `amap` is present, the debug panel shows AMap official themes (from `lib/mapConstants.ts` `AMAP_THEMES`):

| Theme | Style ID |
|-------|----------|
| Normal | `normal` |
| Dark | `dark` |
| Light | `light` |
| Whitesmoke | `whitesmoke` |
| Fresh | `fresh` |
| Grey | `grey` |
| Graffiti | `graffiti` |
| Macaron | `macaron` |
| Blue | `blue` |

---

## Style Sliders

| Param | Key | Range | Step |
|-------|-----|-------|------|
| Provincial boundary width | `boundaryW` | 0.3 – 5px | 0.1 |
| National boundary width | `natBoundaryW` | 0.5 – 8px | 0.1 |
| Building opacity | `buildingOp` | 0 – 100% | 5 |
| Place label size | `labelScale` | 50 – 200% | 10 |
| Road label size | `roadLabelScale` | 50 – 200% | 10 |

---

## Typography

### Panel Header (`h3`)

- **Font Size**: 12px
- **Font Weight**: 600
- **Color**: `var(--use-text-prime)`

### Section Labels

- **Font Size**: 10px
- **Font Weight**: 600
- **Text Transform**: uppercase
- **Letter Spacing**: 0.5px
- **Color**: `var(--use-text-secondary)`

### Color Input (RGBA)

- **Font Size**: 10px
- **Font Family**: `'SF Mono', 'Fira Code', monospace`
- **Color**: `var(--use-text-secondary)` / `var(--use-text-prime)` on focus

### Slider Value Display

- **Font Size**: 10px
- **Font Family**: `'SF Mono', 'Fira Code', monospace`
- **Color**: `var(--chart-rainbow-blue-100)`

---

## Panel Header

- **Height**: ~37px (padding: 10px 14px)
- **Border Bottom**: 1px solid `var(--use-border-prime)`
- **Cursor**: pointer
- **Hover Background**: `var(--use-hover-box-hover)` + 0.15s transition
- **Chevron**: 16px, rotates 180° when expanded, color `var(--use-icon-secondary)`

---

## Preset Grid (AMap themes)

- **Layout**: 3-column equal-width grid
- **Gap**: 5px
- **Button Padding**: 5px
- **Border**: 1px solid `var(--use-border-prime)`
- **Border Radius**: 6px
- **Font Size**: 11px / Weight 500
- **Default Color**: `var(--use-text-prime)` on `var(--use-bg-prime)`
- **Hover**: border + text → `var(--chart-rainbow-blue-100)`
- **Active**: border + text → `var(--chart-rainbow-blue-100)`, background → `var(--chart-rainbow-blue-20)`

---

## Color Picker Row

- **Color Swatch**: 26×26px, border 2px `var(--use-border-prime)`, border-radius 6px
- **Swatch Hover Border**: `var(--chart-rainbow-blue-100)`
- **RGBA Input Width**: 120px

---

## Slider Row

- **Track Height**: 3px
- **Track Color**: `var(--use-border-prime)`
- **Thumb**: 12×12px, circular, `var(--chart-rainbow-blue-100)`, shadow: `var(--chart-black-alpha-20)`

---

## Features Panel (AMap Only)

Shown only when `amap` prop is non-empty. In the current implementation, AMap features (themes, POI search, traffic, satellite) are integrated into the debug panel on the right. Design spec for a standalone left panel:

- **Width**: 240px
- **Position**: `top: 12px; left: 12px`
- **Border radius**: 12px
- **Padding**: 12px
- **Background**: Same as Panel — `color-mix(in srgb, var(--use-bg-prime) 92%, transparent)`
- **POI search results max height**: 200px, scroll when overflow
- **Active button (traffic/satellite)**: background `var(--chart-rainbow-blue-20)`, color `var(--chart-rainbow-blue-100)`

---

## Mode Indicator (Header)

| State | Dot Color | Label |
|-------|-----------|-------|
| MapLibre mode (default) | `var(--use-icon-secondary)` | Vector map mode |
| Loading | `var(--use-icon-secondary)` | — |
| AMap active | `var(--chart-rainbow-green-100)` | AMap Key loaded |

- **Dot Size**: 6×6px, circular
- **Transition**: `background 0.3s`

---

## Responsive Behavior

- Map container fills parent (`position: absolute; inset: 0`), size determined by parent
- Demo page layout: `height: 100dvh` (uses `dvh` for mobile bottom bar), `flex-direction: column`
- Panel max height `calc(100vh - 100px)`, vertical scroll when overflow
- No mobile breakpoint (this component is a desktop debugging tool)

---

## Animation

- **Panel collapse/expand**: `{isOpen && <div>}` conditional render (no transition, instant switch)
- **Chevron rotation**: `transform: rotate(180deg)` + `transition: transform 0.2s`
- **Hover background**: `transition: background 0.15s`
- **Focus border**: `transition: border-color 0.2s`
- **Mode indicator dot**: `transition: background 0.3s`
- **Toast**: `transition: all 0.3s ease`, slide up from bottom + fade in

---

## Accessibility

- Panel header has `role="button"` + `tabIndex={0}` + `onKeyDown` (Enter triggers)
- Color input has `aria-label`
- `<select>` uses native element for keyboard accessibility
- Search result list items have `role="button"` + `tabIndex={0}` + `onKeyDown` (Enter triggers)

---

## Known Issues

### `onAmapLoad` is called with `null` when key is cleared

`onAmapLoad` is reused for two scenarios:
- AMap load success: `onAmapLoad(AMap.Map instance)`
- `amapKey` cleared: `onAmapLoad(null)`

**Impact**: If the callback does not check for `null`, it may incorrectly show "loaded" state when no key is provided.

**Correct usage**:

```typescript
const handleAmapLoad = (inst: unknown) => {
  setAmap(inst);
  if (inst) {
    setModeLabel('AMap Key loaded');
    setModeActive(true);
  } else {
    setModeLabel('Vector map mode');
    setModeActive(false);
  }
  setIsLoading(false);
};
```

**AI Note**: This is a design decision — `onAmapLoad(null)` is the teardown signal, not a bug in `AmapMap`. It is the caller's responsibility to handle `null`.
