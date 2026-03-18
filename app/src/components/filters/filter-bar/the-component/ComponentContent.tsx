/**
 * FilterBarContent - Content Rendering Logic
 */

import React from 'react';

interface FilterBarContentProps {
  children?: React.ReactNode;
}

export const FilterBarContent: React.FC<FilterBarContentProps> = ({ children }) => {
  return <div>{children}</div>;
};
