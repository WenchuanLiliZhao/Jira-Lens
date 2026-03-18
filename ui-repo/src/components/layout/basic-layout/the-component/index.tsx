/**
 * BasicLayout Component
 *
 * A layout component with optional navigation bar, resizable left/right sidebars, and main content area.
 *
 * Sidebar toggle buttons are user-defined via BasicLayout.LeftSidebarToggle and
 * BasicLayout.RightSidebarToggle — place them anywhere inside the tree.
 *
 * @example
 * ```tsx
 * import { BasicLayout } from '@/components/layout/basic-layout';
 *
 * <BasicLayout
 *   navigation={{
 *     start: [
 *       <BasicLayout.LeftSidebarToggle key="toggle">
 *         <Button variant="ghost" startIcon="menu" />
 *       </BasicLayout.LeftSidebarToggle>,
 *     ],
 *   }}
 *   leftSidebar={{ content: <SidebarContent />, defaultOpen: true }}
 * >
 *   <MainContent />
 * </BasicLayout>
 * ```
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 *
 * Modification Guide:
 * - To add new prop: Modify BasicLayoutProps interface
 * - To modify design variants: Modify design-related interfaces
 * - To change render logic: Modify component's return statement
 */

import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { Navigation } from "./Navigation";
import { MainContent } from "./MainContent";
import { BasicLayoutContext } from "./BasicLayoutContext";
import { LeftSidebarToggle, RightSidebarToggle } from "./SidebarToggle";

// ============ TYPES ============

export type SidebarConfig = {
  content: React.ReactNode;
  /** Default true. Initial open state when no localStorage entry exists. */
  defaultOpen?: boolean;
  /** Whether sidebar can be collapsed via drag (default true). */
  collapsibleByDrag?: boolean;
  /** Width range [min, max] in px for drag resize (default [240, 420]). */
  dragRange?: [number, number];
};

export interface BasicLayoutProps {
  /** Main content area */
  children: React.ReactNode;
  /** Navigation bar configuration */
  navigation?: {
    start?: React.ReactNode[];
    end?: React.ReactNode[];
  };
  /** Left sidebar configuration */
  leftSidebar?: SidebarConfig;
  /** Right sidebar configuration */
  rightSidebar?: SidebarConfig;
  /** When true, main content fills the area without max-width (e.g. for full-width maps) */
  mainContentFullBleed?: boolean;
}

// ============ HELPERS ============

// Open/closed state is always driven by defaultOpen — not persisted in localStorage.
// Only width is persisted so the user's resized width survives reloads.
const getInitialOpen = (defaultOpen?: boolean): boolean => defaultOpen ?? true;

// ============ COMPONENT ============

const BasicLayoutBase: React.FC<BasicLayoutProps> = ({
  children,
  navigation,
  leftSidebar,
  rightSidebar,
  mainContentFullBleed = false,
}) => {
  const [leftOpen, setLeftOpen] = useState(() =>
    getInitialOpen(leftSidebar?.defaultOpen)
  );
  const [rightOpen, setRightOpen] = useState(() =>
    getInitialOpen(rightSidebar?.defaultOpen)
  );

  // disable body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const hasNavigation = !!(
    navigation?.start?.length || navigation?.end?.length
  );

  return (
    <BasicLayoutContext.Provider
      value={{ leftOpen, setLeftOpen, rightOpen, setRightOpen }}
    >
      <div className={styles["basic-layout"]}>
        {hasNavigation && (
          <Navigation start={navigation?.start} end={navigation?.end} />
        )}
        <div className={styles["page-content"]}>
          {leftSidebar && (
            <LeftSidebar
              collapsibleByDrag={leftSidebar.collapsibleByDrag}
              dragRange={leftSidebar.dragRange}
            >
              {leftSidebar.content}
            </LeftSidebar>
          )}
          <MainContent fullBleed={mainContentFullBleed}>{children}</MainContent>
          {rightSidebar && (
            <RightSidebar
              collapsibleByDrag={rightSidebar.collapsibleByDrag}
              dragRange={rightSidebar.dragRange}
            >
              {rightSidebar.content}
            </RightSidebar>
          )}
        </div>
      </div>
    </BasicLayoutContext.Provider>
  );
};

BasicLayoutBase.displayName = "BasicLayout";

export const BasicLayout = Object.assign(BasicLayoutBase, {
  LeftSidebarToggle,
  RightSidebarToggle,
});

// Re-export types
export type { LeftSidebarProps } from "./LeftSidebar";
export type { RightSidebarProps } from "./RightSidebar";
export type { NavigationProps } from "./Navigation";
export type { MainContentProps } from "./MainContent";
export type { SidebarToggleProps } from "./SidebarToggle";
export { useBasicLayout } from "./BasicLayoutContext";
