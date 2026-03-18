/**
 * Map scale and coordinate calculations.
 * Extracted from amap.html - pure TypeScript, no external dependencies.
 *
 * Web Mercator: equator resolution 156543 m/px, scales with cos(lat) and 2^zoom.
 */

/**
 * Meters per pixel at given latitude and zoom level.
 */
export function metersPerPixel(lat: number, zoom: number): number {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom);
}

/**
 * Format scale for human-readable display.
 * 1:N for macro views, m/cm/mm for street-level.
 */
export function formatScale(mpp: number): string {
  if (mpp >= 1000) return `1:${(mpp * 3779.5).toFixed(0)}`;
  if (mpp >= 1) return `1 px ≈ ${mpp.toFixed(1)} m`;
  if (mpp >= 0.01) return `1 px ≈ ${(mpp * 100).toFixed(1)} cm`;
  return `1 px ≈ ${(mpp * 1000).toFixed(0)} mm`;
}
