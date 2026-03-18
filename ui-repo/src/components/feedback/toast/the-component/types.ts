/**
 * Toast Component Types
 */

import React from 'react';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Component content */
  children?: React.ReactNode;
  
  /** Design variant */
  variant?: 'default' | 'primary' | 'secondary';
  
  /** Size */
  size?: 'small' | 'medium' | 'large';
  
  /** Whether component is disabled */
  disabled?: boolean;
  
  /** Custom class name */
  className?: string;
}
