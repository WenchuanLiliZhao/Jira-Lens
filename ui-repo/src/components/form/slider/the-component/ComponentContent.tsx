/**
 * SliderContent - Content Rendering Logic
 *
 * AI Hints:
 * - Single mode: one thumb, value is number
 * - Range mode: two thumbs, value is [min, max]
 * - Keyboard: Arrow keys, Home, End for thumb movement
 *
 * AI COLOR GUIDANCE:
 * Use design tokens in styles.module.scss - var(--slider-*), var(--use-*), var(--chart-rainbow-blue-100)
 * DO NOT use hardcoded hex values.
 *
 * Modification Guide:
 * - To change value/range logic: Modify state and handlers
 * - To change layout: Modify JSX structure and styles
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import styles from './styles.module.scss';
import { SliderThumbCircular } from './thumb-circular/ThumbCircular';
import { SliderThumbRectangular } from './thumb-rectangular/ThumbRectangular';

// ============ TYPES ============

interface SliderContentProps {
  children?: React.ReactNode;
  range?: boolean;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  thumbVariant?: 'circular' | 'rectangular';
  onChange?: ((value: number) => void) | ((value: [number, number]) => void);
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

// ============ HELPERS ============

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function roundToStep(value: number, min: number, max: number, step: number): number {
  const steps = Math.round((value - min) / step);
  return clamp(min + steps * step, min, max);
}

// ============ COMPONENT ============

export const SliderContent: React.FC<SliderContentProps> = ({
  children,
  range = false,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'medium',
  thumbVariant,
  onChange,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const resolvedThumb = thumbVariant ?? (range ? 'rectangular' : 'circular');
  const ThumbComponent = resolvedThumb === 'rectangular' ? SliderThumbRectangular : SliderThumbCircular;
  const trackRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<'min' | 'max' | 'single' | null>(null);
  const pointerUpHandlerRef = useRef<((e: PointerEvent) => void) | null>(null);
  const dragOffsetRef = useRef<number>(0);

  const mid = (min + max) / 2;
  const defaultSingle = defaultValue !== undefined && typeof defaultValue === 'number'
    ? defaultValue
    : mid;
  const defaultRange: [number, number] = Array.isArray(defaultValue)
    ? [clamp(defaultValue[0], min, max), clamp(defaultValue[1], min, max)]
    : [min, max];

  const [internalValue, setInternalValue] = useState(defaultSingle);
  const [internalRange, setInternalRange] = useState<[number, number]>(defaultRange);

  const isControlled = value !== undefined;
  const currentSingle = isControlled && !range ? (value as number) : internalValue;
  const [currentMin, currentMax] = isControlled && range
    ? (value as [number, number])
    : internalRange;

  const valueToPercent = useCallback((v: number) => ((v - min) / (max - min)) * 100, [min, max]);
  const percentToValue = useCallback((p: number) => {
    const v = min + (p / 100) * (max - min);
    return roundToStep(v, min, max, step);
  }, [min, max, step]);

  const getValueFromClientX = useCallback((clientX: number): number => {
    const track = trackRef.current;
    if (!track) return currentSingle;
    const rect = track.getBoundingClientRect();
    const percent = ((clientX - rect.left) / rect.width) * 100;
    return percentToValue(percent);
  }, [percentToValue, currentSingle]);

  const notifyChange = useCallback((v: number | [number, number]) => {
    onChange?.(v as number & [number, number]);
  }, [onChange]);

  const setSingleValue = useCallback((v: number) => {
    const clamped = clamp(roundToStep(v, min, max, step), min, max);
    if (!isControlled) setInternalValue(clamped);
    notifyChange(clamped);
  }, [min, max, step, isControlled, notifyChange]);

  const setRangeValue = useCallback((low: number, high: number) => {
    const a = clamp(roundToStep(low, min, max, step), min, max);
    const b = clamp(roundToStep(high, min, max, step), min, max);
    const [lo, hi] = a <= b ? [a, b] : [b, a];
    if (!isControlled) setInternalRange([lo, hi]);
    notifyChange([lo, hi]);
  }, [min, max, step, isControlled, notifyChange]);

  // Drag handling - thumb maintains offset from cursor (no jump on grab)
  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (activeThumbRef.current === null || disabled) return;
    const cursorValue = getValueFromClientX(e.clientX);
    const v = cursorValue - dragOffsetRef.current;

    if (activeThumbRef.current === 'single') {
      setSingleValue(v);
    } else if (activeThumbRef.current === 'min') {
      setRangeValue(v, currentMax);
    } else {
      setRangeValue(currentMin, v);
    }
  }, [disabled, getValueFromClientX, setSingleValue, setRangeValue, currentMin, currentMax]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (e.target) (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    activeThumbRef.current = null;
    window.removeEventListener('pointermove', handlePointerMove as EventListener);
    const handler = pointerUpHandlerRef.current;
    if (handler) window.removeEventListener('pointerup', handler);
  }, [handlePointerMove]);

  useEffect(() => {
    pointerUpHandlerRef.current = handlePointerUp;
  });

  const handlePointerDown = useCallback((which: 'min' | 'max' | 'single') => (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    const cursorValue = getValueFromClientX(e.clientX);
    if (which === 'single') {
      dragOffsetRef.current = cursorValue - currentSingle;
    } else if (which === 'min') {
      dragOffsetRef.current = cursorValue - currentMin;
    } else {
      dragOffsetRef.current = cursorValue - currentMax;
    }
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    activeThumbRef.current = which;
    window.addEventListener('pointermove', handlePointerMove as EventListener);
    window.addEventListener('pointerup', pointerUpHandlerRef.current!);
  }, [disabled, getValueFromClientX, currentSingle, currentMin, currentMax, handlePointerMove]);

  // Track click (jump thumb to click position)
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    // Ignore clicks from thumb - e.g. after drag release, click bubbles to track
    if ((e.target as HTMLElement).closest('[role="slider"]')) return;
    const v = getValueFromClientX(e.clientX);
    if (range) {
      const distToMin = Math.abs(v - currentMin);
      const distToMax = Math.abs(v - currentMax);
      if (distToMin <= distToMax) {
        setRangeValue(v, currentMax);
      } else {
        setRangeValue(currentMin, v);
      }
    } else {
      setSingleValue(v);
    }
  }, [disabled, range, getValueFromClientX, currentMin, currentMax, setSingleValue, setRangeValue]);

  // Keyboard
  const handleKeyDown = useCallback((which: 'min' | 'max' | 'single') => (e: React.KeyboardEvent) => {
    if (disabled) return;
    const stepAmount = step;
    let delta = 0;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -stepAmount;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = stepAmount;
    else if (e.key === 'Home') delta = -Infinity;
    else if (e.key === 'End') delta = Infinity;
    else return;

    e.preventDefault();

    if (which === 'single') {
      const next = delta === -Infinity ? min : delta === Infinity ? max : currentSingle + delta;
      setSingleValue(next);
    } else if (which === 'min') {
      const next = delta === -Infinity ? min : delta === Infinity ? currentMax : currentMin + delta;
      setRangeValue(next, currentMax);
    } else {
      const next = delta === -Infinity ? currentMin : delta === Infinity ? max : currentMax + delta;
      setRangeValue(currentMin, next);
    }
  }, [disabled, step, min, max, currentSingle, currentMin, currentMax, setSingleValue, setRangeValue]);

  if (range) {
    return (
      <div className={styles.slider__track} ref={trackRef} onClick={handleTrackClick}>
        <div
          className={styles['slider__track-fill']}
          style={{
            left: `${valueToPercent(currentMin)}%`,
            width: `${valueToPercent(currentMax) - valueToPercent(currentMin)}%`,
          }}
        />
        <ThumbComponent
          leftPercent={valueToPercent(currentMin)}
          size={size}
          disabled={disabled}
          ariaValuemin={min}
          ariaValuemax={max}
          ariaValuenow={currentMin}
          ariaValuetext={`${currentMin} to ${currentMax}`}
          ariaLabel={ariaLabel}
          ariaLabelledby={ariaLabelledBy}
          onPointerDown={handlePointerDown('min')}
          onKeyDown={handleKeyDown('min')}
        />
        <ThumbComponent
          leftPercent={valueToPercent(currentMax)}
          size={size}
          disabled={disabled}
          ariaValuemin={min}
          ariaValuemax={max}
          ariaValuenow={currentMax}
          ariaValuetext={`${currentMin} to ${currentMax}`}
          ariaLabel={ariaLabel}
          onPointerDown={handlePointerDown('max')}
          onKeyDown={handleKeyDown('max')}
        />
        {children}
      </div>
    );
  }

  return (
    <div className={styles.slider__track} ref={trackRef} onClick={handleTrackClick}>
      <div
        className={styles['slider__track-fill']}
        style={{ width: `${valueToPercent(currentSingle)}%` }}
      />
      <ThumbComponent
        leftPercent={valueToPercent(currentSingle)}
        size={size}
        disabled={disabled}
        ariaValuemin={min}
        ariaValuemax={max}
        ariaValuenow={currentSingle}
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledBy}
        onPointerDown={handlePointerDown('single')}
        onKeyDown={handleKeyDown('single')}
      />
      {children}
    </div>
  );
};

SliderContent.displayName = 'SliderContent';
