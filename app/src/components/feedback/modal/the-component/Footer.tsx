/**
 * Modal Footer
 */

import React from 'react';
import type { ModalFooterProps } from './types';
import styles from './styles.module.scss';

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
  ...rest
}) => {
  const combinedClassName = [styles.modal__footer, className].filter(Boolean).join(' ');

  return (
    <div className={combinedClassName} {...rest}>
      {children}
    </div>
  );
};

ModalFooter.displayName = 'Modal.Footer';
