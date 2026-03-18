/**
 * Spinner Component
 *
 * A loading spinner component with smooth rotation animation.
 * Supports different sizes and can be customized with colors.
 *
 * AI Hints:
 * - Use for indicating loading states in buttons, inputs, or containers
 * - Supports small (16px), medium (24px), and large (32px) sizes
 * - Can be customized with borderColor and topColor props
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 *
 * Modification Guide:
 * - To add new prop: Modify SpinnerProps interface
 * - To modify design variants: Modify design-related interfaces
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import styles from "./styles.module.scss";

// ============ TYPES ============

export interface SpinnerProps {
  /** Spinner size */
  size?: 'small' | 'medium' | 'large';
  /** Custom border color (default: --use-border-prime) */
  borderColor?: string;
  /** Custom top/active color (default: --use-text-prime) */
  topColor?: string;
  /** Custom class name */
  className?: string;
  /** Aria label for accessibility */
  'aria-label'?: string;
  /** If true, spinner will be absolutely positioned and centered (requires parent with position: relative) */
  absolute?: boolean;
}

// ============ COMPONENT ============

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  borderColor,
  topColor,
  className,
  'aria-label': ariaLabel = 'Loading',
  absolute = false,
}) => {
  const sizeClass = styles[`spinner--${size}`];
  const combinedClassName = [
    styles.spinner,
    sizeClass,
    className,
  ].filter(Boolean).join(' ');

  const spinnerStyle: React.CSSProperties = {};
  if (borderColor) {
    spinnerStyle.borderColor = borderColor;
  }
  if (topColor) {
    spinnerStyle.borderTopColor = topColor;
  }

  const spinnerElement = (
    <div
      className={combinedClassName}
      style={spinnerStyle}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    />
  );

  // Wrap in absolute positioning container if absolute prop is true
  if (absolute) {
    return (
      <div className={styles['spinner-wrapper']}>
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

Spinner.displayName = "Spinner";
