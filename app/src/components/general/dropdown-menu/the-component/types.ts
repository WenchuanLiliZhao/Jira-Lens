/**
 * Dropdown Menu Component Types
 */

import React from 'react';

// ============ MAIN COMPONENT TYPES ============

export interface DropdownMenuProps {
  /** Component content */
  children: React.ReactNode;
  
  /** Controlled open state */
  open?: boolean;
  
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean;
  
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  
  /** Whether the menu is disabled */
  disabled?: boolean;
  
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  
  /** Whether to block background interaction (modal mode) */
  modal?: boolean;
}

export interface DropdownMenuTriggerProps {
  /** Trigger content */
  children: React.ReactNode;
  
  /** Pass props to child element instead of wrapping */
  asChild?: boolean;
  
  /** Custom class name */
  className?: string;
}

export interface DropdownMenuContentProps {
  /** Menu items */
  children: React.ReactNode;
  
  /** Alignment relative to trigger */
  align?: 'start' | 'center' | 'end';
  
  /** Side to position the menu */
  side?: 'top' | 'bottom' | 'left' | 'right';
  
  /** Offset from trigger in pixels */
  sideOffset?: number;

  /** Whether to automatically flip when colliding with viewport edges */
  avoidCollisions?: boolean;

  /** Portal container element. When provided (e.g. fullscreen element), menu renders inside it instead of document.body */
  container?: HTMLElement | null;

  /** Custom class name */
  className?: string;
  
  /** Additional props */
  [key: string]: unknown;
}

// ============ MENU ITEM TYPES ============

export interface DropdownMenuItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Item content */
  children: React.ReactNode;
  
  /** Whether the item is disabled */
  disabled?: boolean;
  
  /** Callback when item is selected (click or keyboard activation) */
  onSelect?: (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
  
  /** Custom class name */
  className?: string;
}

export interface DropdownMenuGroupProps {
  /** Group content */
  children: React.ReactNode;
  
  /** Custom class name */
  className?: string;
}

export interface DropdownMenuLabelProps {
  /** Label content */
  children: React.ReactNode;
  
  /** Custom class name */
  className?: string;
}

export interface DropdownMenuSeparatorProps {
  /** Custom class name */
  className?: string;
}

// ============ PREBUILT COMPONENT TYPES ============

export interface DropdownMenuItemButtonProps {
  /** Button label text */
  label: string;
  
  /** Icon name */
  icon?: string;
  
  /** Whether this item is currently active/selected */
  active?: boolean;
  
  /** Whether the button is disabled */
  disabled?: boolean;
  
  /** Callback when button is clicked */
  onSelect?: () => void;
  
  /** Custom class name */
  className?: string;
}

export interface DropdownMenuItemWithShortcutProps {
  /** Item label */
  label: string;
  
  /** Icon name */
  icon?: string;
  
  /** Keyboard shortcut display (e.g., "⌘S", "Ctrl+C") */
  shortcut: string;
  
  /** Whether the item is disabled */
  disabled?: boolean;
  
  /** Callback when item is selected */
  onSelect?: () => void;
  
  /** Custom class name */
  className?: string;
}

export interface DropdownMenuItemWithSwitchProps {
  /** Switch label */
  label: string;
  
  /** Whether the switch is checked */
  checked: boolean;
  
  /** Callback when checked state changes */
  onCheckedChange: (checked: boolean) => void;
  
  /** Whether the switch is disabled */
  disabled?: boolean;
  
  /** Custom class name */
  className?: string;
}

// ============ CONTEXT TYPES ============

export interface DropdownMenuContextValue {
  /** Whether the menu is open */
  isOpen: boolean;
  
  /** Function to close the menu */
  closeMenu: () => void;
  
  /** Function to toggle the menu */
  toggleMenu: () => void;
  
  /** Schedule a delayed close (for hover behavior on nested menus) */
  scheduleClose: (delay?: number) => void;
  
  /** Cancel any scheduled close */
  cancelScheduledClose: () => void;
  
  /** Size variant */
  size: 'small' | 'medium' | 'large';
  
  /** Whether the menu is disabled */
  disabled: boolean;
  
  /** Nesting level (0 for root menu) */
  level: number;
  
  /** Trigger element ref */
  triggerRef: React.RefObject<HTMLElement | null> | null;
  
  /** Content element ref */
  contentRef: React.RefObject<HTMLElement | null> | null;
  
  /** Register a trigger ref */
  setTriggerRef: (ref: React.RefObject<HTMLElement | null>) => void;
  
  /** Register a content ref */
  setContentRef: (ref: React.RefObject<HTMLElement | null>) => void;
}
