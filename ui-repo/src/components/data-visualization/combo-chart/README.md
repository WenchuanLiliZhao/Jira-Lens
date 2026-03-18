---
status:
  - done
  - known-bug
created: 2026-02-03
updated: 2026-02-03
category: data-visualization
complexity: B
aliases:
  - ComboChart
  - CombinationChart
  - DualAxisChart
dependencies:
  - _chart-shared
externalDependencies:
  - react
  - recharts
  - clsx
aiContext: |
  Use ComboChart for dual-axis visualizations combining column and line charts.
  Supports mixed visualization types (column + line) with independent Y-axes.
  Perfect for Pareto charts, sales vs growth comparisons, and multi-metric dashboards.
  Line series support three display modes: line, line-area, and area.
---

# ComboChart

A flexible dual-axis combination chart component for displaying mixed visualizations with independent Y-axes.

## Features

- **Dual Y-Axes**: Independent left and right Y-axes with custom domains and ticks
- **Mixed Visualizations**: Combine columns (bars) and lines in one chart
- **Line Display Modes**: Line, line-area, or area with gradient fills
- **Single or Dual Axis**: Both Y-axes are optional for flexible use cases
- **Legend**: Configurable position (top/bottom)
- **Responsive**: Automatically adapts to container size

## Usage

```tsx
import { ComboChart } from '@/components/data-visualization/combo-chart';

const data = [
  { label: 'Q1', sales: 100, growth: 10 },
  { label: 'Q2', sales: 150, growth: 25 },
  { label: 'Q3', sales: 120, growth: -10 },
];

const series = [
  { key: 'sales', type: 'column', title: 'Sales', yAxisId: 'left' },
  { key: 'growth', type: 'line', title: 'Growth %', yAxisId: 'right' },
];

<ComboChart
  data={data}
  series={series}
  leftYAxis={{ label: 'Sales ($)' }}
  rightYAxis={{ label: 'Growth (%)' }}
/>
```

## When to Use

✅ **DO use ComboChart when:**
- Comparing metrics with different scales (e.g., revenue vs percentage)
- Creating Pareto charts (bars + cumulative line)
- Showing volume metrics alongside rate/percentage metrics
- Displaying actual vs target with different visualization types
- Building multi-metric dashboards with mixed chart types

❌ **DON'T use ComboChart when:**
- You only need column charts → Use `ColumnChart` instead
- You only need line/area charts → Use `TrendChart` instead
- You need stacked columns → Use `ColumnChart` with `mode="stacked"`
- You need horizontal bars → Use `ColumnChart` with `orientation="horizontal"`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `ChartDataPoint[]` | required | Chart data array |
| `series` | `ComboSeriesConfig[]` | required | Series configuration |
| `leftYAxis` | `YAxisConfig` | - | Left Y-axis configuration (required for single-axis charts) |
| `rightYAxis` | `YAxisConfig` | - | Right Y-axis configuration (optional, for dual-axis only) |
| `showLegend` | `boolean` | `true` | Show/hide legend |
| `legendPosition` | `'top' \| 'bottom'` | `'bottom'` | Legend position |
| `showGrid` | `boolean` | `true` | Show/hide grid |
| `chartMargin` | `ChartMargin` | - | Outer spacing |
| `xAxisPadding` | `ChartPadding` | - | X-axis inner spacing |

## Series Configuration

### Column Series

```tsx
interface ComboColumnSeriesConfig {
  type: 'column';
  key: string;           // Data key
  title: string;         // Legend title
  yAxisId?: 'left' | 'right';  // Default: 'left' (use 'left' for single-axis charts)
  color?: string;        // Bar color
  barSize?: number;      // Bar width (pixels)
  radius?: number | [number, number, number, number];  // Border radius
  icon?: string;         // Material icon for legend
  unit?: string;         // Unit for tooltip
}
```

### Line Series

