/**
 * StatCard Component
 *
 * A summary card for displaying distribution stats like NPS (Promoter/Passive/Detractor).
 * Each item shows icon (optional), label, percentage, and count (optional).
 *
 * AI Hints:
 * - Vertical layout: stacked rows (default)
 * - Horizontal layout: items in a row with flex-wrap
 * - Use icon prop for Material icon names (e.g. sentiment_satisfied)
 *
 * Modification Guide:
 * - To add new prop: Modify StatCardProps interface
 * - To modify design variants: Modify layout-related styles
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import { Icon } from "../../../general/icon";
import styles from "./styles.module.scss";

// ============ TYPES ============

export interface StatItem {
  /** Item label, e.g. "Promoter", "Passive", "Detractor" */
  label: string;
  /** Percentage value, e.g. 89, 6, 5 */
  percentage: number;
  /** Optional count, e.g. 1390, 197, 71 */
  count?: number;
  /** Optional CSS color for icon/label */
  color?: string;
  /** Optional Material icon name, e.g. "sentiment_satisfied" */
  icon?: string;
}

export type StatCardLayout = "vertical" | "horizontal";
export type StatCardSize = "small" | "medium";

export interface StatCardProps {
  /** Array of stat items to display */
  items: StatItem[];
  /** Layout direction */
  layout?: StatCardLayout;
  /** Size variant - affects font sizes */
  size?: StatCardSize;
  /** Whether to show count for each item */
  showCount?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ============ COMPONENT ============

export const StatCard: React.FC<StatCardProps> = ({
  items,
  layout = "vertical",
  size = "medium",
  showCount = true,
  className,
}) => {
  const classNames = [
    styles["stat-card"],
    styles[`stat-card--layout-${layout}`],
    styles[`stat-card--size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames}>
      {items.map((item, index) => (
        <div
          key={index}
          className={styles["stat-card__item"]}
          style={item.color ? { color: item.color } : undefined}
        >
          {item.icon && (
            <span className={styles["stat-card__icon"]}>
              <Icon icon={item.icon} />
            </span>
          )}
          <span className={styles["stat-card__label"]}>{item.label}</span>
          <span className={styles["stat-card__percentage"]}>
            {item.percentage}%
          </span>
          {showCount && item.count !== undefined && (
            <span className={styles["stat-card__count"]}>({item.count})</span>
          )}
        </div>
      ))}
    </div>
  );
};

StatCard.displayName = "StatCard";
