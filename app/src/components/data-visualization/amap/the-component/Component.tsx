/**
 * AmapMap Component - MapLibre GL JS map wrapper
 *
 * Disabled interactions (no pitch or rotation):
 * - MapLibre: maxPitch=0, dragRotate=false, touchPitch=false; disables right-click drag rotate, two-finger rotate, two-finger pitch
 * - AMap: viewMode='2D', pitchEnable=false, rotateEnable=false
 */

import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import { buildStyle } from '../lib/mapStyle';
import {
  applyColorsToMap,
  applyStylesToMap,
  applyTogglesToMap,
  applyZoomsToMap,
} from '../lib/mapApply';
import {
  DEFAULT_COLORS,
  DEFAULT_INITIAL_VIEW,
  DEFAULT_STYLES,
  DEFAULT_TOGGLES,
  DEFAULT_ZOOMS,
} from '../lib/mapParaConfig';
import type { StyleState, ToggleState, ZoomState } from '../lib/mapParaConfig';
import { AmapStyleDebugPanel } from '../debug-panel';
import type { AmapMapProps } from './types';
import styles from './styles.module.scss';

function addChinaBoundaryLayers(
  map: maplibregl.Map,
  s: StyleState,
  z: ZoomState,
  t: ToggleState,
  backgroundColor: string,
  boundaryColor: string
): void {
  // Hide original nat-boundary layers so only China standard boundaries are shown
  ['nat-boundary-case', 'nat-boundary'].forEach((id) => {
    if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', 'none');
  });

  map.addSource('cn-nat-src', {
    type: 'geojson',
    data: '/china-boundary.json',
  });
  const w = s.natBoundaryW;
  const caseVisible = t.natBoundaryCasing ? 'visible' : 'none';
  map.addLayer(
    {
      id: 'cn-nat-case',
      type: 'line',
      source: 'cn-nat-src',
      minzoom: z.natBoundaryCaseMin,
      layout: { 'line-cap': 'round', 'line-join': 'round', visibility: caseVisible },
      paint: {
        'line-color': backgroundColor,
        'line-width': ['interpolate', ['linear'], ['zoom'], 2, w + 1, 6, w + 2, 12, w + 3],
        'line-opacity': 0.5,
      },
    },
    'lbl-place'
  );
  map.addLayer(
    {
      id: 'cn-nat',
      type: 'line',
      source: 'cn-nat-src',
      minzoom: z.natBoundaryMin,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': boundaryColor,
        'line-width': ['interpolate', ['linear'], ['zoom'], 2, w * 0.6, 6, w, 12, w * 1.4],
      },
    },
    'lbl-place'
  );
}

