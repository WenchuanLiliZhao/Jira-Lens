/**
 * Label Component
 *
 * A flexible label component for displaying status indicators, tags, and badges.
 * Supports direct color control for text and background, with optional icons.
 *
 * AI Hints:
 * - Use textColor and backgroundColor props for custom colors
 * - Supports both startIcon and endIcon simultaneously
 * - Default size is 'medium' with 24px height
 * - Use 'filled' variant for solid backgrounds, 'outlined' for borders
 *
 * Modification Guide:
 * - To add new prop: Modify LabelProps interface
 * - To modify design variants: Modify size/variant type definitions
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import { Icon } from "../../icon";
import styles from "./styles.module.scss";
import { HoverOverlay } from "../../../shared/hover-overlay";

// ============ TYPES ============

export type LabelSize = "small" | "medium" | "large";
export type LabelVariant = "filled" | "outlined";

export interface LabelProps {
  /**
   * The content of the label
   */
  children: React.ReactNode;

  /**
   * Direct text color (CSS color value or CSS variable from color.scss)
   * @example "var(--chart-rainbow-blue-100)" or "#1364E6"
   */
  textColor?: string;

  /**
   * Direct background color (CSS color value or CSS variable from color.scss)
   * @example "var(--chart-rainbow-blue-20)" or "rgba(19, 100, 230, 0.2)"
   */
  backgroundColor?: string;

  /**
   * Border color for outlined variant (CSS color value or CSS variable)
   * @default Falls back to textColor if not specified
   */
  borderColor?: string;

  /**
   * The size of the label
   * @default "medium"
   */
  size?: LabelSize;

  /**
   * The visual style variant
   * @default "filled"
   */
  variant?: LabelVariant;

  /**
   * Material icon name to display on the left
   * @example "check", "info", "star"
   */
  startIcon?: string;

  /**
   * Material icon name to display on the right
   * @example "cancel", "arrow_forward", "close"
   */
  endIcon?: string;

  /**
   * Callback when remove icon is clicked
   * If provided without endIcon, automatically shows 'cancel' icon
   */
  onRemove?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

// ============ COMPONENT ============

export const Label: React.FC<LabelProps> = ({
  children,
  textColor,
  backgroundColor,
  borderColor,
  size = "medium",
  variant = "filled",
  startIcon,
  endIcon,
  onRemove,
  className,
}) => {
  // If onRemove is provided without endIcon, use 'cancel' icon
  const effectiveEndIcon = endIcon || (onRemove ? "cancel" : undefined);

  // Build className string
  const classNames = [
    styles["label"],
    styles[`label--size-${size}`],
    styles[`label--variant-${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Build inline styles for custom colors
  const inlineStyles: React.CSSProperties = {};
  
  if (textColor) {
    inlineStyles.color = textColor;
  }
  
  if (variant === "filled" && backgroundColor) {
    inlineStyles.backgroundColor = backgroundColor;
  }
  
  if (variant === "outlined") {
    inlineStyles.borderColor = borderColor || textColor;
  }

  // Handle remove icon click
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <span className={classNames} style={inlineStyles}>
      {startIcon && (
        <span className={styles["label__icon"]}>
          <Icon icon={startIcon} />
        </span>
      )}
      
      <span className={styles["label__text"]}>{children}</span>
      
      {effectiveEndIcon && (
        <span 
          className={styles["label__icon"]}
          onClick={onRemove ? handleRemoveClick : undefined}
          style={onRemove ? { cursor: 'pointer' } : undefined}
        >
          <Icon icon={effectiveEndIcon} />
        </span>
      )}

      <HoverOverlay />
    </span>
  );
};

Label.displayName = "Label";
