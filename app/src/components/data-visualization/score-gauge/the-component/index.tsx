/**
 * ScoreGauge Component
 *
 * A semi-circular (or arbitrary-angle) gauge with two display modes:
 * 1. Score mode (default): single value progress on a gradient arc, e.g. NPS score 84.
 * 2. Distribution mode (segments prop): arc divided into proportional colored segments.
 *
 * AI Hints:
 * - `size` = pixel diameter of the gauge circle (default 180)
 * - `arcAngle` = total arc span in degrees, symmetric around 12 o'clock (default 180)
 * - Score mode: single gradient arc fill via stroke-dashoffset
 * - Distribution mode: each segment uses strokeDasharray "0 {start} {len} {rest}"
 * - Border and padding are NOT part of the component - define via wrapper or className
 *
 * Modification Guide:
 * - To add new prop: Modify ScoreGaugeProps interface
 * - To modify geometry: Modify buildArcPath / computeLayout
 * - To change render logic: Modify component's return statement
 */

import React, { useId, useState, useEffect } from "react";
import { chartRainbow } from "../../../../global-styles/colors";
import styles from "./styles.module.scss";

// ============ TYPES ============

export interface ColorStop {
  value: number;
  color: string;
}

export interface DistributionSegment {
  /** Absolute or proportional value; all segments are normalized to the total */
  value: number;
  /** CSS color string (use design token vars) */
  color: string;
  /** Optional label, e.g. "Promoter" */
  label?: string;
}

export interface ScoreGaugeProps {
  /** Current score value displayed in center, e.g. 84 */
  value?: number;
  /** Minimum value for score mode, default -100 (NPS) */
  min?: number;
  /** Maximum value for score mode, default 100 */
  max?: number;
  /** Optional label below value, e.g. "+4.0" */
  label?: string;
  /** Pixel diameter of the gauge, default 180 */
  size?: number;
  /** Total arc span in degrees, symmetric around 12 o'clock, default 180 */
  arcAngle?: number;

  // ---- Score mode (no segments) ----
  /** Color stops for arc gradient in score mode; default red/yellow/green */
  colorStops?: ColorStop[];

  // ---- Distribution mode ----
  /** When provided, renders arc as proportional colored segments (distribution mode) */
  segments?: DistributionSegment[];
  /** Gap between segments in px, default 2. Only used in distribution mode. */
  segmentGap?: number;

  /** Font size (px) for the center value. If omitted, defaults to size * 0.22. */
  valueFontSize?: number;
  /** Font size (px) for the center label and range labels. If omitted, defaults to size * 0.13. */
  labelFontSize?: number;

