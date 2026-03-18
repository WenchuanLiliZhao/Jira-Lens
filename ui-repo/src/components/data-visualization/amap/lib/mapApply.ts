/**
 * MapLibre paint/layout apply utilities.
 * Apply ColorState, StyleState, ZoomState, ToggleState to an existing map
 * without recreating it. Used by AmapMap (reactive scheme switch) and debug-panel.
 */

import type maplibregl from 'maplibre-gl';
import type {
  ColorKey,
  ColorState,
  StyleKey,
  StyleState,
  ToggleState,
  ZoomKey,
  ZoomState,
} from './mapParaConfig';
import { ZOOM_CONTROLS } from './mapParaConfig';

function applyColorToMap(
  key: ColorKey,
  color: string,
  map: maplibregl.Map,
  chinaMapStandard: boolean,
  s: StyleState
): void {
  if (!map.isStyleLoaded()) return;
  const ops: Record<ColorKey, () => void> = {
    background() {
      map.setPaintProperty('bg', 'background-color', color);
      map.setPaintProperty('lbl-place', 'text-halo-color', color);
      const caseIds = chinaMapStandard ? ['nat-boundary-case', 'cn-nat-case'] : ['nat-boundary-case'];
      caseIds.forEach((id) => {
        if (map.getLayer(id)) map.setPaintProperty(id, 'line-color', color);
      });
    },
    water() {
      map.setPaintProperty('water-fill', 'fill-color', color);
      map.setPaintProperty('waterway', 'line-color', color);
    },
    green() {
      map.setPaintProperty('green-cover', 'fill-color', color);
      map.setPaintProperty('green-park', 'fill-color', color);
    },
    building() {
      map.setPaintProperty('building', 'fill-color', color);
    },
    road() {
      map.setPaintProperty('road-fill', 'line-color', color);
      map.setPaintProperty('road-case', 'line-color', s.roadCasing);
      map.setPaintProperty('lbl-road', 'text-halo-color', color);
    },
    highway() {
      map.setPaintProperty('hw-fill', 'line-color', color);
      map.setPaintProperty('hw-case', 'line-color', s.hwCasing);
    },
    rail() {
      map.setPaintProperty('rail', 'line-color', color);
    },
    boundary() {
      map.setPaintProperty('boundary-sub', 'line-color', color);
      const natIds = chinaMapStandard ? ['nat-boundary', 'cn-nat'] : ['nat-boundary'];
      natIds.forEach((id) => {
        if (map.getLayer(id)) map.setPaintProperty(id, 'line-color', color);
      });
    },
    label() {
      map.setPaintProperty('lbl-place', 'text-color', color);
      map.setPaintProperty('lbl-road', 'text-color', color);
    },
  };
  if (ops[key]) ops[key]();
}

function applyStyleToMap(
  key: StyleKey,
  value: string | number,
  map: maplibregl.Map,
  chinaMapStandard: boolean
): void {
  if (!map.isStyleLoaded()) return;
  const ops: Record<string, () => void> = {
    hwCasing() {
      map.setPaintProperty('hw-case', 'line-color', value as string);
    },
    roadCasing() {
      map.setPaintProperty('road-case', 'line-color', value as string);
    },
    boundaryW() {
      const w = value as number;
      map.setPaintProperty('boundary-sub', 'line-width', [
        'interpolate',
        ['linear'],
        ['zoom'],
        2,
        0.5,
        6,
        w * 0.7,
        12,
        w,
      ]);
    },
    natBoundaryW() {
      const w = value as number;
      const natIds = chinaMapStandard ? ['nat-boundary', 'cn-nat'] : ['nat-boundary'];
      const caseIds = chinaMapStandard ? ['nat-boundary-case', 'cn-nat-case'] : ['nat-boundary-case'];
      const natExpr = ['interpolate', ['linear'], ['zoom'], 2, w * 0.6, 6, w, 12, w * 1.4];
      const caseExpr = ['interpolate', ['linear'], ['zoom'], 2, w + 1, 6, w + 2, 12, w + 3];
      natIds.forEach((id) => {
        if (map.getLayer(id)) map.setPaintProperty(id, 'line-width', natExpr);
      });
      caseIds.forEach((id) => {
        if (map.getLayer(id)) map.setPaintProperty(id, 'line-width', caseExpr);
      });
    },
    buildingOp() {
      map.setPaintProperty('building', 'fill-opacity', (value as number) / 100);
    },
    labelScale() {
      const f = (value as number) / 100;
      map.setLayoutProperty(
        'lbl-place',
        'text-size',
        ['match', ['get', 'class'], 'city', 16 * f, 'town', 13 * f, 11 * f]
      );
    },
    roadLabelScale() {
      const f = (value as number) / 100;
      map.setLayoutProperty('lbl-road', 'text-size', 10 * f);
    },
  };
  if (ops[key]) ops[key]();
}

function applyZoomToMap(
  key: ZoomKey,
  zVal: number,
  map: maplibregl.Map,
  chinaMapStandard: boolean
): void {
  if (!map.isStyleLoaded()) return;
  const item = ZOOM_CONTROLS.find((z) => z.key === key);
  if (!item) return;
  item.layers.forEach((id) => {
    const ids =
      chinaMapStandard && (id === 'nat-boundary' || id === 'nat-boundary-case')
        ? [id, id === 'nat-boundary' ? 'cn-nat' : 'cn-nat-case']
        : [id];
    ids.forEach((rid) => {
      if (map.getLayer(rid)) map.setLayerZoomRange(rid, zVal, 24);
    });
  });
}

function applyToggleToMap(
  toggles: ToggleState,
  map: maplibregl.Map,
  chinaMapStandard: boolean
): void {
  if (!map.isStyleLoaded()) return;
  const visible = toggles.natBoundaryCasing ? 'visible' : 'none';
  const caseIds = chinaMapStandard ? ['cn-nat-case'] : ['nat-boundary-case'];
  caseIds.forEach((id) => {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', visible);
  });
}

/** Apply all colors to map. */
export function applyColorsToMap(
  colors: ColorState,
  map: maplibregl.Map,
  chinaMapStandard: boolean,
  styles: StyleState
): void {
  (Object.keys(colors) as ColorKey[]).forEach((key) => {
    applyColorToMap(key, colors[key], map, chinaMapStandard, styles);
  });
}

/** Apply all styles to map. */
export function applyStylesToMap(
  styles: StyleState,
  map: maplibregl.Map,
  chinaMapStandard: boolean
): void {
  (Object.keys(styles) as StyleKey[]).forEach((key) => {
    applyStyleToMap(key, styles[key as keyof StyleState], map, chinaMapStandard);
  });
}

/** Apply all zoom levels to map. */
export function applyZoomsToMap(
  zooms: ZoomState,
  map: maplibregl.Map,
  chinaMapStandard: boolean
): void {
  (Object.keys(zooms) as ZoomKey[]).forEach((key) => {
    applyZoomToMap(key, zooms[key], map, chinaMapStandard);
  });
}

/** Apply toggles to map. */
export function applyTogglesToMap(
  toggles: ToggleState,
  map: maplibregl.Map,
  chinaMapStandard: boolean
): void {
  applyToggleToMap(toggles, map, chinaMapStandard);
}

/** Single-key apply for debug-panel interactive controls. */
export { applyColorToMap, applyStyleToMap, applyZoomToMap, applyToggleToMap };
