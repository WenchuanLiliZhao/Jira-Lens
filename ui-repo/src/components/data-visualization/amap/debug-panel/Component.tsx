/**
 * AmapStyleDebugPanel - Dev tool for map color/style/zoom debugging
 */

import type maplibregl from 'maplibre-gl';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AMAP_THEMES } from '../lib/mapConstants';
import {
  APPEARANCE_SLIDERS,
  DEFAULT_CENTER,
  DEFAULT_COLORS,
  DEFAULT_STYLES,
  DEFAULT_TOGGLES,
  DEFAULT_ZOOM,
  DEFAULT_ZOOMS,
  type InitialViewState,
  ELEMENTS,
  STRUCTURE_SLIDERS,
  STYLE_COLORS,
  STYLE_TOGGLES,
  ZOOM_CONTROLS,
} from '../lib/mapParaConfig';
import {
  colorToHex,
  colorToRgba,
  hexToRgba,
  parseColorToRgba,
} from '../lib/colorUtils';
import {
  applyColorToMap,
  applyStyleToMap,
  applyToggleToMap,
  applyZoomToMap,
} from '../lib/mapApply';
import { formatScale, metersPerPixel } from '../lib/mapCalculations';
import { getTextField } from '../lib/mapStyle';
import type {
  ColorKey,
  ColorState,
  StyleKey,
  StyleState,
  ToggleKey,
  ToggleState,
  ZoomKey,
  ZoomState,
} from '../lib/mapParaConfig';
import { useThemeVariant } from '../lib/useThemeVariant';
import type { AmapStyleDebugPanelProps, ExtraSection } from './types';
import styles from './styles.module.scss';

// ---- Map apply (AMap only) ----

function applyAmapStyle(amap: unknown, colors: ColorState): void {
  if (!amap) return;
  const styleJson = [
    { featureType: 'land', elementType: 'geometry.fill', stylers: { color: colors.background } },
    { featureType: 'water', elementType: 'geometry.fill', stylers: { color: colors.water } },
    { featureType: 'green', elementType: 'geometry.fill', stylers: { color: colors.green } },
    { featureType: 'building', elementType: 'geometry.fill', stylers: { color: colors.building } },
    { featureType: 'local', elementType: 'geometry.fill', stylers: { color: colors.road } },
    { featureType: 'arterial', elementType: 'geometry.fill', stylers: { color: colors.road } },
    { featureType: 'highway', elementType: 'geometry.fill', stylers: { color: colors.highway } },
    { featureType: 'railway', elementType: 'geometry.stroke', stylers: { color: colors.rail } },
    { featureType: 'boundary', elementType: 'geometry.stroke', stylers: { color: colors.boundary } },
    { featureType: 'label', elementType: 'labels.text.fill', stylers: { color: colors.label } },
  ];
  try {
    (amap as { setCustomMapStyle: (opts: { styleJson: string }) => void }).setCustomMapStyle({
      styleJson: JSON.stringify(styleJson),
    });
  } catch {
    // setCustomMapStyle may throw in some AMap versions
  }
}

export type CodeOutputMode = 'component' | 'props';

