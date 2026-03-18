/**
 * Icon Component
 *
 * [Brief description of the component]
 *
 * AI Hints:
 * - [Key hint 1]
 * - [Key hint 2]
 *
 * Modification Guide:
 * - To add new prop: Modify IconProps interface
 * - To modify design variants: Modify design-related interfaces
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import styles from "./styles.module.scss";

// ============ TYPES ============

export interface IconProps {
  icon: string;
  className?: string;
}

// ============ COMPONENT ============

export const Icon: React.FC<IconProps> = ({ icon, className }) => {
  return (
    <span
      className={`${styles["icon"]} material-symbols-outlined ${className}`}
    >
      {icon}
    </span>
  );
};

Icon.displayName = "Icon";
