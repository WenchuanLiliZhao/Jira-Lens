# DataTable Design Specification

This document defines the visual design system for the DataTable component.

---

## Design Tokens

### Colors

```scss
// Surface colors
--color-surface: #ffffff;
--color-header-bg: #f5f5f5;
--color-group-bg: #fafafa;

// Border colors
--color-border: #e0e0e0;
--color-border-light: #f0f0f0;

// Text colors
--color-text: #000000;
--color-text-secondary: #666666;
--color-text-tertiary: #999999;

// Icon colors
--color-icon: #757575;
--color-primary: #1976d2; // For active sort icons

// Interactive states
--color-hover: rgba(0, 0, 0, 0.04);
--color-active: rgba(0, 0, 0, 0.08);
--color-stripe: rgba(0, 0, 0, 0.02);

// Header states
--color-header-hover: #e8e8e8;
--color-header-active: #d8d8d8;

// Group header states
--color-group-hover: #f0f0f0;
--color-group-active: #e8e8e8;
```

### Spacing

**Cell Padding (by size):**
```scss
// Small
--cell-padding-small: 8px 12px;

// Medium (default)
--cell-padding-medium: 12px 16px;

// Large
--cell-padding-large: 16px 20px;
```

**Group Header Padding:**
```scss
// Small
--group-padding-small: 8px 12px;

// Medium
--group-padding-medium: 10px 16px;

// Large
--group-padding-large: 12px 20px;
```

**Content Gaps:**
```scss
--header-content-gap: 8px;  // Between icon, label, sort icon
--group-content-gap: 8px;   // Between expand icon, label icon, label
```

### Typography

**Font Sizes (by size variant):**
```scss
// Small
--font-size-small: 0.875rem;      // 14px
--header-font-size-small: 0.75rem; // 12px

// Medium (default)
--font-size-medium: 1rem;         // 16px
--header-font-size-medium: 1rem;  // 16px

// Large
--font-size-large: 1.125rem;      // 18px
--header-font-size-large: 1rem;   // 16px
```

**Font Weights:**
```scss
--header-font-weight: 600;
--group-header-font-weight: 600;
--cell-font-weight: 400;
```

### Borders

```scss
// Header border
--header-border-bottom: 2px solid var(--color-border);

// Cell borders
--cell-border: 1px solid var(--color-border);
--cell-border-light: 1px solid var(--color-border-light);

// Group header border
--group-border: 1px solid var(--color-border);
```

### Z-Index

```scss
--sticky-header-z-index: 10;
```

### Icons

**Icon Sizes:**
```scss
--header-icon-size: 1.2em;
--sort-icon-size: 1.1em;
--group-icon-size: 1.2em;
--empty-icon-size: 3em;
```

---

## Component Anatomy

