---
status:
  - draft
created: 2026-03-05
updated: 2026-03-05
category: data-visualization
complexity: B
aliases:
  - AmapMap
  - MapLibreMap
  - map color scheme
dependencies: []
externalDependencies:
  - react
  - maplibre-gl
  - (optional) AMap JSAPI v2.0 (loaded dynamically, not an npm dependency)
aiContext: |
  AmapMap is a map component with two display modes:
  1. MapLibre mode (default, no key required): renders a vector tile map using OpenFreeMap tiles.
  2. AMap mode (optional, requires a valid AMap Key): dynamically loads AMap JSAPI v2.0 and switches to an AMap map instance.
  AmapStyleDebugPanel is bundled inside this package (debug-panel/ subdirectory). Use the showDebugPanel prop to enable it directly on AmapMap — no external wiring needed.
  The component does NOT require any key to work — MapLibre mode is fully functional without one.
---

# AmapMap

A map component with two display modes:

- **MapLibre vector map** (default, no key required): Uses [MapLibre GL JS](https://maplibre.org/) and [OpenFreeMap](https://openfreemap.org/) free base tiles, works out of the box.
- **AMap** (optional, requires key): Dynamically loads AMap JSAPI v2.0, switches to AMap instance, unlocks traffic, satellite, POI search and other AMap features.

Typically used with `AmapStyleDebugPanel`, which provides color debugging, presets, zoom controls, etc.

## Features

- **Pitch and rotation disabled**: Map is fixed in 2D top-down view; no pitch or rotation allowed
  - MapLibre: `maxPitch=0`, `dragRotate=false`, `touchPitch=false`; disables right-click drag rotate, two-finger rotate, two-finger pitch
  - AMap: `viewMode='2D'`, `pitchEnable=false`, `rotateEnable=false`
- **No key required**: MapLibre mode is fully free, no API key needed
- **Optional AMap mode**: Pass `amapKey` to dynamically load AMap JSAPI, no npm package
- **China boundary overlay**: Optional DataV GeoJSON China standard boundary (`chinaMapStandard`)
- **POI search and place marking** (AMap only): Search places (e.g. business districts, landmarks) and mark them on the map; see [POI Search and Place Marking](#poi-search-and-place-marking-amap-only)
- **Live color debugging**: Get map instance via `onLoad` callback, call `setPaintProperty` to update colors in real time
- **Dual container switch**: MapLibre and AMap containers coexist; MapLibre instance is not destroyed when switching

## Usage

```tsx
import { AmapMap } from '@/components/data-visualization/amap';

// Minimal usage (MapLibre vector map, no key)
<AmapMap style={{ height: '100dvh' }} />

// With embedded debug panel (showDebugPanel prop)
<AmapMap
  style={{ position: 'absolute', inset: 0 }}
  chinaMapStandard
  showDebugPanel
  debugPanelDefaultOpen
/>

// Optional: pass AMap key to switch to AMap
<AmapMap
  style={{ position: 'absolute', inset: 0 }}
  chinaMapStandard
  amapKey="your-amap-key"
  showDebugPanel
  onAmapLoad={(inst) => console.log('amap loaded', inst)}
  onAmapError={(err) => console.error(err)}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialColors` | `ColorState` | `DEFAULT_COLORS` | Initial map color config |
| `initialStyles` | `StyleState` | `DEFAULT_STYLES` | Initial style config (line width, opacity, etc.) |
| `initialZooms` | `ZoomState` | `DEFAULT_ZOOMS` | Initial zoom level config |
| `initialView` | `InitialViewState` | `DEFAULT_INITIAL_VIEW` | Initial map view (center, zoom) |
| `chinaMapStandard` | `boolean` | `true` | Whether to overlay DataV China standard boundary GeoJSON |
| `amapKey` | `string` | — | AMap key; when provided, dynamically loads AMap JSAPI |
| `showDebugPanel` | `boolean` | `false` | Whether to embed debug panel; map/amap instances are wired internally |
| `debugPanelDefaultOpen` | `boolean` | `true` | Whether debug panel is open by default; only when `showDebugPanel=true` |
| `onLoad` | `(map: maplibregl.Map) => void` | — | MapLibre map load callback |
| `onMoveEnd` | `(map: maplibregl.Map) => void` | — | Map viewport change (moveend) callback |
| `onAmapLoad` | `(inst: unknown) => void` | — | AMap load success callback, returns AMap.Map instance; **also called with `null` when key is cleared** |
| `onAmapError` | `(err: unknown) => void` | — | AMap load error callback |
| `className` | `string` | — | Container div className |
| `style` | `React.CSSProperties` | — | Container div style, typically for height |

## AMap Load Flow

1. Pass `amapKey` (non-empty string)
2. Dynamically create `<script src="https://webapi.amap.com/maps?v=2.0&key=${amapKey}">` and inject into `document.head`
3. After script loads, asynchronously load plugins: `AMap.PlaceSearch`, `AMap.Scale`, `AMap.ToolBar`
4. Create `new AMap.Map(container, { zoom, center, viewMode: '2D', pitchEnable: false, rotateEnable: false })` instance (pitch and rotation disabled)
5. Call `onAmapLoad(instance)` to notify
6. MapLibre container hidden (`display: none`), AMap container shown — **MapLibre instance is not destroyed**

## ⚠️ Known Issues

### `onAmapLoad` is called with `null` when key is cleared

`onAmapLoad` is reused for two scenarios:
- AMap load **success**: `onAmapLoad(AMap.Map instance)`
- `amapKey` cleared: `onAmapLoad(null)` (notifies that amap instance is destroyed)

**Impact**: If the caller's `onAmapLoad` handler does not check for `null`, it may incorrectly show "loaded" state even when no key is provided.

**Fix**: Check the parameter in `onAmapLoad`:

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

## Color Debugging

Use `showDebugPanel` prop to embed `AmapStyleDebugPanel`; map/amap instances are injected internally:

```tsx
<AmapMap showDebugPanel chinaMapStandard style={{ height: '100dvh' }} />
```

You can also import the debug panel separately (advanced):

```tsx
import { AmapStyleDebugPanel } from '@/components/data-visualization/amap';
```

- `AmapStyleDebugPanel` calls `map.setPaintProperty` to update MapLibre colors in real time
- When AMap instance exists, calls `setCustomMapStyle` to apply custom styles
- Colors, line widths, zoom params are defined in `lib/mapParaConfig.ts`; `lib/mapConstants.ts` has `AMAP_THEMES` and `CHINA_MAP_STANDARD`

## POI Search and Place Marking (AMap only)

When `amapKey` is provided and `showDebugPanel` is true, the debug panel shows a **Features Panel** with POI search. You can search for places (e.g. business districts like Xujiahui 徐家汇商圈, landmarks, addresses) and mark them on the map.

**How it works:**
1. Enter an AMap key and load the map
2. Use the search input in the Features Panel (left side when AMap is active)
3. Type a keyword (e.g. "Xujiahui", "Forbidden City", "徐家汇商圈")
4. Click a result to place a marker on the map and center the view on that location

**Requirements:** AMap mode (`amapKey`), `showDebugPanel`, and the debug panel must be open.

**Limitations:**
- **AMap mode only** — MapLibre mode has no POI search
- **Point markers only** — Places are marked as points; the component does not draw boundary polygons (e.g. business district outlines)
- **Result limit** — Up to 6 results per search
- **Nationwide search** — Search scope is nationwide by default

## File Structure

```
amap/
├── the-component/
│   ├── Component.tsx     # AmapMap component
│   ├── types.ts         # AmapMapProps interface
│   ├── styles.module.scss
│   └── index.tsx
├── debug-panel/
│   ├── Component.tsx    # AmapStyleDebugPanel
│   ├── types.ts         # AmapStyleDebugPanelProps interface
│   ├── styles.module.scss
│   └── index.ts
├── lib/
│   ├── mapParaConfig.ts # Color/style/zoom constants and types (DEFAULT_COLORS, STYLE_SLIDERS, ZOOM_CONTROLS)
│   ├── mapConstants.ts  # AMAP_THEMES, CHINA_MAP_STANDARD
│   ├── mapStyle.ts      # buildStyle() — MapLibre StyleSpec
│   ├── colorUtils.ts    # Color format utilities
│   └── mapCalculations.ts # Scale calculation
├── __demo__/react/
│   └── page-content.tsx # Full demo (MapLibre + AMap + debug panel)
└── index.ts
```

## Code Example

Full runnable example:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)**

**AI Note**: `amapKey` is optional; the component works fully without a key (MapLibre mode). `onAmapLoad` must handle `null`. AMap JSAPI is not installed via npm; it is loaded via dynamic script injection (`(window as any).AMap`). `AmapStyleDebugPanel` is bundled in this package's `debug-panel/` subdirectory; enable via `showDebugPanel` prop or import from `@/components/data-visualization/amap`.
