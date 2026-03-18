/**
 * Number Formatters for Chart Axis Labels
 *
 * Provides preset formatting options for Y-axis tick labels:
 * - compact: 1000 → "1K", 1000000 → "1M"
 * - comma: 1000 → "1,000"
 * - percent: 0.5 → "50%"
 * - currency: 1000 → "$1,000"
 * - decimal: 1.2345 → "1.23"
 */

/* -------------------------------------------------------------------------- */
/*                              Types                                         */
/* -------------------------------------------------------------------------- */

/**
 * Preset number format types for axis tick labels.
 */
export type AxisNumberFormat = 'compact' | 'comma' | 'percent' | 'currency' | 'decimal';

/* -------------------------------------------------------------------------- */
/*                           Format Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Format large numbers with K/M/B suffixes.
 * 
 * @example
 * formatCompact(1000) → "1K"
 * formatCompact(1500) → "1.5K"
 * formatCompact(1000000) → "1M"
 * formatCompact(2500000) → "2.5M"
 * formatCompact(1000000000) → "1B"
 */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1e9) {
    const formatted = (abs / 1e9).toFixed(1);
    // Remove trailing .0
    return sign + (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + 'B';
  }
  if (abs >= 1e6) {
    const formatted = (abs / 1e6).toFixed(1);
    return sign + (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + 'M';
  }
  if (abs >= 1e3) {
    const formatted = (abs / 1e3).toFixed(1);
    return sign + (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + 'K';
  }
  return value.toString();
}

/**
 * Format numbers with comma separators for thousands.
 * 
 * @example
 * formatComma(1000) → "1,000"
 * formatComma(1234567) → "1,234,567"
 * formatComma(123.45) → "123.45"
 */
export function formatComma(value: number): string {
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
}

/**
 * Format numbers as percentages.
 * Assumes value is already in decimal form (0.5 = 50%).
 * 
 * @example
 * formatPercent(0.5) → "50%"
 * formatPercent(1) → "100%"
 * formatPercent(0.125) → "12.5%"
 */
export function formatPercent(value: number): string {
  const percent = value * 100;
  // Remove trailing .0
  const formatted = percent.toFixed(1);
  return (formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted) + '%';
}

/**
 * Format numbers as currency (USD by default).
 * 
 * @example
 * formatCurrency(1000) → "$1,000"
 * formatCurrency(1234.56) → "$1,234.56"
 * formatCurrency(-500) → "-$500"
 */
export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return sign + '$' + formatted;
}

/**
 * Format numbers with fixed decimal precision.
 * 
 * @param value - The number to format
 * @param precision - Number of decimal places (default: 2)
 * 
 * @example
 * formatDecimal(1.2345) → "1.23"
 * formatDecimal(1.2345, 1) → "1.2"
 * formatDecimal(1, 2) → "1.00"
 */
export function formatDecimal(value: number, precision: number = 2): string {
  return value.toFixed(precision);
}

/* -------------------------------------------------------------------------- */
/*                           Helper Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Get formatter function by preset name.
 * 
 * @param format - The preset format name
 * @returns Formatter function for the specified format
 * 
 * @example
 * const formatter = getFormatterByName('compact');
 * formatter(1000) → "1K"
 */
export function getFormatterByName(format: AxisNumberFormat): (value: number) => string {
  switch (format) {
    case 'compact':
      return formatCompact;
    case 'comma':
      return formatComma;
    case 'percent':
      return formatPercent;
    case 'currency':
      return formatCurrency;
    case 'decimal':
      return formatDecimal;
    default:
      // TypeScript should prevent this, but fallback to comma format
      return formatComma;
  }
}
