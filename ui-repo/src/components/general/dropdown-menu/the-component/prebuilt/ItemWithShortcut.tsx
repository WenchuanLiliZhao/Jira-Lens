/**
 * DropdownMenu ItemWithShortcut Component
 * 
 * Prebuilt menu item with icon, label, and keyboard shortcut display
 */

import React from 'react';
import { Icon } from '../../../icon';
import { DropdownMenuItem } from '../item';
import type { DropdownMenuItemWithShortcutProps } from '../types';
import styles from '../styles.module.scss';

// ============ COMPONENT ============

export const ItemWithShortcut: React.FC<DropdownMenuItemWithShortcutProps> = ({
  label,
  icon,
  shortcut,
  disabled = false,
  onSelect,
  className,
}) => {
  const itemClassName = [
    styles['dropdown-menu-item-with-shortcut'],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <DropdownMenuItem
      disabled={disabled}
      onSelect={onSelect}
      className={itemClassName}
    >
      <div className={styles['dropdown-menu-item-with-shortcut__content']}>
        {icon && (
          <span className={styles['dropdown-menu-item-with-shortcut__icon']}>
            <Icon icon={icon} />
          </span>
        )}
        <span className={styles['dropdown-menu-item-with-shortcut__label']}>
          {label}
        </span>
      </div>
      <kbd className={styles['dropdown-menu-item-with-shortcut__shortcut']}>
        {shortcut}
      </kbd>
    </DropdownMenuItem>
  );
};

ItemWithShortcut.displayName = 'DropdownMenuItemWithShortcut';
