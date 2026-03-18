/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const PlaceholderFeatureDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'PlaceholderFeature Demo Page',
    slug: 'placeholder-feature-demo-page',
    status: ['draft'],
    figma: [],
    created: '2026-01-30',
    updated: '2026-01-30',
  },
  content: <PageContent />,
};
