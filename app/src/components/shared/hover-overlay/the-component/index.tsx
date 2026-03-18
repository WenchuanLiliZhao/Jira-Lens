/**
 * HoverOverlay Component
 * 
 * A reusable overlay component that provides consistent hover and active states
 * for interactive elements. Uses currentColor and opacity for theming flexibility.
 * 
 * Usage:
 * ```tsx
 * <div style={{ position: 'relative', color: 'blue' }}>
 *   <span>Button Content</span>
 *   <HoverOverlay disabled={false} />
 * </div>
 * ```
 */

import React from 'react';
import styles from './styles.module.scss';
import type { HoverOverlayProps } from './types';

export const HoverOverlay: React.FC<HoverOverlayProps> = ({
  disabled = false,
  color,
  className,
}) => {
  // Don't render if disabled
  if (disabled) {
    return null;
  }

  // Build inline styles only if color is specified
  const inlineStyles: React.CSSProperties | undefined = color
    ? { backgroundColor: color }
    : undefined;

  const overlayClassName = [
    styles['hover-overlay'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div 
      className={overlayClassName}
      style={inlineStyles}
      aria-hidden="true"
    />
  );
};

HoverOverlay.displayName = 'HoverOverlay';

// Re-export types
export type { HoverOverlayProps } from './types';
