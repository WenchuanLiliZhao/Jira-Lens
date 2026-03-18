/**
 * PieChartContent - Core Rendering Logic
 *
 * Contains the Recharts PieChart rendering with:
 * - Dual-column label positioning with collision avoidance
 * - Guide lines connecting labels to slices
 * - Tooltip integration
 * - Legend integration
 * - Hover state management
 */

import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import type {
  PieChartProps,
  PieChartDataItem,
  PieChartInternalData,
} from './types';
import {
  DEFAULT_DESIGN,
  DEFAULT_COLOR_SCHEME,
  LABEL_COLLISION,
} from './constants';
import { calculateLabelPositions } from './labelPositioning';
import { LabelLayer } from './LabelLayer';
import { PieChartTooltip } from './PieChartTooltip';
import { PieChartLegend } from './PieChartLegend';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

/**
 * Resolves the size value to pixels, using default if not provided.
 */
const resolveSize = (size: PieChartProps['size']): number => {
  return size ?? DEFAULT_DESIGN.defaultDiameter;
};

/**
 * Assigns colors to data items using the color scheme.
 */
const assignColors = (
  data: PieChartDataItem[],
  colorScheme: string[] = DEFAULT_COLOR_SCHEME as unknown as string[]
): PieChartDataItem[] => {
  return data.map((item, index) => ({
    ...item,
    color: item.color || colorScheme[index % colorScheme.length],
  }));
};

/**
 * Calculates the SVG container size needed to fit labels.
 * Labels are positioned at labelRadiusOuter * outerRadius from center,
 * plus additional space for text.
 */
const calculateContainerSize = (
  diameter: number,
  showLabels: boolean
): { width: number; height: number; padding: number } => {
  if (!showLabels) {
    return { width: diameter, height: diameter, padding: 0 };
  }
  
  // Calculate extra space needed for labels
  // Labels are at 1.35x radius, plus ~40px for text on each side
  const labelTextWidth = 50; // approximate width for label text
  const labelRadius = (diameter / 2) * LABEL_COLLISION.labelRadiusOuter;
  const padding = labelRadius - diameter / 2 + labelTextWidth;
  
  return {
    width: diameter + padding * 2,
    height: diameter + padding * 2,
    padding,
  };
};

/* -------------------------------------------------------------------------- */
/*                              Content Props                                 */
/* -------------------------------------------------------------------------- */

export interface PieChartContentProps {
  data: PieChartDataItem[];
  size: PieChartProps['size'];
  ringWidth: number;
  legendPosition: NonNullable<PieChartProps['legendPosition']>;
  legendWidth: number;
  showLegendValue: boolean;
  showLegendUnit: boolean;
  labelDisplay: NonNullable<PieChartProps['labelDisplay']>;
  showLabelUnit: boolean;
  showTooltip: boolean;
  tooltipFormatter?: PieChartProps['tooltipFormatter'];
  colorScheme?: string[];
  onSliceClick?: PieChartProps['onSliceClick'];
  onSliceHover?: PieChartProps['onSliceHover'];
  spacing: number;
}

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const PieChartContent: React.FC<PieChartContentProps> = ({
  data,
  size,
  ringWidth,
  legendPosition,
  legendWidth,
  showLegendValue,
  showLegendUnit,
  labelDisplay,
  showLabelUnit,
  showTooltip,
  tooltipFormatter,
  colorScheme,
  onSliceClick,
  onSliceHover,
  spacing,
}) => {
  // State for tracking hovered slice
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  // Resolve size to pixels
  const diameter = resolveSize(size);

  // Assign colors to data items
  const coloredData = React.useMemo(
    () => assignColors(data, colorScheme),
    [data, colorScheme]
  );

  // Transform data for Recharts with original item reference
  const chartData: PieChartInternalData[] = React.useMemo(
    () =>
      coloredData.map((item) => ({
        ...item,
        originalItem: item,
      })),
    [coloredData]
  );

  // Calculate inner radius for donut effect
  const innerRadius = Math.max(0, diameter / 2 - ringWidth);
  const outerRadius = diameter / 2;

  // Determine if labels should be shown based on display mode
  const enableLabels = labelDisplay !== 'none';

  // Calculate container size (larger if showing labels)
  const containerSize = React.useMemo(
    () => calculateContainerSize(diameter, enableLabels),
    [diameter, enableLabels]
  );

  // Calculate center coordinates for the pie (accounting for padding)
  const cx = containerSize.width / 2;
  const cy = containerSize.height / 2;

  // Calculate label positions using the collision avoidance algorithm
  const labelPositions = React.useMemo(() => {
    if (!enableLabels) return [];
    return calculateLabelPositions(
      coloredData,
      cx,
      cy,
      outerRadius,
      DEFAULT_DESIGN.startAngle
    );
  }, [coloredData, cx, cy, outerRadius, enableLabels]);

  // Handle mouse enter on slice
  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
    if (onSliceHover && coloredData[index]) {
      onSliceHover(coloredData[index]);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setActiveIndex(null);
    if (onSliceHover) {
      onSliceHover(null);
    }
  };

  // Handle click on slice
  const handleClick = (index: number) => {
    if (onSliceClick && coloredData[index]) {
      onSliceClick(coloredData[index]);
    }
  };


  return (
    <>
      {/* Chart Container */}
      <div
        className={styles['chart-wrapper']}
        style={{
          width: containerSize.width,
          height: containerSize.height,
          flexShrink: 0,
        }}
      >
        <RechartsPieChart
          width={containerSize.width}
          height={containerSize.height}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          {/* Tooltip */}
          {showTooltip && (
            <Tooltip
              content={<PieChartTooltip formatter={tooltipFormatter} />}
              wrapperStyle={{ outline: 'none', zIndex: 1000 }}
            />
          )}

          {/* Pie */}
          <Pie
            data={chartData as unknown as Record<string, unknown>[]}
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={0}
            dataKey="value"
            startAngle={DEFAULT_DESIGN.startAngle}
            endAngle={DEFAULT_DESIGN.endAngle}
            label={false}
            labelLine={false}
            stroke="none"
            isAnimationActive={false}
            onMouseLeave={handleMouseLeave}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${entry.id}`}
                fill={entry.color}
                style={{ outline: 'none', cursor: onSliceClick ? 'pointer' : 'default' }}
                strokeWidth={0}
                onMouseEnter={() => handleMouseEnter(index)}
                onClick={() => handleClick(index)}
              />
            ))}
          </Pie>

          {/* Custom Label Layer with collision avoidance */}
          {enableLabels && labelPositions.length > 0 && (
            <LabelLayer
              positions={labelPositions}
              displayMode={labelDisplay as 'always' | 'hover'}
              activeIndex={activeIndex}
              showUnit={showLabelUnit}
            />
          )}
        </RechartsPieChart>
      </div>

      {/* Legend */}
      {legendPosition !== 'none' && (
        <div
          style={{
            ...(legendPosition === 'bottom'
              ? { marginTop: spacing }
              : { marginLeft: spacing }),
          }}
        >
          <PieChartLegend
            data={coloredData}
            position={legendPosition}
            width={legendWidth}
            showValue={showLegendValue}
            showUnit={showLegendUnit}
          />
        </div>
      )}
    </>
  );
};

PieChartContent.displayName = 'PieChartContent';
