/**
 * DropdownMenu Group Component
 * 
 * Groups related menu items together
 */

import React from 'react';
import type { DropdownMenuGroupProps } from './types';
import styles from './styles.module.scss';

// ============ COMPONENT ============

export const DropdownMenuGroup: React.FC<DropdownMenuGroupProps> = ({
  children,
  className,
}) => {
  const groupClassName = [
    styles['dropdown-menu-group'],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div
      role="group"
      className={groupClassName}
    >
      {children}
    </div>
  );
};

DropdownMenuGroup.displayName = 'DropdownMenuGroup';
