/**
 * MultiSelectContent - Content Rendering Logic
 */

import React from 'react';

interface MultiSelectContentProps {
  children?: React.ReactNode;
}

export const MultiSelectContent: React.FC<MultiSelectContentProps> = ({ children }) => {
  return <div>{children}</div>;
};
