/**
 * Toast Component - Main Implementation
 */

import React from 'react';
import styles from './styles.module.scss';
import type { ToastProps } from './types';
import { ToastContent } from './ComponentContent';

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
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
      styles.toast,
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
        <ToastContent>
          {children}
        </ToastContent>
      </div>
    );
  }
);

Toast.displayName = 'Toast';
