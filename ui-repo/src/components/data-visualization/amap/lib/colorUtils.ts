/**
 * Color utility functions for map styling.
 * Extracted from amap.html - pure TypeScript, no React/DOM dependencies.
 */

export function hexToRgb(h: string): [number, number, number] {
  const v = parseInt(h.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/** Derive darker stroke color from main color by reducing channel values */
export function darken(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(Math.max(0, r - amt), Math.max(0, g - amt), Math.max(0, b - amt));
}

export function hexToRgba(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, 1)`;
}

export function colorToRgba(color: string): string {
  if (typeof color !== 'string') return color;
  if (color.startsWith('rgba(')) return color;
  if (color.startsWith('#')) return hexToRgba(color);
  return color;
}

export function colorToHex(color: string): string {
  if (typeof color !== 'string') return color;
  if (color.startsWith('#')) return color;
  const m = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return rgbToHex(+m[1], +m[2], +m[3]);
  return color;
}

/**
 * Validate user input, supports #rrggbb, #rgb, rgba(), rgb().
 * Alpha clamped to [0,1]. Returns null for invalid input.
 */
export function parseColorToRgba(str: string): string | null {
  if (!str || typeof str !== 'string') return null;
  const s = str.trim();
  if (/^#[0-9a-fA-F]{3}$/.test(s) || /^#[0-9a-fA-F]{6}$/.test(s)) return hexToRgba(s);
  const m = s.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/);
  if (m)
    return `rgba(${+m[1]}, ${+m[2]}, ${+m[3]}, ${m[4] !== undefined ? Math.max(0, Math.min(1, +m[4])) : 1})`;
  return null;
}
