---
status:
  - done
created: 2026-01-31
updated: 2026-01-31
category: data-display
complexity: B
aliases:
  - DataTable
  - Table
dependencies:
  - Icon
  - Badge
externalDependencies:
  - react
aiContext: |
  DataTable displays data in rows and columns with sortable headers, grouping, and flexible cell rendering.
  Use for displaying structured data like task lists, user tables, or any tabular information.
  Supports custom cell renderers for badges, icons, and complex content.
---

# DataTable Component

## Quick Summary

A fully-featured, data-driven table component for displaying structured data with sortable columns, grouping capabilities, and flexible cell rendering. Similar to tables in Obsidian, GitHub Projects, and Notion.

**Key Features:**
- **Sortable columns** with visual indicators
- **Grouping** with collapsible group headers
- **Flexible cell rendering** - support any React content
- **Sticky headers** for long tables
- **Multiple size variants** and visual styles

**AI Hint**: When the user needs to display structured data in a table format with sorting or grouping, use DataTable. For simple read-only data display, consider using a simpler component.

---

## When to Use

✅ **DO use DataTable when:**
- Displaying structured data with multiple columns
- Users need to sort data by different columns
- Data should be grouped by categories or statuses
- Cells need to contain complex content (badges, tags, icons)
- Working with lists of items that have multiple properties
- Building dashboards, admin panels, or data management UIs

❌ **DON'T use DataTable when:**
- Displaying simple key-value pairs (use a definition list)
- Only showing 1-2 columns of data (use a list component)
- Data is highly hierarchical (use a tree view)
- Need grid-like layout without row/column structure (use CSS Grid)
- Building a spreadsheet editor (needs more complex features)

---

## Visual Variants

### size
- **"small"**: Compact table with reduced padding (8px/12px)
  - Use cases: Dense data displays, embedded tables in cards
  - AI hint: Choose for space-constrained layouts
- **"medium"** (default): Standard spacing (12px/16px)
  - Use cases: Most general-purpose tables
  - AI hint: Default choice for most scenarios
- **"large"**: Spacious table with increased padding (16px/20px)
  - Use cases: Primary content tables, improved readability
  - AI hint: Choose for main content areas with fewer rows

### bordered
- **true** (default): Shows borders between all cells
- **false**: Minimal borders (header border only)

### hoverable
- **true** (default): Rows highlight on hover
- **false**: No hover effect

### striped
- **true**: Alternating row colors for easier scanning
- **false** (default): Uniform background

### stickyHeader
- **true**: Header stays visible while scrolling
- **false** (default): Header scrolls with content

---

## Props API

### Data Props

```typescript
interface DataTableProps<T> {
  // Core data
  data: T[] | TableGroup<T>[];
  columns: Column<T>[];
  
  // Grouping
  isGrouped?: boolean;
  defaultExpandedGroups?: string[];
  onGroupToggle?: (groupKey: string, expanded: boolean) => void;
  
  // Row identification
  rowKey?: keyof T | ((row: T, rowIndex: number) => string | number);
}
```

**data**: The table data - either flat array of rows or grouped array
- Flat: `Task[]` - renders as normal rows
- Grouped: `TableGroup<Task>[]` - renders with group headers

**columns**: Column definitions (see Column Configuration below)

**isGrouped**: Set to `true` when using grouped data structure

**defaultExpandedGroups**: Array of group keys that start expanded

**rowKey**: Function or property name to get unique key for each row (used for React keys)

### Column Configuration

```typescript
interface Column<T> {
  key: string;
  header: {
    label: string;
    icon?: string;
  };
  accessor: keyof T | ((row: T) => any);
  sortable?: boolean;
  cellRenderer?: (value: any, row: T, rowIndex: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}
```

**key**: Unique identifier for the column

**header**: Header cell content
- `label`: Text to display in header
- `icon`: Optional Material icon name

**accessor**: How to get value from row data
- Property name: `'title'` gets `row.title`
- Function: `(row) => row.user.name` for nested access

**sortable**: Enable sort icon and click handling for this column

**cellRenderer**: Custom render function for cell content
- Receives: `(value, row, rowIndex)`
- Return: Any React node (badges, icons, formatted text, etc.)

**width**: CSS width value (`100`, `'20%'`, `'200px'`)

**align**: Text alignment in cells

### Sorting Props (Controlled)

```typescript
sortBy?: SortConfig;
onSortChange?: (config: SortConfig) => void;

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc' | null;
}
```

**sortBy**: Current sort state (controlled component pattern)
- `key`: Column being sorted
- `direction`: Sort direction or `null` for unsorted

**onSortChange**: Callback when user clicks a sortable column header
- Parent should update state and re-sort data

### UI Props

```typescript
stickyHeader?: boolean;
maxHeight?: string | number;
size?: 'small' | 'medium' | 'large';
bordered?: boolean;
hoverable?: boolean;
striped?: boolean;
```

**stickyHeader**: When enabled, header row sticks to the top while scrolling
- Without `maxHeight`: Header sticks to **window/viewport top** (viewport sticky)
- With `maxHeight`: Header sticks to **container top** (container sticky)

**maxHeight**: Maximum height for the table container (enables vertical scrolling)
- Accepts: `'500px'`, `'50vh'`, `500` (number = pixels)
- Creates a scrollable container for the table
- Use with `stickyHeader` for container-sticky behavior
- Example: `maxHeight="400px"`

### Styling Props

```typescript
className?: string;
rowClassName?: string | ((row: T, rowIndex: number) => string);
headerClassName?: string;
```

**rowClassName**: Can be static string or function returning class based on row data

### Behavior Props

```typescript
onRowClick?: (row: T, rowIndex: number) => void;
emptyContent?: React.ReactNode;
```

