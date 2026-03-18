/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const LabelDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'Label Demo Page',
    slug: 'label-demo-page',
    status: ['done', 'redesign-needed'],
    figma: [],
    created: '2026-01-31',
    updated: '2026-01-31',
  },
  content: <PageContent />,
};
