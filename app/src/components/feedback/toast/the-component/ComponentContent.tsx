/**
 * ToastContent - Content Rendering Logic
 */

import React from 'react';

interface ToastContentProps {
  children?: React.ReactNode;
}

export const ToastContent: React.FC<ToastContentProps> = ({ children }) => {
  return <div>{children}</div>;
};
