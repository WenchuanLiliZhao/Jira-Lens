/**
 * LabelLayer Component
 *
 * Renders the labels and guide lines for the pie chart using the
 * dual-column layout positioning system.
 *
 * Features:
 * - Guide lines connecting labels to pie slices
 * - Support for 'always' and 'hover' display modes
 * - Smooth transitions for hover effects
 */

import React from 'react';
import type { LabelPosition } from './types';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Component Props                               */
/* -------------------------------------------------------------------------- */

export interface LabelLayerProps {
  /** Array of calculated label positions */
  positions: LabelPosition[];
  /** Label display mode: 'always' shows all, 'hover' shows only on hover */
  displayMode: 'always' | 'hover';
  /** Index of the currently hovered slice (only used in 'hover' mode) */
  activeIndex: number | null;
  /** Whether to show units in the labels */
  showUnit: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              Component                                      */
/* -------------------------------------------------------------------------- */

export const LabelLayer: React.FC<LabelLayerProps> = ({
  positions,
  displayMode,
  activeIndex,
  showUnit,
}) => {
  if (positions.length === 0) {
    return null;
  }

  return (
    <g className={styles['label-layer']}>
      {positions.map((label) => {
        // Determine visibility based on display mode:
        // - 'always': show all labels
        // - 'hover': only show the label for the hovered slice (none if nothing hovered)
        const isVisible = displayMode === 'always' 
          ? true 
          : activeIndex === label.index;

        if (!isVisible) {
          return null;
        }

        // Build the guide line points: start -> elbow -> end
        const guideLinePoints = [
          `${label.originalX},${label.originalY}`,
          `${label.elbowX},${label.elbowY}`,
          `${label.x},${label.y}`,
        ].join(' ');

        // Format the label text
        const labelText = showUnit && label.unit
          ? `${label.value}${label.unit}`
          : String(label.value);

        return (
          <g key={`label-${label.index}`} className={styles['label-group']}>
            {/* Guide line: connects pie slice to label */}
            <polyline
              points={guideLinePoints}
              className={styles['guide-line']}
            />
            
            {/* Small dot at the pie edge (optional visual enhancement) */}
            <circle
              cx={label.originalX}
              cy={label.originalY}
              r={2}
              className={styles['guide-dot']}
            />
            
            {/* Label text */}
            <text
              x={label.x}
              y={label.y}
              textAnchor={label.textAnchor}
              dominantBaseline="central"
              className={styles.label}
            >
              {labelText}
            </text>
          </g>
        );
      })}
    </g>
  );
};

LabelLayer.displayName = 'LabelLayer';
