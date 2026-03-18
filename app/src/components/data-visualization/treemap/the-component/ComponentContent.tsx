/**
 * TreemapContent - Core Rendering Logic
 *
 * Contains the Recharts Treemap rendering with:
 * - Custom cell content renderer with labels
 * - Color assignment from color scheme
 * - Tooltip integration
 * - Hover state management
 */

import React from 'react';
import {
  Treemap as RechartsTreemap,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { TreemapProps, TreemapDataItem, TreemapContentProps } from './types';
import { DEFAULT_COLOR_SCHEME, TYPOGRAPHY, DEFAULT_DESIGN } from './constants';
import { TreemapTooltip } from './TreemapTooltip';

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

/**
 * Recursively assigns colors to data items using the color scheme.
 * Root-level items get colors from the scheme, children inherit parent color.
 */
const assignColors = (
  data: TreemapDataItem[],
  colorScheme: string[] = DEFAULT_COLOR_SCHEME as unknown as string[],
  parentColor?: string
): TreemapDataItem[] => {
  return data.map((item, index) => {
    const itemColor = item.color || parentColor || colorScheme[index % colorScheme.length];
    
    return {
      ...item,
      color: itemColor,
      children: item.children
        ? assignColors(item.children, colorScheme, itemColor)
        : undefined,
    };
  });
};

/* -------------------------------------------------------------------------- */
/*                           Custom Cell Content                              */
/* -------------------------------------------------------------------------- */

interface CustomizedContentProps extends TreemapContentProps {
  showLabels: boolean;
  minLabelWidth: number;
  minLabelHeight: number;
  showValue: boolean;
  strokeColor: string;
  strokeWidth: number;
  onNodeClick?: (item: TreemapDataItem) => void;
  onNodeHover?: (item: TreemapDataItem | null) => void;
  activeNodeId: string | null;
  // Recharts spreads data properties directly onto props
  color?: string;
  id?: string;
  unit?: string;
  unitPosition?: 'before' | 'after';
  subtitle?: string;
  tertiaryLabel?: string;
  tertiaryColor?: string;
}

const CustomizedContent: React.FC<CustomizedContentProps> = ({
  x,
  y,
  width,
  height,
  depth,
  name,
  value,
  fill,
  showLabels,
  minLabelWidth,
  minLabelHeight,
  showValue,
  strokeColor,
  strokeWidth,
  onNodeClick,
  onNodeHover,
  payload,
  activeNodeId,
  color,
  id,
  unit,
  unitPosition,
  subtitle,
  tertiaryLabel,
  tertiaryColor,
}) => {
  // Only render leaf nodes (depth > 0)
  if (depth === 0) return null;

  // Use id from direct prop or from payload
  const nodeId = id || payload?.id;
  const isActive = nodeId === activeNodeId;
  const canShowLabel = showLabels && width >= minLabelWidth && height >= minLabelHeight;

  // Get the color: direct prop > payload.color > default fill
  const nodeColor = color || (payload as unknown as TreemapDataItem)?.color || fill;

  // Adjust opacity based on depth for hierarchical effect
  const baseOpacity = Math.max(0.6, 1 - (depth - 1) * 0.15);
  const opacity = isActive ? 0.85 : baseOpacity;

  // Get all fields from props or payload
  const payloadData = payload as unknown as TreemapDataItem;
  const nodeUnit = unit || payloadData?.unit;
  const nodeUnitPosition = unitPosition || payloadData?.unitPosition || 'after';
  const nodeSubtitle = subtitle || payloadData?.subtitle;
  const nodeTertiaryLabel = tertiaryLabel || payloadData?.tertiaryLabel;
  const nodeTertiaryColor = tertiaryColor || payloadData?.tertiaryColor || TYPOGRAPHY.tertiaryColor;

  // Construct the data item from available props
  const dataItem: TreemapDataItem = {
    id: nodeId || '',
    name: name || '',
    value,
    color: nodeColor,
    unit: nodeUnit,
    unitPosition: nodeUnitPosition,
    subtitle: nodeSubtitle,
    tertiaryLabel: nodeTertiaryLabel,
    tertiaryColor: nodeTertiaryColor,
  };

  // Format value with unit based on position
  const formatValueWithUnit = (val: number | undefined) => {
    if (val === undefined) return '';
    const formattedValue = typeof val === 'number' ? val.toLocaleString() : val;
    if (!nodeUnit) return formattedValue;
    return nodeUnitPosition === 'before' 
      ? `${nodeUnit}${formattedValue}` 
      : `${formattedValue}${nodeUnit}`;
  };

  const handleClick = () => {
    if (onNodeClick) {
      onNodeClick(dataItem);
    }
  };

  const handleMouseEnter = () => {
    if (onNodeHover) {
      onNodeHover(dataItem);
    }
  };

  const handleMouseLeave = () => {
    if (onNodeHover) {
      onNodeHover(null);
    }
  };

  // Calculate text positioning - centered horizontally and vertically
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const maxTextWidth = width - DEFAULT_DESIGN.cellPadding * 2;
  
  // Determine which lines to show
  const hasSubtitle = !!nodeSubtitle;
  const hasTertiary = !!(nodeTertiaryLabel || (showValue && value !== undefined));
  const tertiaryText = nodeTertiaryLabel || formatValueWithUnit(value);
  
  // Count visible lines
  const lineCount = 1 + (hasSubtitle ? 1 : 0) + (hasTertiary ? 1 : 0);
  
  // Calculate total height of all text lines
  const { lineGap, nameFontSize, subtitleFontSize, tertiaryFontSize } = TYPOGRAPHY;
  const totalHeight = 
    nameFontSize + 
    (hasSubtitle ? lineGap + subtitleFontSize : 0) + 
    (hasTertiary ? lineGap + tertiaryFontSize : 0);
  
  // Calculate Y positions for each line (centered as a group)
  const startY = centerY - totalHeight / 2;
  const nameY = startY + nameFontSize / 2;
  const subtitleY = nameY + nameFontSize / 2 + lineGap + subtitleFontSize / 2;
  const tertiaryY = hasSubtitle 
    ? subtitleY + subtitleFontSize / 2 + lineGap + tertiaryFontSize / 2
    : nameY + nameFontSize / 2 + lineGap + tertiaryFontSize / 2;

  // Check if cell is large enough for multi-line content
  const canShowMultiLine = canShowLabel && height >= (minLabelHeight + lineCount * 12);

  return (
    <g
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: onNodeClick ? 'pointer' : 'default' }}
    >
      {/* Cell rectangle */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={nodeColor}
        fillOpacity={opacity}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        rx={2}
        ry={2}
      />

      {/* Line 1: Name (always shown if canShowLabel) */}
      {canShowLabel && (
        <text
          x={centerX}
          y={canShowMultiLine ? nameY : centerY}
          fill={TYPOGRAPHY.nameColor}
          stroke="none"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: `${TYPOGRAPHY.nameFontSize}px`,
            fontWeight: TYPOGRAPHY.nameFontWeight,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {name && name.length > maxTextWidth / 8
            ? `${name.slice(0, Math.floor(maxTextWidth / 8))}...`
            : name}
        </text>
      )}

      {/* Line 2: Subtitle (optional) */}
      {canShowMultiLine && hasSubtitle && (
        <text
          x={centerX}
          y={subtitleY}
          fill={TYPOGRAPHY.subtitleColor}
          stroke="none"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: `${TYPOGRAPHY.subtitleFontSize}px`,
            fontWeight: TYPOGRAPHY.subtitleFontWeight,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {nodeSubtitle && nodeSubtitle.length > maxTextWidth / 7
            ? `${nodeSubtitle.slice(0, Math.floor(maxTextWidth / 7))}...`
            : nodeSubtitle}
        </text>
      )}

      {/* Line 3: Tertiary label / Value (optional) */}
      {canShowMultiLine && hasTertiary && (
        <text
          x={centerX}
          y={tertiaryY}
          fill={nodeTertiaryColor}
          stroke="none"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontSize: `${TYPOGRAPHY.tertiaryFontSize}px`,
            fontWeight: TYPOGRAPHY.tertiaryFontWeight,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {tertiaryText && tertiaryText.length > maxTextWidth / 7
            ? `${tertiaryText.slice(0, Math.floor(maxTextWidth / 7))}...`
            : tertiaryText}
        </text>
      )}
    </g>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Content Props                                 */
/* -------------------------------------------------------------------------- */

export interface TreemapContentComponentProps {
  data: TreemapDataItem[];
  aspectRatio: number;
  showLabels: boolean;
  minLabelWidth: number;
  minLabelHeight: number;
  showValue: boolean;
  showTooltip: boolean;
  tooltipFormatter?: TreemapProps['tooltipFormatter'];
  colorScheme?: string[];
  strokeColor: string;
  strokeWidth: number;
  onNodeClick?: TreemapProps['onNodeClick'];
  onNodeHover?: TreemapProps['onNodeHover'];
}

/* -------------------------------------------------------------------------- */
/*                              Component                                     */
/* -------------------------------------------------------------------------- */

export const TreemapContent: React.FC<TreemapContentComponentProps> = ({
  data,
  aspectRatio,
  showLabels,
  minLabelWidth,
  minLabelHeight,
  showValue,
  showTooltip,
  tooltipFormatter,
  colorScheme,
  strokeColor,
  strokeWidth,
  onNodeClick,
  onNodeHover,
}) => {
  // State for tracking hovered node
  const [activeNodeId, setActiveNodeId] = React.useState<string | null>(null);

  // Assign colors to data items
  const coloredData = React.useMemo(
    () => assignColors(data, colorScheme),
    [data, colorScheme]
  );

  // Handle hover state
  const handleNodeHover = React.useCallback(
    (item: TreemapDataItem | null) => {
      setActiveNodeId(item?.id || null);
      if (onNodeHover) {
        onNodeHover(item);
      }
    },
    [onNodeHover]
  );

  // Always use ResponsiveContainer to fill the parent chartArea
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsTreemap
        data={coloredData as unknown as Record<string, unknown>[]}
        dataKey="value"
        aspectRatio={aspectRatio}
        stroke={strokeColor}
        fill="var(--chart-rainbow-blue-100)"
        isAnimationActive={false}
        content={
          <CustomizedContent
            showLabels={showLabels}
            minLabelWidth={minLabelWidth}
            minLabelHeight={minLabelHeight}
            showValue={showValue}
            strokeColor={strokeColor}
            strokeWidth={strokeWidth}
            onNodeClick={onNodeClick}
            onNodeHover={handleNodeHover}
            activeNodeId={activeNodeId}
            // Required props that will be filled by Recharts
            x={0}
            y={0}
            width={0}
            height={0}
            depth={0}
            index={0}
            name=""
            value={0}
            fill=""
            root={{} as TreemapContentProps['root']}
            payload={{} as TreemapContentProps['payload']}
          />
        }
      >
        {showTooltip && (
          <Tooltip
            content={<TreemapTooltip formatter={tooltipFormatter} />}
            wrapperStyle={{ outline: 'none', zIndex: 1000 }}
          />
        )}
      </RechartsTreemap>
    </ResponsiveContainer>
  );
};

TreemapContent.displayName = 'TreemapContent';