```
┌─────────────────────────────────────────────────────┐
│ DataTable Container                                  │
│ ┌─────────────────────────────────────────────────┐ │
│ │ <table>                                          │ │
│ │ ┌─────────────────────────────────────────────┐ │ │
│ │ │ <thead>                                      │ │ │
│ │ │ ┌─────────────────────────────────────────┐ │ │ │
│ │ │ │ Header Row                               │ │ │ │
│ │ │ │ [Icon] Label [Sort Icon]                 │ │ │ │
│ │ │ └─────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────┘ │ │
│ │ ┌─────────────────────────────────────────────┐ │ │
│ │ │ <tbody>                                      │ │ │
│ │ │ ┌─────────────────────────────────────────┐ │ │ │
│ │ │ │ Group Header (if grouped)                │ │ │ │
│ │ │ │ [Expand] [Icon] Label (count)            │ │ │ │
│ │ │ └─────────────────────────────────────────┘ │ │ │
│ │ │ ┌─────────────────────────────────────────┐ │ │ │
│ │ │ │ Data Row                                 │ │ │ │
│ │ │ │ Cell | Cell | Cell                       │ │ │ │
│ │ │ └─────────────────────────────────────────┘ │ │ │
│ │ │ ┌─────────────────────────────────────────┐ │ │ │
│ │ │ │ Data Row                                 │ │ │ │
│ │ │ │ Cell | Cell | Cell                       │ │ │ │
│ │ │ └─────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## States

### Header Cell States

**Default:**
- Background: `var(--color-header-bg)`
- Text: `var(--color-text-secondary)`
- Border: `2px solid var(--color-border)`

**Hover (sortable):**
- Background: `var(--color-header-hover)`
- Cursor: `pointer`

**Active (clicked):**
- Background: `var(--color-header-active)`

**Sorted:**
- Sort icon changes to `arrow_upward` or `arrow_downward`
- Sort icon color: `var(--color-primary)` on hover

### Data Row States

**Default:**
- Background: `transparent`
- Border: `1px solid var(--color-border-light)`

**Hover (hoverable):**
- Background: `var(--color-hover)`

**Active (clickable, clicked):**
- Background: `var(--color-active)`

**Striped (even rows):**
- Background: `var(--color-stripe)`

### Group Header States

**Default:**
- Background: `var(--color-group-bg)`
- Cursor: `pointer`

**Hover:**
- Background: `var(--color-group-hover)`

**Active (clicked):**
- Background: `var(--color-group-active)`

**Expanded:**
- Icon: `expand_more`

**Collapsed:**
- Icon: `chevron_right`

---

## Behavior

### Sorting

1. **Initial State**: Sort icon shows `unfold_more` (unsorted indicator)
2. **First Click**: Sort ascending, icon changes to `arrow_upward`
3. **Second Click**: Sort descending, icon changes to `arrow_downward`
4. **Third Click**: Remove sort, icon returns to `unfold_more`

### Grouping

1. **Group Header Click**: Toggle expand/collapse
2. **Animation**: Icon rotates (optional enhancement)
3. **Rows**: Show/hide based on group expansion state

### Sticky Header

**Two Modes:**

**Viewport Sticky** (no `maxHeight`):
1. Header sticks to **window top** when page scrolls
2. Container has no `overflow` (to avoid creating scroll context)
3. Best for tables as part of page content

**Container Sticky** (with `maxHeight`):
1. Header sticks to **container top** when table scrolls
2. Container has `overflow-y: auto` and `overflow-x: auto`
3. Best for fixed-height table widgets

**Shared Behavior:**
1. **Position**: `position: sticky; top: 0;`
2. **Z-Index**: `10` to stay above table content
3. **Background**: Maintains solid background color
4. **Border**: Bottom border for visual separation

---

## Responsive Design

### Breakpoints

**Mobile (< 768px):**
- Reduce font size to `0.875rem`
- Reduce cell padding to `8px 12px`
- Reduce header content gap to `4px`
- Consider horizontal scroll for wide tables

**Tablet (768px - 1024px):**
- Default sizes apply

**Desktop (> 1024px):**
- Default sizes apply
- Tables can expand to full width

### Mobile Considerations

- **Horizontal Scroll**: Wrap table in scrollable container
- **Minimum Column Width**: Prevent columns from becoming too narrow
- **Touch Targets**: Ensure clickable areas are at least 44x44px
- **Sticky Header**: More valuable on mobile for long tables

---

## Accessibility

### Color Contrast

All text must meet WCAG AA standards:
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text**: 3:1 minimum contrast ratio

Current colors:
- Text on white background: `#000000` on `#ffffff` = 21:1 ✓
- Secondary text: `#666666` on `#ffffff` = 5.74:1 ✓
- Tertiary text: `#999999` on `#ffffff` = 2.85:1 ⚠️ (use for non-critical info only)

### Focus Indicators

- **Visible Focus**: 2px outline with adequate contrast
- **Focus Order**: Logical tab order (left to right, top to bottom)
- **Skip Links**: Consider for long tables

### Semantic HTML

- Proper use of `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>`
- `<th>` with `scope="col"` for column headers
- Caption for table description (if needed)

---

## Dark Mode Support

For dark mode implementation, override these CSS variables:

```scss
[data-theme="dark"] {
  // Surface colors
  --color-surface: #1e1e1e;
  --color-header-bg: #2a2a2a;
  --color-group-bg: #252525;

  // Border colors
  --color-border: #404040;
  --color-border-light: #333333;

  // Text colors
  --color-text: #ffffff;
  --color-text-secondary: #b0b0b0;
  --color-text-tertiary: #808080;

  // Icon colors
  --color-icon: #a0a0a0;
  --color-primary: #64b5f6; // Lighter blue for dark mode

  // Interactive states
  --color-hover: rgba(255, 255, 255, 0.08);
  --color-active: rgba(255, 255, 255, 0.12);
  --color-stripe: rgba(255, 255, 255, 0.04);

  // Header states
  --color-header-hover: #333333;
  --color-header-active: #3a3a3a;

  // Group header states
  --color-group-hover: #2e2e2e;
  --color-group-active: #353535;
}
```

---

## Animation

### Transitions

```scss
// Row hover
transition: background-color 0.2s ease;

// Sort icon color
transition: color 0.2s ease;

// Group expand/collapse (optional)
transition: transform 0.2s ease; // For rotating icon
```

### Performance

- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `height` (causes layout recalculation)
- Keep transitions under 300ms for responsiveness

---

## Empty State

### Default Empty State

- **Icon**: `inbox` at `3em` size
- **Text**: "No data available"
- **Padding**: `48px 16px`
- **Alignment**: Center
- **Color**: `var(--color-text-tertiary)`

### Custom Empty State

Accepts any React node, allowing for:
- Custom illustrations
- Call-to-action buttons
- Helpful messages
- Loading states

---

## Implementation Notes

### CSS Modules

All styles use CSS Modules (`.module.scss`) to prevent class name conflicts.

### CSS Variables

Use CSS custom properties for theming and consistency. All color and spacing values should reference design tokens.

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Sticky positioning: IE 11 fallback needed (optional)
- CSS Grid/Flexbox: Fully supported

### Performance

- Table rendering is optimized for up to ~500 rows
- For larger datasets, consider:
  - Pagination
  - Virtual scrolling
  - Progressive loading
