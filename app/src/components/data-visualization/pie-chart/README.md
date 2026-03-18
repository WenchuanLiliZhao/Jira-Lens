---
status:
  - done
created: 2026-02-02
updated: 2026-02-02
category: data-visualization
complexity: B
aliases:
  - PieChart
  - DonutChart
dependencies: []
externalDependencies:
  - react
  - recharts
  - clsx
aiContext: |
  Use PieChart for displaying proportional data as a donut/pie chart.
  Supports size presets (sm/md/lg), legend positioning, tooltips, and custom labels.
  Data items can include icons (as ReactNode) for enhanced legend display.
---

# PieChart Component

## Quick Summary

A customizable donut/pie chart component built on Recharts. Displays proportional data with configurable legend positioning, interactive tooltips, hover labels, and icon support in legends.

**AI Hint**: When user needs to show percentage breakdown or category proportions, use PieChart. For time-series data, use LineChart instead.

---

## When to Use

**DO use PieChart when:**
- Displaying proportional data (percentages, market share, category breakdown)
- Showing part-to-whole relationships with 2-8 categories
- Needing interactive hover tooltips and labels
- Legend needs icons to enhance category recognition

**DON'T use PieChart when:**
- More than 8 categories (use bar chart or data table instead)
- Showing trends over time (use line/area chart)
- Comparing absolute values between categories (use bar chart)
- Values don't sum to a meaningful whole

---

## Visual Variants

### Size
- **`sm`**: 80px diameter - For compact spaces, dashboards
- **`md`**: 120px diameter (default) - Standard use case
- **`lg`**: 160px diameter - When chart is the primary focus
- **number**: Custom pixel value for precise control

### Legend Position
- **`bottom`**: Legend below chart (default) - For narrow containers
- **`right`**: Legend beside chart - For wide containers
- **`none`**: No legend - When labels or external legend suffice

### Label Display
- **`hover`**: Labels appear on slice hover (default) - Clean look with interactivity
- **`always`**: Labels always visible - For static displays
- **`none`**: No labels - Rely on legend/tooltip only

---

## Props API

### Data Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `PieChartDataItem[]` | required | Array of data items for the chart |

### Size Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| number` | `'md'` | Chart diameter |
| `ringWidth` | `number` | `24` | Donut ring thickness in pixels |
| `spacing` | `number` | `24` | Gap between chart and legend |

### Legend Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `legendPosition` | `'bottom' \| 'right' \| 'none'` | `'bottom'` | Legend placement |
| `legendWidth` | `number` | `200` | Legend container width (for right position) |
| `showLegendValue` | `boolean` | `false` | Show values in legend |
| `showLegendUnit` | `boolean` | `false` | Show units in legend |

### Label Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `labelDisplay` | `'always' \| 'hover' \| 'none'` | `'hover'` | When to show labels |
| `showLabelUnit` | `boolean` | `true` | Show units in labels |

### Tooltip Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showTooltip` | `boolean` | `true` | Enable tooltip on hover |
| `tooltipFormatter` | `(item) => ReactNode` | - | Custom tooltip content |

### Interaction Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSliceClick` | `(item) => void` | - | Callback when slice is clicked |
| `onSliceHover` | `(item \| null) => void` | - | Callback when slice is hovered |

### Style Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colorScheme` | `string[]` | rainbow colors | Default colors from global color system |
| `className` | `string` | - | Additional CSS class |

**Note**: Default colors use CSS variables from `global-styles/color.scss`, supporting both light and dark modes automatically.

---

## Data Item Structure

```typescript
interface PieChartDataItem {
  id: string;           // Unique identifier
  name: string;         // Display name
  value: number;        // Numeric value (determines slice size)
  color: string;        // Slice color
  unit?: string;        // Optional unit (e.g., '%', 'pax')
  legendValue?: number; // Optional different value for legend
  legendUnit?: string;  // Optional different unit for legend
  icon?: ReactNode;     // Optional icon for legend
}
```

---

## Quick Start

### Basic Usage

```tsx
import { PieChart, CHART_COLORS } from '@/components';

// Using global chart colors (recommended)
const data = [
  { id: '1', name: 'Train', value: 45, color: CHART_COLORS.blue, unit: '%' },
  { id: '2', name: 'Bus', value: 30, color: CHART_COLORS.green, unit: '%' },
  { id: '3', name: 'Car', value: 25, color: CHART_COLORS.orange, unit: '%' },
];

<PieChart data={data} />
```

**Available CHART_COLORS**: `blue`, `green`, `orange`, `red`, `purple`, `pink`, `yellow`

These colors are CSS variables from `global-styles/color.scss` and automatically adapt to light/dark mode.

### With Icons and Legend Values

```tsx
import { PieChart, CHART_COLORS, Icon } from '@/components';

const data = [
  { 
    id: '1', 
    name: 'Train', 
    value: 45, 
    color: CHART_COLORS.blue,
    unit: '%',
    legendValue: 1234,
    legendUnit: ' pax',
    icon: <Icon icon="train" />
  },
  // ...
];

<PieChart 
  data={data}
  showLegendValue
  showLegendUnit
  legendPosition="right"
/>
```

### Custom Tooltip

```tsx
<PieChart 
  data={data}
  tooltipFormatter={(item) => (
    <div>
      <strong>{item.name}</strong>
      <p>{item.value}% ({item.legendValue} passengers)</p>
    </div>
  )}
/>
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

**[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Accessibility

- **Keyboard navigation**: Tooltip can be triggered via keyboard focus
- **Color contrast**: Default colors meet WCAG AA standards
- **Screen reader**: Chart includes descriptive ARIA labels
- **Reduced motion**: Animations are disabled by default

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns.
