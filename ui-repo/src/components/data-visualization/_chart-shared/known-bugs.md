# Known Bugs - Chart Shared

## CartesianGrid Clipping Issue

**Status**: Unresolved  
**Affected**: `combo-chart`, potentially other charts using `CartesianGrid`

### Description

Recharts' `CartesianGrid` component clips horizontal grid lines incorrectly. The following `GRID` constants in `constants.ts` do not work as expected:

- `showLeftBorder`, `showRightBorder`, `showTopBorder`, `showBottomBorder` - Border lines cannot be rendered correctly due to clipping
- `showVerticalGrid: true` - Incorrectly renders left and right borders instead of vertical grid lines

### Workaround

Currently using `ReferenceLine` components for horizontal grid lines as a partial workaround. Vertical grid lines and border controls remain broken.

### AI Note

**DO NOT** rely on these `GRID` constants for border or vertical grid control until this bug is fixed:
- `showLeftBorder`
- `showRightBorder`
- `showTopBorder`
- `showBottomBorder`
- `showVerticalGrid`
