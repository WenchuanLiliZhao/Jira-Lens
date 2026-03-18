/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const ComboChartDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'ComboChart Demo Page',
    slug: 'combo-chart-demo-page',
    status: ['done', 'known-bug'],
    figma: [],
    created: '2026-02-03',
    updated: '2026-02-03',
  },
  content: <PageContent />,
};
