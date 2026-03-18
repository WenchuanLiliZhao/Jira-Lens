/**
 * CalendarContent - Calendar grid, header, navigation, date selection
 */

import React, { useState, useMemo } from 'react';
import type { CalendarProps, CalendarDay } from './types';
import styles from './styles.module.scss';

const DEFAULT_WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isSameDay(a: Date, b: Date | null | undefined): boolean {
  if (!b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dateTimestamp(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function isBefore(a: Date, b: Date): boolean {
  return dateTimestamp(a) < dateTimestamp(b);
}

function isBetween(d: Date, start: Date, end: Date): boolean {
  const t = dateTimestamp(d);
  const ts = dateTimestamp(start);
  const te = dateTimestamp(end);
  return t > ts && t < te;
}

function isToday(d: Date): boolean {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}

function normalizeRange(range: [Date, Date]): [Date, Date] {
  const [a, b] = range;
  return isBefore(a, b) ? [a, b] : [b, a];
}

/** Build the 6x7 grid of days for a given month */
function buildMonthGrid(
  month: Date,
  weekStartsOn: 0 | 1,
  value: Date | [Date, Date] | null | undefined,
  selectionMode: 'single' | 'range',
  disabledDate?: (d: Date) => boolean
): CalendarDay[][] {
  const first = startOfMonth(month);
  const firstWeekday = first.getDay();
  const offset = weekStartsOn === 1 ? (firstWeekday === 0 ? 6 : firstWeekday - 1) : firstWeekday;
  const startDate = addDays(first, -offset);

  const range = selectionMode === 'range' && Array.isArray(value) ? normalizeRange([value[0], value[1]]) : null;
  const singleDate = selectionMode === 'single' ? (value as Date | null | undefined) : null;

  const grid: CalendarDay[][] = [];
  let current = new Date(startDate);

  for (let row = 0; row < 6; row++) {
    const week: CalendarDay[] = [];
    for (let col = 0; col < 7; col++) {
      const d = new Date(current);
      const isCurrentMonth = d.getMonth() === month.getMonth();

      let isSelected = false;
      let isInRange = false;
      let isRangeStart = false;
      let isRangeEnd = false;

      if (selectionMode === 'single') {
        isSelected = isSameDay(d, singleDate);
      } else if (range) {
        const [start, end] = range;
        isRangeStart = isSameDay(d, start);
        isRangeEnd = isSameDay(d, end);
        isSelected = isRangeStart || isRangeEnd;
        isInRange = isBetween(d, start, end);
      }

      week.push({
        date: d,
        isCurrentMonth,
        isToday: isToday(d),
        isSelected,
        isDisabled: disabledDate ? disabledDate(d) : false,
        isInRange,
        isRangeStart,
        isRangeEnd,
      });
      current = addDays(current, 1);
    }
    grid.push(week);
  }
  return grid;
}

function formatMonthYear(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

type CalendarContentProps = Pick<
  CalendarProps,
  'value' | 'onChange' | 'defaultMonth' | 'disabledDate' | 'weekStartsOn' | 'weekdayLabels'
> & {
  selectionMode?: 'single' | 'range';
};

export const CalendarContent: React.FC<CalendarContentProps> = ({
  value,
  onChange,
  defaultMonth,
  disabledDate,
  weekStartsOn = 0,
  weekdayLabels = DEFAULT_WEEKDAY_LABELS,
  selectionMode = 'single',
}) => {
  const initialMonth = useMemo(() => {
    if (defaultMonth) return startOfMonth(defaultMonth);
    if (selectionMode === 'range' && Array.isArray(value) && value[0]) return startOfMonth(value[0]);
    if (selectionMode === 'single' && value && !Array.isArray(value)) return startOfMonth(value);
    return startOfMonth(new Date());
  }, [defaultMonth, selectionMode, value]);

  const [currentMonth, setCurrentMonth] = useState(() => initialMonth);

  const labels = useMemo(() => {
    if (weekStartsOn === 1) {
      return [...weekdayLabels.slice(1), weekdayLabels[0]];
    }
    return weekdayLabels;
  }, [weekStartsOn, weekdayLabels]);

  const grid = useMemo(
    () => buildMonthGrid(currentMonth, weekStartsOn, value, selectionMode, disabledDate),
    [currentMonth, weekStartsOn, value, selectionMode, disabledDate]
  );

  const goPrev = () => setCurrentMonth((m) => addMonths(m, -1));
  const goNext = () => setCurrentMonth((m) => addMonths(m, 1));

  const handleDayClick = (day: CalendarDay) => {
    if (day.isDisabled) return;

    if (selectionMode === 'single') {
      (onChange as (date: Date | null) => void)?.(day.date);
    } else {
      const range = (value as [Date, Date] | null | undefined) ?? null;
      const onChangeRange = onChange as ((range: [Date, Date] | null) => void) | undefined;

      if (!range) {
        onChangeRange?.([day.date, day.date]);
      } else {
        const [start, end] = normalizeRange(range);
        const clicked = day.date;

        if (isSameDay(clicked, start) || isSameDay(clicked, end) || isBetween(clicked, start, end)) {
          onChangeRange?.(null);
        } else if (isBefore(clicked, start)) {
          onChangeRange?.([clicked, end]);
        } else {
          onChangeRange?.([start, clicked]);
        }
      }
    }

    if (!day.isCurrentMonth) {
      setCurrentMonth(startOfMonth(day.date));
    }
  };

  return (
    <div className={styles.calendarContent}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          onClick={goPrev}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className={styles.monthYear}>{formatMonthYear(currentMonth)}</span>
        <button
          type="button"
          className={styles.navButton}
          onClick={goNext}
          aria-label="Next month"
        >
          ›
        </button>
      </header>

      <div className={styles.weekdayRow}>
        {labels.map((label, i) => (
          <div key={i} className={styles.weekdayCell}>
            {label}
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        {grid.map((week, rowIdx) =>
          week.map((day, colIdx) => (
            <button
              key={`${rowIdx}-${colIdx}`}
              type="button"
              className={[
                styles.dayCell,
                day.isCurrentMonth && styles.dayCurrentMonth,
                day.isToday && styles.dayToday,
                day.isSelected && styles.daySelected,
                day.isInRange && styles.dayInRange,
                day.isRangeStart && styles.dayRangeStart,
                day.isRangeEnd && styles.dayRangeEnd,
                day.isDisabled && styles.dayDisabled,
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleDayClick(day)}
              disabled={day.isDisabled}
              aria-label={day.date.toLocaleDateString()}
            >
              {day.date.getDate()}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
