/**
 * DevToolbar Component - Main Implementation
 */

import React from 'react';
import styles from './styles.module.scss';
import type { DevToolbarProps } from './types';
import { DevToolbarContent } from './ComponentContent';

export const DevToolbar = React.forwardRef<HTMLDivElement, DevToolbarProps>(
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
      styles["dev-toolbar"],
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
        <DevToolbarContent>
          {children}
        </DevToolbarContent>
      </div>
    );
  }
);

DevToolbar.displayName = 'DevToolbar';
