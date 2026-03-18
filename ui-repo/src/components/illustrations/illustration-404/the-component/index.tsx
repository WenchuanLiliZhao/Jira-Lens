/**
 * Illustration404 Component
 *
 * [Brief description of the component]
 *
 * AI Hints:
 * - [Key hint 1]
 * - [Key hint 2]
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 *
 * Modification Guide:
 * - To add new prop: Modify Illustration404Props interface
 * - To modify design variants: Modify design-related interfaces
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import styles from "./styles.module.scss";

// ============ TYPES ============

export interface Illustration404Props {
  unknownProps: unknown; // this is just an auto-generated placeholder prop. one you have specified the props below, remove this prop.
}

// ============ COMPONENT ============

export const Illustration404: React.FC<Illustration404Props> = ({ unknownProps }) => {
  console.log(unknownProps); // delete this once you have specified the props.

  return (
    <div className={styles["illustration404"]}>
      Illustration404
    </div>
  );
};

Illustration404.displayName = "Illustration404";
