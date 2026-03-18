---
status:
  - done
created: 2026-02-02
updated: 2026-02-02
category: layout
complexity: B
aliases:
  - BentoGrid
  - Bento Grid
  - Grid Layout
dependencies: []
externalDependencies:
  - react
  - class-variance-authority
  - clsx
  - "@radix-ui/react-slot"
aiContext: |
  BentoGrid is a 12-column grid layout component with container-based responsive behavior.
  Use BentoGrid.Item for grid items with responsive column/row spanning.
  Responds to container width (not viewport) using ResizeObserver.
  Supports polymorphic rendering via asChild prop.
---

# BentoGrid Component

A flexible 12-column grid system inspired by Bento Box layouts, featuring **container-based responsive behavior** (not viewport-based).

## Features

- **12-Column Grid System**: Full flexibility with 1-12 column spans
- **Row Spanning**: Support for 1-6 row spans
- **Container-Based Responsive**: Uses `ResizeObserver` to monitor container width
- **Per-Item Responsive**: Each item defines its own breakpoints
- **Compound Components**: `BentoGrid.Item` pattern for intuitive API
- **Polymorphic Rendering**: `asChild` prop for rendering as any element
- **Type-Safe**: Full TypeScript support with CVA-generated types

## Installation

```tsx
import { BentoGrid } from '@/components/layout/bento-grid';
```

## Basic Usage

```tsx
<BentoGrid gap="md">
  <BentoGrid.Item res={[{ cols: 4, rows: 1 }]}>
    <Card>Item A</Card>
  </BentoGrid.Item>
  <BentoGrid.Item res={[{ cols: 8, rows: 1 }]}>
    <Card>Item B</Card>
  </BentoGrid.Item>
</BentoGrid>
```

## Responsive Configuration

Each `BentoGrid.Item` accepts a `res` prop with an array of responsive configurations:

```tsx
<BentoGrid.Item res={[
  { maxWidth: 640, cols: 12, rows: 1 },  // 0-640px: full width
  { maxWidth: 1024, cols: 6, rows: 1 },  // 641-1024px: half width
  { cols: 4, rows: 1 }                   // 1025px+: default
]}>
  <Card>Responsive Item</Card>
</BentoGrid.Item>
```

**Config without `maxWidth`** = default breakpoint (largest/fallback)

## API Reference

### BentoGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gap` | `"none" \| "sm" \| "md" \| "lg"` | `"md"` | Gap size between items |
| `rowHeight` | `ResponsiveRowHeight[]` | `[{ height: 180 }]` | Responsive row height |
| `className` | `string` | - | Custom class name |

### BentoGrid.Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `res` | `ResponsiveConfig[]` | **Required** | Responsive configuration |
| `asChild` | `boolean` | `false` | Render child as root element |
| `className` | `string` | - | Custom class name |

### Type Definitions

```typescript
interface ResponsiveConfig {
  maxWidth?: number;  // Omit for default breakpoint
  cols: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  rows: 1 | 2 | 3 | 4 | 5 | 6;
}

interface ResponsiveRowHeight {
  maxWidth?: number;
  height: number;
}
```

## Examples

### Responsive Dashboard Layout

```tsx
<BentoGrid 
  gap="md" 
  rowHeight={[
    { maxWidth: 600, height: 100 },
    { height: 140 }
  ]}
>
  {/* Stats row - 4 items */}
  {[1, 2, 3, 4].map((i) => (
    <BentoGrid.Item 
      key={i} 
      res={[
        { maxWidth: 600, cols: 6, rows: 1 },
        { cols: 3, rows: 1 }
      ]}
    >
      <StatCard value={`$${i}00K`} />
    </BentoGrid.Item>
  ))}
  
  {/* Main chart - spans 8 cols on desktop */}
  <BentoGrid.Item res={[
    { maxWidth: 600, cols: 12, rows: 2 },
    { cols: 8, rows: 2 }
  ]}>
    <ChartArea />
  </BentoGrid.Item>
  
  {/* Side cards */}
  <BentoGrid.Item res={[
    { maxWidth: 600, cols: 12, rows: 1 },
    { cols: 4, rows: 2 }
  ]}>
    <SidePanel />
  </BentoGrid.Item>
</BentoGrid>
```

### Full-Width Header

```tsx
<BentoGrid gap="md">
  <BentoGrid.Item res={[{ cols: 'full', rows: 1 }]}>
    <Header>Full Width</Header>
  </BentoGrid.Item>
  {/* ... other items */}
</BentoGrid>
```

### Polymorphic Rendering

```tsx
{/* Render as link */}
<BentoGrid.Item res={[{ cols: 4, rows: 1 }]} asChild>
  <a href="/feature">
    <Card>Click me!</Card>
  </a>
</BentoGrid.Item>

{/* Render as button */}
<BentoGrid.Item res={[{ cols: 4, rows: 1 }]} asChild>
  <button onClick={handleClick}>
    <Card>Interactive</Card>
  </button>
</BentoGrid.Item>
```

## Why Container-Based Responsive?

Unlike `@media` queries that respond to **viewport** width, BentoGrid uses `ResizeObserver` to monitor the **container's** width. This enables:

- **Sidebar-Friendly**: Works correctly inside sidebars or constrained layouts
- **Component-Level Responsive**: Each grid responds to its own container
- **Predictable**: Behavior is consistent regardless of viewport size
- **Embeddable**: Can be placed in any container and respond appropriately

## Architecture

```
the-component/
├── context.ts          # BentoGridContext (container width)
├── types.ts            # All type definitions
├── style.ts            # CVA variants
├── styles.module.scss  # CSS Grid styles
├── BentoGrid.tsx       # Container (ResizeObserver + Provider)
├── BentoGridItem.tsx   # Item (responsive span calculation)
└── index.tsx           # Compound Components export
```

## Advanced: Access Container Width

For custom components that need the container width:

```tsx
import { useBentoGridContext } from '@/components/layout/bento-grid';

const CustomComponent = () => {
  const { containerWidth } = useBentoGridContext();
  return <div>Container is {containerWidth}px wide</div>;
};
```
