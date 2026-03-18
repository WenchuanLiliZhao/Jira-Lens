/**
 * Modal Content
 *
 * Renders the modal overlay and dialog in a portal. Handles escape key, overlay click,
 * focus trap, and scroll lock.
 */

import React, { useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useModalContext } from './context';
import { useClickOutside, useEscapeKey, usePreventScroll, useFocusTrap } from './hooks';
import type { ModalContentProps } from './types';
import styles from './styles.module.scss';
import { Button } from '../../../general/button';

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  className,
  ...rest
}) => {
  const {
    isOpen,
    closeModal,
    size,
    closeOnOverlayClick,
    closeOnEscape,
    setContentRef,
    titleId,
    descriptionId,
  } = useModalContext();

  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContentRef(dialogRef);
    return () => setContentRef(null);
  }, [setContentRef]);

  useEscapeKey(closeModal, isOpen && closeOnEscape);
  usePreventScroll(isOpen);

  const clickOutsideRefs = useMemo(() => [dialogRef] as (React.RefObject<HTMLElement | null> | null)[], []);
  useClickOutside(clickOutsideRefs, closeModal, isOpen && closeOnOverlayClick);

  useFocusTrap(dialogRef, isOpen);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  const dialogClassName = [
    styles.modal__dialog,
    styles[`modal__dialog--size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <div
      ref={overlayRef}
      className={styles.modal__overlay}
      role="presentation"
      onClick={handleOverlayClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy ?? titleId}
        aria-describedby={ariaDescribedBy ?? descriptionId}
        className={dialogClassName}
        {...rest}
      >
        <Button
          // size="small"
          startIcon="close"
          variant="ghost"
          className={styles.modal__close}
          onClick={closeModal}
          aria-label="Close"
        >
        </Button>
        {children}
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

ModalContent.displayName = 'Modal.Content';