**onRowClick**: Makes rows clickable, triggers on row click

**emptyContent**: Custom content to show when data is empty

---

## Quick Start

### Basic Usage

```tsx
import { DataTable, Column } from '@/components/data-display/data-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const columns: Column<User>[] = [
  {
    key: 'id',
    header: { label: 'ID' },
    accessor: 'id',
    width: 80,
  },
  {
    key: 'name',
    header: { label: 'Name', icon: 'person' },
    accessor: 'name',
    sortable: true,
  },
  {
    key: 'email',
    header: { label: 'Email' },
    accessor: 'email',
  },
  {
    key: 'role',
    header: { label: 'Role' },
    accessor: 'role',
    sortable: true,
  },
];

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
];

function UserTable() {
  return (
    <DataTable
      data={users}
      columns={columns}
      rowKey="id"
    />
  );
}
```

### With Sorting (Controlled)

```tsx
function SortableTable() {
  const [sortBy, setSortBy] = useState<SortConfig>({
    key: 'name',
    direction: null,
  });
  
  // Sort data based on current sort config
  const sortedData = useMemo(() => {
    if (!sortBy.direction) return users;
    
    return [...users].sort((a, b) => {
      const aVal = a[sortBy.key];
      const bVal = b[sortBy.key];
      
      if (aVal < bVal) return sortBy.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortBy.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, sortBy]);
  
  return (
    <DataTable
      data={sortedData}
      columns={columns}
      sortBy={sortBy}
      onSortChange={setSortBy}
      rowKey="id"
    />
  );
}
```

### Custom Cell Renderers

```tsx
import { Badge } from '@/components/general/badge';

const columns: Column<User>[] = [
  {
    key: 'role',
    header: { label: 'Role' },
    accessor: 'role',
    cellRenderer: (value) => {
      const color = value === 'Admin' ? 'primary' : 'default';
      return <Badge variant={color}>{value}</Badge>;
    },
  },
  {
    key: 'status',
    header: { label: 'Status' },
    accessor: (row) => row.isActive,
    cellRenderer: (isActive) => (
      <span style={{ color: isActive ? 'green' : 'red' }}>
        {isActive ? '● Active' : '○ Inactive'}
      </span>
    ),
  },
];
```

### Grouped Data

```tsx
import { TableGroup } from '@/components/data-display/data-table';

const groupedTasks: TableGroup<Task>[] = [
  {
    groupKey: 'todo',
    groupLabel: 'To Do',
    icon: 'radio_button_unchecked',
    rows: [/* tasks with status='todo' */],
  },
  {
    groupKey: 'done',
    groupLabel: 'Completed',
    icon: 'check_circle',
    rows: [/* tasks with status='done' */],
  },
];

function GroupedTable() {
  return (
    <DataTable
      data={groupedTasks}
      columns={columns}
      isGrouped
      defaultExpandedGroups={['todo', 'done']}
      rowKey="id"
    />
  );
}
```

### Sticky Header

**Two sticky modes:**

**1. Viewport Sticky** - Header sticks to window top when page scrolls:
```tsx
<DataTable
  data={data}
  columns={columns}
  stickyHeader
  rowKey="id"
/>
```

**2. Container Sticky** - Header sticks to container top when table scrolls:
```tsx
<DataTable
  data={largeDataset}
  columns={columns}
  stickyHeader
  maxHeight="500px"  // Enables container scrolling
  rowKey="id"
/>
```

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Accessibility

- **Semantic HTML**: Uses proper `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` elements
- **Keyboard Navigation**: Tab through focusable elements (clickable headers, clickable rows)
- **Sort Indicators**: Visual sort icons for screen readers and sighted users
- **Color Independence**: Status conveyed through icons and text, not just color
- **Focus Indicators**: Visible focus states on interactive elements
- **Expandable Groups**: Clear expand/collapse affordance with icons

**ARIA Attributes** (for future enhancement):
- Consider `role="grid"` for advanced keyboard navigation
- `aria-sort` on sortable column headers
- `aria-expanded` on group headers

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns including sorting logic, grouping, and custom cell renderers.

---

## Common Patterns

### Dynamic Row Styling

```tsx
<DataTable
  data={tasks}
  columns={columns}
  rowClassName={(row) => {
    if (row.priority === 'high') return 'high-priority-row';
    if (row.isOverdue) return 'overdue-row';
    return '';
  }}
  rowKey="id"
/>
```

### Clickable Rows

```tsx
<DataTable
  data={users}
  columns={columns}
  onRowClick={(user) => {
    navigate(`/users/${user.id}`);
  }}
  rowKey="id"
/>
```

### Complex Cell Content

```tsx
const columns: Column<Task>[] = [
  {
    key: 'assignee',
    header: { label: 'Assignee' },
    accessor: 'assignee',
    cellRenderer: (assignee) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Avatar src={assignee.avatar} size="small" />
        <span>{assignee.name}</span>
      </div>
    ),
  },
];
```

---

## Performance Considerations

- **Memoize sorted/filtered data** to avoid recalculation on every render
- **Use `rowKey`** for stable React keys (improves reconciliation)
- **Lazy load large datasets** if rendering hundreds of rows
- **Virtual scrolling** may be needed for 1000+ rows (future enhancement)
- **Cell renderers** should be lightweight - avoid expensive computations

---

## TypeScript Tips

```tsx
// Define your data type
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

// Type your columns
const columns: Column<Product>[] = [
  // TypeScript will enforce accessor matches Product properties
  {
    key: 'name',
    header: { label: 'Product' },
    accessor: 'name', // ✓ Valid
    // accessor: 'invalid', // ✗ Type error
  },
];

// Component usage
<DataTable<Product>
  data={products}
  columns={columns}
  rowKey="id"
/>
```
