/**
 * Form Components - Category Index
 * 
 * Auto-generated exports for category demo pages group.
 */

import type { DemoPagesGroup } from '../../types/react-demo-page-types';
import { CalendarDemoPage } from './calendar';
import { DateRangePickerDemoPage } from './date-range-picker';
import { FormDemoPage } from './form';
import { MultiSelectDemoPage } from './multi-select';
import { SearchDemoPage } from './search';
import { SelectDemoPage } from './select';
import { SliderDemoPage } from './slider';

export const FormDemoPages: DemoPagesGroup = {
  yaml: {
    title: 'Form',
    slug: 'form',
    status: ['done', 'draft', 'redesign-needed'],
    figma: ['draft', 'in-progress'],
  },
  pages: {
    CalendarDemoPage,
    DateRangePickerDemoPage,
    FormDemoPage,
    MultiSelectDemoPage,
    SearchDemoPage,
    SelectDemoPage,
    SliderDemoPage,
  },
};

// Component Exports
export { Calendar } from './calendar';
export { DateRangePicker } from './date-range-picker';
export { Form } from './form';
export { MultiSelect } from './multi-select';
export { Search } from './search';
export { Select } from './select';
export { Slider } from './slider';

// Type Exports
export type { CalendarProps } from './calendar';
export type { DateRangePickerProps } from './date-range-picker';
export type { FormProps } from './form';
export type { MultiSelectProps } from './multi-select';
export type { SearchProps } from './search';
export type { SelectProps } from './select';
export type { SliderProps } from './slider';
