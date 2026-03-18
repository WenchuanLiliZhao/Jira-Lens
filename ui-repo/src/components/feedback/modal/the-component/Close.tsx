/**
 * Modal Close
 *
 * Wraps a child element to close the modal on click. Use for close/cancel buttons.
 */

import React from 'react';
import { useModalContext } from './context';

export interface ModalCloseProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement;
  className?: string;
}

export const ModalClose: React.FC<ModalCloseProps> = ({ children }) => {
  const { closeModal } = useModalContext();

  const handleClick = (e: React.MouseEvent) => {
    closeModal();
    (children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props?.onClick?.(e);
  };

  return React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>, {
        onClick: handleClick,
      })
    : children;
};

ModalClose.displayName = 'Modal.Close';
