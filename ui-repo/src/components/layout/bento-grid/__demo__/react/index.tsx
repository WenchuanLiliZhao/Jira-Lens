/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const BentoGridDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'BentoGrid Demo Page',
    slug: 'bento-grid-demo-page',
    status: ['done'],
    figma: [],
    created: '2026-02-02',
    updated: '2026-02-02',
  },
  content: <PageContent />,
};
