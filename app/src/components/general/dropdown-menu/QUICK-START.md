# DropdownMenu - Quick Start Guide

## Installation

The component is already available in your project:

```tsx
import { DropdownMenu } from '@/components/general/dropdown-menu';
import { Button } from '@/components/general/button';
```

## 30-Second Example

```tsx
<DropdownMenu>
  <DropdownMenu.Trigger>
    <Button>Open Menu</Button>
  </DropdownMenu.Trigger>
  
  <DropdownMenu.Content>
    <DropdownMenu.ItemButton label="Edit" icon="edit" onSelect={() => alert('Edit')} />
    <DropdownMenu.ItemButton label="Delete" icon="delete" onSelect={() => alert('Delete')} />
  </DropdownMenu.Content>
</DropdownMenu>
```

## Common Use Cases

### 1. Action Menu (Most Common)

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

### 2. With Keyboard Shortcuts

```tsx
<DropdownMenu.Content>
  <DropdownMenu.ItemWithShortcut 
    label="Save"
    icon="save"
    shortcut="⌘S"
    onSelect={handleSave}
  />
</DropdownMenu.Content>
```

### 3. Settings Menu with Switches

```tsx
<DropdownMenu.Content>
  <DropdownMenu.ItemWithSwitch
    label="Dark Mode"
    checked={isDark}
    onCheckedChange={setIsDark}
  />
</DropdownMenu.Content>
```

### 4. Nested Submenu

```tsx
<DropdownMenu.Content>
  <DropdownMenu.ItemButton label="New" icon="plus" />
  
  {/* Submenu */}
  <DropdownMenu>
    <DropdownMenu.Trigger asChild>
      <DropdownMenu.Item>
        Export <Icon icon="chevron-right" />
      </DropdownMenu.Item>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content side="right">
      <DropdownMenu.ItemButton label="PDF" icon="file-pdf" />
      <DropdownMenu.ItemButton label="PNG" icon="image" />
    </DropdownMenu.Content>
  </DropdownMenu>
</DropdownMenu.Content>
```

### 5. Custom Content

```tsx
<DropdownMenu.Content>
  <DropdownMenu.Item>
    <div style={{ display: 'flex', gap: '12px' }}>
      <Avatar src="/user.jpg" />
      <div>
        <div>John Doe</div>
        <div>john@example.com</div>
      </div>
    </div>
  </DropdownMenu.Item>
</DropdownMenu.Content>
```

## Available Components

- **DropdownMenu**: Container (manages state)
- **DropdownMenu.Trigger**: Opens the menu
- **DropdownMenu.Content**: Menu container
- **DropdownMenu.Item**: Base item (accepts any children)
- **DropdownMenu.ItemButton**: Prebuilt button item
- **DropdownMenu.ItemWithShortcut**: Button with keyboard shortcut
- **DropdownMenu.ItemWithSwitch**: Item with toggle switch
- **DropdownMenu.Group**: Groups items together
- **DropdownMenu.Separator**: Visual divider
- **DropdownMenu.Label**: Non-interactive text

## Keyboard Navigation

- **Arrow Down/Up**: Navigate between items
- **Enter/Space**: Activate item
- **Escape**: Close menu
- **Arrow Right**: Open submenu
- **Arrow Left**: Close submenu

## Props Quick Reference

### Most Used Props

```tsx
// Container
<DropdownMenu 
  open={boolean}           // Controlled mode
  defaultOpen={boolean}    // Uncontrolled mode
  onOpenChange={fn}        // Callback
  size="small|medium|large"
  disabled={boolean}
/>

// Content
<DropdownMenu.Content
  align="start|center|end"
  side="top|bottom|left|right"
  sideOffset={number}
/>

// ItemButton
<DropdownMenu.ItemButton
  label="Text"
  icon="icon-name"
  disabled={boolean}
  onSelect={() => {}}
/>
```

## Tips

1. **Use `asChild` for custom triggers**: `<DropdownMenu.Trigger asChild><CustomButton /></DropdownMenu.Trigger>`
2. **Submenus open on hover**: No need to handle click events
3. **Custom content**: Use `DropdownMenu.Item` for complete freedom
4. **Positioning**: Content automatically adjusts to stay in viewport
5. **Accessibility**: Keyboard navigation and ARIA attributes are built-in

## Full Documentation

- **[README.md](./README.md)**: Complete API documentation
- **[DESIGN-SPEC.md](./DESIGN-SPEC.md)**: Design specifications
- **[Demo](./__demo__/react/page-content.tsx)**: Interactive examples

## Need Help?

Check the demo file for working examples of every feature!
