/**
 * DropdownMenu Label Component
 * 
 * Non-interactive text label or paragraph in the menu
 */

import React from 'react';
import type { DropdownMenuLabelProps } from './types';
import styles from './styles.module.scss';

// ============ COMPONENT ============

export const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({
  children,
  className,
}) => {
  const labelClassName = [
    styles['dropdown-menu-label'],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div
      className={labelClassName}
      role="presentation"
    >
      {children}
    </div>
  );
};

DropdownMenuLabel.displayName = 'DropdownMenuLabel';
