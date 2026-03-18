/**
 * Map parameter configuration — single source of truth for initial view,
 * By element type, Style tuning, and Zoom visibility.
 *
 * Used by: AmapMap (initial state), debug-panel (UI controls), buildStyle().
 * Do not duplicate these params elsewhere.
 */

// =============================================================================
// INITIAL VIEW
// =============================================================================
// Default center and zoom. AmapMap uses these when center/zoom props are not provided.
// Debug-panel uses them for MapInfoDisplay and generateCodeOutput fallback.

/** Default map center [lng, lat]. */
export const DEFAULT_CENTER: [number, number] = [117.1416, 35.1717];

/** Default map zoom level (0–18). */
export const DEFAULT_ZOOM = 3.9;

/** Initial map view. Shape matches the "Initial view" config group. */
export interface InitialViewState {
  center: [number, number];
  zoom: number;
}

/** Default initial view. */
export const DEFAULT_INITIAL_VIEW: InitialViewState = {
  center: [117.1416, 35.1717],
  zoom: 3.9, // scale ~1:32396749
};

// =============================================================================
// SECTION 1: BY ELEMENT TYPE
// =============================================================================
// Element colors (ground, water, green, building, road, highway, rail, boundary,
// label). Each key maps to MapLibre paint properties. The debug-panel renders
// color pickers from ELEMENTS; AmapMap and buildStyle use ColorState.

/** Color keys for map elements. Must match ELEMENTS[].key. */
export type ColorKey =
  | 'background'
  | 'water'
  | 'green'
  | 'building'
  | 'road'
  | 'highway'
  | 'rail'
  | 'boundary'
  | 'label';

/** Map from ColorKey to rgba/hex string. Used by buildStyle and applyColorToMap. */
export type ColorState = Record<ColorKey, string>;

/** Defines one row in the "By element type" color picker UI. */
export interface ElementDef {
  key: ColorKey;
  name: string;
}

/** Element definitions for debug-panel color pickers. Order determines UI order. */
export const ELEMENTS: ElementDef[] = [
  { key: 'background', name: 'Ground' },
  { key: 'water', name: 'Water' },
  { key: 'green', name: 'Green' },
  { key: 'building', name: 'Building' },
  { key: 'road', name: 'Road' },
  { key: 'highway', name: 'Highway' },
  { key: 'rail', name: 'Rail' },
  { key: 'boundary', name: 'Boundary' },
  { key: 'label', name: 'Label' },
];

/** Default colors. AmapMap uses these when initialColors is not provided. */
export const DEFAULT_COLORS: ColorState = {
  background: 'rgba(240, 237, 232, 1)',
  water: 'rgba(184, 212, 241, 1)',
  green: 'rgba(200, 230, 201, 1)',
  building: 'rgba(221, 214, 204, 1)',
  road: 'rgba(255, 255, 255, 1)',
  highway: 'rgba(249, 199, 79, 1)',
  rail: 'rgba(120, 120, 120, 1)',
  boundary: 'rgba(160, 160, 160, 1)',
  label: 'rgba(51, 51, 51, 1)',
};

/** Maps ColorKey to MapLibre layer IDs. Used for code output in debug-panel. */
export const ELEMENT_CODE_REFS: Record<ColorKey, string> = {
  background: 'bg, lbl-place, nat-boundary-case',
  water: 'water-fill, waterway',
  green: 'green-cover, green-park',
  building: 'building',
  road: 'road-fill, road-case, lbl-road',
  highway: 'hw-fill, hw-case',
  rail: 'rail',
  boundary: 'boundary-sub, nat-boundary, cn-nat',
  label: 'lbl-place, lbl-road',
};

// =============================================================================
// SECTION 2: STYLE TUNING
// =============================================================================
// Style params: color-style (hwCasing, roadCasing) and numeric-style (boundaryW,
// natBoundaryW, buildingOp, labelScale, roadLabelScale). The debug-panel renders
// color pickers from STYLE_COLORS and sliders from STYLE_SLIDERS.

/** Style keys. Color-style (hwCasing, roadCasing) and numeric-style (rest). */
export type StyleKey =
  | 'hwCasing'
  | 'roadCasing'
  | 'boundaryW'
  | 'natBoundaryW'
  | 'buildingOp'
  | 'labelScale'
  | 'roadLabelScale';

/** Style state: colors for casing, numbers for widths/opacity/scale. */
export type StyleState = {
  hwCasing: string;
  roadCasing: string;
  boundaryW: number;
  natBoundaryW: number;
  buildingOp: number;
  labelScale: number;
  roadLabelScale: number;
};

/** Defines one row in the "Style tuning" slider UI. */
export interface StyleSliderDef {
  key: StyleKey;
  name: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  fmt: (v: number) => string;
  /** Which panel group this slider belongs to. */
  group: 'appearance' | 'structure';
}

/** Color-style keys for debug-panel. Rendered as color pickers. */
export const STYLE_COLORS: Array<{ key: StyleKey; name: string }> = [
  { key: 'hwCasing', name: 'Highway casing' },
  { key: 'roadCasing', name: 'Road casing' },
];

