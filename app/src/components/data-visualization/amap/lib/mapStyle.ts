/**
 * MapLibre style building utilities.
 * Extracted from amap.html - pure TypeScript, no React/DOM dependencies.
 */

import type { ColorState, StyleState, ZoomState } from './mapParaConfig';

/**
 * MapLibre text-field expression for label layers.
 * coalesce provides fallback: zh mode prefers name:zh → name:latin → name;
 * en mode prefers name:en → name:latin → name → name:zh.
 */
export function getTextField(lang: 'en' | 'zh'): unknown[] {
  if (lang === 'zh') {
    return ['coalesce', ['get', 'name:zh'], ['get', 'name:latin'], ['get', 'name']];
  }
  return ['coalesce', ['get', 'name:en'], ['get', 'name:latin'], ['get', 'name'], ['get', 'name:zh']];
}

/**
 * Build complete MapLibre style JSON (version 8).
 * Layer order: background → vegetation → water → building → boundaries → roads → highway → rail
 * → national borders → labels.
 */
export function buildStyle(
  c: ColorState,
  s: StyleState,
  z: ZoomState,
  mapLang: 'en' | 'zh'
): object {
  const tf = getTextField(mapLang);
  return {
    version: 8,
    sources: {
      om: {
        type: 'vector',
        url: 'https://tiles.openfreemap.org/planet',
      },
    },
    sprite: 'https://tiles.openfreemap.org/sprites/ofm_f384/ofm',
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': c.background } },

      {
        id: 'green-cover',
        type: 'fill',
        source: 'om',
        'source-layer': 'landcover',
        filter: ['in', 'class', 'grass', 'wood', 'forest'],
        paint: { 'fill-color': c.green, 'fill-opacity': 0.45 },
      },

      {
        id: 'green-park',
        type: 'fill',
        source: 'om',
        'source-layer': 'landuse',
        filter: ['in', 'class', 'park', 'cemetery', 'grass'],
        paint: { 'fill-color': c.green, 'fill-opacity': 0.55 },
      },

      {
        id: 'water-fill',
        type: 'fill',
        source: 'om',
        'source-layer': 'water',
        paint: { 'fill-color': c.water },
      },

      {
        id: 'waterway',
        type: 'line',
        source: 'om',
        'source-layer': 'waterway',
        minzoom: z.waterwayMin,
        paint: {
          'line-color': c.water,
          'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 14, 3],
        },
      },

      {
        id: 'building',
        type: 'fill',
        source: 'om',
        'source-layer': 'building',
        minzoom: z.buildingMin,
        paint: { 'fill-color': c.building, 'fill-opacity': s.buildingOp / 100 },
      },

      {
        id: 'boundary-sub',
        type: 'line',
        source: 'om',
        'source-layer': 'boundary',
        minzoom: z.boundarySubMin,
        filter: ['>', 'admin_level', 2],
        paint: {
          'line-color': c.boundary,
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, 0.5, 6, s.boundaryW * 0.7, 12, s.boundaryW],
          'line-dasharray': [4, 2],
          'line-opacity': 0.7,
        },
      },

      {
        id: 'road-case',
        type: 'line',
        source: 'om',
        'source-layer': 'transportation',
        minzoom: z.roadMin,
        filter: ['all', ['!in', 'class', 'motorway', 'motorway_link', 'rail', 'path', 'ferry']],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': s.roadCasing,
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0, 13, 3, 18, 14],
          'line-opacity': 0.35,
        },
      },

      {
        id: 'road-fill',
        type: 'line',
        source: 'om',
        'source-layer': 'transportation',
        minzoom: z.roadMin,
        filter: ['all', ['!in', 'class', 'motorway', 'motorway_link', 'rail', 'path', 'ferry']],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': c.road,
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0, 13, 2, 18, 12],
        },
      },

      {
        id: 'hw-case',
        type: 'line',
        source: 'om',
        'source-layer': 'transportation',
        minzoom: z.hwMin,
        filter: ['in', 'class', 'motorway', 'motorway_link', 'trunk'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': s.hwCasing,
          'line-width': ['interpolate', ['linear'], ['zoom'], 6, 0, 8, 1.5, 18, 18],
        },
      },

      {
        id: 'hw-fill',
        type: 'line',
        source: 'om',
        'source-layer': 'transportation',
        minzoom: z.hwMin,
        filter: ['in', 'class', 'motorway', 'motorway_link', 'trunk'],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': c.highway,
          'line-width': ['interpolate', ['linear'], ['zoom'], 6, 0, 8, 1, 18, 15],
        },
      },

      {
        id: 'rail',
        type: 'line',
        source: 'om',
        'source-layer': 'transportation',
        minzoom: z.railMin,
        filter: ['==', 'class', 'rail'],
        paint: { 'line-color': c.rail, 'line-width': 1.2, 'line-dasharray': [5, 3] },
      },

      {
        id: 'nat-boundary-case',
        type: 'line',
        source: 'om',
        'source-layer': 'boundary',
        minzoom: z.natBoundaryCaseMin,
        filter: ['==', 'admin_level', 2],
        layout: { 'line-cap': 'butt', 'line-join': 'round' },
        paint: {
          'line-color': c.background,
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, s.natBoundaryW + 1, 6, s.natBoundaryW + 2, 12, s.natBoundaryW + 3],
          'line-opacity': 0.5,
        },
      },

      {
        id: 'nat-boundary',
        type: 'line',
        source: 'om',
        'source-layer': 'boundary',
        minzoom: z.natBoundaryMin,
        filter: ['==', 'admin_level', 2],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': c.boundary,
          'line-width': ['interpolate', ['linear'], ['zoom'], 2, s.natBoundaryW * 0.6, 6, s.natBoundaryW, 12, s.natBoundaryW * 1.4],
        },
      },

      {
        id: 'lbl-place',
        type: 'symbol',
        source: 'om',
        'source-layer': 'place',
        minzoom: z.placeMin,
        filter: ['in', 'class', 'city', 'town', 'village'],
        layout: {
          'text-field': tf,
          'text-font': ['Noto Sans Regular'],
          'text-size': [
            'match',
            ['get', 'class'],
            'city',
            16 * s.labelScale / 100,
            'town',
            13 * s.labelScale / 100,
            11 * s.labelScale / 100,
          ],
          'text-max-width': 8,
          'text-anchor': 'center',
        },
        paint: {
          'text-color': c.label,
          'text-halo-color': c.background,
          'text-halo-width': 1.5,
        },
      },

      {
        id: 'lbl-road',
        type: 'symbol',
        source: 'om',
        'source-layer': 'transportation_name',
        minzoom: z.roadLblMin,
        layout: {
          'text-field': tf,
          'text-font': ['Noto Sans Regular'],
          'text-size': 10 * s.roadLabelScale / 100,
          'symbol-placement': 'line',
          'text-max-angle': 30,
          'text-rotation-alignment': 'map',
        },
        paint: {
          'text-color': c.label,
          'text-halo-color': c.road,
          'text-halo-width': 1,
        },
      },
    ],
  };
}
