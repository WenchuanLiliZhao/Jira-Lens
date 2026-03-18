/**
 * DevToolbarContent - Content Rendering Logic
 */

import React from 'react';

interface DevToolbarContentProps {
  children?: React.ReactNode;
}

export const DevToolbarContent: React.FC<DevToolbarContentProps> = ({ children }) => {
  return <div>{children}</div>;
};
