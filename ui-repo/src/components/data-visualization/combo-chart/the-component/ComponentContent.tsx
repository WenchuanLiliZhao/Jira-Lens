/**
 * ComboChartContent - Inner Implementation
 *
 * Contains the core chart rendering logic using Recharts ComposedChart.
 * Supports dual Y-axes with mixed column and line visualizations.
 */

import React, { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import type { ComboChartProps, YAxisId, GridConfig } from './types';
import type { CustomDotProps } from '../../_chart-shared';
import {
  ChartLegend,
  ChartTooltip,
  DEFAULT_COLOR_SCHEME,
  SPACING,
  TYPOGRAPHY,
  Y_AXIS,
  LINE_CHART,
  HOVER,
  FILL_OPACITY_BY_MODE,
  STROKE_WIDTH_BY_MODE,
  getFormatterByName,
  formatDecimal,
} from '../../_chart-shared';
import {
  COMBO_COLUMN,
  COMBO_LINE,
  GRID,
} from './constants';
import sharedStyles from '../../_chart-shared/styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                           Helper Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Calculate nice tick values for Y-axis based on data range.
 * Returns approximately 5 evenly spaced ticks.
 */
function calculateYAxisTicks(data: Record<string, unknown>[], seriesKeys: string[]): number[] {
  // Find min and max values across all series
  let min = Infinity;
  let max = -Infinity;
  
  data.forEach(point => {
    seriesKeys.forEach(key => {
      const value = point[key];
      if (typeof value === 'number' && !isNaN(value)) {
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
    });
  });
  
  // If no valid data, return empty
  if (min === Infinity || max === -Infinity) {
    return [];
  }
  
  // Add some padding
  const range = max - min;
  const paddedMin = min - range * 0.05;
  const paddedMax = max + range * 0.05;
  
  // Calculate nice step size
  const roughStep = (paddedMax - paddedMin) / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalizedStep = roughStep / magnitude;
  
  let niceStep;
  if (normalizedStep < 1.5) niceStep = 1;
  else if (normalizedStep < 3) niceStep = 2;
  else if (normalizedStep < 7) niceStep = 5;
  else niceStep = 10;
  
  const step = niceStep * magnitude;
  
  // Generate ticks
  const ticks: number[] = [];
  const start = Math.floor(paddedMin / step) * step;
  for (let tick = start; tick <= paddedMax; tick += step) {
    ticks.push(Math.round(tick * 100) / 100); // Round to 2 decimal places
  }
  
  return ticks;
}

/**
 * Normalize grid configuration to a consistent object format.
 * Inspired by Chart.js's declarative grid API.
 *
 * @param grid - Grid configuration (boolean or GridConfig object)
 * @returns Normalized grid config with explicit horizontal/vertical booleans
 */
function normalizeGridConfig(
  grid: boolean | GridConfig | undefined
): { horizontal: boolean; vertical: boolean } {
  // false = no grid
  if (grid === false) {
    return { horizontal: false, vertical: false };
  }
  // true or undefined = default (horizontal only)
  if (grid === true || grid === undefined) {
    return { horizontal: true, vertical: false };
  }
  // Object = use provided values with defaults
  return {
    horizontal: grid.horizontal ?? true,
    vertical: grid.vertical ?? false,
  };
}

/* -------------------------------------------------------------------------- */
/*                           Component Props (Internal)                       */
/* -------------------------------------------------------------------------- */

type ComboChartContentProps = Omit<ComboChartProps, 'className' | 'style'>;

/* -------------------------------------------------------------------------- */
/*                           Helper: Create Custom Dot                        */
/* -------------------------------------------------------------------------- */

/**
 * Factory function to create a custom dot component for line series.
 * Follows trend-chart pattern for consistency.
 */
const createCustomDot = (color: string) => {
  return function CustomDot(props: CustomDotProps) {
    const { cx, cy, payload } = props;
    if (!cx || !cy || !payload) return null;

    return (
      <circle
        cx={cx}
        cy={cy}
        r={LINE_CHART.dotRadius}
        fill={LINE_CHART.dotFill}
        stroke={color}
        strokeWidth={LINE_CHART.dotStrokeWidth}
      />
    );
  };
};

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const ComboChartContent: React.FC<ComboChartContentProps> = ({
  data,
  series,
  leftYAxis,
  rightYAxis,
  showLegend = true,
  legendPosition = 'bottom',
  grid = true,
  chartMargin,
  xAxisPadding,
}) => {
  // Normalize grid configuration to { horizontal, vertical }
  const gridConfig = useMemo(() => normalizeGridConfig(grid), [grid]);
  // Compute spacing values
  const spacing = useMemo(
    () => ({
      top: chartMargin?.top ?? SPACING.chartMargin.top,
      right: chartMargin?.right ?? SPACING.chartMargin.right,
      bottom: chartMargin?.bottom ?? SPACING.chartMargin.bottom,
      left: chartMargin?.left ?? SPACING.chartMargin.left,
    }),
    [chartMargin]
  );

  // Compute X-axis padding
  const xAxisPaddingValue = useMemo(
    () => ({
      ...SPACING.xAxisPadding,
      ...xAxisPadding,
    }),
    [xAxisPadding]
  );

  // Compute left Y-axis formatter
  const leftTickFormatter = useMemo(() => {
    // Custom formatter takes precedence
    if (leftYAxis?.tickFormatter) return leftYAxis.tickFormatter;
    
    // Use preset format if provided
    if (leftYAxis?.format) {
      if (leftYAxis.format === 'decimal') {
        return (value: number) => formatDecimal(value, leftYAxis.decimalPrecision);
      }
      return getFormatterByName(leftYAxis.format);
    }
    
    // No formatting - let Recharts handle it
    return undefined;
  }, [leftYAxis]);

  // Compute right Y-axis formatter
  const rightTickFormatter = useMemo(() => {
    // Custom formatter takes precedence
    if (rightYAxis?.tickFormatter) return rightYAxis.tickFormatter;
    
    // Use preset format if provided
    if (rightYAxis?.format) {
      if (rightYAxis.format === 'decimal') {
        return (value: number) => formatDecimal(value, rightYAxis.decimalPrecision);
      }
      return getFormatterByName(rightYAxis.format);
    }
    
    // No formatting - let Recharts handle it
    return undefined;
  }, [rightYAxis]);

  // Prepare legend items
  const legendItems = useMemo(
    () =>
      series.map((s, index) => ({
        key: s.key,
        title: s.title,
        color: s.color || DEFAULT_COLOR_SCHEME[index % DEFAULT_COLOR_SCHEME.length],
        icon: s.icon,
      })),
    [series]
  );

  // Determine which Y-axes are needed
  const needsLeftAxis = useMemo(() => {
    if (leftYAxis) return true;
    return series.some((s) => {
      const yAxisId = s.yAxisId || (s.type === 'column' ? COMBO_COLUMN.defaultYAxisId : COMBO_LINE.defaultYAxisId);
      return yAxisId === 'left';
    });
  }, [series, leftYAxis]);

  const needsRightAxis = useMemo(() => {
    if (rightYAxis) return true;
    return series.some((s) => {
      const yAxisId = s.yAxisId || (s.type === 'column' ? COMBO_COLUMN.defaultYAxisId : COMBO_LINE.defaultYAxisId);
      return yAxisId === 'right';
    });
  }, [series, rightYAxis]);

  // Development warning: Single-axis charts should use left axis
  if (process.env.NODE_ENV === 'development') {
    if (!needsLeftAxis && needsRightAxis) {
      console.warn(
        '[ComboChart] Single-axis charts must use leftYAxis, not rightYAxis. ' +
        'All series should have yAxisId="left" or omit yAxisId (defaults to left). ' +
        'Right axis is reserved for secondary metrics in dual-axis scenarios.'
      );
    }
  }

  // Calculate Y-axis ticks for horizontal grid lines
  const leftYAxisTicks = useMemo(() => {
    if (!needsLeftAxis || !gridConfig.horizontal) return [];
    
    // If custom ticks are provided, use them
    if (leftYAxis?.ticks) return leftYAxis.ticks;
    
    // Otherwise, calculate from data
    const leftSeriesKeys = series
      .filter(s => {
        const yAxisId = s.yAxisId || (s.type === 'column' ? COMBO_COLUMN.defaultYAxisId : COMBO_LINE.defaultYAxisId);
        return yAxisId === 'left';
      })
      .map(s => s.key);
    
    return calculateYAxisTicks(data, leftSeriesKeys);
  }, [data, series, leftYAxis, needsLeftAxis, gridConfig.horizontal]);

  const rightYAxisTicks = useMemo(() => {
    if (!needsRightAxis || !gridConfig.horizontal) return [];
    
    // If custom ticks are provided, use them
    if (rightYAxis?.ticks) return rightYAxis.ticks;
    
    // Otherwise, calculate from data
    const rightSeriesKeys = series
      .filter(s => {
        const yAxisId = s.yAxisId || (s.type === 'column' ? COMBO_COLUMN.defaultYAxisId : COMBO_LINE.defaultYAxisId);
        return yAxisId === 'right';
      })
      .map(s => s.key);
    
    return calculateYAxisTicks(data, rightSeriesKeys);
  }, [data, series, rightYAxis, needsRightAxis, gridConfig.horizontal]);

  // Render gradient definitions for area fills
  const renderGradientDefs = () => {
    return series
      .filter((s) => {
        if (s.type !== 'line') return false;
        const displayAs = s.displayAs || 'line';
        return displayAs === 'area' || displayAs === 'line-area';
      })
      .map((s, index) => {
        const color =
          (s.type === 'line' ? s.fillColor : undefined) ||
          s.color ||
          DEFAULT_COLOR_SCHEME[index % DEFAULT_COLOR_SCHEME.length];
        const gradientId = `combo-gradient-${s.key}`;
        return (
          <linearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        );
      });
  };

  // Render series based on type and displayAs
  const renderSeries = () => {
    return series.map((s, index) => {
      const color = s.color || DEFAULT_COLOR_SCHEME[index % DEFAULT_COLOR_SCHEME.length];
      const yAxisId: YAxisId = s.yAxisId || (s.type === 'column' ? COMBO_COLUMN.defaultYAxisId : COMBO_LINE.defaultYAxisId);

      // Render column series
      if (s.type === 'column') {
        return (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.title}
            yAxisId={yAxisId}
            fill={color}
            radius={s.radius || COMBO_COLUMN.radius}
            barSize={s.barSize || COMBO_COLUMN.barSize}
          />
        );
      }

      // Render line series with display modes
      const displayAs = s.displayAs || 'line';
      const strokeWidth = s.strokeWidth || STROKE_WIDTH_BY_MODE[displayAs];

      // Custom dot for line/area
      const CustomDot = createCustomDot(color);

      if (displayAs === 'line') {
        return (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.title}
            yAxisId={yAxisId}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={s.strokeDasharray}
            connectNulls={s.connectNulls ?? false}
            dot={<CustomDot />}
            activeDot={{ r: LINE_CHART.activeDotRadius }}
          />
        );
      }

      // Area modes (line-area or area)
      const gradientId = `combo-gradient-${s.key}`;
      const fillOpacity = s.fillOpacity !== undefined ? s.fillOpacity : FILL_OPACITY_BY_MODE[displayAs];

      return (
        <Area
          key={s.key}
          type="monotone"
          dataKey={s.key}
          name={s.title}
          yAxisId={yAxisId}
          stroke={displayAs === 'area' ? 'none' : color}
          strokeWidth={strokeWidth}
          strokeDasharray={s.strokeDasharray}
          connectNulls={s.connectNulls ?? false}
          fill={`url(#${gradientId})`}
          fillOpacity={fillOpacity}
          dot={<CustomDot />}
          activeDot={{ r: LINE_CHART.activeDotRadius }}
        />
      );
    });
  };

  return (
    <>
      {/* Top spacing */}
      {spacing.top > 0 && <div style={{ height: spacing.top, flexShrink: 0 }} />}

      {/* Legend - Top */}
      {showLegend && legendPosition === 'top' && (
        <ChartLegend items={legendItems} position="top" />
      )}

      {/* Chart Surface */}
      <div className={sharedStyles.chartSurface}>
        {/* Left spacing */}
        {spacing.left > 0 && <div style={{ width: spacing.left, flexShrink: 0 }} />}

        {/* Chart Content */}
        <div className={sharedStyles.chartContent}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: GRID.topOffset, right: 0, bottom: 0, left: 0 }}
            >
              {/* Gradient definitions for area fills */}
              <defs>{renderGradientDefs()}</defs>

              {/* Vertical grid lines (at X-axis tick positions) */}
              {gridConfig.vertical && (
                <CartesianGrid
                  stroke={GRID.strokeColor}
                  strokeDasharray="0"
                  horizontal={false}
                  vertical={true}
                />
              )}

              {/* Horizontal grid lines - using ReferenceLine because Recharts CartesianGrid horizontal is broken */}
              {/* Only draw grid lines for the primary axis (left if exists, otherwise right) */}
              {gridConfig.horizontal && needsLeftAxis && leftYAxisTicks.map((tick, index) => (
                <ReferenceLine
                  key={`h-grid-${index}`}
                  y={tick}
                  yAxisId="left"
                  stroke={GRID.strokeColor}
                  strokeWidth={1}
                  strokeDasharray="0"
                />
              ))}
              {gridConfig.horizontal && !needsLeftAxis && needsRightAxis && rightYAxisTicks.map((tick, index) => (
                <ReferenceLine
                  key={`h-grid-${index}`}
                  y={tick}
                  yAxisId="right"
                  stroke={GRID.strokeColor}
                  strokeWidth={1}
                  strokeDasharray="0"
                />
              ))}

              {/* X-Axis - follows column-chart/trend-chart standard */}
              <XAxis
                dataKey="label"
                tick={{
                  fill: TYPOGRAPHY.axisLabelColor,
                  fontSize: TYPOGRAPHY.axisLabelFontSize,
                  style: {
                    fontSize: TYPOGRAPHY.axisLabelFontSize,
                    fill: TYPOGRAPHY.axisLabelColor,
                  },
                }}
                axisLine={false}
                tickLine={false}
                padding={xAxisPaddingValue}
                dy={10}
              />

              {/* Left Y-Axis - follows column-chart/trend-chart standard */}
              {needsLeftAxis && (
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  domain={leftYAxis?.domain}
                  ticks={leftYAxis?.ticks || (gridConfig.horizontal ? leftYAxisTicks : undefined)}
                  tickFormatter={leftTickFormatter}
                  tick={{
                    fill: TYPOGRAPHY.axisLabelColor,
                    fontSize: TYPOGRAPHY.axisLabelFontSize,
                    style: {
                      fontSize: TYPOGRAPHY.axisLabelFontSize,
                      fill: TYPOGRAPHY.axisLabelColor,
                    },
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={Y_AXIS.width}
                  label={
                    leftYAxis?.label && (leftYAxis.showLabel ?? Y_AXIS.showLabel)
                      ? {
                          value: leftYAxis.label,
                          angle: -90,
                          position: 'insideLeft',
                          style: {
                            fill: TYPOGRAPHY.axisLabelColor,
                            fontSize: TYPOGRAPHY.axisLabelFontSize,
                            textAnchor: 'middle',
                          },
                        }
                      : undefined
                  }
                />
              )}

              {/* Right Y-Axis - follows column-chart/trend-chart standard */}
              {needsRightAxis && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={rightYAxis?.domain}
                  ticks={rightYAxis?.ticks || (gridConfig.horizontal ? rightYAxisTicks : undefined)}
                  tickFormatter={rightTickFormatter}
                  tick={{
                    fill: TYPOGRAPHY.axisLabelColor,
                    fontSize: TYPOGRAPHY.axisLabelFontSize,
                    style: {
                      fontSize: TYPOGRAPHY.axisLabelFontSize,
                      fill: TYPOGRAPHY.axisLabelColor,
                    },
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={Y_AXIS.width}
                  label={
                    rightYAxis?.label && (rightYAxis.showLabel ?? Y_AXIS.showLabel)
                      ? {
                          value: rightYAxis.label,
                          angle: 90,
                          position: 'insideRight',
                          style: {
                            fill: TYPOGRAPHY.axisLabelColor,
                            fontSize: TYPOGRAPHY.axisLabelFontSize,
                            textAnchor: 'middle',
                          },
                        }
                      : undefined
                  }
                />
              )}

              {/* Render all series */}
              {renderSeries()}

              {/* Tooltip - follows trend-chart standard */}
              <Tooltip
                content={<ChartTooltip seriesConfig={series} />}
                cursor={{
                  stroke: HOVER.cursorStroke,
                  strokeWidth: 1,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Right spacing */}
        {spacing.right > 0 && <div style={{ width: spacing.right, flexShrink: 0 }} />}
      </div>

      {/* Legend - Bottom */}
      {showLegend && legendPosition === 'bottom' && (
        <ChartLegend items={legendItems} position="bottom" />
      )}

      {/* Bottom spacing */}
      {spacing.bottom > 0 && <div style={{ height: spacing.bottom, flexShrink: 0 }} />}
    </>
  );
};
