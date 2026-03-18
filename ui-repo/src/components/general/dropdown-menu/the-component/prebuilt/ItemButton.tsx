/**
 * DropdownMenu ItemButton Component
 * 
 * Prebuilt menu item with icon and label
 */

import React from 'react';
import { Icon } from '../../../icon';
import { DropdownMenuItem } from '../item';
import type { DropdownMenuItemButtonProps } from '../types';
import styles from '../styles.module.scss';

// ============ COMPONENT ============

export const ItemButton: React.FC<DropdownMenuItemButtonProps> = ({
  label,
  icon,
  active = false,
  disabled = false,
  onSelect,
  className,
}) => {
  const itemClassName = [
    styles['dropdown-menu-item-button'],
    active && styles['dropdown-menu-item-button--active'],
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
      {icon && (
        <span className={styles['dropdown-menu-item-button__icon']}>
          <Icon icon={icon} />
        </span>
      )}
      <span className={styles['dropdown-menu-item-button__label']}>
        {label}
      </span>
      {active && (
        <span className={styles['dropdown-menu-item-button__check']}>
          <Icon icon="check" />
        </span>
      )}
    </DropdownMenuItem>
  );
};

ItemButton.displayName = 'DropdownMenuItemButton';
