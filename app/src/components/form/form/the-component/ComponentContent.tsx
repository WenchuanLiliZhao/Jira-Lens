/**
 * FormContent - Content Rendering Logic
 */

import React from 'react';

interface FormContentProps {
  children?: React.ReactNode;
}

export const FormContent: React.FC<FormContentProps> = ({ children }) => {
  return <div>{children}</div>;
};
