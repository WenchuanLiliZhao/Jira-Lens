/**
 * FAB Component
 *
 * A Floating Action Button (FAB) performs the primary, or most common, action on a screen.
 * It appears in front of all screen content, typically as a circular shape with an icon in its center.
 *
 * AI Hints:
 * - Use variant="circular" for standard FABs
 * - Use variant="extended" when a text label is required
 * - Integrate with HoverOverlay for consistent interaction states
 *
 * Modification Guide:
 * - To add new prop: Modify FABProps interface
 * - To modify design variants: Modify design-related interfaces
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import { Icon } from "../../icon/the-component";
import { HoverOverlay } from "../../../shared/hover-overlay";
import styles from "./styles.module.scss";

// ============ TYPES ============

export type FABVariant = "circular" | "extended";
export type FABSize = "small" | "medium" | "large";
export type FABColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant to use
   * @default "circular"
   */
  variant?: FABVariant;

  /**
   * The size of the component
   * @default "medium"
   */
  size?: FABSize;

  /**
   * The color of the component
   * @default "primary"
   */
  color?: FABColor;

  /**
   * Icon name to display
   */
  icon?: string;

  /**
   * Label text (required for 'extended' variant)
   */
  label?: string;

  /**
   * If provided, renders as an anchor tag
   */
  href?: string;

  /**
   * Target for the link (if href is provided)
   * @default "_blank"
   */
  target?: string;

  /**
   * Custom component for the root element
   */
  component?: React.ElementType;
}

// ============ COMPONENT ============

export const FAB = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, FABProps>(
  (
    {
      variant = "circular",
      size = "medium",
      color = "primary",
      icon,
      label,
      href,
      target = "_blank",
      component,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    // Build class names
    const classNames = [
      styles["f-a-b"],
      styles[`f-a-b--variant-${variant}`],
      styles[`f-a-b--size-${size}`],
      styles[`f-a-b--color-${color}`],
      disabled && styles["f-a-b--disabled"],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Determine the root component
    const Root = component || (href ? "a" : "button");
    const rootProps = href
      ? { href, target, rel: target === "_blank" ? "noopener noreferrer" : undefined }
      : { type: "button" as const, disabled };

    return (
      <Root
        ref={ref as React.Ref<HTMLButtonElement | HTMLAnchorElement>}
        className={classNames}
        {...rootProps}
        {...rest}
      >
        <div className={styles["f-a-b__content"]}>
          {icon && (
            <div className={styles["f-a-b__icon-container"]}>
              <Icon icon={icon} />
            </div>
          )}
          {variant === "extended" && label && (
            <span className={styles["f-a-b__label"]}>{label}</span>
          )}
          {children}
        </div>
        <HoverOverlay disabled={disabled} />
      </Root>
    );
  },
);

FAB.displayName = "FAB";