function generateAppearanceOutput(
  colors: ColorState,
  s: StyleState,
  toggles: ToggleState,
  mode: CodeOutputMode,
  colorSchemeLabel: string | undefined,
  themeVariant: 'light' | 'dark' | undefined,
  extraSections?: ExtraSection[]
): string {
  const nl = '\n';
  const contextLine = colorSchemeLabel || themeVariant
    ? `Color scheme: ${colorSchemeLabel ?? 'custom'}  |  Theme: ${themeVariant ?? 'unknown'}`
    : null;

  const colorsObj = `  background: '${colorToRgba(colors.background)}',
  water: '${colorToRgba(colors.water)}',
  green: '${colorToRgba(colors.green)}',
  building: '${colorToRgba(colors.building)}',
  road: '${colorToRgba(colors.road)}',
  highway: '${colorToRgba(colors.highway)}',
  rail: '${colorToRgba(colors.rail)}',
  boundary: '${colorToRgba(colors.boundary)}',
  label: '${colorToRgba(colors.label)}'`;

  const appearanceStylesObj = `  hwCasing: '${colorToRgba(s.hwCasing)}',
  roadCasing: '${colorToRgba(s.roadCasing)}',
  boundaryW: ${s.boundaryW},
  natBoundaryW: ${s.natBoundaryW},
  buildingOp: ${s.buildingOp}`;

  const togglesObj = STYLE_TOGGLES.map((t) => `  ${t.key}: ${toggles[t.key]}`).join(`,` + nl);

  const extraCode = extraSections
    ?.map((s) => s.codeOutput)
    .filter(Boolean)
    .join('\n') ?? '';

  if (mode === 'component') {
    const schemeNote = colorSchemeLabel
      ? `These colors come from a color scheme config (e.g. exampleColorSchemes.ts).\nTo modify: update COLOR_SCHEMES["${colorSchemeLabel}"]["${themeVariant ?? 'light'}"] in your scheme file.\n(DEFAULT_COLORS in mapParaConfig.ts has no effect when initialColors is explicitly passed.)\n`
      : `Update in mapParaConfig.ts: DEFAULT_COLORS, appearance keys in DEFAULT_STYLES, DEFAULT_TOGGLES.\n`;
    const header = `Appearance config — color-scheme dependent${contextLine ? `\n${contextLine}` : ''}

${schemeNote}
--- Config data ---
`;
    return (
      header +
      `// DEFAULT_COLORS
export const DEFAULT_COLORS: ColorState = {
${colorsObj},
};

// DEFAULT_STYLES (appearance keys — keep other keys unchanged)
export const DEFAULT_STYLES: StyleState = {
${appearanceStylesObj},
  // ...
};

// DEFAULT_TOGGLES
export const DEFAULT_TOGGLES: ToggleState = {
${togglesObj},
};
` +
      (extraCode ? `\n${extraCode}\n` : '')
    );
  }

  // mode === 'props'
  const schemeSource = colorSchemeLabel
    ? `Source: COLOR_SCHEMES["${colorSchemeLabel}"]["${themeVariant ?? 'light'}"] in your color scheme config file.\nTo adjust colors, modify the corresponding variant in that file.\n`
    : `Pass as AmapMap props: initialColors, initialStyles (appearance keys), initialToggles.\n`;
  const header = `Appearance config — color-scheme dependent${contextLine ? `\n${contextLine}` : ''}

${schemeSource}
--- Config data ---
`;
  return (
    header +
    `// Element colors — initialColors prop
const mapColors: ColorState = {
${colorsObj},
};

// Appearance styles — initialStyles prop (appearance keys)
const mapAppearanceStyles = {
${appearanceStylesObj},
};

// Toggles — initialToggles prop
const mapToggles: ToggleState = {
${togglesObj},
};

// Note: initialStyles requires the full StyleState (all keys).
// Also copy View & Structure config to obtain mapStructureStyles, then combine:
// <AmapMap initialColors={mapColors} initialStyles={{...mapAppearanceStyles, ...mapStructureStyles}} initialToggles={mapToggles} />
` +
    (extraCode ? `\n${extraCode}\n` : '')
  );
}

