/**
 * PrdAnnotation Component
 *
 * [Brief description of the component]
 *
 * AI Hints:
 * - [Key hint 1]
 * - [Key hint 2]
 *
 * Modification Guide:
 * - To add new prop: Modify PrdAnnotationProps interface
 * - To modify design variants: Modify design-related interfaces
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import styles from "./styles.module.scss";

// ============ TYPES ============

export interface PrdAnnotationProps {
  unknownProps: unknown; // this is just an auto-generated placeholder prop. one you have specified the props below, remove this prop.
}

// ============ COMPONENT ============

export const PrdAnnotation: React.FC<PrdAnnotationProps> = ({ unknownProps }) => {
  console.log(unknownProps); // delete this once you have specified the props.

  return (
    <div className={styles["prd-annotation"]}>
      PrdAnnotation
    </div>
  );
};

PrdAnnotation.displayName = "PrdAnnotation";
