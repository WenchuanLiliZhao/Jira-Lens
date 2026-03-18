/**
 * Feedback Components - Category Index
 * 
 * Auto-generated exports for category demo pages group.
 */

import type { DemoPagesGroup } from '../../types/react-demo-page-types';
import { EmptyStateDemoPage } from './empty-state';
import { LoadingStateDemoPage } from './loading-state';
import { ModalDemoPage } from './modal';
import { SpinnerDemoPage } from './spinner';
import { ToastDemoPage } from './toast';

export const FeedbackDemoPages: DemoPagesGroup = {
  yaml: {
    title: 'Feedback',
    slug: 'feedback',
    status: ['draft'],
    figma: ['draft'],
  },
  pages: {
    EmptyStateDemoPage,
    LoadingStateDemoPage,
    ModalDemoPage,
    SpinnerDemoPage,
    ToastDemoPage,
  },
};

// Component Exports
export { EmptyState } from './empty-state';
export { LoadingState } from './loading-state';
export { Modal } from './modal';
export { Spinner } from './spinner';
export { Toast } from './toast';

// Type Exports
export type { EmptyStateProps } from './empty-state';
export type { LoadingStateProps } from './loading-state';
export type { ModalProps } from './modal';
export type { SpinnerProps } from './spinner';
export type { ToastProps } from './toast';
