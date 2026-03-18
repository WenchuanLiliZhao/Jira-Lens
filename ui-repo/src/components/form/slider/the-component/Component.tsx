/**
 * Slider Component - Main Implementation
 *
 * AI Hints:
 * - Use range={false} (default) for single value (volume, brightness)
 * - Use range={true} for range selection (price, date range)
 * - Keyboard: Arrow keys, Home, End for thumb movement
 *
 * AI COLOR GUIDANCE:
 * Use design tokens in styles - var(--use-*), var(--chart-rainbow-blue-100)
 * DO NOT use hardcoded hex values.
 *
 * Modification Guide:
 * - To add new prop: Modify SliderProps in types.ts
 * - To change UI/layout: Modify ComponentContent and styles.module.scss
 */

import React from 'react';
import styles from './styles.module.scss';
import type { SliderProps } from './types';
import { SliderContent } from './ComponentContent';

// ============ COMPONENT ============

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (props, ref) => {
    const {
      children,
      variant = 'default',
      size = 'medium',
      disabled = false,
      thumbVariant,
      range = false,
      value,
      defaultValue,
      min,
      max,
      step,
      onChange,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...restProps
    } = props;

    // Build className
    const componentClassName = [
      styles.slider,
      className,
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={componentClassName}
        data-variant={variant}
        data-size={size}
        data-disabled={disabled}
        data-range={range}
        {...restProps}
      >
        <SliderContent
          range={range}
          value={value}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          size={size}
          thumbVariant={thumbVariant}
          onChange={onChange}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        >
          {children}
        </SliderContent>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
