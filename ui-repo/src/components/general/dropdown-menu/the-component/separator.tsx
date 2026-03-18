/**
 * DropdownMenu Separator Component
 * 
 * Visual separator between menu items or groups
 */

import React from 'react';
import type { DropdownMenuSeparatorProps } from './types';
import styles from './styles.module.scss';

// ============ COMPONENT ============

export const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({
  className,
}) => {
  const separatorClassName = [
    styles['dropdown-menu-separator'],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={separatorClassName}
    />
  );
};

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';
