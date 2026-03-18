---
status: done
created: 2026-01-30
updated: 2026-01-30
---

# DropdownMenu Component - Design Specifications

## Overview

This document defines the complete design specifications for the DropdownMenu component, including dimensions, colors, spacing, typography, states, and accessibility requirements.

---

## Layout & Dimensions

### Content Container

| Size | Min Width | Max Width | Max Height | Padding |
|------|-----------|-----------|------------|---------|
| Small | 140px | 240px | 400px | 6px |
| Medium | 180px | 320px | 400px | 6px |
| Large | 220px | 400px | 400px | 6px |

### Menu Items

| Size | Height | Padding Vertical | Padding Horizontal | Icon Size | Gap |
|------|--------|------------------|--------------------|-----------| ----|
| Small | 32px | 6px | 10px | 14px | 6px |
| Medium | 36px | 8px | 12px | 16px | 8px |
| Large | 40px | 10px | 14px | 18px | 10px |

### Spacing

- **Item Gap**: 2px between items
- **Group Gap**: 2px between items within group
- **Separator Margin**: 4px vertical
- **Label Padding**: 6px vertical, 12px horizontal
- **Shortcut Padding**: 2px vertical, 6px horizontal
- **Switch Size**: 36px × 20px

---

## Colors

### Light Mode

**Content Container:**
- Background: `var(--use-bg-prime)` - #FFFFFF
- Border: `var(--use-border-prime)` - #D0D7DE
- Shadow: `0 4px 12px var(--use-shadow-popup-default)`

**Menu Item:**
- Text (Normal): `var(--use-text-prime)` - #1F2328
- Text (Secondary): `var(--use-text-secondary)` - #8C959F
- Background (Hover): `var(--use-hover-box-hover)` - rgba(0,0,0,0.04)
- Background (Active): `var(--use-hover-box-mouse-down)` - rgba(0,0,0,0.06)
- Icon: `var(--use-icon-prime)` - #424A53

**Separator:**
- Color: `var(--use-border-prime)` - #D0D7DE

**Shortcut Badge:**
- Background: `var(--use-bg-secondary)` - #F6F8FA
- Border: `var(--use-border-prime)` - #D0D7DE
- Text: `var(--use-text-secondary)` - #8C959F

**Switch:**
- Background (Off): `var(--use-bg-tool-bg)` - #D0D7DE
- Background (On): `var(--chart-rainbow-blue-100)` - #1364E6
- Thumb: #FFFFFF

### Dark Mode

**Content Container:**
- Background: `var(--use-bg-prime)` - #000000
- Border: `var(--use-border-prime)` - #292E36
- Shadow: `0 4px 12px var(--use-shadow-popup-default)`

**Menu Item:**
- Text (Normal): `var(--use-text-prime)` - #F0F6FC
- Text (Secondary): `var(--use-text-secondary)` - #545D68
- Background (Hover): `var(--use-hover-box-hover)` - rgba(255,255,255,0.04)
- Background (Active): `var(--use-hover-box-mouse-down)` - rgba(255,255,255,0.06)
- Icon: `var(--use-icon-prime)` - #909DAB

---

## Typography

### Menu Items

| Size | Font Size | Line Height | Font Weight |
|------|-----------|-------------|-------------|
| Small | 13px | 20px | 400 (Regular) |
| Medium | 14px | 22px | 400 (Regular) |
| Large | 15px | 24px | 400 (Regular) |

### Label

- Font Size: 12px
- Line Height: 18px
- Font Weight: 600 (Semi-Bold)
- Color: Secondary text color

### Shortcut

- Font Size: 12px
- Font Family: Monospace
- Font Weight: 400

---

## Border Radius

- Content Container: 8px
- Menu Item: 6px
- Shortcut Badge: 4px
- Switch: 10px (pill shape)

---

## Shadows

| State | Shadow |
|-------|--------|
| Normal | `0 4px 12px var(--use-shadow-popup-default)` |
| Submenu (Level 1+) | `0 2px 8px var(--use-shadow-popup-default)` |

---

## Animations

### Menu Open/Close

