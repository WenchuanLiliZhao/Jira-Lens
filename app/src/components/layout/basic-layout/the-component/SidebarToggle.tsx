/**
 * BasicLayout Sidebar Toggle Components
 *
 * LeftSidebarToggle and RightSidebarToggle wrap any ReactNode children
 * and connect them to the sidebar open/close state via BasicLayoutContext.
 *
 * Children define the visual appearance entirely. The toggle intercepts clicks
 * and toggles the corresponding sidebar. Multiple toggles for the same sidebar
 * can coexist anywhere in the tree — they all share the same context state.
 *
 * @example
 * ```tsx
 * <BasicLayout.LeftSidebarToggle>
 *   <Button variant="ghost" startIcon="menu" />
 * </BasicLayout.LeftSidebarToggle>
 * ```
 *
 * Throws at runtime if rendered outside a BasicLayout.
 */

import React from "react";
import { useBasicLayout } from "./BasicLayoutContext";

// ============ TYPES ============

export interface SidebarToggleProps {
  children: React.ReactNode;
}

// ============ COMPONENTS ============

export const LeftSidebarToggle: React.FC<SidebarToggleProps> = ({
  children,
}) => {
  const { setLeftOpen } = useBasicLayout();
  return (
    <span
      style={{ display: "contents" }}
      onClick={() => setLeftOpen((v) => !v)}
    >
      {children}
    </span>
  );
};

LeftSidebarToggle.displayName = "BasicLayout.LeftSidebarToggle";

export const RightSidebarToggle: React.FC<SidebarToggleProps> = ({
  children,
}) => {
  const { setRightOpen } = useBasicLayout();
  return (
    <span
      style={{ display: "contents" }}
      onClick={() => setRightOpen((v) => !v)}
    >
      {children}
    </span>
  );
};

RightSidebarToggle.displayName = "BasicLayout.RightSidebarToggle";
