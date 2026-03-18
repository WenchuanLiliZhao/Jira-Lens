/**
 * BasicLayout.MainContent Component
 *
 * The main content area wrapper for BasicLayout.
 *
 * Features:
 * - Fills remaining horizontal space
 * - Scrollable content area
 * - Centered content with max-width constraint
 */

import React from "react";
import styles from "./MainContent.module.scss";

// ============ TYPES ============

export interface MainContentProps {
  children: React.ReactNode;
  /** When true, children fill the main area without max-width constraint (e.g. for maps) */
  fullBleed?: boolean;
}

// ============ COMPONENT ============

export const MainContent: React.FC<MainContentProps> = ({
  children,
  fullBleed = false,
}) => {
  return (
    <main
      className={`${styles["main-content"]} ${fullBleed ? styles["full-bleed"] : ""}`}
    >
      {fullBleed ? (
        children
      ) : (
        <div className={styles["main-content-inner"]}>{children}</div>
      )}
    </main>
  );
};

MainContent.displayName = "BasicLayout.MainContent";
