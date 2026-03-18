/**
 * DropdownMenu Component - Main Export
 * 
 * A flexible dropdown menu component with support for:
 * - Custom and prebuilt menu items
 * - Keyboard navigation
 * - Nested submenus
 * - Controlled and uncontrolled modes
 * 
 * Usage:
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenu.Trigger>
 *     <Button>Open Menu</Button>
 *   </DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <DropdownMenu.ItemButton label="Edit" icon="edit" onSelect={handleEdit} />
 *     <DropdownMenu.ItemButton label="Delete" icon="delete" onSelect={handleDelete} />
 *   </DropdownMenu.Content>
 * </DropdownMenu>
 * ```
 */

import { DropdownMenu as DropdownMenuRoot } from './Component';
import { DropdownMenuTrigger } from './trigger';
import { DropdownMenuContent } from './content';
import { DropdownMenuItem } from './item';
import { DropdownMenuGroup } from './group';
import { DropdownMenuSeparator } from './separator';
import { DropdownMenuLabel } from './label';
import { ItemButton } from './prebuilt/ItemButton';
import { ItemWithShortcut } from './prebuilt/ItemWithShortcut';
import { ItemWithSwitch } from './prebuilt/ItemWithSwitch';

// ============ COMPOUND COMPONENT ============

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
  ItemButton: ItemButton,
  ItemWithShortcut: ItemWithShortcut,
  ItemWithSwitch: ItemWithSwitch,
});

// ============ TYPE EXPORTS ============

export type {
  DropdownMenuProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuGroupProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuItemButtonProps,
  DropdownMenuItemWithShortcutProps,
  DropdownMenuItemWithSwitchProps,
} from './types';
