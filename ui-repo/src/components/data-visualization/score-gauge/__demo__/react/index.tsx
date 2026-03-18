/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const ScoreGaugeDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'ScoreGauge Demo Page',
    slug: 'score-gauge-demo-page',
    status: ['draft'],
    figma: ['draft'],
    created: '2026-02-24',
    updated: '2026-02-24',
  },
  content: <PageContent />,
};
