/**
 * Label Positioning Algorithm for Pie Chart
 *
 * Implements a dual-column layout with guide lines for label collision avoidance.
 * Labels are positioned on fixed vertical lines (left and right columns) and
 * adjusted vertically to prevent overlapping.
 *
 * Features:
 * - Dual-column layout (left/right sides)
 * - Bidirectional collision resolution
 * - Boundary constraints to prevent overflow
 * - Dynamic gap adjustment for many labels
 * - Small slice filtering
 * - Centering optimization
 */

import type { PieChartDataItem, LabelPosition } from './types';
import { LABEL_COLLISION } from './constants';

/* -------------------------------------------------------------------------- */
/*                              Constants                                      */
/* -------------------------------------------------------------------------- */

const RADIAN = Math.PI / 180;

/* -------------------------------------------------------------------------- */
/*                          Helper Functions                                   */
/* -------------------------------------------------------------------------- */

/**
 * Normalizes an angle to the range [0, 360).
 */
const normalizeAngle = (angle: number): number => {
  return ((angle % 360) + 360) % 360;
};

/**
 * Determines if an angle places the label on the right side of the chart.
 * Right side: angles from 270° to 360° (top-right quadrant) or 0° to 90° (bottom-right quadrant)
 */
const isRightSide = (normalizedAngle: number): boolean => {
  return normalizedAngle >= 270 || normalizedAngle <= 90;
};

/**
 * Calculates the total value of all data items.
 */
const calculateTotal = (data: PieChartDataItem[]): number => {
  return data.reduce((sum, item) => sum + item.value, 0);
};

/**
 * Filters out data items with values too small to display labels.
 */
const filterSmallSlices = (
  data: PieChartDataItem[],
  total: number
): PieChartDataItem[] => {
  if (total === 0) return [];
  
  return data.filter((item) => {
    const percent = (item.value / total) * 100;
    return percent >= LABEL_COLLISION.minSlicePercent;
  });
};

/* -------------------------------------------------------------------------- */
/*                       Collision Resolution                                  */
/* -------------------------------------------------------------------------- */

/**
 * Resolves vertical collisions within a label group using bidirectional adjustment.
 * First pushes overlapping labels down, then adjusts if boundary is exceeded.
 */
const resolveCollisionsBidirectional = (
  labels: LabelPosition[],
  cy: number,
  maxRadius: number,
  minGap: number
): void => {
  if (labels.length <= 1) return;

  // Sort by Y coordinate (top to bottom)
  labels.sort((a, b) => a.y - b.y);

  // Calculate boundaries
  const boundaryPadding = maxRadius * LABEL_COLLISION.boundaryPadding;
  const minY = cy - maxRadius + boundaryPadding;
  const maxY = cy + maxRadius - boundaryPadding;
  const availableHeight = maxY - minY;

  // Check if we need to reduce gap due to too many labels
  const requiredHeight = (labels.length - 1) * minGap;
  const effectiveGap = requiredHeight > availableHeight
    ? availableHeight / (labels.length - 1)
    : minGap;

  // Phase 1: Push overlapping labels down
  for (let i = 1; i < labels.length; i++) {
    const prev = labels[i - 1];
    const curr = labels[i];
    const gap = curr.y - prev.y;

    if (gap < effectiveGap) {
      curr.y = prev.y + effectiveGap;
    }
  }

  // Phase 2: Check if bottom label exceeds boundary
  const bottomLabel = labels[labels.length - 1];
  if (bottomLabel.y > maxY) {
    // Calculate how much to shift the entire group up
    const overflow = bottomLabel.y - maxY;
    
    // Shift all labels up
    labels.forEach((label) => {
      label.y -= overflow;
    });
  }

  // Phase 3: Check if top label exceeds boundary after shift
  const topLabel = labels[0];
  if (topLabel.y < minY) {
    // If both boundaries are exceeded, we need to compress further
    // Redistribute labels evenly within the available space
    const step = availableHeight / (labels.length - 1 || 1);
    labels.forEach((label, i) => {
      label.y = minY + i * step;
    });
  }
};

/**
 * Attempts to center a label group around the chart center for better visual balance.
 */
const centerLabelGroup = (
  labels: LabelPosition[],
  cy: number
): void => {
  if (labels.length === 0) return;

  // Calculate the vertical center of the label group
  const totalY = labels.reduce((sum, l) => sum + l.y, 0);
  const avgY = totalY / labels.length;
  const offset = cy - avgY;

  // Only apply centering if the offset is significant
  if (Math.abs(offset) <= LABEL_COLLISION.centeringThreshold) return;

  // Check if we can shift without breaking min gap constraints
  const adjustedOffset = offset * LABEL_COLLISION.centeringFactor;
  
  // Apply the centering adjustment
  labels.forEach((label) => {
    label.y += adjustedOffset;
  });
};

