/**
 * Calendar Component Types
 */

import React from 'react';

type CalendarBaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  /** The month to display (defaults to value or today) */
  defaultMonth?: Date;
  /** Function to determine if a date is disabled */
  disabledDate?: (date: Date) => boolean;
  /** First day of week: 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1;
  /** Weekday labels (default: Sun, Mon, ...) */
  weekdayLabels?: string[];
  /** Custom class name */
  className?: string;
};

export type CalendarProps = CalendarBaseProps &
  (
    | {
        selectionMode?: 'single';
        value?: Date | null;
        onChange?: (date: Date | null) => void;
      }
    | {
        selectionMode: 'range';
        value?: [Date, Date] | null;
        onChange?: (range: [Date, Date] | null) => void;
      }
  );

/** Internal: a day cell in the calendar grid */
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  /** Range mode: day is strictly between start and end */
  isInRange?: boolean;
  /** Range mode: day equals range start */
  isRangeStart?: boolean;
  /** Range mode: day equals range end */
  isRangeEnd?: boolean;
}
