/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const IconDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'Icon Demo Page',
    slug: 'icon-demo-page',
    status: ['done'],
    figma: ['not-necessary'],
    created: '2026-01-30',
    updated: '2026-01-30',
  },
  content: <PageContent />,
};
