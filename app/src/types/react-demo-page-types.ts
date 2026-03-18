import type { ReactNode } from "react";

export interface ReactDemoPageYAMLProps {
  title: string;
  slug: string;
  status?: string[];
  figma?: string[];
  created?: string;
  updated?: string;
}

export interface ReactDemoPageProps {
  yaml: ReactDemoPageYAMLProps;
  content: ReactNode;
}

export interface DemoPagesGroupYAMLProps {
  title: string;
  slug: string;
  description?: string;
  status: string[];
  figma: string[];
}

export interface DemoPagesGroup {
  yaml: DemoPagesGroupYAMLProps;
  pages: Record<string, ReactDemoPageProps>;
}

export const PageSlugPrefix = {
  Component: 'components',
  Experiment: 'experiments',
  Channel: 'channels',
  Playground: 'playground',
  Demo: 'demos',
  Example: 'examples',
} as const;