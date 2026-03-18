/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const CalendarDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'Calendar Demo Page',
    slug: 'calendar-demo-page',
    status: ['draft'],
    figma: ['draft'],
    created: '2026-02-18',
    updated: '2026-02-18',
  },
  content: <PageContent />,
};