function loadAmapScript(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export const AmapMap = React.forwardRef<HTMLDivElement, AmapMapProps>(
  (
    {
      initialColors = DEFAULT_COLORS,
      initialStyles = DEFAULT_STYLES,
      initialZooms = DEFAULT_ZOOMS,
      initialToggles = DEFAULT_TOGGLES,
      initialView = DEFAULT_INITIAL_VIEW,
      chinaMapStandard = true,
      amapKey,
      onAmapLoad,
      onAmapError,
      onLoad,
      onMoveEnd,
      showDebugPanel = false,
      debugPanelDefaultOpen = true,
      colorSchemeLabel,
      themeVariant,
      extraDebugSections,
      extraStructureDebugSections,
      className,
      style,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const amapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const amapInstanceRef = useRef<unknown>(null);
    const [amapLoaded, setAmapLoaded] = useState(false);
    const [internalMap, setInternalMap] = useState<maplibregl.Map | null>(null);
    const [internalAmap, setInternalAmap] = useState<unknown>(null);
    const onLoadRef = useRef(onLoad);
    const onMoveEndRef = useRef(onMoveEnd);
    const onAmapLoadRef = useRef(onAmapLoad);
    const onAmapErrorRef = useRef(onAmapError);

    useEffect(() => {
      onLoadRef.current = onLoad;
    }, [onLoad]);

    useEffect(() => {
      onMoveEndRef.current = onMoveEnd;
    }, [onMoveEnd]);

    useEffect(() => {
      onAmapLoadRef.current = onAmapLoad;
    }, [onAmapLoad]);

    useEffect(() => {
      onAmapErrorRef.current = onAmapError;
    }, [onAmapError]);

    useEffect(() => {
      if (!amapKey) {
        const prev = amapInstanceRef.current;
        if (prev && typeof (prev as { destroy?: () => void }).destroy === 'function') {
          (prev as { destroy: () => void }).destroy();
        }
        amapInstanceRef.current = null;
        onAmapLoadRef.current?.(null as unknown);
        queueMicrotask(() => {
          setAmapLoaded(false);
          setInternalAmap(null);
        });
        return;
      }
      const prev = amapInstanceRef.current;
      if (prev && typeof (prev as { destroy?: () => void }).destroy === 'function') {
        (prev as { destroy: () => void }).destroy();
      }
      amapInstanceRef.current = null;

      loadAmapScript(amapKey)
        .then(
          () =>
            new Promise<void>((resolve) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any).AMap.plugin(['AMap.PlaceSearch', 'AMap.Scale', 'AMap.ToolBar'], resolve);
            })
        )
        .then(() => {
          const container = amapContainerRef.current;
          if (!container) return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const AMap = (window as any).AMap;
          const inst = new AMap.Map(container, {
            zoom: 12,
            center: [116.4074, 39.9042],
            // Disable pitch and rotation: 2D mode, no tilt or rotate
            viewMode: '2D',
            pitchEnable: false,
            rotateEnable: false,
          });
          inst.addControl(new AMap.Scale());
          inst.addControl(new AMap.ToolBar({ position: 'RB' }));
          amapInstanceRef.current = inst;
          setAmapLoaded(true);
          setInternalAmap(inst);
          onAmapLoadRef.current?.(inst);
        })
        .catch((err) => {
          onAmapErrorRef.current?.(err);
        });
    }, [amapKey]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const styleSpec = buildStyle(initialColors, initialStyles, initialZooms, 'en');
      const map = new maplibregl.Map({
        container,
        style: styleSpec as maplibregl.StyleSpecification,
        center: initialView.center,
        zoom: initialView.zoom,
        localIdeographFontFamily: "'PingFang SC','Noto Sans CJK SC','Microsoft YaHei',sans-serif",
        attributionControl: false,
        // Disable pitch and rotation: maxPitch=0 locks pitch, dragRotate/touchPitch=false disable drag/touch rotate and pitch
        maxPitch: 0,
        dragRotate: false,
        touchPitch: false,
      });

      // Explicitly disable: right-click drag rotate, two-finger rotate, two-finger pitch
      map.dragRotate.disable();
      map.touchZoomRotate.disableRotation();
      map.touchPitch.disable();

      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

      map.on('load', () => {
        if (chinaMapStandard) {
          addChinaBoundaryLayers(
            map,
            initialStyles,
            initialZooms,
            initialToggles,
            initialColors.background,
            initialColors.boundary
          );
        }
        setInternalMap(map);
        onLoadRef.current?.(map);
      });

      map.on('moveend', () => {
        onMoveEndRef.current?.(map);
      });

      mapRef.current = map;

      return () => {
        map.remove();
        mapRef.current = null;
        setInternalMap(null);
      };
      // Map creation only when chinaMapStandard changes; initialColors/styles/zooms/toggles/view
      // are applied reactively by the effect below to avoid unnecessary map recreation.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chinaMapStandard]);

    // Reactively apply colors/styles/zooms/toggles when they change (e.g. scheme switch).
    // Avoids map recreation and visible refresh.
    useEffect(() => {
      const map = internalMap;
      if (!map?.isStyleLoaded()) return;
      applyColorsToMap(initialColors, map, chinaMapStandard, initialStyles);
      applyStylesToMap(initialStyles, map, chinaMapStandard);
      applyZoomsToMap(initialZooms, map, chinaMapStandard);
      applyTogglesToMap(initialToggles, map, chinaMapStandard);
    }, [
      internalMap,
      initialColors,
      initialStyles,
      initialZooms,
      initialToggles,
      chinaMapStandard,
    ]);

    const componentClassName = [styles.mapWrapper, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={componentClassName} style={style}>
        <div
          ref={containerRef}
          style={{ position: 'absolute', inset: 0, display: amapLoaded ? 'none' : 'block' }}
        />
        <div
          ref={amapContainerRef}
          style={{ position: 'absolute', inset: 0, display: amapLoaded ? 'block' : 'none' }}
        />
        {showDebugPanel && (
          <AmapStyleDebugPanel
            map={internalMap}
            amap={internalAmap}
            chinaMapStandard={chinaMapStandard}
            defaultOpen={debugPanelDefaultOpen}
            initialColors={initialColors}
            initialStyles={initialStyles}
            initialToggles={initialToggles}
            initialZooms={initialZooms}
            initialView={initialView}
            colorSchemeLabel={colorSchemeLabel}
            themeVariant={themeVariant}
            extraSections={extraDebugSections}
            extraStructureSections={extraStructureDebugSections}
          />
        )}
      </div>
    );
  }
);

AmapMap.displayName = 'AmapMap';
