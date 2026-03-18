/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const ModalDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'Modal Demo Page',
    slug: 'modal-demo-page',
    status: ['draft'],
    figma: [],
    created: '2026-01-30',
    updated: '2026-01-30',
  },
  content: <PageContent />,
};
