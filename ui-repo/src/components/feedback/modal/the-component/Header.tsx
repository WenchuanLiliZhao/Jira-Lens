/**
 * Modal Header
 */

import React from 'react';
import { useModalContext } from './context';
import type { ModalHeaderProps } from './types';
import styles from './styles.module.scss';

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className,
  id,
  ...rest
}) => {
  const { titleId } = useModalContext();
  const combinedClassName = [styles.modal__header, className].filter(Boolean).join(' ');

  return (
    <div
      id={id ?? titleId}
      className={combinedClassName}
      {...rest}
    >
      {children}
    </div>
  );
};

ModalHeader.displayName = 'Modal.Header';
