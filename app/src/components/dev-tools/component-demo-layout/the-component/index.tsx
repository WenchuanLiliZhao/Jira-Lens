/**
 * ComponentDemoLayout Component
 *
 * [Brief description of the component]
 *
 * AI Hints:
 * - [Key hint 1]
 * - [Key hint 2]
 *
 * Modification Guide:
 * - To add new prop: Modify ComponentDemoLayoutProps interface
 * - To modify design variants: Modify design-related interfaces
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import styles from "./styles.module.scss";
import { DevToolsFAB } from "../../dev-tools-fab";

// ============ TYPES ============

export interface ComponentDemoLayoutProps {
  children: React.ReactNode;
}

// ============ COMPONENT ============

export const ComponentDemoLayout: React.FC<ComponentDemoLayoutProps> = ({ children }) => {
  return (
    <div className={styles["component-demo-layout"]}>
      {children}
      <DevToolsFAB />
    </div>
  );
};

ComponentDemoLayout.displayName = "ComponentDemoLayout";
