/* @refresh reset */
import type { ReactDemoPageProps } from "../../../../../types/react-demo-page-types";
import PageContent from "./page-content";

export const SliderDemoPage: ReactDemoPageProps = {
  yaml: {
    title: 'Slider Demo Page',
    slug: 'slider-demo-page',
    status: ['done', 'redesign-needed'],
    figma: ['draft'],
    created: '2026-02-05',
    updated: '2026-02-12',
  },
  content: <PageContent />,
};