```tsx
interface ComboLineSeriesConfig {
  type: 'line';
  key: string;           // Data key
  title: string;         // Legend title
  yAxisId?: 'left' | 'right';  // Default: 'left' (use 'left' for single-axis charts)
  displayAs?: 'line' | 'line-area' | 'area';  // Default: 'line'
  color?: string;        // Line/stroke color
  strokeWidth?: number;  // Line width (pixels)
  strokeDasharray?: string;  // Dash pattern (e.g., "5 5")
  fillColor?: string;    // Area fill color (for line-area/area modes)
  fillOpacity?: number;  // Area fill opacity (0-1)
  icon?: string;         // Material icon for legend
  unit?: string;         // Unit for tooltip
}
```

## Line Display Modes

| Mode | Description | Visual |
|------|-------------|--------|
| `'line'` | Pure line chart with dots at data points | Line only |
| `'line-area'` | Line with filled gradient area underneath | Line + gradient fill |
| `'area'` | Filled area only (no stroke on top) | Gradient fill only |

## Y-Axis Configuration

```tsx
interface YAxisConfig {
  label?: string;                          // Axis label
  showLabel?: boolean;                     // Whether to show the axis label (default: true)
  format?: 'compact' | 'comma' | 'percent' | 'currency' | 'decimal';  // Preset number format
  decimalPrecision?: number;               // Decimal places for 'decimal' format (default: 2)
  domain?: [number, number] | [string, string];  // Min/max values
  ticks?: number[];                        // Custom tick values
  unit?: string;                           // Unit to display
  tickFormatter?: (value: number) => string;  // Custom formatter (takes precedence over format)
}
```

### ⚠️ Important: Single Y-Axis Must Be on the Left

**When using only one Y-axis, it MUST be configured as `leftYAxis`:**

```tsx
// ✅ CORRECT: Single axis on the left
<ComboChart
  data={data}
  series={[
    { key: 'revenue', type: 'column', title: 'Revenue', yAxisId: 'left' }
  ]}
  leftYAxis={{ label: 'Revenue ($)' }}
  // No rightYAxis
/>

// ❌ WRONG: Single axis on the right
<ComboChart
  data={data}
  series={[
    { key: 'revenue', type: 'column', title: 'Revenue', yAxisId: 'right' }
  ]}
  rightYAxis={{ label: 'Revenue ($)' }}  // WRONG position!
  // No leftYAxis
/>
```

**Why this matters:**
- Standard chart convention places the primary Y-axis on the left
- Right Y-axis is reserved for secondary metrics in dual-axis scenarios
- Ensures consistent user experience and data interpretation
- Series with `yAxisId: 'left'` or no yAxisId will use the left axis by default

### Number Format Options

The `format` prop provides preset formatting options for Y-axis tick labels:

| Format | Description | Example Input | Example Output |
|--------|-------------|---------------|----------------|
| `'compact'` | Large numbers with K/M/B suffixes | `1000`, `1500000` | `"1K"`, `"1.5M"` |
| `'comma'` | Comma-separated thousands | `1000`, `1234567` | `"1,000"`, `"1,234,567"` |
| `'percent'` | Percentage (assumes decimal input) | `0.5`, `0.125` | `"50%"`, `"12.5%"` |
| `'currency'` | Currency format (USD) | `1000`, `1234.56` | `"$1,000"`, `"$1,234"` |
| `'decimal'` | Fixed decimal precision | `1.2345` (precision=2) | `"1.23"` |

**Priority Order:**
1. `tickFormatter` (custom function) - highest priority
2. `format` (preset) - used if no custom formatter
3. Default Recharts formatting - fallback

### ⚠️ Critical: Percent Format Data Requirements

**When using `format: 'percent'`, your data MUST be in decimal form (0-1 range):**

