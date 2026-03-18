/**
 * CustomGridRenderer Component
 * 
 * A complete replacement for Recharts CartesianGrid that provides independent control
 * over borders and grid lines. This component extracts tick positions from Recharts'
 * coordinate system and renders SVG lines with full granularity.
 * 
 * Key Features:
 * - Independent control of 4 borders (top, right, bottom, left)
 * - Independent control of horizontal and vertical grid lines
 * - No parameter interference between borders and grid lines
 * - Works with single or dual Y-axes
 * 
 * Usage:
 * This component must be used within Recharts' Customized component wrapper
 * to receive the coordinate system context.
 * 
 * @example
 * import { Customized } from 'recharts';
 * 
 * <ComposedChart data={data}>
 *   <Customized
 *     component={CustomGridRenderer}
 *     showHorizontalGrid={true}
 *     showVerticalGrid={true}
 *     showTopBorder={false}
 *     showBottomBorder={true}
 *     stroke="rgba(0, 0, 0, 0.1)"
 *   />
 *   <XAxis ... />
 *   <YAxis ... />
 * </ComposedChart>
 */

import React from 'react';

/* -------------------------------------------------------------------------- */
/*                              Types                                         */
/* -------------------------------------------------------------------------- */

/**
 * Recharts X-axis tick object
 */
interface XAxisTick {
  coordinate?: number;
  [key: string]: unknown;
}

/**
 * Recharts X-axis configuration object
 */
interface XAxisConfig {
  ticks?: XAxisTick[];
  [key: string]: unknown;
}

/**
 * Recharts Y-axis configuration object
 */
interface YAxisConfig {
  niceTicks?: number[];
  scale?: (value: number) => number;
  [key: string]: unknown;
}

export interface CustomGridRendererProps {
  /** Chart coordinate system - X-axis map (provided by Recharts) */
  xAxisMap?: Record<string, XAxisConfig>;
  /** Chart coordinate system - Y-axis map (provided by Recharts) */
  yAxisMap?: Record<string, YAxisConfig>;
  /** Chart area offset coordinates (provided by Recharts) */
  offset?: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
  };
  
  /* Grid line configuration */
  /** Whether to show horizontal grid lines at Y-axis ticks */
  showHorizontalGrid?: boolean;
  /** Whether to show vertical grid lines at X-axis ticks */
  showVerticalGrid?: boolean;
  
  /* Border configuration */
  /** Whether to show top border */
  showTopBorder?: boolean;
  /** Whether to show right border */
  showRightBorder?: boolean;
  /** Whether to show bottom border */
  showBottomBorder?: boolean;
  /** Whether to show left border */
  showLeftBorder?: boolean;
  
  /* Styling */
  /** Stroke color for all lines */
  stroke?: string;
  /** Stroke width for all lines */
  strokeWidth?: number;
}

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

/**
 * Extract Y-axis tick positions from Recharts yAxisMap.
 * Handles both single and dual Y-axes.
 */
function extractYAxisTicks(yAxisMap?: Record<string, YAxisConfig>): number[] {
  console.log('extractYAxisTicks called with:', yAxisMap);
  
  if (!yAxisMap) {
    console.log('No yAxisMap provided');
    return [];
  }
  
  const ticks: number[] = [];
  
  // Iterate through all Y-axes (typically 'left' and/or 'right')
  Object.entries(yAxisMap).forEach(([key, axis]: [string, YAxisConfig]) => {
    console.log(`Processing Y-axis "${key}":`, axis);
    console.log('  - niceTicks:', axis?.niceTicks);
    console.log('  - scale:', typeof axis?.scale);
    
    if (axis?.niceTicks && Array.isArray(axis.niceTicks)) {
      // niceTicks contains the Y values
      // We need to convert them to pixel coordinates using the scale
      axis.niceTicks.forEach((tickValue: number) => {
        if (axis.scale && typeof axis.scale === 'function') {
          const pixelY = axis.scale(tickValue);
          console.log(`    Tick value ${tickValue} -> pixel Y: ${pixelY}`);
          if (typeof pixelY === 'number' && !isNaN(pixelY)) {
            ticks.push(pixelY);
          }
        }
      });
    }
  });
  
  console.log('Final Y ticks:', ticks);
  
  // Remove duplicates and sort
  return Array.from(new Set(ticks)).sort((a, b) => a - b);
}

/**
 * Extract X-axis tick positions from Recharts xAxisMap.
 */
