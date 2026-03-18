/**
 * BasicLayout Context
 *
 * Provides sidebar open/close state to all descendants.
 * Consumed by LeftSidebar, RightSidebar, LeftSidebarToggle, RightSidebarToggle,
 * and the useBasicLayout hook for custom integrations.
 */

import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

// ============ TYPES ============

export type BasicLayoutContextValue = {
  leftOpen: boolean;
  setLeftOpen: Dispatch<SetStateAction<boolean>>;
  rightOpen: boolean;
  setRightOpen: Dispatch<SetStateAction<boolean>>;
};

// ============ CONTEXT ============

export const BasicLayoutContext =
  createContext<BasicLayoutContextValue | null>(null);

// ============ HOOK ============

export function useBasicLayout(): BasicLayoutContextValue {
  const ctx = useContext(BasicLayoutContext);
  if (!ctx) {
    throw new Error("useBasicLayout must be used within a BasicLayout");
  }
  return ctx;
}