```tsx
// ✅ CORRECT: Data in decimal form
const data = [
  { label: 'Q1', efficiency: 0.92 },  // Will display as "92%"
  { label: 'Q2', efficiency: 0.85 },  // Will display as "85%"
];

<ComboChart
  data={data}
  series={[{ key: 'efficiency', type: 'line', title: 'Efficiency' }]}
  leftYAxis={{ 
    format: 'percent',
    domain: [0, 1],              // Domain in decimal form
    ticks: [0, 0.25, 0.5, 0.75, 1.0]  // Ticks in decimal form
  }}
/>

// ❌ WRONG: Data as integers (0-100)
const wrongData = [
  { label: 'Q1', efficiency: 92 },   // Will display as "9200%"! 
  { label: 'Q2', efficiency: 85 },   // Will display as "8500%"!
];

<ComboChart
  data={wrongData}
  series={[{ key: 'efficiency', type: 'line', title: 'Efficiency' }]}
  leftYAxis={{ 
    format: 'percent',
    domain: [0, 100],  // WRONG: Domain doesn't match data format
  }}
/>
```

**Why this matters:**
- `format: 'percent'` multiplies values by 100 and adds the "%" symbol
- If your data is already 92 (meaning 92%), the formatter will output 9200%
- Always ensure data is in decimal form (0.92, not 92) when using percent format
- Domain and ticks must also be in decimal form to match the data

### ⚠️ Important: Always Specify Ticks with Fixed Domain

**When setting a fixed `domain`, you MUST also specify `ticks` to ensure grid lines align properly:**

```tsx
// ✅ CORRECT: domain + ticks together
<ComboChart
  data={data}
  series={series}
  leftYAxis={{ 
    label: 'Score', 
    domain: [0, 5], 
    ticks: [0, 1, 2, 3, 4, 5]  // Grid lines at these exact values
  }}
/>

// ❌ INCORRECT: domain without ticks
<ComboChart
  data={data}
  series={series}
  leftYAxis={{ 
    label: 'Score', 
    domain: [0, 5]  // Recharts may generate non-integer ticks like [0, 1.25, 2.5, 3.75, 5]
  }}
/>
```

**Why this matters:**
- Without explicit `ticks`, Recharts auto-generates values that may not align with your data
- This causes grid lines to appear misaligned (e.g., at 1.25, 2.5 instead of 1, 2, 3)
- Always pair `domain` with `ticks` for predictable, clean grid alignment

## Examples

### Pareto Chart (Dual Y-Axes)

```tsx
<ComboChart
  data={[
    { label: 'Defect A', count: 2800, cumulativePercent: 45 },
    { label: 'Defect B', count: 2400, cumulativePercent: 84 },
    { label: 'Defect C', count: 1800, cumulativePercent: 100 },
  ]}
  series={[
    { key: 'count', type: 'column', title: 'Count', yAxisId: 'left' },
    { key: 'cumulativePercent', type: 'line', title: 'Cumulative %', yAxisId: 'right' },
  ]}
  leftYAxis={{ label: 'Count' }}
  rightYAxis={{ label: 'Cumulative %', domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100] }}
/>
```

### Sales vs Growth Rate

```tsx
<ComboChart
  data={salesData}
  series={[
    { key: 'revenue', type: 'column', title: 'Revenue', yAxisId: 'left' },
    { key: 'growthRate', type: 'line', title: 'Growth Rate', yAxisId: 'right' },
  ]}
  leftYAxis={{ label: 'Revenue ($)' }}
  rightYAxis={{ label: 'Growth Rate (%)' }}
/>
```

### Single Axis with Mixed Visualizations

```tsx
// ✅ Single-axis chart: all series use left axis
<ComboChart
  data={performanceData}
  series={[
    {
      key: 'actual',
      type: 'line',
      displayAs: 'line-area',
      title: 'Actual',
      yAxisId: 'left',  // Explicitly set to left
    },
    {
      key: 'target',
      type: 'line',
      displayAs: 'line',
      title: 'Target',
      yAxisId: 'left',  // Must be left, not right
      strokeDasharray: '5 5',
    },
  ]}
  leftYAxis={{ label: 'Performance' }}
  // No rightYAxis - this is a single-axis chart
/>
```

