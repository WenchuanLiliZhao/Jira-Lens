/**
 * Map constants (non-style params).
 * Style/zoom/initial-view params live in mapParaConfig.ts.
 */

/** Whether to use China standard national boundary GeoJSON. */
export const CHINA_MAP_STANDARD = true;

/** AMap official theme names to style IDs. Used when amap instance is present. */
export const AMAP_THEMES: Record<string, string> = {
  Normal: 'normal',
  Dark: 'dark',
  Light: 'light',
  Whitesmoke: 'whitesmoke',
  Fresh: 'fresh',
  Grey: 'grey',
  Graffiti: 'graffiti',
  Macaron: 'macaron',
  Blue: 'blue',
};
