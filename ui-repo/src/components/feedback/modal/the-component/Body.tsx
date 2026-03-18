/**
 * Modal Body
 */

import React from 'react';
import { useModalContext } from './context';
import type { ModalBodyProps } from './types';
import styles from './styles.module.scss';

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className,
  id,
  ...rest
}) => {
  const { descriptionId } = useModalContext();
  const combinedClassName = [styles.modal__body, className].filter(Boolean).join(' ');

  return (
    <div
      id={id ?? descriptionId}
      className={combinedClassName}
      {...rest}
    >
      {children}
    </div>
  );
};

ModalBody.displayName = 'Modal.Body';