### Multi-Metric Dashboard

```tsx
<ComboChart
  data={dashboardData}
  series={[
    { key: 'volume', type: 'column', title: 'Volume', yAxisId: 'left' },
    {
      key: 'trend',
      type: 'line',
      displayAs: 'area',
      title: 'Trend',
      yAxisId: 'left',
      fillOpacity: 0.3,
    },
    { key: 'efficiency', type: 'line', title: 'Efficiency %', yAxisId: 'right' },
  ]}
  leftYAxis={{ label: 'Volume' }}
  rightYAxis={{ label: 'Efficiency (%)', domain: [0, 100], ticks: [0, 25, 50, 75, 100] }}
/>
```

### Hide Y-Axis Labels

```tsx
<ComboChart
  data={data}
  series={series}
  leftYAxis={{ 
    label: 'Revenue ($)', 
    showLabel: false  // Hide left Y-axis label
  }}
  rightYAxis={{ 
    label: 'Growth (%)', 
    showLabel: false  // Hide right Y-axis label
  }}
/>
```

### Number Formatting Examples

#### Compact Format (K/M/B)
```tsx
<ComboChart
  data={salesData}
  series={[{ key: 'revenue', type: 'column', title: 'Revenue' }]}
  leftYAxis={{ 
    label: 'Revenue', 
    format: 'compact'  // 150000 → "150K"
  }}
/>
```

#### Comma Separator
```tsx
<ComboChart
  data={productionData}
  series={[{ key: 'units', type: 'column', title: 'Units' }]}
  leftYAxis={{ 
    label: 'Units Produced', 
    format: 'comma'  // 1000 → "1,000"
  }}
/>
```

#### Percentage
```tsx
<ComboChart
  data={efficiencyData}
  series={[{ key: 'rate', type: 'line', title: 'Efficiency' }]}
  leftYAxis={{ 
    label: 'Efficiency', 
    format: 'percent'  // 0.92 → "92%"
  }}
/>
```

#### Currency
```tsx
<ComboChart
  data={salesData}
  series={[{ key: 'revenue', type: 'column', title: 'Revenue' }]}
  leftYAxis={{ 
    label: 'Revenue', 
    format: 'currency'  // 1000 → "$1,000"
  }}
/>
```

#### Decimal Precision
```tsx
<ComboChart
  data={ratingData}
  series={[{ key: 'score', type: 'column', title: 'Score' }]}
  leftYAxis={{ 
    label: 'Score', 
    format: 'decimal',
    decimalPrecision: 1  // 4.567 → "4.6"
  }}
/>
```

## Component Comparison

| Feature | ColumnChart | TrendChart | **ComboChart** |
|---------|-------------|------------|----------------|
| Column/Bar | ✅ | ❌ | ✅ |
| Line | ❌ | ✅ | ✅ |
| Area Fill | ❌ | ✅ | ✅ |
| Dual Y-Axes | ❌ | ❌ | ✅ |
| Stacked Mode | ✅ | ❌ | ❌ |
| Horizontal | ✅ | ❌ | ❌ |
| Selection | ✅ | ✅ | ❌ |

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

## Accessibility

- Keyboard navigation support via Recharts
- ARIA labels for chart elements
- Color-blind friendly default color scheme
- Tooltip provides detailed information on hover
- Legend provides visual reference for all series

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns.

## Known Bugs

⚠️ **CartesianGrid Clipping Issue** - The following `GRID` constants from `_chart-shared/constants.ts` do NOT work correctly and should NOT be used:

- `showLeftBorder`, `showRightBorder`, `showTopBorder`, `showBottomBorder` - Cannot render borders
- `showVerticalGrid` - Renders borders instead of vertical grid lines

**AI Note**: Do NOT attempt to use these properties. Only `showHorizontalGrid` works correctly (via ReferenceLine workaround).

See: [`_chart-shared/known-bugs.md`](../_chart-shared/known-bugs.md) for details.