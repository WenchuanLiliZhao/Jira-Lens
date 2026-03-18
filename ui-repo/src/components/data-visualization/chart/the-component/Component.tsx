/**
 * Chart Component - Main Implementation
 */

import React from 'react';
import styles from './styles.module.scss';
import type { ChartProps } from './types';
import { ChartContent } from './ComponentContent';

export const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
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
      styles.chart,
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
        <ChartContent>
          {children}
        </ChartContent>
      </div>
    );
  }
);

Chart.displayName = 'Chart';
