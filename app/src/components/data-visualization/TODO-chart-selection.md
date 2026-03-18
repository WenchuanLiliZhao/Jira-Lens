# TODO: Chart Selection Feature

## Overview

Implement interactive node/bar selection for TrendChart and ColumnChart components.

## Feature Description

**User Interaction:**
- Users can click on data points (TrendChart) or bars (ColumnChart) to select them
- Selected elements are visually highlighted while unselected elements are dimmed
- Clicking an already selected element does not deselect it (single selection mode)

**Visual Feedback:**
- Selected nodes/bars: full opacity
- Unselected nodes/bars: reduced opacity (e.g., 0.475)
- Cursor changes to pointer on selectable elements

**Configuration Options:**
- `enableSelection`: Boolean to enable/disable the feature
- `defaultSelectedNode`: Pre-select a specific node on mount (label + seriesKey)
- `onNodeSelect`: Callback when selection changes
- `selectable` (per series): Allow marking certain series as non-selectable (always full opacity)

## Scope

- Shared `useChartSelection` hook in `_chart-shared/`
- Integration with TrendChart (dots on lines/areas)
- Integration with ColumnChart (bar cells)

## Acceptance Criteria

1. Selection state is managed internally with optional controlled mode
2. Non-selectable series remain at full opacity regardless of selection state
3. Selection callback provides label and seriesKey of selected node
4. Works correctly with all display modes (line, area, grouped, stacked, horizontal)
