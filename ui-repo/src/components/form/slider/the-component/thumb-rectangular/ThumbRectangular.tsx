/**
 * Slider ThumbRectangular - Rectangular thumb variant
 *
 * AI Hints:
 * - Used by default for range mode (range=true)
 * - Renders role="slider" with rectangular border-radius (4px)
 * - Receives size/disabled via props for self-styling (data-size, data-disabled)
 *
 * AI COLOR GUIDANCE:
 * Use design tokens in styles.module.scss - var(--chart-black-alpha-0-hex), var(--use-border-prime)
 * DO NOT use hardcoded hex values.
 *
 * Modification Guide:
 * - To change rectangular appearance: Modify thumb-rectangular/styles.module.scss
 * - To change props: Modify SliderThumbProps in types.ts
 */

import React from 'react';
import styles from './styles.module.scss';
import type { SliderThumbProps } from '../types';
import { HoverOverlay } from '../../../../shared/hover-overlay';

// ============ COMPONENT ============

export const SliderThumbRectangular: React.FC<SliderThumbProps> = ({
  leftPercent,
  size = 'medium',
  disabled = false,
  ariaValuemin,
  ariaValuemax,
  ariaValuenow,
  ariaValuetext,
  ariaLabel,
  ariaLabelledby,
  onPointerDown,
  onKeyDown,
  children,
}) => {
  return (
    <div
      role="slider"
      aria-valuemin={ariaValuemin}
      aria-valuemax={ariaValuemax}
      aria-valuenow={ariaValuenow}
      aria-valuetext={ariaValuetext}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={styles.thumb}
      data-size={size}
      data-disabled={disabled}
      style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <HoverOverlay disabled={disabled} />
      {children}
    </div>
  );
};

SliderThumbRectangular.displayName = 'Slider.ThumbRectangular';
