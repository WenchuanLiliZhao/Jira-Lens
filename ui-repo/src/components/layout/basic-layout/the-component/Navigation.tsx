/**
 * BasicLayout.Navigation Component
 *
 * A fixed navigation bar for BasicLayout.
 *
 * Features:
 * - Fixed position at the top of the viewport
 * - Start and end slots for navigation items
 * - Uses scrollable-part trick to reserve space in document flow
 */

import React from "react";
import styles from "./Navigation.module.scss";

// ============ TYPES ============

export interface NavigationProps {
  start?: React.ReactNode[];
  end?: React.ReactNode[];
}

// ============ COMPONENT ============

export const Navigation: React.FC<NavigationProps> = ({ start, end }) => {
  return (
    <div className={styles["navigation"]}>
      <div className={styles["scrollable-part"]} />
      <div className={styles["fixed-part"]}>
        {start && (
          <div className={styles["navigation-start"]}>
            {start.map((item, index) => (
              <React.Fragment key={index}>{item}</React.Fragment>
            ))}
          </div>
        )}
        {end && (
          <div className={styles["navigation-end"]}>
            {end.map((item, index) => (
              <React.Fragment key={index}>{item}</React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

Navigation.displayName = "BasicLayout.Navigation";
