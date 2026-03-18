/**
 * DropdownMenu Component - Main Container
 * 
 * A flexible dropdown menu system that supports complex menu structures
 * including nested submenus, custom items, and various prebuilt components.
 * 
 * AI Hints:
 * - Use DropdownMenu.Item for completely custom content
 * - Use prebuilt components (ItemButton, ItemWithShortcut) for common patterns
 * - Supports recursive nesting for submenus
 * - Automatically manages focus, positioning, and keyboard navigation
 * 
 * Modification Guide:
 * - To add new props: Modify DropdownMenuProps in types.ts
 * - To modify state logic: Update this component
 * - To add new sub-components: Create in separate files and export from index.tsx
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { DropdownMenuProvider, useOptionalDropdownMenuContext } from './context';
import { useControllableState } from './hooks';
import type { DropdownMenuProps } from './types';

// ============ COMPONENT ============

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  size = 'medium',
  modal: _modal = false,
}) => {
  // ============ STATE MANAGEMENT ============
  
  // Use controllable state pattern (can be controlled or uncontrolled)
  const [isOpen, setIsOpen] = useControllableState(
    controlledOpen,
    defaultOpen,
    onOpenChange
  );
  
  // Refs for trigger and content
  const [triggerRef, setTriggerRef] = useState<React.RefObject<HTMLElement | null> | null>(null);
  const [contentRef, setContentRef] = useState<React.RefObject<HTMLElement | null> | null>(null);
  
  // Timer ref for delayed close on hover (for nested menus)
  const closeTimerRef = useRef<number | null>(null);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);
  
  // ============ NESTING SUPPORT ============
  
  // Check if this menu is nested inside another menu
  const parentContext = useOptionalDropdownMenuContext();
  const level = parentContext ? parentContext.level + 1 : 0;
  
  // ============ HANDLERS ============
  
  const closeMenu = useCallback(() => {
    if (!disabled) {
      setIsOpen(false);
    }
  }, [disabled, setIsOpen]);
  
  const toggleMenu = useCallback(() => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  }, [disabled, isOpen, setIsOpen]);
  
  // Schedule a delayed close (for hover behavior on nested menus)
  const scheduleClose = useCallback((delay: number = 150) => {
    // Clear any existing timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    
    // Schedule close
    closeTimerRef.current = window.setTimeout(() => {
      closeMenu();
      closeTimerRef.current = null;
    }, delay);
  }, [closeMenu]);
  
  // Cancel any scheduled close
  const cancelScheduledClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);
  
  // ============ CONTEXT VALUE ============
  
  const contextValue = useMemo(
    () => ({
      isOpen,
      closeMenu,
      toggleMenu,
      scheduleClose,
      cancelScheduledClose,
      size,
      disabled,
      level,
      triggerRef,
      contentRef,
      setTriggerRef,
      setContentRef,
    }),
    [isOpen, closeMenu, toggleMenu, scheduleClose, cancelScheduledClose, size, disabled, level, triggerRef, contentRef]
  );
  
  // ============ RENDER ============
  
  return (
    <DropdownMenuProvider value={contextValue}>
      {children}
    </DropdownMenuProvider>
  );
};

DropdownMenu.displayName = 'DropdownMenu';
