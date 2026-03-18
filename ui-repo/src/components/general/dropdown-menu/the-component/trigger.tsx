/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * DropdownMenu Trigger Component
 * 
 * Trigger element that opens/closes the dropdown menu
 */

import React, { useRef, useEffect } from 'react';
import { useDropdownMenuContext } from './context';
import type { DropdownMenuTriggerProps } from './types';

// ============ COMPONENT ============

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  asChild = false,
  className,
}) => {
  const context = useDropdownMenuContext();
  const { 
    isOpen, 
    toggleMenu, 
    scheduleClose, 
    cancelScheduledClose, 
    disabled, 
    level, 
    setTriggerRef 
  } = context;
  
  const triggerRef = useRef<HTMLElement>(null);
  
  // Register ref with context (only once on mount)
  useEffect(() => {
    setTriggerRef(triggerRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // ============ EVENT HANDLERS ============
  
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled) return;
    
    // Only handle clicks for root level (level === 0)
    // Nested menus use hover
    if (level === 0) {
      toggleMenu();
    }
  };
  
  const handleMouseEnter = () => {
    if (disabled) return;
    
    // Only open on hover for nested menus (level > 0)
    if (level > 0) {
      // Cancel any pending close
      cancelScheduledClose();
      
      // Open immediately on hover for nested menus
      if (!isOpen) {
        toggleMenu();
      }
    }
  };
  
  const handleMouseLeave = () => {
    if (disabled) return;
    
    // Only handle hover for nested menus (level > 0)
    if (level > 0 && isOpen) {
      // Schedule close with a delay to allow mouse to move to content
      scheduleClose(150);
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    // Handle keyboard activation
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    }
    
    // Arrow down opens menu and focuses first item
    if (event.key === 'ArrowDown' && !isOpen) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    }
    
    // Arrow right opens submenu (if this is a submenu trigger)
    if (event.key === 'ArrowRight' && level > 0 && !isOpen) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    }
    
    // Arrow left closes submenu
    if (event.key === 'ArrowLeft' && level > 0 && isOpen) {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    }
  };
  
  // ============ RENDER ============
  
  const buttonProps = {
    ref: triggerRef as React.RefObject<HTMLButtonElement>,
    type: 'button' as const,
    className,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    'aria-haspopup': 'true' as const,
    'data-state': isOpen ? 'open' : 'closed',
    'data-disabled': disabled,
    'data-level': level,
    disabled,
    children,
  };

  // If asChild, merge props with single child
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: triggerRef,
      onClick: (e: React.MouseEvent) => {
        handleClick(e);
        (children as any).props?.onClick?.(e);
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        handleKeyDown(e);
        (children as any).props?.onKeyDown?.(e);
      },
      onMouseEnter: (e: React.MouseEvent) => {
        handleMouseEnter();
        (children as any).props?.onMouseEnter?.(e);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        handleMouseLeave();
        (children as any).props?.onMouseLeave?.(e);
      },
      'aria-haspopup': 'true',
      'aria-expanded': isOpen ? 'true' : 'false',
      'data-state': isOpen ? 'open' : 'closed',
      'data-disabled': disabled,
      'data-level': level,
    });
  }

  // Use literal "true"/"false" for aria-expanded so ARIA linters accept the value
  return isOpen ? (
    <button {...buttonProps} aria-expanded="true" />
  ) : (
    <button {...buttonProps} aria-expanded="false" />
  );
};

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';