**Slide Down (Opening):**
```css
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
- Duration: 150ms
- Easing: ease-out

**Slide Up (Closing):**
```css
@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}
```
- Duration: 150ms
- Easing: ease-in

### Item Hover

- Property: background-color
- Duration: 120ms
- Easing: ease

### Switch Toggle

- Property: transform (thumb position), background-color
- Duration: 120ms
- Easing: ease

---

## States

### Menu Item States

| State | Background | Text Color | Cursor | Opacity |
|-------|------------|------------|--------|---------|
| Normal | Transparent | Primary | pointer | 1 |
| Hover | Hover BG | Primary | pointer | 1 |
| Active | Active BG | Primary | pointer | 1 |
| Focus | Hover BG | Primary | pointer | 1 |
| Disabled | Transparent | Primary | not-allowed | 0.5 |

### Focus Indicators

**Keyboard Focus (Focus-Visible):**
- Outline: 2px solid blue (`var(--chart-rainbow-blue-100)`)
- Outline Offset: -2px (inside)

**Mouse Focus:**
- Background: Hover color (subtle, not outline)

---

## Positioning

### Default Position

- Side: bottom
- Align: start
- Offset: 4px from trigger

### Boundary Detection

- Minimum padding from viewport edge: 8px
- Automatically flips position if content would overflow viewport
- Adjusts horizontal position to stay within bounds

### Z-Index

- Root menu: 1000
- Submenu (level 1): 1001
- Submenu (level 2): 1002
- etc. (increments by level)

---

## Accessibility

### ARIA Attributes

| Element | Role | ARIA Attributes |
|---------|------|-----------------|
| Trigger | button | `aria-haspopup="true"`, `aria-expanded` |
| Content | menu | `aria-orientation="vertical"` |
| Item | menuitem | `aria-disabled` (if disabled) |
| Separator | separator | `aria-orientation="horizontal"` |
| Switch | switch | `aria-checked` |
| Label | presentation | - |

### Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| Enter / Space | Open/close menu | On trigger |
| Enter / Space | Activate item | On menu item |
| ArrowDown | Move focus to next item | In menu |
| ArrowUp | Move focus to previous item | In menu |
| Home | Focus first item | In menu |
| End | Focus last item | In menu |
| ArrowRight | Open submenu | On submenu trigger |
| ArrowLeft | Close submenu | In submenu |
| Escape | Close menu | In menu |
| Tab | Move focus out of menu (closes) | In menu |

### Focus Management

1. When menu opens: Auto-focus first enabled item
2. When menu closes: Return focus to trigger
3. Focus trap: Tab wraps around menu items
4. Focus visible indicators for keyboard users
5. Skip disabled items during keyboard navigation

### Screen Reader Announcements

- Trigger announces: "Button, has popup menu"
- When opened: "Menu, {item count} items"
- Each item: "Menu item, {label}"
- Disabled items: "Menu item, {label}, disabled"
- Switch items: "Switch, {label}, {checked/unchecked}"

---

## Responsive Behavior

### Mobile (< 640px)

- Max width: `calc(100vw - 32px)` (16px padding each side)
- Max height: `calc(100vh - 32px)` (16px padding each side)
- Touch targets: Minimum 44px height (already met)
- Scrolling: Smooth scroll with momentum

### Desktop

- Max width: As specified in size variants
- Max height: 400px
- Hover interactions enabled
- Keyboard navigation fully supported

---

## Performance Guidelines

1. **Portal Rendering**: Content rendered in portal to avoid z-index issues
2. **Conditional Rendering**: Closed menus don't render content
3. **Position Calculation**: Use `useLayoutEffect` to prevent flash
4. **Event Delegation**: Keyboard navigation uses delegation for efficiency
5. **Scroll Optimization**: Throttle scroll position updates

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback for browsers without Portal support
- CSS Grid and Flexbox required
- CSS Custom Properties required

---

## Print Styles

```css
@media print {
  .dropdown-menu-content {
    display: none;
  }
}
```

Dropdown menus are hidden in print view as they're interactive elements.

---

## Testing Checklist

### Functional Tests

- [ ] Opens and closes with click
- [ ] Opens with keyboard (Enter/Space)
- [ ] Closes with Escape
- [ ] Closes on click outside
- [ ] Arrow keys navigate items
- [ ] Enter/Space activates items
- [ ] Disabled items are skipped
- [ ] Submenus open on hover (level > 0)
- [ ] Submenus open with ArrowRight
- [ ] Position adjusts for viewport boundaries

### Visual Tests

- [ ] Proper spacing and alignment
- [ ] Correct colors in light/dark mode
- [ ] Smooth animations
- [ ] Focus indicators visible
- [ ] Icons properly sized
- [ ] Shortcuts properly aligned
- [ ] Switch toggle animates correctly

### Accessibility Tests

- [ ] Screen reader announces correctly
- [ ] Keyboard navigation works
- [ ] Focus management correct
- [ ] ARIA attributes present
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets at least 44px

---

## Related Design Patterns

- **Radix UI**: Dropdown Menu patterns
- **Material UI**: Menu component
- **Headless UI**: Menu patterns
- **Ariakit**: Menu component

---

## Version History

- **v1.0.0** (2026-01-30): Initial design specification
