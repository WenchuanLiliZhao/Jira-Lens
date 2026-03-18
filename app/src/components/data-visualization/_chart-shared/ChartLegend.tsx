/**
 * ChartLegend - Shared Legend Component for Charts
 *
 * A customizable legend component for use with chart components.
 * Supports icons and configurable positioning.
 */

import React from 'react';
import clsx from 'clsx';
import { Icon } from '../../general/icon';
import type { ChartLegendProps } from './types';
import { LEGEND } from './constants';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const ChartLegend: React.FC<ChartLegendProps> = ({
  items,
  position = LEGEND.defaultPosition,
  className,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        styles.legendArea,
        position === 'top' && styles['legendArea--top'],
        className
      )}
    >
      <div className={styles.customLegend}>
        {items.map((item, index) => (
          <div key={item.key || index} className={styles.legendItem}>
            {/* Icon or color indicator */}
            {item.icon ? (
              <span className={styles.legendIcon} style={{ color: item.color }}>
                <Icon icon={item.icon} />
              </span>
            ) : (
              <span
                className={styles.legendColor}
                style={{ backgroundColor: item.color }}
              />
            )}
            {/* Title */}
            <span className={styles.legendTitle}>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

ChartLegend.displayName = 'ChartLegend';

/* -------------------------------------------------------------------------- */
/*                           Default Export                                   */
/* -------------------------------------------------------------------------- */

export default ChartLegend;
