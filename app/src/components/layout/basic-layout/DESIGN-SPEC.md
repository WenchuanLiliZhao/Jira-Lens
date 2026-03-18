# BasicLayout Component - Design Specification

This document defines the design specifications for the BasicLayout component.

---

## Layout Structure

### Overall Layout
- **Full viewport**: `100vw` x `100vh`
- **Body scroll**: Disabled when BasicLayout is mounted
- **Flex direction**: Column (nav on top, content below)

### Navigation Bar
- **Height**: `64px` (CSS variable: `--nav-height`)
- **Position**: Fixed at top
- **Padding**: `0 16px` (CSS variable: `--nav-paddign`)
- **Background**: `var(--use-bg-prime)`
- **Border**: `1px solid var(--use-border-prime)` on bottom
- **Z-index**: Above content

### Left Sidebar
- **Default width**: `280px`
- **Min width**: `240px` (configurable via `dragRange[0]`; collapses below this when `collapsibleByDrag` is true)
- **Max width**: `420px` (configurable via `dragRange[1]`)
- **Height**: `calc(100vh - 64px)`
- **Background**: `var(--use-bg-prime)`
- **Border**: `1px solid var(--use-border-prime)` on right
- **Overflow**: `auto` (scrollable)

### Main Content
- **Width**: Fills remaining space (`flex: 1`)
- **Max inner width**: `700px` (centered)
- **Padding**: `0 24px`
- **Overflow**: `auto` (scrollable)

---

## Sidebar Resize Handle

### Visual
- **Width**: `4px`
- **Position**: Absolute, right edge of sidebar
- **Cursor**: `col-resize`
- **Background (default)**: Transparent
- **Background (hover/dragging)**: `var(--chart-rainbow-blue-100)`

### Behavior
- **Click**: Toggle collapse/expand
- **Drag**: Resize sidebar width within `dragRange` [min, max]
- **Drag below min**: Auto-collapse when `collapsibleByDrag` is true (default); otherwise clamped at min
- **Drag threshold**: 5px (to distinguish click from drag)
- **Click (no drag)**: When `collapsibleByDrag` is false, click on handle does not collapse (only expand if collapsed)

---

## Toggle Components (User-defined)

Toggle buttons are fully user-controlled. There are no auto-injected toggles.

### BasicLayout.LeftSidebarToggle / BasicLayout.RightSidebarToggle
- Wrap any `ReactNode` children
- On click, toggle the corresponding sidebar open/close state via `BasicLayoutContext`
- Can be placed anywhere inside `BasicLayout` — navigation, sidebar content, main content, etc.
- Multiple toggles for the same sidebar can coexist in the tree
- Rendered as `<span style="display: contents">` — no visual box of its own

### useBasicLayout() hook
- Exposes `{ leftOpen, setLeftOpen, rightOpen, setRightOpen }`
- For reading open state (e.g. conditional icon rendering) or manual control
- Throws if called outside a `BasicLayout`

---

## State Persistence

### localStorage Keys
- `basicLayout.leftSidebar` - Left sidebar state
- `basicLayout.rightSidebar` - Right sidebar state

### Stored Data
```typescript
{
  width: number;        // Current sidebar width
  previousWidth: number; // Width before collapse (for restore)
}
```

---

## Sidebar Config Options

### collapsibleByDrag
- **Type**: `boolean`
- **Default**: `true`
- **Description**: When false, the sidebar cannot be collapsed via drag. The resize handle still allows resizing within `dragRange`. Click on the handle (without dragging) does not collapse; it only expands if the sidebar is collapsed. Toggle buttons (`LeftSidebarToggle` / `RightSidebarToggle`) are unaffected.

### dragRange
- **Type**: `[number, number]`
- **Default**: `[240, 420]`
- **Description**: Width range [min, max] in px for drag resize. If `[a, b]` is passed with `a > b`, the values are normalized internally (min = Math.min(a,b), max = Math.max(a,b)).

---

## Transitions

### Sidebar Width
- **Property**: `width`
- **Duration**: `150ms`
- **Timing**: `ease-out`

### Sidebar Content Opacity (on collapse)
- **Property**: `opacity`
- **Duration**: `150ms`
- **Timing**: `ease-out`

---

## CSS Variables

```scss
.basic-layout {
  --nav-height: 64px;
  --nav-paddign: 16px;
  --page-content-height: calc(100vh - var(--nav-height));
}
```

---

## Implementation Notes

### File Structure
```
the-component/
├── index.tsx                 # Main BasicLayout component + subcomponent mounting
├── styles.module.scss        # Root layout styles
├── BasicLayoutContext.ts     # Context definition + useBasicLayout hook
├── SidebarToggle.tsx         # LeftSidebarToggle + RightSidebarToggle
├── Navigation.tsx            # Navigation bar subcomponent
├── Navigation.module.scss
├── LeftSidebar.tsx           # Left sidebar with resize logic (consumes context)
├── LeftSidebar.module.scss
├── RightSidebar.tsx          # Right sidebar with resize logic (consumes context)
├── RightSidebar.module.scss
├── MainContent.tsx           # Main content wrapper
└── MainContent.module.scss
```

### State Management
- `leftOpen` / `rightOpen` state managed in `BasicLayout`, provided via `BasicLayoutContext`
- `LeftSidebar` and `RightSidebar` consume context directly (no `collapsed`/`onCollapsedChange` props)
- `LeftSidebarToggle` / `RightSidebarToggle` consume context to toggle state on click
- Sidebar width state managed internally in each sidebar component
- All state persisted to localStorage

---

## AI Implementation Notes

**When implementing this component, AI must:**
- Follow all design specifications defined in this document
- Use design tokens consistently (no arbitrary values)
- Ensure proper localStorage persistence
- Implement smooth transitions for sidebar
- Include proper ARIA labels on toggle button
- Test resize behavior and auto-collapse threshold

---

**Note**: This document should be updated whenever design tokens or specifications change to reflect the current design system.
