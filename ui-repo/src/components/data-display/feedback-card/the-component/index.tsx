/**
 * FeedbackCard Component
 *
 * A feedback list item card showing sentiment icon, comment, NPS score,
 * date/time, and optional meta content.
 *
 * AI Hints:
 * - Two horizontal sections: (1) emoji + score, (2) comment + datetime + metaContent
 * - onClick enables interactive styling
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles.
 * Use CSS variables in styles.module.scss.
 *
 * Modification Guide:
 * - To add new prop: Modify FeedbackCardProps interface
 * - To modify design variants: Modify design-related interfaces
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import { Icon } from "../../../general/icon";
import styles from "./styles.module.scss";

// ============ TYPES ============

export interface FeedbackCardProps {
  /** Comment text, e.g. "都很好，很满意的购物体验！" */
  comment: string;
  /** NPS score, e.g. 10 */
  score?: number;
  /** Date and time string, e.g. "2025/12/10 15:30" */
  datetime?: string;
  /** Material icon name for sentiment, e.g. "sentiment_satisfied" */
  sentimentIcon?: string;
  /** Optional CSS color for sentiment icon (e.g. green=Promoter, yellow=Passive, red=Detractor) */
  sentimentColor?: string;
  /** Optional content in the meta row (between datetime and chevron). Can be Label, badges, or any ReactNode. */
  metaContent?: React.ReactNode | React.ReactNode[];
  /** Click callback; when provided, enables interactive styling */
  onClick?: () => void;
  /** Size variant. 'small' reduces font sizes and icon size for dense layouts. */
  size?: 'default' | 'small';
  /** Additional CSS classes */
  className?: string;
}

// ============ COMPONENT ============

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  comment,
  score,
  datetime,
  sentimentIcon,
  sentimentColor,
  metaContent,
  onClick,
  size = 'default',
  className,
}) => {
  const metaItems = metaContent === undefined ? [] : Array.isArray(metaContent) ? metaContent : [metaContent];
  const classNames = [
    styles["feedback-card"],
    onClick && styles["feedback-card--clickable"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={classNames}
      data-size={size !== 'default' ? size : undefined}
      onClick={handleClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Section 1: emoji + score (vertical) */}
      {(sentimentIcon || score !== undefined) && (
        <div className={styles["feedback-card__left"]}>
          {sentimentIcon && (
            <span
              className={styles["feedback-card__sentiment-icon"]}
              style={sentimentColor ? { color: sentimentColor } : undefined}
            >
              <Icon icon={sentimentIcon} />
            </span>
          )}
          {score !== undefined && (
            <span className={styles["feedback-card__score"]}>{score}</span>
          )}
        </div>
      )}

      {/* Section 2: comment + datetime + metaContent (vertical) */}
      <div className={styles["feedback-card__center"]}>
        <span className={styles["feedback-card__comment"]}>{comment}</span>
        <div className={styles["feedback-card__meta"]}>
          {datetime && (
            <span className={styles["feedback-card__datetime"]}>{datetime}</span>
          )}
          {metaItems.length > 0 && (
            <div className={styles["feedback-card__meta-content"]}>
              {metaItems.map((item, i) => (
                <React.Fragment key={i}>{item}</React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

FeedbackCard.displayName = "FeedbackCard";
