---
status:
  - done
created: 2026-02-02
updated: 2026-02-02
category: layout
complexity: B
aliases:
  - BasicLayout
dependencies:
  - Button
  - DropdownMenu
externalDependencies:
  - react
aiContext: |
  Use BasicLayout for app shells with navigation bar, resizable sidebars, and main content.
  Toggle buttons are user-defined via BasicLayout.LeftSidebarToggle / BasicLayout.RightSidebarToggle.
  Use useBasicLayout() hook to access open state anywhere in the tree.
  Sidebar state persists to localStorage.
---

# BasicLayout Component

## Quick Summary

BasicLayout is a full-page layout component that provides a fixed navigation bar, resizable/collapsible left and right sidebars, and a scrollable main content area. Sidebar toggle buttons are fully user-defined — place `BasicLayout.LeftSidebarToggle` / `BasicLayout.RightSidebarToggle` anywhere in the tree with any children.

**AI Hint**: Use BasicLayout for app shells, dashboards, and documentation pages. Add `BasicLayout.LeftSidebarToggle` to `navigation.start` with a Button child. Use `useBasicLayout()` to read open state anywhere inside the layout.

---

## When to Use

✅ **DO use BasicLayout when:**
- Building app shells with navigation and sidebar
- Creating dashboard layouts
- Building documentation sites with navigation
- Need a resizable sidebar that persists state

❌ **DON'T use BasicLayout when:**
- Building landing pages (use simpler layouts)
- Need complex multi-column grids (use BentoGrid)
- Building forms or modals (use appropriate containers)

---

## Visual Variants

### Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Navigation Bar (fixed, 64px height)                                      │
│ [<LeftToggle>] [Start Items...]          [End Items...] [<RightToggle>]  │
├──────────────┬──────────────────────────────────────┬────────────────────┤
│ Left Sidebar │ Main Content                         │ Right Sidebar      │
│ (resizable)  │ (scrollable, max-width: 700px)       │ (resizable)        │
│ [min,max]px  │                                      │ [min,max]px        │
└──────────────┴──────────────────────────────────────┴────────────────────┘
```

### Sidebar States
- **Expanded**: Shows sidebar content (width within `dragRange`, default 240-420px)
- **Collapsed**: Hidden (0px width), toggle button shows "menu" icon
- **Resizing**: Drag edge to resize; auto-collapses below min when `collapsibleByDrag` is true (default)

---

## Props API

### Content Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Main content area |
| `leftSidebar` | `SidebarConfig` | - | Left sidebar configuration |
| `rightSidebar` | `SidebarConfig` | - | Right sidebar configuration |

**SidebarConfig** optional fields:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `collapsibleByDrag` | `boolean` | `true` | When false, sidebar cannot be collapsed via drag (toggle button still works). |
| `dragRange` | `[number, number]` | `[240, 420]` | Width range [min, max] in px for drag resize. |

### Design Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navigation` | `{ start?: ReactNode[], end?: ReactNode[] }` | - | Navigation bar items |
| `mainContentFullBleed` | `boolean` | `false` | When true, main content fills area without max-width (e.g. for maps) |

```typescript
type SidebarConfig = {
  content: React.ReactNode;
  defaultOpen?: boolean;  // Default true. Initial state when no localStorage.
  collapsibleByDrag?: boolean;  // Default true. When false, drag cannot collapse sidebar.
  dragRange?: [number, number];  // [min, max] width in px. Default [240, 420].
};

interface BasicLayoutProps {
  children: React.ReactNode;
  navigation?: { start?: React.ReactNode[]; end?: React.ReactNode[] };
  leftSidebar?: SidebarConfig;
  rightSidebar?: SidebarConfig;
  mainContentFullBleed?: boolean;
}
```

### Subcomponents

| Component | Props | Description |
|-----------|-------|-------------|
| `BasicLayout.LeftSidebarToggle` | `{ children: ReactNode }` | Wraps children; click toggles left sidebar. Must be inside `BasicLayout`. |
| `BasicLayout.RightSidebarToggle` | `{ children: ReactNode }` | Same for right sidebar. |

### Hook

```typescript
const { leftOpen, setLeftOpen, rightOpen, setRightOpen } = useBasicLayout();
```

Reads and writes sidebar open state from anywhere inside `BasicLayout`. Throws if used outside a `BasicLayout`.

---

## Quick Start

### Basic Usage

```tsx
import { BasicLayout } from '@/components/layout/basic-layout';

<BasicLayout
  navigation={{
    start: [
      <BasicLayout.LeftSidebarToggle key="toggle">
        <Button variant="ghost" startIcon="menu" />
      </BasicLayout.LeftSidebarToggle>,
      <Logo key="logo" />,
    ],
    end: [<UserMenu key="user" />],
  }}
  leftSidebar={{
    content: (
      <nav>
        <NavItem href="/home">Home</NavItem>
        <NavItem href="/settings">Settings</NavItem>
      </nav>
    ),
    defaultOpen: true,
  }}
>
  <h1>Page Title</h1>
  <p>Main content goes here...</p>
</BasicLayout>
```

### Without Sidebar

```tsx
<BasicLayout
  navigation={{
    start: [<Logo key="logo" />],
    end: [<UserMenu key="user" />],
  }}
>
  <p>Content without sidebar</p>
</BasicLayout>
```

### With Right Sidebar

```tsx
<BasicLayout
  leftSidebar={{
    content: <LeftPanel />,
    defaultOpen: true,
    collapsibleByDrag: false,  // Disable collapse via drag
    dragRange: [200, 400],
  }}
  rightSidebar={{ content: <RightPanel />, defaultOpen: false }}
  navigation={{
    start: [
      <BasicLayout.LeftSidebarToggle key="lt">
        <Button variant="ghost" startIcon="menu" />
      </BasicLayout.LeftSidebarToggle>,
    ],
    end: [
      <BasicLayout.RightSidebarToggle key="rt">
        <Button variant="ghost" startIcon="menu" />
      </BasicLayout.RightSidebarToggle>,
    ],
  }}
>
  <Content />
</BasicLayout>
```

### Reading open state (for conditional icon)

```tsx
function NavBar() {
  const { leftOpen } = useBasicLayout();
  return (
    <BasicLayout.LeftSidebarToggle>
      <Button startIcon={leftOpen ? "menu_open" : "menu"} />
    </BasicLayout.LeftSidebarToggle>
  );
}
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Accessibility

- **Keyboard Navigation**: Tab through navigation items, sidebar content, and main content
- **Toggle Button**: Has `aria-label` describing current action ("Show sidebar" / "Hide sidebar")
- **Focus Management**: Focus remains logical when sidebar collapses/expands
- **Screen Reader**: Semantic HTML (`<nav>`, `<main>`) for proper landmarks

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns.
