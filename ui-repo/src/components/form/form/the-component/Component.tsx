/**
 * Form Component - Main Implementation
 */

import React from 'react';
import styles from './styles.module.scss';
import type { FormProps } from './types';
import { FormContent } from './ComponentContent';

export const Form = React.forwardRef<HTMLDivElement, FormProps>(
  (props, ref) => {
    const {
      children,
      variant = 'default',
      size = 'medium',
      disabled = false,
      className,
      ...restProps
    } = props;

    // Build className
    const componentClassName = [
      styles.form,
      className,
    ].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={componentClassName}
        data-variant={variant}
        data-size={size}
        data-disabled={disabled}
        {...restProps}
      >
        <FormContent>
          {children}
        </FormContent>
      </div>
    );
  }
);

Form.displayName = 'Form';
