/**
 * Slider Component Types
 */

import React from 'react';

// ============ THUMB PROPS ============

export interface SliderThumbProps {
  leftPercent: number;
  /** For thumb self-styling via data-size (no parent .slider[data-size] selector) */
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  ariaValuemin: number;
  ariaValuemax: number;
  ariaValuenow: number;
  ariaValuetext?: string;
  ariaLabel?: string;
  ariaLabelledby?: string;
  onPointerDown: (e: React.PointerEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  children?: React.ReactNode;
}

// ============ SLIDER PROPS ============

interface SliderBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> {
  /** Component content */
  children?: React.ReactNode;

  /** Design variant */
  variant?: 'default' | 'primary' | 'secondary';

  /** Size */
  size?: 'small' | 'medium' | 'large';

  /** Whether component is disabled */
  disabled?: boolean;

  /** Thumb shape: circular (default for single), rectangular (default for range). Override with thumbVariant. */
  thumbVariant?: 'circular' | 'rectangular';

  /** Custom class name */
  className?: string;

  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /** Step increment */
  step?: number;

  /** Accessible label for screen readers */
  'aria-label'?: string;

  /** ID of element that labels the slider */
  'aria-labelledby'?: string;
}

export interface SliderSingleProps extends SliderBaseProps {
  /** Single-value mode (default) */
  range?: false;

  /** Current value (single) */
  value?: number;

  /** Default value (single) */
  defaultValue?: number;

  /** Value change callback (single) */
  onChange?: (value: number) => void;
}

export interface SliderRangeProps extends SliderBaseProps {
  /** Range mode with two thumbs */
  range: true;

  /** Current value [min, max] */
  value?: [number, number];

  /** Default value [min, max] */
  defaultValue?: [number, number];

  /** Value change callback (range) */
  onChange?: (value: [number, number]) => void;
}

export type SliderProps = SliderSingleProps | SliderRangeProps;
