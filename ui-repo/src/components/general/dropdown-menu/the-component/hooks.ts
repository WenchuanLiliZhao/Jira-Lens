/**
 * Dropdown Menu Custom Hooks
 * 
 * Provides utility hooks for positioning, click outside detection, etc.
 */

import { useEffect, useLayoutEffect, useState, useCallback } from 'react';

// ============ TYPES ============

interface PositionOptions {
  side: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
  sideOffset: number;
  avoidCollisions?: boolean;
}

interface Position {
  x: number;
  y: number;
}

// ============ HOOKS ============

/**
 * Hook to calculate position of content relative to trigger
 * Includes boundary detection to keep content within viewport
 */
export function usePosition(
  triggerRef: React.RefObject<HTMLElement | null> | null,
  contentRef: React.RefObject<HTMLElement | null> | null,
  isOpen: boolean,
  options: PositionOptions
): Position {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  
  // Destructure options to use individual values in dependencies
  const { side, align, sideOffset, avoidCollisions = true } = options;
  
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef?.current || !contentRef?.current) return;
    
    const calculatePosition = () => {
      const triggerRect = triggerRef.current!.getBoundingClientRect();
      const contentRect = contentRef.current!.getBoundingClientRect();
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 8; // Minimum padding from viewport edge
      
      let x = 0;
      let y = 0;
      let currentSide = side;
      let currentAlign = align;
      
      // Collision handling - prioritize flipping over clamping
      if (avoidCollisions) {
        if (side === 'top' || side === 'bottom') {
          // Check vertical collision
          const fitsBottom = triggerRect.bottom + contentRect.height + sideOffset <= viewportHeight - padding;
          const fitsTop = triggerRect.top - contentRect.height - sideOffset >= padding;
          
          if (side === 'bottom' && !fitsBottom && fitsTop) {
            currentSide = 'top';
          } else if (side === 'top' && !fitsTop && fitsBottom) {
            currentSide = 'bottom';
          }
          
          // Check horizontal collision for vertical sides
          if (align === 'start') {
            const fitsStart = triggerRect.left + contentRect.width <= viewportWidth - padding;
            const fitsEnd = triggerRect.right - contentRect.width >= padding;
            if (!fitsStart && fitsEnd) currentAlign = 'end';
          } else if (align === 'end') {
            const fitsEnd = triggerRect.right - contentRect.width >= padding;
            const fitsStart = triggerRect.left + contentRect.width <= viewportWidth - padding;
            if (!fitsEnd && fitsStart) currentAlign = 'start';
          }
        } else {
          // Check horizontal collision for left/right sides
          const fitsRight = triggerRect.right + contentRect.width + sideOffset <= viewportWidth - padding;
          const fitsLeft = triggerRect.left - contentRect.width - sideOffset >= padding;
          
          if (side === 'right' && !fitsRight && fitsLeft) {
            currentSide = 'left';
          } else if (side === 'left' && !fitsLeft && fitsRight) {
            currentSide = 'right';
          }
          
          // Check vertical collision for horizontal sides
          if (align === 'start') {
            const fitsStart = triggerRect.top + contentRect.height <= viewportHeight - padding;
            const fitsEnd = triggerRect.bottom - contentRect.height >= padding;
            if (!fitsStart && fitsEnd) currentAlign = 'end';
          } else if (align === 'end') {
            const fitsEnd = triggerRect.bottom - contentRect.height >= padding;
            const fitsStart = triggerRect.top + contentRect.height <= viewportHeight - padding;
            if (!fitsEnd && fitsStart) currentAlign = 'start';
          }
        }
      }
      
      // Calculate base position based on currentSide
      switch (currentSide) {
        case 'bottom':
          y = triggerRect.bottom + sideOffset;
          break;
        case 'top':
          y = triggerRect.top - contentRect.height - sideOffset;
          break;
        case 'right':
          x = triggerRect.right + sideOffset;
          break;
        case 'left':
          x = triggerRect.left - contentRect.width - sideOffset;
          break;
      }
      
      // Calculate alignment based on currentSide and currentAlign
      if (currentSide === 'top' || currentSide === 'bottom') {
        switch (currentAlign) {
          case 'start':
            x = triggerRect.left;
            break;
          case 'center':
            x = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
            break;
          case 'end':
            x = triggerRect.right - contentRect.width;
            break;
        }
      } else {
        switch (currentAlign) {
          case 'start':
            y = triggerRect.top;
            break;
          case 'center':
            y = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
            break;
          case 'end':
            y = triggerRect.bottom - contentRect.height;
            break;
        }
      }
      
      // Boundary detection - final clamping as a last resort
      // Horizontal bounds
      if (x < padding) {
        x = padding;
      } else if (x + contentRect.width > viewportWidth - padding) {
        x = viewportWidth - contentRect.width - padding;
      }
      
      // Vertical bounds
      if (y < padding) {
        y = padding;
      } else if (y + contentRect.height > viewportHeight - padding) {
        y = viewportHeight - contentRect.height - padding;
      }
      
      setPosition({ x, y });
    };
    
    calculatePosition();
    
    // Recalculate on window resize or scroll
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);
    
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isOpen, triggerRef, contentRef, side, align, sideOffset, avoidCollisions]);
  
  return position;
}

/**
 * Hook to detect clicks outside of element(s)
 * Note: refs array should be stable (not recreated on every render)
 */
export function useClickOutside(
  refs: (React.RefObject<HTMLElement | null> | null)[],
  handler: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;
    
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Do nothing if clicking any of the ref's elements or their descendants
      for (const ref of refs) {
        if (ref?.current && ref.current.contains(target)) {
          return;
        }
      }
      
      handler();
    };
    
    // Use mousedown instead of click for better UX
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, handler]);
}

/**
 * Hook to handle escape key press
 */
export function useEscapeKey(
  handler: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;
    
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handler();
      }
    };
    
    document.addEventListener('keydown', listener);
    
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handler, enabled]);
}

/**
 * Hook to prevent body scroll when menu is open (modal mode)
 */
export function usePreventScroll(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [enabled]);
}

/**
 * Hook to manage controllable state (can be controlled or uncontrolled)
 */
export function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void
): [T, (value: T) => void] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  
  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange]
  );
  
  return [value, setValue];
}

/**
 * Hook to track focus within element
 */
export function useFocusWithin(
  ref: React.RefObject<HTMLElement | null> | null
): boolean {
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  
  useEffect(() => {
    if (!ref?.current) return;
    
    const element = ref.current;
    
    const handleFocusIn = () => setIsFocusWithin(true);
    const handleFocusOut = (event: FocusEvent) => {
      // Check if focus is moving outside the element
      if (!element.contains(event.relatedTarget as Node)) {
        setIsFocusWithin(false);
      }
    };
    
    element.addEventListener('focusin', handleFocusIn);
    element.addEventListener('focusout', handleFocusOut);
    
    return () => {
      element.removeEventListener('focusin', handleFocusIn);
      element.removeEventListener('focusout', handleFocusOut);
    };
  }, [ref]);
  
  return isFocusWithin;
}