/**
 * Updates the elbow positions after Y coordinates have been adjusted.
 * The elbow Y should match the label Y for horizontal guide lines.
 */
const updateElbowPositions = (labels: LabelPosition[]): void => {
  labels.forEach((label) => {
    label.elbowY = label.y;
  });
};

/* -------------------------------------------------------------------------- */
/*                       Main Calculation Function                             */
/* -------------------------------------------------------------------------- */

/**
 * Calculates label positions for all data items using the dual-column layout algorithm.
 *
 * @param data - Array of pie chart data items
 * @param cx - X coordinate of the pie chart center
 * @param cy - Y coordinate of the pie chart center
 * @param outerRadius - Outer radius of the pie chart
 * @param startAngle - Start angle in degrees (typically 90 for top start)
 * @returns Array of LabelPosition objects with calculated coordinates
 */
export const calculateLabelPositions = (
  data: PieChartDataItem[],
  cx: number,
  cy: number,
  outerRadius: number,
  startAngle: number = 90
): LabelPosition[] => {
  // Handle edge cases
  if (!data || data.length === 0) return [];

  const total = calculateTotal(data);
  if (total === 0) return [];

  // Filter out slices that are too small for labels
  const visibleData = filterSmallSlices(data, total);
  if (visibleData.length === 0) return [];

  // Calculate label column positions (fixed X coordinates)
  const labelRadius = outerRadius * LABEL_COLLISION.labelRadiusOuter;
  const elbowRadius = outerRadius * LABEL_COLLISION.labelRadiusMiddle;
  const rightLabelX = cx + labelRadius;
  const leftLabelX = cx - labelRadius;

  // Calculate initial positions for all labels
  let currentAngle = startAngle;
  const allLabels: LabelPosition[] = [];

  // We need to iterate through ALL data to get correct angles,
  // but only create labels for visible (non-tiny) slices
  const visibleIds = new Set(visibleData.map(d => d.id));
  
  data.forEach((item, index) => {
    const sliceAngle = (item.value / total) * 360;
    const midAngle = currentAngle - sliceAngle / 2;
    currentAngle -= sliceAngle;

    // Skip if this slice is too small for a label
    if (!visibleIds.has(item.id)) return;

    const normalizedAngle = normalizeAngle(midAngle);
    const onRightSide = isRightSide(normalizedAngle);

    // Calculate Y coordinate based on angle (using label radius for initial position)
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

    // X coordinate is fixed on the column line
    const x = onRightSide ? rightLabelX : leftLabelX;

    // Calculate pie edge position (guide line start point)
    const originalX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const originalY = cy + outerRadius * Math.sin(-midAngle * RADIAN);

    // Calculate elbow position (between pie edge and label)
    const elbowX = onRightSide ? cx + elbowRadius : cx - elbowRadius;
    const elbowY = y; // Initially same as label Y, will be updated after collision resolution

    allLabels.push({
      index,
      x,
      y,
      originalX,
      originalY,
      elbowX,
      elbowY,
      textAnchor: onRightSide ? 'start' : 'end',
      value: item.value,
      unit: item.unit,
      color: item.color,
      midAngle,
    });
  });

  // Split into left and right groups
  const rightLabels = allLabels.filter((l) => l.textAnchor === 'start');
  const leftLabels = allLabels.filter((l) => l.textAnchor === 'end');

  // Resolve collisions for each group
  const maxRadius = labelRadius;
  const minGap = LABEL_COLLISION.minLabelGap;

  resolveCollisionsBidirectional(rightLabels, cy, maxRadius, minGap);
  resolveCollisionsBidirectional(leftLabels, cy, maxRadius, minGap);

  // Apply centering optimization
  centerLabelGroup(rightLabels, cy);
  centerLabelGroup(leftLabels, cy);

  // Re-resolve collisions after centering (centering might introduce new overlaps)
  resolveCollisionsBidirectional(rightLabels, cy, maxRadius, minGap);
  resolveCollisionsBidirectional(leftLabels, cy, maxRadius, minGap);

  // Update elbow positions to match final label Y coordinates
  updateElbowPositions(rightLabels);
  updateElbowPositions(leftLabels);

  // Combine and return all labels
  return [...rightLabels, ...leftLabels];
};

