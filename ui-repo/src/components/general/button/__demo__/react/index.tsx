/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const ButtonDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'Button Demo Page',
    slug: 'button-demo-page',
    status: ['done'],
    figma: ['done'],
    created: '2026-01-30',
    updated: '2026-01-30',
  },
  content: <PageContent />,
};