  /** Whether to show min/max range labels at arc ends, default true */
  showRangeLabels?: boolean;
  /** Animate on mount, default true */
  animated?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const DEFAULT_COLOR_STOPS: ColorStop[] = [
  { value: -100, color: chartRainbow["red-100"] },
  { value: 0, color: chartRainbow["yellow-100"] },
  { value: 100, color: chartRainbow["green-100"] },
];

// ============ CONSTANTS ============

const STROKE_WIDTH = 8;
const LABEL_HEIGHT = 20; // vertical space reserved below arc endpoints for range labels

// ============ HELPERS ============

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Build SVG path for an arc of `arcAngleDeg` degrees, centered at (0,0),
 * symmetric around 12 o'clock (270° in SVG clockwise convention).
 */
function buildArcPath(radius: number, arcAngleDeg: number): string {
  const halfAngle = (arcAngleDeg / 2) * (Math.PI / 180);
  const startAngle = Math.PI * 1.5 - halfAngle; // 270° - half
  const endAngle = Math.PI * 1.5 + halfAngle;   // 270° + half
  const sx = radius * Math.cos(startAngle);
  const sy = radius * Math.sin(startAngle);
  const ex = radius * Math.cos(endAngle);
  const ey = radius * Math.sin(endAngle);
  const largeArc = arcAngleDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${radius} ${radius} 0 ${largeArc} 1 ${ex} ${ey}`;
}

/** Arc length for an arbitrary angle */
function arcLength(radius: number, arcAngleDeg: number): number {
  return (arcAngleDeg / 180) * Math.PI * radius;
}

/**
 * Compute SVG viewBox and font sizes from size (diameter) and arcAngle.
 * Circle center is at (0, 0) in SVG local space.
 */
function computeLayout(sizeNum: number, arcAngleDeg: number) {
  const radius = sizeNum / 2;
  const halfAngle = (arcAngleDeg / 2) * (Math.PI / 180);

  // Y coordinate of arc endpoints in circle-center coords (center at 0,0)
  // Endpoint angle from 12 o'clock = halfAngle; y = -r*cos(halfAngle)
  const endpointY = -radius * Math.cos(halfAngle);

  const arcTopY = -radius; // topmost point of arc
  const topPad = STROKE_WIDTH / 2;
  const vbTop = arcTopY - topPad;
  const vbBottom = endpointY + LABEL_HEIGHT;
  const vbHeight = vbBottom - vbTop;
  const vbWidth = sizeNum + STROKE_WIDTH;
  const vbLeft = -sizeNum / 2 - STROKE_WIDTH / 2;

  // Range label positions (arc endpoints in circle-center coords)
  const endpointX = radius * Math.sin(halfAngle);
  const leftLabelX = -endpointX;
  const rightLabelX = endpointX;
  const rangeLabelY = endpointY + 14;

  return {
    radius,
    vbTop,
    vbLeft,
    vbWidth,
    vbHeight,
    endpointY,
    leftLabelX,
    rightLabelX,
    rangeLabelY,
  };
}

/** Map value to 0..1 progress */
function toProgress(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/** Map colorStop value to 0..1 gradient offset */
function toGradientOffset(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
}

/**
 * Build strokeDasharray that renders only the portion from startOffset to startOffset+segLen.
 * Pattern: "0 {start} {len} {huge}" → gap(start) then dash(len) then gap(rest)
 */
function buildSegmentDasharray(
  startOffset: number,
  segLen: number,
  circumference: number
): string {
  const rest = Math.max(circumference - startOffset - segLen, 0);
  return `0 ${startOffset} ${segLen} ${rest + circumference}`;
}

// ============ SUB-RENDERERS ============

interface ScoreArcProps {
  path: string;
  circumference: number;
  gradientId: string;
  gradientStops: Array<{ offset: number; color: string }>;
  displayProgress: number;
  progress: number;
}

const ScoreArc: React.FC<ScoreArcProps> = ({
  path,
  circumference,
  gradientId,
  gradientStops,
  displayProgress,
  progress,
}) => {
  const strokeDashoffset = (1 - displayProgress * progress) * circumference;

  return (
    <>
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
          gradientUnits="objectBoundingBox"
        >
          {gradientStops.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
      </defs>
      <path d={path} className={styles["score-gauge__track"]} fill="none" />
      <path
        d={path}
        className={styles["score-gauge__fill"]}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeDasharray={`${circumference}`}
        strokeDashoffset={strokeDashoffset}
      />
    </>
  );
};

interface DistributionArcProps {
  path: string;
  circumference: number;
  segments: DistributionSegment[];
  segmentGap: number;
  displayProgress: number;
}

const DistributionArc: React.FC<DistributionArcProps> = ({
  path,
  circumference,
  segments,
  segmentGap,
  displayProgress,
}) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return null;

  const totalGapLength = segmentGap * segments.length;
  const availableLength = Math.max(circumference - totalGapLength, 0);

  let startOffset = 0;
  const renderedSegments: Array<{ dasharray: string; color: string }> = [];

  segments.forEach((seg) => {
    const proportion = seg.value / total;
    const segLen = Math.max(proportion * availableLength * displayProgress, 0);
    renderedSegments.push({
      dasharray: buildSegmentDasharray(startOffset, segLen, circumference),
      color: seg.color,
    });
    startOffset += segLen + segmentGap;
  });

  return (
    <>
      {renderedSegments.map((seg, i) => (
        <path
          key={i}
          d={path}
          className={styles["score-gauge__segment"]}
          fill="none"
          stroke={seg.color}
          strokeDasharray={seg.dasharray}
        />
      ))}
    </>
  );
};

// ============ COMPONENT ============

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  value,
  min = -100,
  max = 100,
  label,
  size = 180,
  arcAngle = 180,
  colorStops = DEFAULT_COLOR_STOPS,
  segments,
  segmentGap = 2,
  valueFontSize,
  labelFontSize,
  showRangeLabels = true,
  animated = true,
  className,
}) => {
  const gradientId = useId();
  const [displayProgress, setDisplayProgress] = useState(animated ? 0 : 1);

  const isDistributionMode = segments !== undefined && segments.length > 0;
  const layout = computeLayout(size, arcAngle);
  const path = buildArcPath(layout.radius, arcAngle);
  const circumference = arcLength(layout.radius, arcAngle);
  const progress = value !== undefined ? toProgress(value, min, max) : 0;

  useEffect(() => {
    if (!animated) return;
    let id2: number | null = null;
    const id1 = requestAnimationFrame(() => {
      setDisplayProgress(0);
      id2 = requestAnimationFrame(() => {
        setDisplayProgress(1);
      });
    });
    return () => {
      cancelAnimationFrame(id1);
      if (id2 !== null) cancelAnimationFrame(id2);
    };
  }, [animated, arcAngle, size]);

  const resolvedValueFontSize = valueFontSize ?? Math.round(layout.radius * 0.44);
  const resolvedLabelFontSize = labelFontSize ?? Math.round(layout.radius * 0.26);

  const classNames = [styles["score-gauge"], className].filter(Boolean).join(" ");

  const sortedStops = [...colorStops].sort((a, b) => a.value - b.value);
  const gradientStops = sortedStops.map((s) => ({
    ...s,
    offset: toGradientOffset(s.value, min, max),
  }));

  const { vbLeft, vbTop, vbWidth, vbHeight } = layout;
  const viewBox = `${vbLeft} ${vbTop} ${vbWidth} ${vbHeight}`;

  return (
    <div className={classNames} style={{ width: size + STROKE_WIDTH }}>
      <svg
        className={styles["score-gauge__svg"]}
        viewBox={viewBox}
        width={size + STROKE_WIDTH}
        height={vbHeight}
        overflow="visible"
      >
        {isDistributionMode ? (
          <DistributionArc
            path={path}
            circumference={circumference}
            segments={segments}
            segmentGap={segmentGap}
            displayProgress={displayProgress}
          />
        ) : (
          <ScoreArc
            path={path}
            circumference={circumference}
            gradientId={gradientId}
            gradientStops={gradientStops}
            displayProgress={displayProgress}
            progress={progress}
          />
        )}

        {/* Center: value and label grouped, vertically centered at arc origin (0, 0) */}
        {(value !== undefined || (label !== undefined && label !== "")) && (() => {
          const hasValue = value !== undefined;
          const hasLabel = label !== undefined && label !== "";
          const CENTER_GAP = 4;
          // Total block height; when both present, stack value + gap + label
          const blockHeight = hasValue && hasLabel
            ? resolvedValueFontSize + CENTER_GAP + resolvedLabelFontSize
            : hasValue
              ? resolvedValueFontSize
              : resolvedLabelFontSize;
          // Top of the block so that the block's midpoint lands at y=0
          const blockTop = -blockHeight / 2;
          return (
            <>
              {hasValue && (
                <text
                  x="0"
                  y={blockTop}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  className={styles["score-gauge__value"]}
                  style={{ fontSize: resolvedValueFontSize }}
                >
                  {value}
                </text>
              )}
              {hasLabel && (
                <text
                  x="0"
                  y={hasValue ? blockTop + resolvedValueFontSize + CENTER_GAP : blockTop}
                  textAnchor="middle"
                  dominantBaseline="hanging"
                  className={styles["score-gauge__label"]}
                  // style={{ fontSize: resolvedLabelFontSize }}
                >
                  {label}
                </text>
              )}
            </>
          );
        })()}

        {/* Range labels at arc endpoints */}
        {showRangeLabels && (
          <>
            <text
              x={layout.leftLabelX}
              y={layout.rangeLabelY}
              textAnchor="middle"
              dominantBaseline="hanging"
              className={styles["score-gauge__range-label"]}
              // style={{ fontSize: resolvedLabelFontSize * 0.85 }}
            >
              {min}
            </text>
            <text
              x={layout.rightLabelX}
              y={layout.rangeLabelY}
              textAnchor="middle"
              dominantBaseline="hanging"
              className={styles["score-gauge__range-label"]}
              // style={{ fontSize: resolvedLabelFontSize * 0.85 }}
            >
              {max}
            </text>
          </>
        )}
      </svg>
    </div>
  );
};

ScoreGauge.displayName = "ScoreGauge";
