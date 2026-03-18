/**
 * BasicLayout.LeftSidebar Component
 *
 * A resizable and collapsible left sidebar for BasicLayout.
 * Open/closed state is driven by BasicLayoutContext (set by BasicLayout).
 *
 * Features:
 * - Open/close state shared via context (controlled by LeftSidebarToggle or useBasicLayout)
 * - Drag the resize handle to resize (240px - 420px)
 * - Auto-collapses when dragged below 240px
 * - Persists width and collapsed state in localStorage
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import styles from "./LeftSidebar.module.scss";
import { useBasicLayout } from "./BasicLayoutContext";

// ============ CONSTANTS ============

const DEFAULT_WIDTH = 280;
const DEFAULT_DRAG_RANGE: [number, number] = [240, 420];
const STORAGE_KEY = "basicLayout.leftSidebar";

// ============ TYPES ============

export interface LeftSidebarProps {
  children: React.ReactNode;
  /** Whether sidebar can be collapsed via drag (default true). */
  collapsibleByDrag?: boolean;
  /** Width range [min, max] in px for drag resize (default [240, 420]). */
  dragRange?: [number, number];
}

interface StoredState {
  width: number;
  previousWidth: number;
}

// ============ HELPERS ============

const getStoredState = (): StoredState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore localStorage errors
  }
  return null;
};

const saveState = (state: StoredState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore localStorage errors
  }
};

const getMinMax = (dragRange?: [number, number]): [number, number] => {
  if (!dragRange || dragRange.length < 2) return DEFAULT_DRAG_RANGE;
  const [a, b] = dragRange;
  return [Math.min(a, b), Math.max(a, b)];
};

// ============ COMPONENT ============

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  children,
  collapsibleByDrag = true,
  dragRange,
}) => {
  const { leftOpen, setLeftOpen } = useBasicLayout();
  const isCollapsed = !leftOpen;

  const [minWidth, maxWidth] = getMinMax(dragRange);

  const storedState = getStoredState();

  const [width, setWidth] = useState(
    Math.min(Math.max(storedState?.width ?? DEFAULT_WIDTH, minWidth), maxWidth)
  );
  const [isDragging, setIsDragging] = useState(false);

  const hasDraggedRef = useRef(false);
  const previousWidthRef = useRef(storedState?.previousWidth ?? DEFAULT_WIDTH);
  const startXRef = useRef(0);
  const startWidthRef = useRef(DEFAULT_WIDTH);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      hasDraggedRef.current = false;
      startXRef.current = e.clientX;
      startWidthRef.current = isCollapsed ? previousWidthRef.current : width;
    },
    [width, isCollapsed]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startXRef.current;

      if (Math.abs(deltaX) > 5) {
        hasDraggedRef.current = true;
      }

      const newWidth = startWidthRef.current + deltaX;

      if (newWidth < minWidth && collapsibleByDrag) {
        setLeftOpen(false);
        previousWidthRef.current = startWidthRef.current;
      } else {
        setLeftOpen(true);
        setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth));
      }
    },
    [isDragging, setLeftOpen, minWidth, maxWidth, collapsibleByDrag]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    if (!hasDraggedRef.current) {
      if (isCollapsed) {
        setLeftOpen(true);
        setWidth(previousWidthRef.current);
      } else if (collapsibleByDrag) {
        previousWidthRef.current = width;
        setLeftOpen(false);
      }
    }
  }, [isDragging, isCollapsed, width, setLeftOpen, collapsibleByDrag]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Persist width to localStorage when not dragging (open/closed state is NOT persisted)
  useEffect(() => {
    if (!isDragging) {
      saveState({
        width,
        previousWidth: previousWidthRef.current,
      });
    }
  }, [width, isDragging]);

  return (
    <div
      className={`${styles["left-sidebar"]} ${isCollapsed ? styles["collapsed"] : ""}`}
      style={{ width: isCollapsed ? 0 : width }}
    >
      <div className={styles["left-sidebar-inner"]}>{children}</div>
      <div
        className={`${styles["left-sidebar-toggle"]} ${isDragging ? styles["dragging"] : ""}`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

LeftSidebar.displayName = "BasicLayout.LeftSidebar";
