/**
 * Modal Context
 *
 * Provides shared state and methods to all modal sub-components.
 */

import { createContext, useContext } from 'react';
import type { ModalContextValue } from './types';

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = ModalContext.Provider;

export function useModalContext(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a Modal component');
  }
  return context;
}
