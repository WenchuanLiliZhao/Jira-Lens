/**
 * General Components - Category Index
 * 
 * Auto-generated exports for category demo pages group.
 */

import type { DemoPagesGroup } from '../../types/react-demo-page-types';
import { BadgeDemoPage } from './badge';
import { ButtonDemoPage } from './button';
import { ButtonGroupDemoPage } from './button-group';
import { DropdownMenuDemoPage } from './dropdown-menu';
import { FABDemoPage } from './fab';
import { IconDemoPage } from './icon';
import { LabelDemoPage } from './label';
import { ProgressBarDemoPage } from './progress-bar';
import { ToggleSwitchDemoPage } from './toggle-switch';

export const GeneralDemoPages: DemoPagesGroup = {
  yaml: {
    title: 'General',
    slug: 'general',
    status: ['done', 'draft', 'redesign-needed'],
    figma: ['done', 'draft', 'in-progress', 'incomplete', 'not-necessary'],
  },
  pages: {
    BadgeDemoPage,
    ButtonDemoPage,
    ButtonGroupDemoPage,
    DropdownMenuDemoPage,
    FABDemoPage,
    IconDemoPage,
    LabelDemoPage,
    ProgressBarDemoPage,
    ToggleSwitchDemoPage,
  },
};

// Component Exports
export { Badge } from './badge';
export { Button } from './button';
export { ButtonGroup } from './button-group';
export { DropdownMenu } from './dropdown-menu';
export { FAB } from './fab';
export { Icon } from './icon';
export { Label } from './label';
export { ProgressBar } from './progress-bar';
export { ToggleSwitch } from './toggle-switch';

// Type Exports
export type { BadgeProps } from './badge';
export type { ButtonProps } from './button';
export type { ButtonGroupProps } from './button-group';
export type { DropdownMenuProps } from './dropdown-menu';
export type { FABProps } from './fab';
export type { IconProps } from './icon';
export type { LabelProps } from './label';
export type { ProgressBarProps } from './progress-bar';
export type { ToggleSwitchProps } from './toggle-switch';
