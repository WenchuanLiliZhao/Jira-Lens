/**
 * IndexCard Component
 *
 * A small metric card for displaying KPIs like "ACE 67", "NPS 70", "Fits 87".
 * Supports size variants and optional trend indicators.
 *
 * AI Hints:
 * - Medium size: vertical layout (label above, value below)
 * - Small size: horizontal layout (label left, value right)
 * - Trend: positive = green, negative = red
 *
 * Modification Guide:
 * - To add new prop: Modify IndexCardProps interface
 * - To modify design variants: Modify size-related styles
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import styles from "./styles.module.scss";

// ============ TYPES ============

export type IndexCardSize = "small" | "medium" | "large";

export type IndexCardAlign = "left" | "center";

export interface IndexCardProps {
  /** Metric name, e.g. "ACE", "NPS", "Fits", "VM" */
  label: string;
  /** Metric value, e.g. 67, 70, 87 */
  value: number | string;
  /** Optional subtitle, e.g. "Attend", "Create", "Engage" */
  sublabel?: string;
  /** Optional trend change, e.g. +4.0 or -8 */
  trend?: number;
  /** Card size variant */
  size?: IndexCardSize;
  /** Content alignment: left (default) or center */
  align?: IndexCardAlign;
  /** Additional CSS classes */
  className?: string;
}

// ============ COMPONENT ============

export const IndexCard: React.FC<IndexCardProps> = ({
  label,
  value,
  sublabel,
  trend,
  size = "medium",
  align = "left",
  className,
}) => {
  const classNames = [
    styles["index-card"],
    styles[`index-card--size-${size}`],
    align === "center" && styles["index-card--align-center"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const trendFormatted =
    trend !== undefined
      ? trend >= 0
        ? `+${trend}`
        : `${trend}`
      : null;

  const trendModifier =
    trend !== undefined
      ? trend > 0
        ? styles["index-card__trend--positive"]
        : styles["index-card__trend--negative"]
      : null;

  return (
    <div className={classNames}>
      <div className={styles["index-card__header"]}>
        <span className={styles["index-card__label"]}>{label}</span>
        {sublabel && (
          <span className={styles["index-card__sublabel"]}>{sublabel}</span>
        )}
      </div>
      <div className={styles["index-card__value-row"]}>
        <span className={styles["index-card__value"]}>{value}</span>
        {trendFormatted !== null && (
          <span
            className={[
              styles["index-card__trend"],
              trendModifier,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {trendFormatted}
          </span>
        )}
      </div>
    </div>
  );
};

IndexCard.displayName = "IndexCard";