function generateStructureOutput(
  s: StyleState,
  zooms: ZoomState,
  map: maplibregl.Map | null,
  initialView: InitialViewState | undefined,
  mode: CodeOutputMode,
  extraSections?: ExtraSection[]
): string {
  const nl = '\n';
  const c = map?.isStyleLoaded()
    ? map.getCenter()
    : { lng: initialView?.center[0] ?? DEFAULT_CENTER[0], lat: initialView?.center[1] ?? DEFAULT_CENTER[1] };
  const zoom = map?.isStyleLoaded() ? map.getZoom() : (initialView?.zoom ?? DEFAULT_ZOOM);
  const mpp = metersPerPixel(c.lat, zoom);
  const scaleStr = formatScale(mpp);
  const centerStr = `[${c.lng.toFixed(4)}, ${c.lat.toFixed(4)}]`;
  const zoomStr = zoom.toFixed(1);

  const structureStylesObj = `  labelScale: ${s.labelScale},
  roadLabelScale: ${s.roadLabelScale}`;

  const zoomsObj = ZOOM_CONTROLS.map((zc) => `  ${zc.key}: ${zooms[zc.key]}`).join(`,` + nl);

  const extraCode = extraSections
    ?.map((s) => s.codeOutput)
    .filter(Boolean)
    .join('\n') ?? '';

  if (mode === 'component') {
    const header = `View & Structure config — independent of color scheme

Update in mapParaConfig.ts: DEFAULT_INITIAL_VIEW, labelScale/roadLabelScale in DEFAULT_STYLES, DEFAULT_ZOOMS.

--- Config data ---
`;
    return (
      header +
      `// DEFAULT_INITIAL_VIEW
export const DEFAULT_INITIAL_VIEW: InitialViewState = {
  center: ${centerStr},
  zoom: ${zoomStr},  // scale ~${scaleStr}
};

// DEFAULT_STYLES (structure keys — keep other keys unchanged)
export const DEFAULT_STYLES: StyleState = {
${structureStylesObj},
  // ...
};

// DEFAULT_ZOOMS
export const DEFAULT_ZOOMS: ZoomState = {
${zoomsObj},
};
` +
      (extraCode ? `\n${extraCode}\n` : '')
    );
  }

  // mode === 'props'
  const header = `View & Structure config — independent of color scheme

Pass as AmapMap props: initialView, initialStyles (structure keys), initialZooms.
These values are safe to set globally across all color schemes.

--- Config data ---
`;
  return (
    header +
    `// Map view — initialView prop
const mapView: InitialViewState = {
  center: ${centerStr},
  zoom: ${zoomStr},  // scale ~${scaleStr}
};

// Structure styles — initialStyles prop (structure keys)
const mapStructureStyles = {
${structureStylesObj},
};

// Zoom visibility — initialZooms prop
const mapZooms: ZoomState = {
${zoomsObj},
};

// Note: initialStyles requires the full StyleState (all keys).
// Also copy Appearance config to obtain mapAppearanceStyles, then combine:
// <AmapMap initialView={mapView} initialStyles={{...mapAppearanceStyles, ...mapStructureStyles}} initialZooms={mapZooms} />
` +
    (extraCode ? `\n${extraCode}\n` : '')
  );
}

// ---- Internal sub-components ----

