/**
 * Button Component
 *
 * A versatile button component with multiple variants, sizes, and colors.
 * Based on Material UI design patterns.
 *
 * AI Hints:
 * - Use variant="contained" for primary actions
 * - Use variant="outlined" for secondary actions
 * - Use variant="text" for tertiary actions
 *
 * Modification Guide:
 * - To add new prop: Modify ButtonProps interface
 * - To modify design variants: Modify design-related interfaces and SCSS
 * - To change render logic: Modify component's return statement
 */

import React from "react";
import { Icon } from "../../icon";
import { HoverOverlay } from "../../../shared/hover-overlay";
import styles from "./styles.module.scss";

// ============ TYPES ============

export type ButtonVariant = "ghost" | "contained" | "outlined";
export type ButtonColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant to use
   * @default "text"
   */
  variant?: ButtonVariant;

  /**
   * The color of the component
   * @default "primary"
   */
  color?: ButtonColor;

  /**
   * The size of the component
   * @default "medium"
   */
  size?: ButtonSize;

  /**
   * If true, the button will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * If true, the button will be disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Element placed before the children
   */
  startIcon?: string;

  /**
   * Element placed after the children
   */
  endIcon?: string;

  /**
   * The content of the button
   */
  children?: React.ReactNode;

  /**
   * The URL to link to when the button is clicked
   * If defined, an anchor element will be used instead of a button
   */
  href?: string;

  /**
   * The target to open the link in
   * @default "_blank"
   */
  target?: string;

  /**
   * The component used for the root node
   * @default "button"
   */
  component?: React.ElementType;
}

// ============ COMPONENT ============

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "text",
      color = "default",
      size = "medium",
      fullWidth = false,
      disabled = false,
      startIcon,
      endIcon,
      children,
      href,
      component,
      className,
      ...rest
    },
    ref,
  ) => {
    // Determine if the button is constantly in dark mode
    
    // Build className string
    const hasStartIcon = Boolean(startIcon);
    const hasEndIcon = Boolean(endIcon);
    const classNames = [
      styles["button"],
      styles[`button--variant-${variant}`],
      styles[`button--color-${color}`],
      styles[`button--size-${size}`],
      fullWidth && styles["button--full-width"],
      disabled && styles["button--disabled"],
      hasStartIcon && styles["button--has-left-icon"],
      hasEndIcon && styles["button--has-right-icon"],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Determine element type
    const Component = component || (href ? "a" : "button");
    const buttonProps = href ? { href } : { type: "button" as const, disabled };

    return (
      <Component
        ref={ref as React.Ref<HTMLButtonElement | HTMLAnchorElement>}
        className={classNames}
        {...buttonProps}
        {...rest}
      >
        {startIcon && (
          <div className={styles["icon-container"]}>
            <Icon icon={startIcon} className={styles["icon"]} />
          </div>
        )}
        {children && (
          <span className={styles["button__label"]}>{children}</span>
        )}
        {endIcon && (
          <div className={styles["icon-container"]}>
            <Icon icon={endIcon} className={styles["icon"]} />
          </div>
        )}
        
        {variant == "outlined" && (
          <div className={`${styles["outline-border"]} outline-border`} />
        )}

        <HoverOverlay disabled={disabled} />
      </Component>
    );
  },
);

Button.displayName = "Button";
