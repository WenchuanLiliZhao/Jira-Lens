/**
 * Modal Component - Compound Export
 *
 * Usage:
 * ```tsx
 * <Modal>
 *   <Modal.Trigger><Button>Open</Button></Modal.Trigger>
 *   <Modal.Content>
 *     <Modal.Header>Title</Modal.Header>
 *     <Modal.Body>Content</Modal.Body>
 *     <Modal.Footer><Button onClick={close}>Close</Button></Modal.Footer>
 *   </Modal.Content>
 * </Modal>
 * ```
 */

import { Modal as ModalRoot } from './Component';
import { ModalTrigger } from './Trigger';
import { ModalContent } from './Content';
import { ModalHeader } from './Header';
import { ModalBody } from './Body';
import { ModalFooter } from './Footer';
import { ModalClose } from './Close';

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Content: ModalContent,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
  Close: ModalClose,
});

export type {
  ModalProps,
  ModalTriggerProps,
  ModalContentProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalCloseProps,
} from './types';
