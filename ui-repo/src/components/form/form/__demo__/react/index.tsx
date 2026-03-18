/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const FormDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'Form Demo Page',
    slug: 'form-demo-page',
    status: ['draft'],
    figma: [],
    created: '2026-01-30',
    updated: '2026-01-30',
  },
  content: <PageContent />,
};