function ColorPickerRow({
  label,
  value,
  onChange,
  cn,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  cn: Record<string, string>;
}) {
  const [rgbaInput, setRgbaInput] = useState(() => colorToRgba(value));
  useEffect(() => {
    setRgbaInput(colorToRgba(value));
  }, [value]);

  const handleRgbaBlur = useCallback(() => {
    const parsed = parseColorToRgba(rgbaInput);
    if (parsed) {
      onChange(parsed);
    } else {
      setRgbaInput(colorToRgba(value));
    }
  }, [rgbaInput, value, onChange]);

  const handleRgbaKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleRgbaBlur();
      }
    },
    [handleRgbaBlur]
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rgba = hexToRgba(e.target.value);
      setRgbaInput(rgba);
      onChange(rgba);
    },
    [onChange]
  );

  return (
    <div className={cn.colorRow}>
      <span className={cn.colorRowLabel}>{label}</span>
      <input
        type="text"
        className={cn.colorRowRgba}
        value={rgbaInput}
        onChange={(e) => setRgbaInput(e.target.value)}
        onBlur={handleRgbaBlur}
        onKeyDown={handleRgbaKeyDown}
        placeholder="rgba(r,g,b,a)"
      />
      <input type="color" value={colorToHex(value)} onChange={handleColorChange} title="Pick color" />
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  fmt,
  onChange,
  cn,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
  onChange: (v: number) => void;
  cn: Record<string, string>;
}) {
  return (
    <div className={cn.sliderRow}>
      <span className={cn.colorRowLabel}>{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
      <span className={cn.sliderVal}>{fmt(value)}</span>
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  cn,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  cn: Record<string, string>;
}) {
  return (
    <div className={cn.checkboxRow}>
      <label className={cn.checkboxLabel}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={label}
        />
        <span className={cn.colorRowLabel}>{label}</span>
      </label>
    </div>
  );
}

function MapInfoDisplay({
  map,
  cn,
}: {
  map: maplibregl.Map | null;
  cn: Record<string, string>;
}) {
  const [info, setInfo] = useState({ center: '—', zoom: '—', scale: '—' });

  useEffect(() => {
    if (!map) return;
    const update = () => {
      const c = map.getCenter();
      const z = map.getZoom();
      const mpp = metersPerPixel(c.lat, z);
      setInfo({
        center: `${c.lng.toFixed(4)}°E, ${c.lat.toFixed(4)}°N`,
        zoom: `Z${Math.round(z)}`,
        scale: formatScale(mpp),
      });
    };
    if (map.isStyleLoaded()) update();
    map.on('moveend', update);
    return () => {
      map.off('moveend', update);
    };
  }, [map]);

  return (
    <>
      <div className={cn.sectionLabel}>Map view (default Z3.7 center [119.74, 37.07])</div>
      <div className={cn.mapInfoRow}>
        <span className={cn.colorRowLabel}>Center</span>
        <span className={cn.mapInfoVal}>{info.center}</span>
      </div>
      <div className={cn.mapInfoRow}>
        <span className={cn.colorRowLabel}>Zoom</span>
        <span className={cn.mapInfoVal}>{info.zoom}</span>
      </div>
      <div className={cn.mapInfoRow}>
        <span className={cn.colorRowLabel}>Scale</span>
        <span className={cn.mapInfoVal}>{info.scale}</span>
      </div>
    </>
  );
}

function CodeOutputBlock({
  colors,
  styleState,
  toggles,
  zooms,
  map,
  initialView,
  group,
  mode,
  onModeChange,
  onCopy,
  colorSchemeLabel,
  themeVariant,
  extraSections,
  cn,
}: {
  colors: ColorState;
  styleState: StyleState;
  toggles: ToggleState;
  zooms: ZoomState;
  map: maplibregl.Map | null;
  initialView?: InitialViewState;
  group: 'appearance' | 'structure';
  mode: CodeOutputMode;
  onModeChange: (mode: CodeOutputMode) => void;
  onCopy: () => void;
  colorSchemeLabel?: string;
  themeVariant?: 'light' | 'dark';
  extraSections?: ExtraSection[];
  cn: Record<string, string>;
}) {
  const text =
    group === 'appearance'
      ? generateAppearanceOutput(colors, styleState, toggles, mode, colorSchemeLabel, themeVariant, extraSections)
      : generateStructureOutput(styleState, zooms, map, initialView, mode, extraSections);
  const label = group === 'appearance' ? 'Appearance (copy for prompt)' : 'View & Structure (copy for prompt)';
  return (
    <div className={cn.codeBlock}>
      <div className={cn.codeBlockHeader}>
        <span className={cn.codeBlockLabel}>{label}</span>
        <div className={cn.codeBlockTabs}>
          <button
            type="button"
            className={mode === 'component' ? cn.codeBlockTabActive : cn.codeBlockTab}
            onClick={() => onModeChange('component')}
          >
            Component level
          </button>
          <button
            type="button"
            className={mode === 'props' ? cn.codeBlockTabActive : cn.codeBlockTab}
            onClick={() => onModeChange('props')}
          >
            User props
          </button>
        </div>
        <button type="button" className={cn.copyBtn} onClick={onCopy}>
          Copy
        </button>
      </div>
      <div className={cn.codeBlockContent}>{text}</div>
    </div>
  );
}

// ---- Main component ----

interface PoiResult {
  name: string;
  address: string;
  location: unknown;
}

export function AmapStyleDebugPanel({
  map,
  amap,
  chinaMapStandard = true,
  defaultOpen = true,
  className,
  initialColors,
  initialStyles,
  initialToggles,
  initialZooms,
  initialView,
  colorSchemeLabel,
  themeVariant,
  extraSections,
  extraStructureSections,
}: AmapStyleDebugPanelProps) {
  const themeFromHook = useThemeVariant();
  const resolvedThemeVariant = themeVariant ?? themeFromHook;

  const [externalColorsVersion, setExternalColorsVersion] = useState<ColorState | undefined>(initialColors);
  const [colors, setColors] = useState<ColorState>(initialColors ?? DEFAULT_COLORS);
  const [stylesState, setStylesState] = useState<StyleState>(initialStyles ?? DEFAULT_STYLES);
  const [toggles, setToggles] = useState<ToggleState>(initialToggles ?? DEFAULT_TOGGLES);
  const [zooms, setZooms] = useState<ZoomState>(initialZooms ?? DEFAULT_ZOOMS);
  const [codeOutputMode, setCodeOutputMode] = useState<CodeOutputMode>('component');
  const [mapLang, setMapLang] = useState<'en' | 'zh'>('en');
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [trafficOn, setTrafficOn] = useState(false);
  const [satelliteOn, setSatelliteOn] = useState(false);
  const [activeAmapTheme, setActiveAmapTheme] = useState<string | null>(null);
  const [poiQuery, setPoiQuery] = useState('');
  const [poiResults, setPoiResults] = useState<PoiResult[]>([]);
  const trafficLayerRef = useRef<unknown>(null);
  const satelliteLayerRef = useRef<unknown>(null);
  const poiDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const poiMarkersRef = useRef<unknown[]>([]);
  const prevInitialColorsRef = useRef(initialColors);

  // Derived state: sync color pickers when initialColors prop changes (scheme / theme switch).
  // Calling setState during render is React's recommended pattern for derived state from props.
  if (initialColors !== undefined && initialColors !== externalColorsVersion) {
    setExternalColorsVersion(initialColors);
    setColors(initialColors);
  }

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000);
  }, []);

  useEffect(() => {
    if (amap) applyAmapStyle(amap, colors);
  }, [amap, colors]);

  useEffect(() => {
    if (initialColors && initialColors !== prevInitialColorsRef.current) {
      prevInitialColorsRef.current = initialColors;
      if (map?.isStyleLoaded()) {
        (Object.keys(initialColors) as ColorKey[]).forEach((key) => {
          applyColorToMap(key, initialColors[key], map, chinaMapStandard, stylesState);
        });
      }
      if (amap) applyAmapStyle(amap, initialColors);
    }
  }, [initialColors, map, chinaMapStandard, stylesState, amap]);

  const handleColorChange = useCallback(
    (key: ColorKey, color: string) => {
      const newColors = { ...colors, [key]: color };
      setColors(newColors);
      if (map) applyColorToMap(key, color, map, chinaMapStandard, stylesState);
      if (amap) applyAmapStyle(amap, newColors);
    },
    [map, amap, chinaMapStandard, stylesState, colors]
  );

  const handleStyleChange = useCallback(
    (key: StyleKey, value: string | number) => {
      setStylesState((prev) => ({ ...prev, [key]: value }));
      if (map) applyStyleToMap(key, value, map, chinaMapStandard);
    },
    [map, chinaMapStandard]
  );

  const handleZoomChange = useCallback(
    (key: ZoomKey, value: number) => {
      setZooms((prev) => ({ ...prev, [key]: value }));
      if (map) applyZoomToMap(key, value, map, chinaMapStandard);
    },
    [map, chinaMapStandard]
  );

  const handleToggleChange = useCallback(
    (key: ToggleKey, value: boolean) => {
      setToggles((prev) => ({ ...prev, [key]: value }));
      if (map) applyToggleToMap({ ...toggles, [key]: value }, map, chinaMapStandard);
    },
    [map, chinaMapStandard, toggles]
  );

  useEffect(() => {
    if (map) applyToggleToMap(toggles, map, chinaMapStandard);
  }, [map, toggles, chinaMapStandard]);

  const handleLangChange = useCallback(
    (lang: 'en' | 'zh') => {
      setMapLang(lang);
      if (map?.isStyleLoaded()) {
        const tf = getTextField(lang);
        map.setLayoutProperty('lbl-place', 'text-field', tf as string[]);
        map.setLayoutProperty('lbl-road', 'text-field', tf as string[]);
      }
    },
    [map]
  );

  const handleCopyAppearance = useCallback(() => {
    const text = generateAppearanceOutput(colors, stylesState, toggles, codeOutputMode, colorSchemeLabel, resolvedThemeVariant, extraSections);
    navigator.clipboard.writeText(text).then(() => showToast('Copied'));
  }, [colors, stylesState, toggles, codeOutputMode, colorSchemeLabel, resolvedThemeVariant, extraSections, showToast]);

  const handleCopyStructure = useCallback(() => {
    const text = generateStructureOutput(stylesState, zooms, map, initialView, codeOutputMode, extraStructureSections);
    navigator.clipboard.writeText(text).then(() => showToast('Copied'));
  }, [stylesState, zooms, map, initialView, codeOutputMode, extraStructureSections, showToast]);

  const handleAmapThemeSelect = useCallback(
    (themeName: string) => {
      if (!amap) return;
      const styleId = AMAP_THEMES[themeName];
      if (styleId) {
        (amap as { setMapStyle: (style: string) => void }).setMapStyle('amap://styles/' + styleId);
        setActiveAmapTheme(themeName);
      }
    },
    [amap]
  );

  const handleTrafficToggle = useCallback(() => {
    if (!amap) return;
    if (trafficOn) {
      const layer = trafficLayerRef.current as { setMap: (m: unknown) => void } | null;
      if (layer) layer.setMap(null);
      trafficLayerRef.current = null;
      setTrafficOn(false);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AMap = (window as any).AMap;
      const layer = new AMap.TileLayer.Traffic({ zIndex: 10 });
      (layer as { setMap: (m: unknown) => void }).setMap(amap);
      trafficLayerRef.current = layer;
      setTrafficOn(true);
    }
  }, [amap, trafficOn]);

  const handleSatelliteToggle = useCallback(() => {
    if (!amap) return;
    if (satelliteOn) {
      const layer = satelliteLayerRef.current as { setMap: (m: unknown) => void } | null;
      if (layer) layer.setMap(null);
      satelliteLayerRef.current = null;
      setSatelliteOn(false);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AMap = (window as any).AMap;
      const layer = new AMap.TileLayer.Satellite();
      (layer as { setMap: (m: unknown) => void }).setMap(amap);
      satelliteLayerRef.current = layer;
      setSatelliteOn(true);
    }
  }, [amap, satelliteOn]);

  const clearPoi = useCallback(() => {
    const markers = poiMarkersRef.current as Array<{ setMap: (m: unknown) => void }>;
    markers.forEach((m) => m.setMap(null));
    poiMarkersRef.current = [];
  }, []);

  const handlePoiSelect = useCallback(
    (poi: PoiResult) => {
      if (!amap) return;
      clearPoi();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AMap = (window as any).AMap;
      const m = new AMap.Marker({ position: poi.location, title: poi.name }) as { setMap: (map: unknown) => void };
      m.setMap(amap);
      poiMarkersRef.current.push(m);
      (amap as { setCenter: (loc: unknown) => void; setZoom: (z: number) => void }).setCenter(poi.location);
      (amap as { setZoom: (z: number) => void }).setZoom(15);
    },
    [amap, clearPoi]
  );

  const handlePoiSearch = useCallback(
    (query: string) => {
      setPoiQuery(query);
      if (!query.trim()) {
        setPoiResults([]);
        clearPoi();
        return;
      }
      if (poiDebounceRef.current) clearTimeout(poiDebounceRef.current);
      poiDebounceRef.current = setTimeout(() => {
        if (!amap) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AMap = (window as any).AMap;
        const PlaceSearch = AMap.PlaceSearch;
        const ps = new PlaceSearch({ pageSize: 6, city: '全国' });
        (ps as { search: (q: string, cb: (st: string, res: unknown) => void) => void }).search(query.trim(), (st, res) => {
          const r = res as { poiList?: { pois: Array<{ name: string; address?: string; cityname?: string; location: unknown }> } };
          if (st !== 'complete' || !r.poiList) {
            setPoiResults([]);
            return;
          }
          const pois = r.poiList.pois.map((p) => ({
            name: p.name,
            address: p.address ?? p.cityname ?? '',
            location: p.location,
          }));
          setPoiResults(pois);
        });
      }, 300);
    },
    [amap, clearPoi]
  );

  const componentClassName = [styles.panel, className].filter(Boolean).join(' ');

  return (
    <>
    <div className={componentClassName}>
      <div className={styles.panelHeader} onClick={() => setIsOpen((o) => !o)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setIsOpen((o) => !o)}>
        <h3>Element Style</h3>
        <svg className={`${styles.chevron} ${isOpen ? styles.chevronUp : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.panelBody}>

          {/* ── Group A: Appearance (color-scheme dependent) ── */}
          <div className={styles.sectionLabel}>Map language</div>
          <select
            className={styles.langSelect}
            value={mapLang}
            onChange={(e) => handleLangChange(e.target.value as 'en' | 'zh')}
            title="Map label language"
            style={{ flex: 1, minWidth: 80, marginBottom: 4 }}
          >
            <option value="en">English</option>
            <option value="zh">Chinese</option>
          </select>

          {amap ? (
            <>
              <div className={styles.sectionLabel}>AMap official themes</div>
              <div className={styles.presetGrid}>
                {Object.keys(AMAP_THEMES).map((themeName) => (
                  <button
                    key={themeName}
                    type="button"
                    className={[styles.presetBtn, activeAmapTheme === themeName ? styles.presetBtnActive : ''].filter(Boolean).join(' ')}
                    onClick={() => handleAmapThemeSelect(themeName)}
                  >
                    {themeName}
                  </button>
                ))}
              </div>
            </>
          ) : null}

          <div className={styles.sectionLabel}>By element type</div>
          {ELEMENTS.map((el) => (
            <ColorPickerRow
              key={el.key}
              label={el.name}
              value={colors[el.key]}
              onChange={(v) => handleColorChange(el.key, v)}
              cn={styles}
            />
          ))}

          <div className={styles.sectionLabel}>Style tuning</div>
          {STYLE_COLORS.map((sc) => (
            <ColorPickerRow
              key={sc.key}
              label={sc.name}
              value={stylesState[sc.key as keyof StyleState] as string}
              onChange={(v) => handleStyleChange(sc.key, v)}
              cn={styles}
            />
          ))}
          {APPEARANCE_SLIDERS.map((ss) => (
            <SliderRow
              key={ss.key}
              label={ss.name}
              value={stylesState[ss.key as keyof StyleState] as number}
              min={ss.min}
              max={ss.max}
              step={ss.step}
              fmt={ss.fmt}
              onChange={(v) => handleStyleChange(ss.key, v)}
              cn={styles}
            />
          ))}

          <div className={styles.sectionLabel}>Toggles</div>
          {STYLE_TOGGLES.map((t) => (
            <CheckboxRow
              key={t.key}
              label={t.name}
              checked={toggles[t.key]}
              onChange={(v) => handleToggleChange(t.key, v)}
              cn={styles}
            />
          ))}

          {/* ── Extra sections injected by consumer (e.g. overlay style controls) ── */}
          {extraSections?.map((section) => (
            <React.Fragment key={section.label}>
              <div className={styles.sectionLabel}>{section.label}</div>
              {section.content}
            </React.Fragment>
          ))}

          <CodeOutputBlock
            colors={colors}
            styleState={stylesState}
            toggles={toggles}
            zooms={zooms}
            map={map}
            initialView={initialView}
            group="appearance"
            mode={codeOutputMode}
            onModeChange={setCodeOutputMode}
            onCopy={handleCopyAppearance}
            colorSchemeLabel={colorSchemeLabel}
            themeVariant={resolvedThemeVariant}
            extraSections={extraSections}
            cn={styles}
          />

          {/* ── Group B: View & Structure (scheme-independent) ── */}
          <hr className={styles.groupDivider} />
          <div className={styles.groupLabel}>View &amp; Structure</div>

          <MapInfoDisplay map={map} cn={styles} />

          <div className={styles.sectionLabel}>Label sizes</div>
          {STRUCTURE_SLIDERS.map((ss) => (
            <SliderRow
              key={ss.key}
              label={ss.name}
              value={stylesState[ss.key as keyof StyleState] as number}
              min={ss.min}
              max={ss.max}
              step={ss.step}
              fmt={ss.fmt}
              onChange={(v) => handleStyleChange(ss.key, v)}
              cn={styles}
            />
          ))}

          <div className={styles.sectionLabel}>Zoom visibility</div>
          {ZOOM_CONTROLS.map((zc) => (
            <SliderRow
              key={zc.key}
              label={zc.name}
              value={zooms[zc.key]}
              min={0}
              max={18}
              step={1}
              fmt={(v) => `Z${Math.round(v)}`}
              onChange={(v) => handleZoomChange(zc.key, v)}
              cn={styles}
            />
          ))}

          {/* ── Extra sections injected by consumer into View & Structure ── */}
          {extraStructureSections?.map((section) => (
            <React.Fragment key={section.label}>
              <div className={styles.sectionLabel}>{section.label}</div>
              {section.content}
            </React.Fragment>
          ))}

          <CodeOutputBlock
            colors={colors}
            styleState={stylesState}
            toggles={toggles}
            zooms={zooms}
            map={map}
            initialView={initialView}
            group="structure"
            mode={codeOutputMode}
            onModeChange={setCodeOutputMode}
            onCopy={handleCopyStructure}
            colorSchemeLabel={colorSchemeLabel}
            themeVariant={resolvedThemeVariant}
            extraSections={extraStructureSections}
            cn={styles}
          />
        </div>
      )}

      {toastMsg && (
        <div className={`${styles.toast} ${styles.toastShow}`} role="status">
          {toastMsg}
        </div>
      )}
    </div>

    {amap ? (
      <div className={styles.featuresPanel}>
        <h4>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 5 4 4" />
            <path d="M13.5 6.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          AMap Key active
        </h4>
        <input
          type="text"
          className={styles.searchInput}
          value={poiQuery}
          onChange={(e) => handlePoiSearch(e.target.value)}
          placeholder="Search place (e.g. Forbidden City)"
          aria-label="Search place"
        />
        <div className={styles.searchResults}>
          {poiResults.map((p, i) => (
            <div key={i} className={styles.searchItem} onClick={() => handlePoiSelect(p)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handlePoiSelect(p)}>
              <div>{p.name}</div>
              <div className={styles.searchItemAddr}>{p.address}</div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className={[styles.featureBtn, trafficOn ? styles.featureBtnActive : ''].filter(Boolean).join(' ')}
          onClick={handleTrafficToggle}
        >
          Traffic
        </button>
        <button
          type="button"
          className={[styles.featureBtn, satelliteOn ? styles.featureBtnActive : ''].filter(Boolean).join(' ')}
          onClick={handleSatelliteToggle}
        >
          Satellite
        </button>
      </div>
    ) : null}
    </>
  );
}