function extractXAxisTicks(xAxisMap?: Record<string, XAxisConfig>): number[] {
  console.log('extractXAxisTicks called with:', xAxisMap);
  
  if (!xAxisMap) {
    console.log('No xAxisMap provided');
    return [];
  }
  
  const ticks: number[] = [];
  
  // Typically there's only one X-axis
  Object.entries(xAxisMap).forEach(([key, axis]: [string, XAxisConfig]) => {
    console.log(`Processing X-axis "${key}":`, axis);
    console.log('  - ticks:', axis?.ticks);
    
    if (axis?.ticks && Array.isArray(axis.ticks)) {
      // ticks contains objects with coordinate information
      axis.ticks.forEach((tick: XAxisTick, index: number) => {
        console.log(`    Tick ${index}:`, tick);
        if (tick?.coordinate !== undefined) {
          const pixelX = tick.coordinate;
          console.log(`    Coordinate: ${pixelX}`);
          if (typeof pixelX === 'number' && !isNaN(pixelX)) {
            ticks.push(pixelX);
          }
        }
      });
    }
  });
  
  console.log('Final X ticks:', ticks);
  
  return ticks;
}

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

/**
 * CustomGridRenderer
 * 
 * Renders grid lines and borders with complete independent control.
 * Automatically receives coordinate context from Recharts when used via Customized.
 */
export const CustomGridRenderer: React.FC<CustomGridRendererProps> = (props) => {
  const {
    xAxisMap,
    yAxisMap,
    offset,
    showHorizontalGrid = true,
    showVerticalGrid = true,
    showTopBorder = false,
    showRightBorder = false,
    showBottomBorder = false,
    showLeftBorder = false,
    stroke = 'rgba(0, 0, 0, 0.1)',
    strokeWidth = 1,
  } = props;
  
  // Debug: Log ALL props to see what Recharts is actually passing
  console.log('CustomGridRenderer received ALL props:', props);
  console.log('Props keys:', Object.keys(props));
  console.log('Props stringified:', JSON.stringify(props, null, 2));

  // If nothing is enabled, render nothing
  if (!showHorizontalGrid && !showVerticalGrid && 
      !showTopBorder && !showRightBorder && !showBottomBorder && !showLeftBorder) {
    return null;
  }

  // Extract chart area boundaries
  const chartArea = offset || {};
  const left = chartArea.left || 0;
  const right = (chartArea.left || 0) + (chartArea.width || 0);
  const top = chartArea.top || 0;
  const bottom = (chartArea.top || 0) + (chartArea.height || 0);

  // Extract tick positions
  const yTicks = showHorizontalGrid ? extractYAxisTicks(yAxisMap) : [];
  const xTicks = showVerticalGrid ? extractXAxisTicks(xAxisMap) : [];

  console.log('Extracted ticks:', {
    yTicks,
    xTicks,
    chartArea: { left, right, top, bottom }
  });

  return (
    <g className="custom-grid-renderer">
      {/* Horizontal Grid Lines (at Y-axis ticks) */}
      {showHorizontalGrid && yTicks.map((y, index) => (
        <line
          key={`h-grid-${index}-${y}`}
          className="custom-grid-horizontal"
          x1={left}
          y1={y}
          x2={right}
          y2={y}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
        />
      ))}

      {/* Vertical Grid Lines (at X-axis ticks) */}
      {showVerticalGrid && xTicks.map((x, index) => (
        <line
          key={`v-grid-${index}-${x}`}
          className="custom-grid-vertical"
          x1={x}
          y1={top}
          x2={x}
          y2={bottom}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
        />
      ))}

      {/* Top Border */}
      {showTopBorder && (
        <line
          className="custom-border-top"
          x1={left}
          y1={top}
          x2={right}
          y2={top}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
        />
      )}

      {/* Right Border */}
      {showRightBorder && (
        <line
          className="custom-border-right"
          x1={right}
          y1={top}
          x2={right}
          y2={bottom}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
        />
      )}

      {/* Bottom Border */}
      {showBottomBorder && (
        <line
          className="custom-border-bottom"
          x1={left}
          y1={bottom}
          x2={right}
          y2={bottom}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
        />
      )}

      {/* Left Border */}
      {showLeftBorder && (
        <line
          className="custom-border-left"
          x1={left}
          y1={top}
          x2={left}
          y2={bottom}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
        />
      )}
    </g>
  );
};
