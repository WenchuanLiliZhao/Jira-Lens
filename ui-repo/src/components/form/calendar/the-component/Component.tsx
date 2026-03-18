/**
 * Calendar Component - Main Implementation
 *
 * Compact month-view calendar for date selection (Date Picker popup).
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 */

import React from 'react';
import styles from './styles.module.scss';
import type { CalendarProps } from './types';
import { CalendarContent } from './ComponentContent';

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      defaultMonth,
      disabledDate,
      weekStartsOn = 0,
      weekdayLabels,
      selectionMode = 'single',
      className,
      ...restProps
    } = props;

    const componentClassName = [styles.calendar, className].filter(Boolean).join(' ');

    return (
      <div ref={ref} className={componentClassName} role="application" aria-label="Calendar" {...restProps}>
        <CalendarContent
          value={value}
          onChange={onChange}
          defaultMonth={defaultMonth}
          disabledDate={disabledDate}
          weekStartsOn={weekStartsOn}
          weekdayLabels={weekdayLabels}
          selectionMode={selectionMode}
        />
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';
