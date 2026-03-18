/**
 * DateRangePickerContent - Content Rendering Logic
 */

import React from 'react';

interface DateRangePickerContentProps {
  children?: React.ReactNode;
}

export const DateRangePickerContent: React.FC<DateRangePickerContentProps> = ({ children }) => {
  return <div>{children}</div>;
};
