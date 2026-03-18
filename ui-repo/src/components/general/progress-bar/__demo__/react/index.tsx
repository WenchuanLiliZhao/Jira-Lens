/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const ProgressBarDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'ProgressBar Demo Page',
    slug: 'progress-bar-demo-page',
    status: ['done'],
    figma: ['in-progress'],
    created: '2026-01-30',
    updated: '2026-01-30',
  },
  content: <PageContent />,
};
