/**
 * Badge Component
 *
 * Displays notification counts or status indicators on top of child elements.
 * Supports dot (presence-only) and standard (numeric/text) variants per Material Design 3.
 *
 * AI Hints:
 * - Use variant="dot" for "has unread" without count
 * - Use variant="standard" for message counts, cart quantities, etc.
 * - Wrap the target element as children: <Badge badgeContent={5}><Icon /></Badge>
 *
 * Modification Guide:
 * - To add new prop: Modify BadgeProps interface
 * - To modify design variants: Modify design-related interfaces
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import styles from "./styles.module.scss";

// ============ TYPES ============

export type BadgeVariant = "dot" | "standard";
export type BadgeColor =
  | "default"
  | "primary"
  | "error"
  | "info"
  | "warning";

export type BadgeAnchorVertical = "top" | "bottom";
export type BadgeAnchorHorizontal = "left" | "right";

export interface BadgeAnchorOrigin {
  vertical: BadgeAnchorVertical;
  horizontal: BadgeAnchorHorizontal;
}

export interface BadgeProps {
  /**
   * Badge content. Numbers show count; strings/ReactNode render as-is.
   */
  badgeContent?: number | string | React.ReactNode;

  /**
   * The element to wrap (Icon, Button, etc.).
   */
  children: React.ReactNode;

  /**
   * dot = circle only; standard = number/text.
   * @default "standard"
   */
  variant?: BadgeVariant;

  /**
   * Badge background color.
   * @default "error"
   */
  color?: BadgeColor;

  /**
   * Badge position relative to child.
   * @default { vertical: "top", horizontal: "right" }
   */
  anchorOrigin?: BadgeAnchorOrigin;

  /**
   * Max number to display; above this shows "max+".
   * @default 99
   */
  max?: number;

  /**
   * Show badge when badgeContent is 0.
   * @default false
   */
  showZero?: boolean;

  /**
   * Force hide the badge.
   * @default false
   */
  invisible?: boolean;

  /**
   * Additional CSS classes for the root wrapper.
   */
  className?: string;
}

// ============ HELPERS ============

function getDisplayValue(
  badgeContent: number | string | React.ReactNode | undefined,
  max: number,
  variant: BadgeVariant
): React.ReactNode {
  if (badgeContent === undefined || badgeContent === null) return null;
  if (variant === "dot") return null;

  if (typeof badgeContent === "number") {
    if (badgeContent > max) return `${max}+`;
    return String(badgeContent);
  }

  return badgeContent;
}

function getAnchorClass(anchor: BadgeAnchorOrigin): string {
  const v = anchor.vertical;
  const h = anchor.horizontal;
  const key = `${v}${h.charAt(0).toUpperCase() + h.slice(1)}` as
    | "topRight"
    | "topLeft"
    | "bottomRight"
    | "bottomLeft";
  return styles[`badge--anchor-${key}`];
}

function isVisible(
  badgeContent: number | string | React.ReactNode | undefined,
  showZero: boolean,
  invisible: boolean
): boolean {
  if (invisible) return false;
  if (badgeContent === undefined || badgeContent === null) return false;
  if (typeof badgeContent === "number" && badgeContent === 0 && !showZero)
    return false;
  return true;
}

// ============ COMPONENT ============

export const Badge: React.FC<BadgeProps> = ({
  badgeContent,
  children,
  variant = "standard",
  color = "error",
  anchorOrigin = { vertical: "top", horizontal: "right" },
  max = 99,
  showZero = false,
  invisible = false,
  className,
}) => {
  const visible = isVisible(badgeContent, showZero, invisible);
  const displayValue = getDisplayValue(badgeContent, max, variant);

  const classNames = [
    styles["badge"],
    styles[`badge--variant-${variant}`],
    styles[`badge--color-${color}`],
    getAnchorClass(anchorOrigin),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const ariaLabel =
    typeof badgeContent === "number"
      ? `${badgeContent} items`
      : typeof badgeContent === "string"
        ? badgeContent
        : badgeContent != null
          ? "unread"
          : undefined;

  return (
    <span className={classNames}>
      {children}
      {visible && (
        <span
          className={styles["badge__content"]}
          role="status"
          aria-label={ariaLabel}
          aria-hidden={!visible}
        >
          {variant === "standard" && displayValue != null && (
            <span className={styles["badge__label"]}>{displayValue}</span>
          )}
        </span>
      )}
    </span>
  );
};

Badge.displayName = "Badge";
