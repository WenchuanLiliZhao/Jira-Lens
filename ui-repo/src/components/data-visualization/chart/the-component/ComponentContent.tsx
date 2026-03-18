/**
 * ChartContent - Content Rendering Logic
 */

import React from 'react';

interface ChartContentProps {
  children?: React.ReactNode;
}

export const ChartContent: React.FC<ChartContentProps> = ({ children }) => {
  return <div>{children}</div>;
};
