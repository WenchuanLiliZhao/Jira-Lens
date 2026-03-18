/**
 * ToggleSwitch Component
 *
 * A standalone toggle switch component with optional label.
 * Can be used anywhere in the UI, not just in dropdown menus.
 *
 * AI Hints:
 * - Use for binary on/off settings and preferences
 * - Label is optional - use when you need descriptive text
 * - Supports keyboard navigation (Space to toggle)
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 *
 * Modification Guide:
 * - To add new prop: Modify ToggleSwitchProps interface
 * - To modify design variants: Modify design-related interfaces
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import styles from "./styles.module.scss";
import { HoverOverlay } from "../../../shared/hover-overlay";

// ============ TYPES ============

export interface ToggleSwitchProps {
  /** Optional label text */
  label?: string;
  
  /** Whether the switch is checked */
  checked: boolean;
  
  /** Callback when checked state changes */
  onCheckedChange: (checked: boolean) => void;
  
  /** Whether the switch is disabled */
  disabled?: boolean;
  
  /** Custom class name */
  className?: string;
}

// ============ COMPONENT ============

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  className,
}) => {
  const containerClassName = [
    styles["toggle-switch"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    
    // Space key toggles the switch
    if (event.key === " ") {
      event.preventDefault();
      onCheckedChange(!checked);
    }
  };

  const ariaLabel = label || "Toggle switch";

  return (
    <div className={containerClassName}>
      {label && (
        <span className={styles["toggle-switch__label"]}>
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel}
        className={styles["toggle-switch__switch"]}
        data-state={checked ? "checked" : "unchecked"}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      >
        <span className={styles["toggle-switch__switch-thumb"]} />
        <HoverOverlay disabled={disabled} />
      </button>
    </div>
  );
};

ToggleSwitch.displayName = "ToggleSwitch";
