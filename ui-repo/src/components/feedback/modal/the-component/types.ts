/**
 * Modal Component Types
 */

import React from 'react';

// ============ ROOT ============

export interface ModalProps {
  /** Component content */
  children?: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether clicking overlay closes the modal */
  closeOnOverlayClick?: boolean;
  /** Whether pressing Escape closes the modal */
  closeOnEscape?: boolean;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Disabled state (prevents opening) */
  disabled?: boolean;
}

// ============ TRIGGER ============

export interface ModalTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Trigger content (e.g. Button) */
  children: React.ReactElement;
  /** Custom class name */
  className?: string;
}

// ============ CONTENT ============

export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Dialog content */
  children?: React.ReactNode;
  /** Accessible title (for aria-labelledby) */
  'aria-labelledby'?: string;
  /** Accessible description (for aria-describedby) */
  'aria-describedby'?: string;
  /** Custom class name */
  className?: string;
}

// ============ HEADER / BODY / FOOTER ============

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export interface ModalCloseProps {
  children: React.ReactElement;
  className?: string;
}

// ============ CONTEXT ============

export interface ModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  closeOnOverlayClick: boolean;
  closeOnEscape: boolean;
  triggerRef: React.RefObject<HTMLElement | null> | null;
  setTriggerRef: (ref: React.RefObject<HTMLElement | null> | null) => void;
  contentRef: React.RefObject<HTMLDivElement | null> | null;
  setContentRef: (ref: React.RefObject<HTMLDivElement | null> | null) => void;
  titleId: string;
  descriptionId: string;
}
