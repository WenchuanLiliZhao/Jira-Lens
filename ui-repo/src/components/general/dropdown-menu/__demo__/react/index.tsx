/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const DropdownMenuDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'DropdownMenu Demo Page',
    slug: 'dropdown-menu-demo-page',
    status: ['done', 'redesign-needed'],
    figma: ['done', 'incomplete'],
    created: '2026-01-30',
    updated: '2026-01-30',
  },
  content: <PageContent />,
};
