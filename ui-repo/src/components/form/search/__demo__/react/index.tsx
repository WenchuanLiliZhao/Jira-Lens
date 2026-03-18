/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const SearchDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'Search Demo Page',
    slug: 'search-demo-page',
    status: ['done', 'redesign-needed'],
    figma: ['in-progress'],
    created: '2026-02-04',
    updated: '2026-02-04',
  },
  content: <PageContent />,
};
