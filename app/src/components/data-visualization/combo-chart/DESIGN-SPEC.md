# ComboChart Design Specifications

> ⚠️ **AI Warning**: This component has known bugs with grid/border controls. See the [Grid section](#grid) before implementing grid-related features.

## Overview

Design specifications for the ComboChart component - a dual-axis combination chart supporting mixed column and line visualizations.

## Layout & Structure

### Chart Composition

```
┌───────────────────────────────────────────────────┐
│ [Legend - Top] (optional)                         │
├───────────────────────────────────────────────────┤
│ ┌─────┬───────────────────────────────────┬─────┐ │
│ │Left │                                   │Right│ │
│ │Y-   │     Chart Area                    │Y-   │ │
│ │Axis │     (Columns + Lines)             │Axis │ │
│ │     │                                   │     │ │
│ └─────┴───────────────────────────────────┴─────┘ │
│              X-Axis Labels                        │
├───────────────────────────────────────────────────┤
│ [Legend - Bottom] (optional)                      │
└───────────────────────────────────────────────────┘
```

### Spacing

- **Chart Margin**: 
  - Top: 20px
  - Right: 20px
  - Bottom: 20px
  - Left: 20px
- **Y-Axis Width**: 60px (each side)
- **Grid Top Offset**: 10px
- **Legend Spacing**: 16px from chart

## Colors

### Default Color Scheme

Uses shared chart color scheme from `_chart-shared`:
- Series 1: `var(--chart-rainbow-blue-100)`
- Series 2: `var(--chart-rainbow-green-100)`
- Series 3: `var(--chart-rainbow-purple-100)`
- Series 4: `var(--chart-rainbow-orange-100)`
- Series 5: `var(--chart-rainbow-red-100)`
- Additional series cycle through the scheme

### Chart Elements

- **Grid Lines**: `var(--chart-black-alpha-15-hex)` or `#E5E7EB`
- **Axis Lines**: `var(--chart-black-alpha-15-hex)` or `#D1D5DB`
- **Axis Labels**: `var(--chart-black-alpha-80-hex)` or `#374151`
- **Tooltip Background**: `var(--chart-black-alpha-0-hex)` with shadow
- **Empty State Text**: `var(--chart-black-alpha-40)`

### Area Fill Gradients

For `line-area` and `area` display modes:
- **Gradient Direction**: Top to bottom (vertical)
- **Start**: Series color at 100% opacity
- **End**: Series color at 0% opacity
- **Default Fill Opacity**: 0.2 (customizable per series)

## Typography

### Axis Labels

- **Font Family**: `var(--font-family-sans)`
- **Font Size**: 12px
- **Font Weight**: 400
- **Color**: `var(--chart-black-alpha-80-hex)`

### Axis Titles

- **Font Size**: 12px
- **Font Weight**: 500
- **Color**: `var(--chart-black-alpha-80-hex)`
- **Rotation**: -90° (left), 90° (right)

### Legend

- **Font Size**: 14px
- **Font Weight**: 400
- **Color**: `var(--chart-black-alpha-80-hex)`

## Column (Bar) Styling

### Default Configuration

- **Bar Size**: 16px (width)
- **Bar Gap**: 4px (between bars in same category)
- **Bar Category Gap**: 20% (between categories)
- **Border Radius**: `[4, 4, 0, 0]` (top-left, top-right, bottom-right, bottom-left)

### States

- **Default**: Full color opacity
- **Hover**: Slightly brighter (handled by Recharts)
- **Active**: Full color with cursor feedback

## Line Styling

### Default Configuration

- **Stroke Width**: 2px
- **Line Type**: Monotone curve
- **Dot Radius**: 4px
- **Dot Fill**: White (`#FFFFFF`)
- **Dot Stroke Width**: 2px
- **Active Dot Radius**: 6px

### Display Modes

1. **Line Mode** (`displayAs: 'line'`)
   - Stroke: Series color
   - Fill: None
   - Dots: Visible

2. **Line-Area Mode** (`displayAs: 'line-area'`)
   - Stroke: Series color
   - Fill: Gradient (series color)
   - Fill Opacity: 0.2 (default)
   - Dots: Visible

3. **Area Mode** (`displayAs: 'area'`)
   - Stroke: None
   - Fill: Gradient (series color)
   - Fill Opacity: 0.2 (default)
   - Dots: Visible

### Dashed Lines

- **Pattern**: Customizable via `strokeDasharray`
- **Common Patterns**:
  - `"5 5"`: Dashed line
  - `"2 2"`: Dotted line
  - `"10 5"`: Long dashes

## Y-Axes Styling

### Positioning

- **Left Y-Axis**: 
  - Orientation: `left`
  - Label Position: `insideLeft`
  - Label Angle: -90°
- **Right Y-Axis**: 
  - Orientation: `right`
  - Label Position: `insideRight`
  - Label Angle: 90°

### Axis Lines

- **Stroke**: `var(--chart-black-alpha-15-hex)`
- **Stroke Width**: 1px

### Tick Lines

- **Stroke**: `var(--chart-black-alpha-15-hex)`
- **Length**: 6px

### Domain Configuration

- **Auto**: `['auto', 'auto']` (default)
- **Custom**: `[min, max]` (e.g., `[0, 100]`)
- **Padding**: 10% (Recharts default)

### ⚠️ Important: Domain + Ticks Best Practice

**When setting a fixed `domain`, always specify `ticks` to ensure grid lines align properly:**

```typescript
// ✅ CORRECT: domain + ticks together
leftYAxis={{ 
  domain: [0, 100], 
  ticks: [0, 25, 50, 75, 100]  // Grid lines at these exact values
}}

// ❌ INCORRECT: domain only
leftYAxis={{ 
  domain: [0, 100]  // Recharts may generate ticks like [0, 16.7, 33.3, 50, 66.7, 83.3, 100]
}}
```

**Why this matters:**
- Without explicit `ticks`, Recharts auto-generates tick values using d3-scale's "nice" algorithm
- Auto-generated ticks may not align with your data values (e.g., 1.25, 2.5, 3.75 instead of 1, 2, 3, 4, 5)
- This causes grid lines to appear "misaligned" with data points
- Explicitly setting `ticks` ensures grid lines appear at expected, human-readable values

### ⚠️ Critical: Percent Format Data Requirements

**When using `format: 'percent'`, data MUST be in decimal form (0-1 range):**

```typescript
// ✅ CORRECT: Decimal data (0-1)
data: [{ efficiency: 0.92 }]  // Displays as "92%"
leftYAxis={{ 
  format: 'percent',
  domain: [0, 1],
  ticks: [0, 0.25, 0.5, 0.75, 1.0]
}}

// ❌ WRONG: Integer data (0-100)
data: [{ efficiency: 92 }]  // Displays as "9200%"!
leftYAxis={{ 
  format: 'percent',
  domain: [0, 100]  // Mismatched format
}}
```

**Format behavior:**
- `format: 'percent'` multiplies values by 100 and appends "%"
- Data value 0.92 → displayed as "92%"
- Data value 92 → displayed as "9200%" (incorrect!)
- Always ensure data, domain, and ticks are in decimal form when using percent format

## Grid

- **Horizontal Lines**: Visible (default)
- **Vertical Lines**: Hidden by default
- **Stroke**: `var(--use-border-prime-trans)`
- **Stroke Dasharray**: None (solid lines)

### ⚠️ Known Bug - Grid Controls Broken

The following `GRID` constants from `_chart-shared/constants.ts` are **broken** due to Recharts CartesianGrid clipping issues:

| Property | Status | Issue |
|----------|--------|-------|
| `showHorizontalGrid` | ✅ Works | Uses ReferenceLine workaround |
| `showVerticalGrid` | ❌ Broken | Renders borders instead of grid lines |
| `showLeftBorder` | ❌ Broken | Cannot render |
| `showRightBorder` | ❌ Broken | Cannot render |
| `showTopBorder` | ❌ Broken | Cannot render |
| `showBottomBorder` | ❌ Broken | Cannot render |

**AI Implementation Note**: Do NOT use the broken properties. Only rely on `showHorizontalGrid` for grid control.

## Tooltip

### Styling

- **Background**: `var(--chart-black-alpha-0-hex)` or `#FFFFFF`
- **Border**: 1px solid `var(--chart-black-alpha-15-hex)`
- **Border Radius**: 4px
- **Padding**: 8px 12px
- **Shadow**: `0 2px 8px rgba(0, 0, 0, 0.1)`

### Content

- **Label**: Bold, 14px
- **Series Name**: Regular, 13px
- **Value**: Bold, 13px
- **Unit**: Regular, 13px (if provided)

## Responsive Behavior

### Container Sizing

- **Min Width**: 300px (recommended)
- **Min Height**: 200px (recommended)
- **Responsive**: Uses `ResponsiveContainer` from Recharts

### Narrow Containers (< 500px)

- Y-axis labels may overlap - consider shorter labels
- Legend may wrap to multiple lines
- Bar width automatically adjusts

### Wide Containers (> 1200px)

- Maintain consistent bar widths
- Increase spacing between categories if needed

## States

### Empty State

- **Message**: "No data available" or "No series configured"
- **Font Size**: 14px
- **Color**: `var(--chart-black-alpha-40)`
- **Alignment**: Center (both horizontal and vertical)

### Loading State

Not implemented in base component - handle at application level.

## Accessibility

### Color Contrast

- All text meets WCAG AA standards (4.5:1 for normal text)
- Default color scheme is color-blind friendly

### Interactive Elements

- Tooltip appears on hover
- Cursor changes to pointer on hover over data points
- Focus indicators provided by Recharts

### ARIA Labels

- Chart container has implicit role
- Tooltip provides detailed information
- Legend provides visual reference

## Animation

- **Initial Render**: Recharts default animation (300ms)
- **Data Updates**: Smooth transitions
- **Hover**: Immediate feedback

## Best Practices

1. **Single Y-Axis Must Be Left**: When using only one Y-axis, it MUST be the left axis. Right axis is reserved for secondary metrics in dual-axis scenarios.
2. **Y-Axis Scales**: Use left axis for absolute values (counts, amounts), right axis for percentages or rates
3. **Color Coordination**: Use contrasting colors for left vs right axis series
4. **Label Clarity**: Keep Y-axis labels short and descriptive
5. **Data Density**: Limit to 10-15 data points for optimal readability
6. **Series Count**: Maximum 5-6 series for clarity
7. **Mixed Types**: Use columns for volume metrics, lines for trends/percentages
8. **Domain + Ticks**: When setting fixed `domain`, always specify `ticks` array to ensure grid alignment (see Domain Configuration section above)
9. **Percent Format Data**: When using `format: 'percent'`, ensure data is in decimal form (0-1 range), not integer percentage (0-100)