import type {
  ColorState,
  StyleState,
  ToggleState,
} from '../../../lib/mapParaConfig';
import {
  DEFAULT_STYLES,
  DEFAULT_TOGGLES,
} from '../../../lib/mapParaConfig';

/** Default: minimal light gray. Light = appearance config; dark = darker variant. */
const COLOR_SCHEME_DEFAULT = {
  light: {
    background: 'rgba(255, 255, 255, 1)',
    water: 'rgba(240, 240, 240, 1)',
    green: 'rgba(240, 240, 240, 1)',
    building: 'rgba(245, 245, 245, 1)',
    road: 'rgba(255, 255, 255, 1)',
    highway: 'rgba(242, 242, 242, 1)',
    rail: 'rgba(232, 232, 232, 1)',
    boundary: 'rgba(199, 199, 199, 1)',
    label: 'rgba(189, 189, 189, 1)',
  } as ColorState,
  dark: {
    background: 'rgba(45, 42, 38, 1)',
    water: 'rgba(55, 75, 95, 1)',
    green: 'rgba(50, 70, 55, 1)',
    building: 'rgba(65, 62, 58, 1)',
    road: 'rgba(70, 68, 65, 1)',
    highway: 'rgba(180, 150, 80, 1)',
    rail: 'rgba(100, 100, 105, 1)',
    boundary: 'rgba(110, 108, 105, 1)',
    label: 'rgba(230, 228, 225, 1)',
  } as ColorState,
};

/** Dark map style. Light = dark map on light UI; dark = darker map on dark UI. */
const COLOR_SCHEME_DARK = {
  light: {
    background: 'rgba(34, 34, 38, 1)',
    water: 'rgba(45, 55, 72, 1)',
    green: 'rgba(40, 55, 45, 1)',
    building: 'rgba(55, 55, 60, 1)',
    road: 'rgba(60, 60, 65, 1)',
    highway: 'rgba(100, 130, 180, 1)',
    rail: 'rgba(90, 90, 95, 1)',
    boundary: 'rgba(100, 100, 110, 1)',
    label: 'rgba(220, 220, 225, 1)',
  } as ColorState,
  dark: {
    background: 'rgba(24, 24, 28, 1)',
    water: 'rgba(35, 45, 58, 1)',
    green: 'rgba(30, 45, 35, 1)',
    building: 'rgba(45, 45, 50, 1)',
    road: 'rgba(50, 50, 55, 1)',
    highway: 'rgba(90, 120, 165, 1)',
    rail: 'rgba(75, 75, 80, 1)',
    boundary: 'rgba(85, 85, 95, 1)',
    label: 'rgba(235, 235, 240, 1)',
  } as ColorState,
};

/** Fresh: light blue/green. Light = current; dark = dark variant. */
const COLOR_SCHEME_FRESH = {
  light: {
    background: 'rgba(245, 248, 250, 1)',
    water: 'rgba(170, 210, 255, 1)',
    green: 'rgba(180, 220, 185, 1)',
    building: 'rgba(235, 232, 228, 1)',
    road: 'rgba(255, 255, 255, 1)',
    highway: 'rgba(80, 140, 220, 1)',
    rail: 'rgba(140, 140, 145, 1)',
    boundary: 'rgba(140, 150, 160, 1)',
    label: 'rgba(45, 55, 65, 1)',
  } as ColorState,
  dark: {
    background: 'rgba(30, 38, 48, 1)',
    water: 'rgba(40, 65, 95, 1)',
    green: 'rgba(35, 55, 45, 1)',
    building: 'rgba(50, 55, 60, 1)',
    road: 'rgba(55, 60, 65, 1)',
    highway: 'rgba(70, 120, 200, 1)',
    rail: 'rgba(90, 95, 100, 1)',
    boundary: 'rgba(95, 105, 115, 1)',
    label: 'rgba(220, 228, 235, 1)',
  } as ColorState,
};

export const COLOR_SCHEMES = {
  Default: COLOR_SCHEME_DEFAULT,
  Dark: COLOR_SCHEME_DARK,
  Fresh: COLOR_SCHEME_FRESH,
} as const;

export type ColorSchemeKey = keyof typeof COLOR_SCHEMES;
export type ThemeVariant = 'light' | 'dark';

/** Appearance styles per scheme/theme. Merged with DEFAULT_STYLES for full StyleState. */
export const APPEARANCE_STYLES: Partial<
  Record<ColorSchemeKey, Partial<Record<ThemeVariant, Partial<StyleState>>>>
> = {
  Default: {
    light: {
      hwCasing: 'rgba(203, 195, 174, 0)',
      roadCasing: 'rgba(230, 230, 230, 1)',
      boundaryW: 0.7,
      natBoundaryW: 0.7,
      buildingOp: 75,
    },
    dark: {
      hwCasing: 'rgba(204, 154, 34, 0)',
      roadCasing: 'rgba(230, 230, 230, 0)',
      boundaryW: 0.7,
      natBoundaryW: 0.7,
      buildingOp: 75,
    },
  },
};

/** Toggles per scheme/theme. Falls back to DEFAULT_TOGGLES when not defined. */
export const SCHEME_TOGGLES: Partial<
  Record<ColorSchemeKey, Partial<Record<ThemeVariant, ToggleState>>>
> = {
  Default: {
    light: { natBoundaryCasing: false },
    dark: { natBoundaryCasing: false },
  },
};

/** Full StyleState for a scheme/theme: appearance overrides + structure defaults. */
export function getSchemeStyles(
  scheme: ColorSchemeKey,
  theme: ThemeVariant
): StyleState {
  const appearance = APPEARANCE_STYLES[scheme]?.[theme];
  return { ...DEFAULT_STYLES, ...appearance };
}

/** ToggleState for a scheme/theme. */
export function getSchemeToggles(
  scheme: ColorSchemeKey,
  theme: ThemeVariant
): ToggleState {
  return SCHEME_TOGGLES[scheme]?.[theme] ?? DEFAULT_TOGGLES;
}
