---
status:
  - done
  - redesign-needed
created: 2026-01-30
updated: 2026-01-30
category: general
complexity: B
aliases:
  - DropdownMenu
  - Menu
  - ContextMenu
dependencies:
  - Icon
externalDependencies:
  - react
  - react-dom
aiContext: |
  A flexible dropdown menu component supporting custom items, prebuilt components, keyboard navigation, and nested submenus.
  Use DropdownMenu.Item for complete customization, or prebuilt components (ItemButton, ItemWithShortcut, ItemWithSwitch) for common patterns.
figma:
  - done
  - incomplete
---

# DropdownMenu Component

## Quick Summary

The DropdownMenu component is a flexible, accessible dropdown menu system based on compound component patterns. It supports complex menu structures including nested submenus, custom items, and various prebuilt components for common use cases. The component includes full keyboard navigation, focus management, and automatic positioning with boundary detection.

**AI Hint**: Use `DropdownMenu.Item` for completely custom content. Use prebuilt components like `ItemButton` or `ItemWithShortcut` for common patterns. Supports recursive nesting for submenus.

---

## When to Use

✅ **DO use DropdownMenu when:**
- You need a contextual menu triggered by a button or element
- You want to display a list of actions or options
- You need nested submenus for hierarchical actions
- You want keyboard navigation and accessibility out of the box
- You need to mix different types of content (buttons, switches, search bars)

❌ **DON'T use DropdownMenu when:**
- You need a select/combobox for form input (use Select component)
- You need a navigation menu (use NavigationMenu component)
- You need a tooltip (use Tooltip component)
- You need always-visible options (use ButtonGroup or Tabs)

---

## Component Architecture

### Core Components

```
DropdownMenu (Container)
├── DropdownMenu.Trigger (Trigger element)
└── DropdownMenu.Content (Menu container)
    ├── DropdownMenu.Item (Base item - accepts any children)
    ├── DropdownMenu.ItemButton (Prebuilt: icon + label)
    ├── DropdownMenu.ItemWithShortcut (Prebuilt: icon + label + shortcut)
    ├── DropdownMenu.ItemWithSwitch (Prebuilt: label + toggle switch)
    ├── DropdownMenu.Group (Group items together)
    ├── DropdownMenu.Separator (Visual separator)
    ├── DropdownMenu.Label (Non-interactive text)
    └── DropdownMenu (Recursive nesting for submenus)
```

### Design Philosophy

**"Flexible base, convenient prebuilts"** - The `DropdownMenu.Item` component accepts any children for maximum flexibility. Prebuilt components (ItemButton, ItemWithShortcut, etc.) provide convenient APIs for common patterns without sacrificing customization.

---

## Props API

### DropdownMenu (Container)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Menu trigger and content |
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Uncontrolled default open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `disabled` | `boolean` | `false` | Disable the menu |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Size variant |
| `modal` | `boolean` | `false` | Block background interaction |

### DropdownMenu.Trigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Trigger element |
| `asChild` | `boolean` | `false` | Merge props with child element |
| `className` | `string` | - | Custom class name |

### DropdownMenu.Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Menu items |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Alignment relative to trigger |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Positioning side |
| `sideOffset` | `number` | `4` | Offset from trigger in pixels |
| `className` | `string` | - | Custom class name |

### DropdownMenu.Item

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Item content (any) |
| `disabled` | `boolean` | `false` | Disable the item |
| `onSelect` | `(event: Event) => void` | - | Callback when selected |
| `className` | `string` | - | Custom class name |

### DropdownMenu.ItemButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Button label |
| `icon` | `string` | - | Icon name |
| `disabled` | `boolean` | `false` | Disable the button |
| `onSelect` | `() => void` | - | Callback when clicked |
| `className` | `string` | - | Custom class name |

### DropdownMenu.ItemWithShortcut

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Item label |
| `icon` | `string` | - | Icon name |
| `shortcut` | `string` | - | Keyboard shortcut (e.g., "⌘S") |
| `disabled` | `boolean` | `false` | Disable the item |
| `onSelect` | `() => void` | - | Callback when selected |
| `className` | `string` | - | Custom class name |

### DropdownMenu.ItemWithSwitch

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Switch label |
| `checked` | `boolean` | - | Whether checked |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when toggled |
| `disabled` | `boolean` | `false` | Disable the switch |
| `className` | `string` | - | Custom class name |

---

## Quick Start

### Basic Menu

```tsx
import { DropdownMenu } from '@/components/general/dropdown-menu';
import { Button } from '@/components/general/button';

<DropdownMenu>
  <DropdownMenu.Trigger>
    <Button variant="outlined">Options</Button>
  </DropdownMenu.Trigger>
  
  <DropdownMenu.Content>
    <DropdownMenu.ItemButton 
      label="Edit" 
      icon="edit"
      onSelect={() => console.log('Edit')}
    />
    <DropdownMenu.ItemButton 
      label="Delete" 
      icon="delete"
      onSelect={() => console.log('Delete')}
    />
  </DropdownMenu.Content>
</DropdownMenu>
```

### With Shortcuts and Groups

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger>
    <Button variant="contained">File</Button>
  </DropdownMenu.Trigger>
  
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.ItemWithShortcut 
        label="New File"
        icon="file-plus"
        shortcut="⌘N"
        onSelect={handleNew}
      />
      <DropdownMenu.ItemWithShortcut 
        label="Save"
        icon="save"
        shortcut="⌘S"
        onSelect={handleSave}
      />
    </DropdownMenu.Group>
    
    <DropdownMenu.Separator />
    
    <DropdownMenu.ItemButton 
      label="Close"
      icon="x"
      onSelect={handleClose}
    />
  </DropdownMenu.Content>
