/**
 * Modal Component - Root
 *
 * Compound component root. Manages open state and provides context to Trigger and Content.
 *
 * Usage:
 * ```tsx
 * <Modal>
 *   <Modal.Trigger><Button>Open</Button></Modal.Trigger>
 *   <Modal.Content>
 *     <Modal.Header>Title</Modal.Header>
 *     <Modal.Body>Content</Modal.Body>
 *     <Modal.Footer><Button>Close</Button></Modal.Footer>
 *   </Modal.Content>
 * </Modal>
 * ```
 */

import React, { useState, useCallback, useMemo, useId } from 'react';
import { ModalProvider } from './context';
import { useControllableState } from './hooks';
import type { ModalProps } from './types';

export const Modal: React.FC<ModalProps> = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size = 'medium',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useControllableState(
    controlledOpen,
    defaultOpen,
    onOpenChange
  );

  const [triggerRef, setTriggerRef] = useState<React.RefObject<HTMLElement | null> | null>(null);
  const [contentRef, setContentRef] = useState<React.RefObject<HTMLDivElement | null> | null>(null);

  const titleId = useId();
  const descriptionId = useId();

  const openModal = useCallback(() => {
    if (!disabled) setIsOpen(true);
  }, [disabled, setIsOpen]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const toggleModal = useCallback(() => {
    if (!disabled) setIsOpen(!isOpen);
  }, [disabled, isOpen, setIsOpen]);

  const contextValue = useMemo(
    () => ({
      isOpen,
      openModal,
      closeModal,
      toggleModal,
      size,
      disabled,
      closeOnOverlayClick,
      closeOnEscape,
      triggerRef,
      setTriggerRef,
      contentRef,
      setContentRef,
      titleId,
      descriptionId,
    }),
    [
      isOpen,
      openModal,
      closeModal,
      toggleModal,
      size,
      disabled,
      closeOnOverlayClick,
      closeOnEscape,
      triggerRef,
      contentRef,
      titleId,
      descriptionId,
    ]
  );

  return <ModalProvider value={contextValue}>{children}</ModalProvider>;
};

Modal.displayName = 'Modal';
