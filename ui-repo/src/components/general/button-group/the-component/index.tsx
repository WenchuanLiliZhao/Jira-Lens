/**
 * ButtonGroup Component
 *
 * A container that groups related buttons together with state management,
 * supporting single/multiple selection modes and various style variants.
 *
 * AI Hints:
 * - Use mode="single" for exclusive selection (radio-like behavior)
 * - Use mode="multiple" for non-exclusive selection (checkbox-like behavior)
 * - The component controls child Button variant/color/size - do not override on children
 * - Each Button child must have a unique `value` prop for identification
 *
 * Modification Guide:
 * - To add new prop: Modify ButtonGroupProps interface
 * - To modify selection logic: Update handleButtonClick function
 * - To modify style mapping: Update getButtonVariant function
 */

import React, { useState, useCallback } from "react";
import { Button } from "../../button/the-component";
import type { ButtonProps, ButtonSize, ButtonVariant, ButtonColor } from "../../button/the-component";

/** Props for a Button child when used inside ButtonGroup */
interface ButtonChildProps extends ButtonProps {
  value?: string;
}
import styles from "./styles.module.scss";

// ============ TYPES ============

export type ButtonGroupMode = "single" | "multiple";
export type ButtonGroupVariant = "outlined" | "ghost" | "contained";

export interface ButtonGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Layout direction of the grouped buttons
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";

  /**
   * If true, buttons are visually merged (shared borders, no gap)
   * @default true
   */
  segmented?: boolean;

  /**
   * Selection mode
   * - "single": Only one button can be selected at a time
   * - "multiple": Multiple buttons can be selected
   * @default "single"
   */
  mode?: ButtonGroupMode;

  /**
   * Style variant for the button group
   * - "outlined": Active = contained+color, Inactive = outlined+default
   * - "ghost": Active = contained+color, Inactive = ghost+default
   * - "contained": Active = contained+color, Inactive = contained+default
   * @default "outlined"
   */
  variant?: ButtonGroupVariant;

  /**
   * Color theme for selected buttons
   * Unselected buttons always use "default" color
   * Note: "secondary" color is not supported and will fallback to "primary"
   * @default "primary"
   */
  color?: ButtonColor;

  /**
   * Uniform size for all buttons in the group
   * @default "medium"
   */
  size?: ButtonSize;

  /**
   * Controlled selected value(s)
   * - string: for single mode
   * - string[]: for multiple mode
   */
  value?: string | string[];

  /**
   * Default selected value(s) for uncontrolled mode
   * - string: for single mode
   * - string[]: for multiple mode
   */
  defaultValue?: string | string[];

  /**
   * Callback fired when selection changes
   * @param value - Selected value(s)
   */
  onChange?: (value: string | string[]) => void;

  /**
   * If true, all buttons are disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * In single mode, if true, clicking the active button will deselect it
   * @default false
   */
  exclusive?: boolean;

  /**
   * If true, buttons take up full width of the container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Content of the group (typically Button components with value props)
   */
  children?: React.ReactNode;
}

// ============ COMPONENT ============

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      orientation = "horizontal",
      segmented = true,
      mode = "single",
      variant = "outlined",
      color = "primary",
      size = "medium",
      value: controlledValue,
      defaultValue,
      onChange,
      disabled = false,
      exclusive = false,
      fullWidth = false,
      children,
      className,
      ...rest
    },
    ref,
  ) => {
    // ============ STATE MANAGEMENT ============
    
    // Determine if component is controlled
    const isControlled = controlledValue !== undefined;
    
    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState<string | string[]>(() => {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      return mode === "multiple" ? [] : "";
    });

    // Get current value (controlled or uncontrolled)
    const currentValue = isControlled ? controlledValue : internalValue;

    // ============ HELPER FUNCTIONS ============

    /**
     * Check if a value is selected
     */
    const isValueSelected = useCallback(
      (val: string): boolean => {
        if (mode === "multiple") {
          return Array.isArray(currentValue) && currentValue.includes(val);
        }
        return currentValue === val;
      },
      [currentValue, mode],
    );

    /**
     * Get the appropriate variant for a button based on its selection state
     */
    const getButtonVariant = useCallback(
      (isActive: boolean): ButtonVariant => {
        if (isActive) {
          return "contained";
        }
        
        // Map group variant to inactive button variant
        switch (variant) {
          case "outlined":
            return "outlined";
          case "ghost":
            return "ghost";
          case "contained":
            return "contained";
          default:
            return "outlined";
        }
      },
      [variant],
    );

    /**
     * Handle button click
     */
    const handleButtonClick = useCallback(
      (val: string) => {
        let newValue: string | string[];

        if (mode === "multiple") {
          const currentArray = Array.isArray(currentValue) ? currentValue : [];
          if (currentArray.includes(val)) {
            // Deselect
            newValue = currentArray.filter((v) => v !== val);
          } else {
            // Select
            newValue = [...currentArray, val];
          }
        } else {
          // Single mode
          if (currentValue === val && exclusive) {
            // Allow deselection if exclusive is true
            newValue = "";
          } else {
            newValue = val;
          }
        }

        // Update state for uncontrolled mode
        if (!isControlled) {
          setInternalValue(newValue);
        }

        // Call onChange callback
        onChange?.(newValue);
      },
      [mode, currentValue, exclusive, isControlled, onChange],
    );

    // ============ RENDER CHILDREN ============

    const renderedChildren = React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return child;
      }

      // Check if child is a Button component
      if (child.type === Button) {
        const buttonChild = child as React.ReactElement<ButtonChildProps>;
        const { value: childValue, disabled: childDisabled, onClick: childOnClick, ...restProps } = buttonChild.props;

        if (!childValue) {
          console.warn("ButtonGroup: Each Button child must have a value prop");
          return child;
        }

        const isActive = isValueSelected(childValue);
        const buttonVariant = getButtonVariant(isActive);
        const isDisabled = disabled || childDisabled;

        // Secondary color is not supported for selected buttons, fallback to primary
        const activeColor = color === "secondary" ? "primary" : color;

        // Clone the button with controlled props
        return React.cloneElement(buttonChild, {
          ...restProps,
          value: childValue,
          variant: buttonVariant,
          color: isActive ? activeColor : "default",
          size: size,
          disabled: isDisabled,
          onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
            // Call original onClick if exists
            childOnClick?.(e);
            // Handle selection
            if (!isDisabled) {
              handleButtonClick(childValue);
            }
          },
        } as Partial<ButtonProps>);
      }

      return child;
    });

    // ============ CLASS NAMES ============

    const classNames = [
      styles["button-group"],
      styles[`button-group--${orientation}`],
      segmented && styles["button-group--segmented"],
      fullWidth && styles["button-group--full-width"],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // ============ RENDER ============

    return (
      <div ref={ref} className={classNames} role="group" {...rest}>
        {renderedChildren}
      </div>
    );
  },
);

ButtonGroup.displayName = "ButtonGroup";
