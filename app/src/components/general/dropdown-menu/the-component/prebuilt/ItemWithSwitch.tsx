/**
 * DropdownMenu ItemWithSwitch Component
 * 
 * Prebuilt menu item with label and toggle switch
 * Uses the standalone ToggleSwitch component wrapped in DropdownMenuItem
 */

import React from 'react';
import { DropdownMenuItem } from '../item';
import { ToggleSwitch } from '../../../toggle-switch';
import type { DropdownMenuItemWithSwitchProps } from '../types';
import styles from '../styles.module.scss';

// ============ COMPONENT ============

export const ItemWithSwitch: React.FC<DropdownMenuItemWithSwitchProps> = ({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}) => {
  const itemClassName = [
    styles['dropdown-menu-item-with-switch'],
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  const handleSelect = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
    // Prevent default menu close behavior
    event.preventDefault();
    event.stopPropagation();
    
    // Toggle the switch
    onCheckedChange(!checked);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Prevent space from closing menu (let it toggle the switch)
    if (event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      onCheckedChange(!checked);
    }
  };
  
  // Handle clicks and keyboard events on the ToggleSwitch to prevent double-toggling
  // We wrap ToggleSwitch and stop propagation so the menu item's handlers don't fire
  // The ToggleSwitch's internal handlers will call onCheckedChange directly
  const handleSwitchWrapperInteraction = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Stop propagation to prevent DropdownMenuItem's handlers from firing
    // This prevents double-toggling - only ToggleSwitch's handler will fire
    e.stopPropagation();
  };
  
  return (
    <DropdownMenuItem
      disabled={disabled}
      onSelect={handleSelect}
      onKeyDown={handleKeyDown}
      className={itemClassName}
    >
      <div 
        onClick={handleSwitchWrapperInteraction}
        onKeyDown={handleSwitchWrapperInteraction}
      >
        <ToggleSwitch
          label={label}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
    </DropdownMenuItem>
  );
};

ItemWithSwitch.displayName = 'DropdownMenuItemWithSwitch';
