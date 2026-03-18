/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const SpinnerDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'Spinner Demo Page',
    slug: 'spinner-demo-page',
    status: ['draft'],
    figma: ['draft'],
    created: '2026-02-04',
    updated: '2026-02-04',
  },
  content: <PageContent />,
};
