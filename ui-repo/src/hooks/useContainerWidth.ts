/**
 * useContainerWidth Hook
 * 
 * A reusable hook that monitors container width using ResizeObserver.
 * Updates in real-time without requiring page refresh.
 */

import { useRef, useState, useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Result type for useContainerWidth hook
 */
export interface UseContainerWidthResult<T extends HTMLElement> {
  /** Ref to attach to the container element */
  ref: RefObject<T | null>;
  /** Current container width in pixels, null if not yet measured */
  width: number | null;
}

/**
 * Hook to monitor container width using ResizeObserver
 * 
 * @example
 * ```tsx
 * const { ref, width } = useContainerWidth<HTMLDivElement>();
 * 
 * return (
 *   <div ref={ref}>
 *     Container width: {width}px
 *   </div>
 * );
 * ```
 */
export function useContainerWidth<T extends HTMLElement = HTMLDivElement>(): UseContainerWidthResult<T> {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateWidth = () => {
      setWidth(element.offsetWidth);
    };

    // Initial measurement
    updateWidth();

    // Create ResizeObserver to monitor size changes
    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { ref, width };
}
