import React from "react";
import styles from "./styles.module.scss";
import { ComponentDemoLayout } from "../..";
// import { ComponentDemoLayout } from '../../the-component';

/**
 * ComponentDemoLayout Demo Page Content
 *
 * AI Hint: This is a demo page showcasing all usage patterns of the ComponentDemoLayout component.
 */
const PageContent: React.FC = () => {
  return (
    <ComponentDemoLayout>
      <h2 className={styles["component-demo-layout__title"]}>See Other Components</h2>
    </ComponentDemoLayout>
  );
};

export default PageContent;
