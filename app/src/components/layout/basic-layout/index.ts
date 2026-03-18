/**
 * BasicLayout Component Exports
 *
 * A layout component with optional navigation bar, resizable left/right sidebars, and main content area.
 * Toggle buttons are user-defined via BasicLayout.LeftSidebarToggle and BasicLayout.RightSidebarToggle.
 */

// Main component export
export { BasicLayout } from "./the-component";

// Hook export
export { useBasicLayout } from "./the-component";

// Type exports
export type {
  BasicLayoutProps,
  SidebarConfig,
  SidebarToggleProps,
  LeftSidebarProps,
  RightSidebarProps,
  NavigationProps,
  MainContentProps,
} from "./the-component";

// Demo page export