</DropdownMenu>
```

### Nested Submenu

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger>
    <Button>Menu</Button>
  </DropdownMenu.Trigger>
  
  <DropdownMenu.Content>
    <DropdownMenu.ItemButton label="New" icon="plus" />
    <DropdownMenu.ItemButton label="Open" icon="folder" />
    
    {/* Nested submenu */}
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <DropdownMenu.Item>
          <span>Export</span>
          <Icon icon="chevron-right" />
        </DropdownMenu.Item>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.ItemButton label="PDF" icon="file-pdf" />
        <DropdownMenu.ItemButton label="PNG" icon="image" />
      </DropdownMenu.Content>
    </DropdownMenu>
  </DropdownMenu.Content>
</DropdownMenu>
```

### Custom Item Content

```tsx
<DropdownMenu.Content>
  {/* Use Item for complete customization */}
  <DropdownMenu.Item>
    <div style={{ display: 'flex', gap: '12px' }}>
      <Avatar src="/user.jpg" />
      <div>
        <div>John Doe</div>
        <div style={{ fontSize: '12px', color: 'gray' }}>
          john@example.com
        </div>
      </div>
    </div>
  </DropdownMenu.Item>
  
  <DropdownMenu.Separator />
  
  <DropdownMenu.ItemButton label="Settings" icon="settings" />
  <DropdownMenu.ItemButton label="Logout" icon="logout" />
</DropdownMenu.Content>
```

### With Switches (Settings Menu)

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger>
    <Button>Settings</Button>
  </DropdownMenu.Trigger>
  
  <DropdownMenu.Content>
    <DropdownMenu.ItemWithSwitch
      label="Dark Mode"
      checked={isDark}
      onCheckedChange={setIsDark}
    />
    <DropdownMenu.ItemWithSwitch
      label="Auto Save"
      checked={autoSave}
      onCheckedChange={setAutoSave}
    />
    <DropdownMenu.ItemWithSwitch
      label="Notifications"
      checked={notifications}
      onCheckedChange={setNotifications}
    />
  </DropdownMenu.Content>
</DropdownMenu>
```

---

## Accessibility

The DropdownMenu component is designed with accessibility in mind:

- **Keyboard Navigation**:
  - `Enter`/`Space` on trigger: Open/close menu
  - `ArrowDown`/`ArrowUp`: Navigate between items
  - `Home`/`End`: Jump to first/last item
  - `Escape`: Close menu
  - `ArrowRight`: Open submenu (if exists)
  - `ArrowLeft`: Close submenu
  
- **ARIA Attributes**:
  - `role="menu"` on content
  - `role="menuitem"` on items
  - `aria-haspopup="true"` on trigger
  - `aria-expanded` reflects open state
  - `aria-disabled` for disabled items
  
- **Focus Management**:
  - Auto-focuses first item when menu opens
  - Returns focus to trigger when menu closes
  - Traps focus within menu during keyboard navigation

---

## Design Specifications

For detailed design specifications including colors, spacing, states, and accessibility requirements, see:

👉 **[DESIGN-SPEC.md](./DESIGN-SPEC.md)** - Complete design system specifications

**AI MUST reference DESIGN-SPEC.md** when generating code to ensure design consistency.

---

## Code Examples

For comprehensive, runnable code examples, see:

- **[__demo__/react/page-content.tsx](./__demo__/react/page-content.tsx)** - Complete interactive demo

**AI Note**: Reference the demo files for actual, working code patterns.

---

## Common Patterns

### Action Menu (Edit/Delete)

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger>
    <IconButton icon="more-vertical" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.ItemButton label="Edit" icon="edit" />
    <DropdownMenu.ItemButton label="Duplicate" icon="copy" />
    <DropdownMenu.Separator />
    <DropdownMenu.ItemButton label="Delete" icon="trash" />
  </DropdownMenu.Content>
</DropdownMenu>
```

### User Profile Menu

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger>
    <Avatar src="/user.jpg" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Label>john@example.com</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.ItemButton label="Profile" icon="user" />
    <DropdownMenu.ItemButton label="Settings" icon="settings" />
    <DropdownMenu.Separator />
    <DropdownMenu.ItemButton label="Logout" icon="log-out" />
  </DropdownMenu.Content>
</DropdownMenu>
```

---

## Performance Notes

- Content is rendered in a portal to `document.body` to avoid z-index and overflow issues
- Closed menus don't render content (conditional rendering)
- Position calculations use `useLayoutEffect` to prevent flash
- Keyboard navigation uses event delegation for efficiency

---

## Future Enhancements

Potential additions (not implemented yet):
- `DropdownMenu.CheckboxItem`: Multi-select menu items
- `DropdownMenu.RadioGroup`: Single-select group
- Virtual scrolling for very long menus
- Animation customization props
- Command palette integration

---

## Advanced Usage

### Using the Context Hook

If you need to access the dropdown menu context in a custom component, import the hook directly:

```tsx
import { useDropdownMenuContext } from '@/components/general/dropdown-menu/the-component/context';

function MyCustomItem() {
  const { closeMenu, isOpen } = useDropdownMenuContext();
  // Your custom logic
}
```

---

## Related Components

- **Button**: Primary trigger for dropdown menus
- **Icon**: Used in menu items
- **Select**: For form input selection (different use case)
- **Tooltip**: For simple hover information
