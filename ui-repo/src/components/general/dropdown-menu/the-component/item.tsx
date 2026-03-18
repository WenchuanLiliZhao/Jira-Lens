/**
 * DropdownMenu Item Component
 * 
 * Base menu item component - accepts any children for maximum flexibility
 */

import React, { forwardRef } from 'react';
import { useDropdownMenuContext } from './context';
import { HoverOverlay } from '../../../shared/hover-overlay';
import type { DropdownMenuItemProps } from './types';
import styles from './styles.module.scss';

// ============ COMPONENT ============

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(({
  children,
  disabled = false,
  onSelect,
  className,
  onClick,
  onKeyDown,
  ...rest
}, ref) => {
  const context = useDropdownMenuContext();
  const { closeMenu } = context;
  
  // ============ EVENT HANDLERS ============
  
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    onClick?.(event);
    
    // Trigger onSelect and close menu
    if (!event.defaultPrevented) {
      onSelect?.(event);
      closeMenu();
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    onKeyDown?.(event);
    
    // Enter or Space activates the item
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      
      if (!event.defaultPrevented) {
        onSelect?.(event);
        closeMenu();
      }
    }
  };
  
  // ============ RENDER ============
  
  const itemClassName = [
    styles['dropdown-menu-item'],
    disabled && styles['dropdown-menu-item--disabled'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const itemProps = {
    ref,
    role: 'menuitem' as const,
    tabIndex: disabled ? -1 : 0,
    className: itemClassName,
    'data-disabled': disabled,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    ...rest,
  };

  // Use literal "true"/"false" for aria-disabled so ARIA linters accept the value
  return disabled ? (
    <div {...itemProps} aria-disabled="true">
      {children}
      <HoverOverlay disabled={disabled} />
    </div>
  ) : (
    <div {...itemProps} aria-disabled="false">
      {children}
      <HoverOverlay disabled={disabled} />
    </div>
  );
});

DropdownMenuItem.displayName = 'DropdownMenuItem';