/** Numeric-style keys for debug-panel. Rendered as sliders. */
export const STYLE_SLIDERS: StyleSliderDef[] = [
  {
    key: 'boundaryW',
    name: 'Provincial boundary width',
    min: 0.3,
    max: 5,
    step: 0.1,
    unit: 'px',
    fmt: (v) => v.toFixed(1),
    group: 'appearance',
  },
  {
    key: 'natBoundaryW',
    name: 'National boundary width',
    min: 0.5,
    max: 8,
    step: 0.1,
    unit: 'px',
    fmt: (v) => v.toFixed(1),
    group: 'appearance',
  },
  {
    key: 'buildingOp',
    name: 'Building opacity',
    min: 0,
    max: 100,
    step: 5,
    unit: '%',
    fmt: (v) => Math.round(v) + '%',
    group: 'appearance',
  },
  {
    key: 'labelScale',
    name: 'Place label size',
    min: 50,
    max: 200,
    step: 10,
    unit: '%',
    fmt: (v) => Math.round(v) + '%',
    group: 'structure',
  },
  {
    key: 'roadLabelScale',
    name: 'Road label size',
    min: 50,
    max: 200,
    step: 10,
    unit: '%',
    fmt: (v) => Math.round(v) + '%',
    group: 'structure',
  },
];

/** Appearance sliders (scheme-dependent). Subset of STYLE_SLIDERS. */
export const APPEARANCE_SLIDERS = STYLE_SLIDERS.filter((s) => s.group === 'appearance');

/** Structure sliders (scheme-independent). Subset of STYLE_SLIDERS. */
export const STRUCTURE_SLIDERS = STYLE_SLIDERS.filter((s) => s.group === 'structure');

/** Default styles. AmapMap uses these when initialStyles is not provided. */
export const DEFAULT_STYLES: StyleState = {
  hwCasing: 'rgba(204, 154, 34, 1)',
  roadCasing: 'rgba(230, 230, 230, 1)',
  boundaryW: 0.7,
  natBoundaryW: 0.7,
  buildingOp: 75,
  labelScale: 80,
  roadLabelScale: 100,
};

// =============================================================================
// SECTION 3: ZOOM VISIBILITY
// =============================================================================
// Min-zoom per layer group. Controls when layers become visible. The debug-panel
// renders sliders from ZOOM_CONTROLS; applyZoomToMap uses layers to set
// setLayerZoomRange.

/** Zoom keys. Each maps to one or more MapLibre layer IDs. */
export type ZoomKey =
  | 'placeMin'
  | 'waterwayMin'
  | 'buildingMin'
  | 'roadMin'
  | 'hwMin'
  | 'railMin'
  | 'roadLblMin'
  | 'boundarySubMin'
  | 'natBoundaryMin'
  | 'natBoundaryCaseMin';

/** Map from ZoomKey to minzoom value (0–24). */
export type ZoomState = Record<ZoomKey, number>;

/** Defines one row in the "Zoom visibility" slider UI. layers = MapLibre layer IDs. */
export interface ZoomControlDef {
  key: ZoomKey;
  name: string;
  layers: string[];
}

/** Zoom control definitions. layers are passed to setLayerZoomRange. */
export const ZOOM_CONTROLS: ZoomControlDef[] = [
  { key: 'placeMin', name: 'Place labels', layers: ['lbl-place'] },
  { key: 'waterwayMin', name: 'Waterway', layers: ['waterway'] },
  { key: 'buildingMin', name: 'Building', layers: ['building'] },
  { key: 'roadMin', name: 'Road', layers: ['road-case', 'road-fill'] },
  { key: 'hwMin', name: 'Highway', layers: ['hw-case', 'hw-fill'] },
  { key: 'railMin', name: 'Rail', layers: ['rail'] },
  { key: 'roadLblMin', name: 'Road labels', layers: ['lbl-road'] },
  { key: 'boundarySubMin', name: 'Provincial boundary', layers: ['boundary-sub'] },
  { key: 'natBoundaryMin', name: 'National boundary', layers: ['nat-boundary'] },
  { key: 'natBoundaryCaseMin', name: 'National boundary casing', layers: ['nat-boundary-case'] },
];

/** Default zoom min values. AmapMap uses these when initialZooms is not provided. */
export const DEFAULT_ZOOMS: ZoomState = {
  placeMin: 18,
  waterwayMin: 8,
  buildingMin: 13,
  roadMin: 10,
  hwMin: 6,
  railMin: 10,
  roadLblMin: 13,
  boundarySubMin: 3,
  natBoundaryMin: 0,
  natBoundaryCaseMin: 0,
};

// =============================================================================
// SECTION 4: BOOLEAN TOGGLES
// =============================================================================
// Feature flags for map layer visibility. Debug-panel renders checkboxes.

/** Toggle keys. Each controls a boolean feature. */
export type ToggleKey = 'natBoundaryCasing';

/** Map from ToggleKey to boolean. */
export type ToggleState = Record<ToggleKey, boolean>;

/** Defines one row in the "Toggles" checkbox UI. */
export interface ToggleDef {
  key: ToggleKey;
  name: string;
}

/** Toggle definitions for debug-panel. */
export const STYLE_TOGGLES: ToggleDef[] = [
  { key: 'natBoundaryCasing', name: 'National boundary casing' },
];

/** Default toggles. AmapMap uses these when initialToggles is not provided. */
export const DEFAULT_TOGGLES: ToggleState = {
  natBoundaryCasing: true,
};
