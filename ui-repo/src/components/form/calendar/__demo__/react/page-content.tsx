import React, { useState } from 'react';
import styles from './styles.module.scss';
import { Calendar } from '../../the-component';
import { DropdownMenu } from '../../../../general/dropdown-menu';
import { Button } from '../../../../general/button';

/**
 * Calendar Demo Page Content
 *
 * AI Hint: This is a demo page showcasing all usage patterns of the Calendar component.
 * Compact month-view calendar for date selection (Date Picker popup).
 */
const PageContent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedDateUncontrolled, setSelectedDateUncontrolled] = useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = useState<[Date, Date] | null>(null);

  const isWeekend = (d: Date) => {
    const day = d.getDay();
    return day === 0 || day === 6;
  };

  const isPast = (d: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };

  return (
    <div className={styles['component-demo-container']}>
      <h1>Calendar Component Demo</h1>

      <section className={styles['component-demo-section']}>
        <h2>Basic Usage (Controlled)</h2>
        <p>Select a date. Selected: {selectedDate ? selectedDate.toLocaleDateString() : 'none'}</p>
        <Calendar value={selectedDate} onChange={setSelectedDate} />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Uncontrolled with defaultMonth</h2>
        <p>Opens at March 2025. Selected: {selectedDateUncontrolled ? selectedDateUncontrolled.toLocaleDateString() : 'none'}</p>
        <Calendar
          value={selectedDateUncontrolled}
          onChange={setSelectedDateUncontrolled}
          defaultMonth={new Date(2025, 2, 1)}
        />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Disabled Dates (weekends)</h2>
        <p>Weekends are disabled.</p>
        <Calendar value={selectedDate} onChange={setSelectedDate} disabledDate={isWeekend} />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Disabled Past Dates</h2>
        <p>Past dates cannot be selected.</p>
        <Calendar value={selectedDate} onChange={setSelectedDate} disabledDate={isPast} />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Week Starts on Monday</h2>
        <p>First column is Monday.</p>
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          weekStartsOn={1}
          weekdayLabels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
        />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Range Selection</h2>
        <p>
          First click sets start=end. Second click extends left or right. Click within range to clear.
          {selectedRange
            ? ` Selected: ${selectedRange[0].toLocaleDateString()} – ${selectedRange[1].toLocaleDateString()}`
            : ' No range selected.'}
        </p>
        <Calendar
          selectionMode="range"
          value={selectedRange}
          onChange={setSelectedRange}
        />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Calendar in Dropdown Menu</h2>
        <p>
          Calendar without frame, used as menu content. Selected:{' '}
          {selectedDate ? selectedDate.toLocaleDateString() : 'none'}
        </p>
        <DropdownMenu>
          <DropdownMenu.Trigger asChild>
            <Button variant="outlined">Pick date</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <Calendar value={selectedDate} onChange={setSelectedDate} />
          </DropdownMenu.Content>
        </DropdownMenu>
      </section>
    </div>
  );
};

export default PageContent;
