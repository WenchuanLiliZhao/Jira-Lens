/**
 * ProgressBar Component
 *
 * Horizontal progress bar for showing a value relative to a max (e.g. district GDP ranking).
 * Renders a track with a fill; optionally shows label and value text.
 *
 * AI Hints:
 * - Use value/max for fill width; clamp to 0–100%
 * - When max is 0, show 0% fill
 */

import React from 'react';
import styles from './styles.module.scss';

// ============ TYPES ============

export interface ProgressBarProps {
  /** Current value (used with max for fill width) */
  value: number;
  /** Maximum value; fill width = value / max * 100% */
  max: number;
  /** Label shown before or beside the bar (e.g. district name) */
  label: string;
  /** Optional formatted value text (e.g. "2,750Bn") */
  valueLabel?: string;
  /** Optional fill color; defaults to --chart-rainbow-red-100 */
  color?: string;
}

// ============ COMPONENT ============

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  valueLabel,
  color,
}) => {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  return (
    <div className={styles['progress-bar']} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={`${label}: ${valueLabel ?? value}`}>
      <div className={styles['progress-bar__header']}>
        <span className={styles['progress-bar__label']}>{label}</span>
        {valueLabel != null && (
          <span className={styles['progress-bar__value']}>{valueLabel}</span>
        )}
      </div>
      <div className={styles['progress-bar__track']}>
        <div
          className={styles['progress-bar__fill']}
          style={{
            width: `${percent}%`,
            backgroundColor: color ?? 'var(--chart-rainbow-red-100)',
          }}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';
