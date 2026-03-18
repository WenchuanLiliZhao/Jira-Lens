import React from 'react';
import styles from './styles.module.scss';
import { Button } from '../../the-component';

/**
 * Button Demo Page Content
 * 
 * AI Hint: This is a demo page showcasing all usage patterns of the Button component.
 */
const PageContent: React.FC = () => {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className={styles["component-demo-container"]}>
      <h1>Button Component Demo</h1>

      {/* With Icons */}
      <section className={styles["component-demo-section"]}>
        <h2>With Icons</h2>
        <div className={styles["demo-row"]}>
          <Button variant="ghost" startIcon="deployed_code">Start Icon</Button>
          <Button variant="ghost" endIcon="arrow_drop_down">End Icon</Button>
          <Button variant="ghost" startIcon="deployed_code" endIcon="arrow_drop_down">Both Icons</Button>
        </div>
        <div className={styles["demo-row"]}>
          <Button variant="contained" startIcon="deployed_code">Start Icon</Button>
          <Button variant="contained" endIcon="arrow_drop_down">End Icon</Button>
          <Button variant="contained" startIcon="deployed_code" endIcon="arrow_drop_down">Both Icons</Button>
        </div>
        <div className={styles["demo-row"]}>
          <Button variant="outlined" startIcon="deployed_code">Start Icon</Button>
          <Button variant="outlined" endIcon="arrow_drop_down">End Icon</Button>
          <Button variant="outlined" startIcon="deployed_code" endIcon="arrow_drop_down">Both Icons</Button>
        </div>
      </section>
      
      {/* Variants Section */}
      <section className={styles["component-demo-section"]}>
        <h2>Variants</h2>
        <div className={styles["demo-row"]}>
          <Button variant="ghost" onClick={handleClick}>Text</Button>
          <Button variant="contained" onClick={handleClick}>Contained</Button>
          <Button variant="outlined" onClick={handleClick}>Outlined</Button>
        </div>
      </section>

      {/* Colors - Ghost Variant */}
      <section className={styles["component-demo-section"]}>
        <h2>Colors (Ghost Variant)</h2>
        <div className={styles["demo-row"]}>
          <Button variant="ghost" color="default">Default</Button>
          <Button variant="ghost" color="primary">Primary</Button>
          <Button variant="ghost" color="secondary">Secondary</Button>
          <Button variant="ghost" color="success">Success</Button>
          <Button variant="ghost" color="error">Error</Button>
          <Button variant="ghost" color="info">Info</Button>
          <Button variant="ghost" color="warning">Warning</Button>
        </div>
      </section>

      {/* Colors - Contained Variant */}
      <section className={styles["component-demo-section"]}>
        <h2>Colors (Contained Variant)</h2>
        <div className={styles["demo-row"]}>
          <Button variant="contained" color="default">Default</Button>
          <Button variant="contained" color="primary">Primary</Button>
          <Button variant="contained" color="secondary">Secondary</Button>
          <Button variant="contained" color="success">Success</Button>
          <Button variant="contained" color="error">Error</Button>
          <Button variant="contained" color="info">Info</Button>
          <Button variant="contained" color="warning">Warning</Button>
        </div>
      </section>

      {/* Colors - Outlined Variant */}
      <section className={styles["component-demo-section"]}>
        <h2>Colors (Outlined Variant)</h2>
        <div className={styles["demo-row"]}>
          <Button variant="outlined" color="default">Default</Button>
          <Button variant="outlined" color="primary">Primary</Button>
          <Button variant="outlined" color="secondary">Secondary</Button>
          <Button variant="outlined" color="success">Success</Button>
          <Button variant="outlined" color="error">Error</Button>
          <Button variant="outlined" color="info">Info</Button>
          <Button variant="outlined" color="warning">Warning</Button>
        </div>
      </section>

      {/* Sizes */}
      <section className={styles["component-demo-section"]}>
        <h2>Sizes (Text)</h2>
        <div className={styles["demo-row"]}>
          <Button variant="ghost" size="small" startIcon="deployed_code" endIcon="arrow_drop_down">Small</Button>
          <Button variant="ghost" size="medium">Medium</Button>
          <Button variant="ghost" size="large">Large</Button>
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Sizes (Contained)</h2>
        <div className={styles["demo-row"]}>
          <Button variant="contained" size="small">Small</Button>
          <Button variant="contained" size="medium">Medium</Button>
          <Button variant="contained" size="large">Large</Button>
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Sizes (Outlined)</h2>
        <div className={styles["demo-row"]}>
          <Button variant="outlined" size="small">Small</Button>
          <Button variant="outlined" size="medium">Medium</Button>
          <Button variant="outlined" size="large">Large</Button>
        </div>
      </section>

      {/* Disabled State */}
      <section className={styles["component-demo-section"]}>
        <h2>Disabled State</h2>
        <div className={styles["demo-row"]}>
          <Button variant="ghost" disabled>Text Disabled</Button>
          <Button variant="contained" disabled>Contained Disabled</Button>
          <Button variant="outlined" disabled>Outlined Disabled</Button>
        </div>
      </section>

      {/* Full Width */}
      <section className={styles["component-demo-section"]}>
        <h2>Full Width</h2>
        <div className={styles["demo-column"]}>
          <Button variant="contained" fullWidth>
            Full Width Button
          </Button>
          <Button variant="outlined" fullWidth>
            Full Width Outlined
          </Button>
        </div>
      </section>

      {/* As Link */}
      <section className={styles["component-demo-section"]}>
        <h2>As Link</h2>
        <div className={styles["demo-row"]}>
          <Button variant="contained" href="https://github.com" target="_blank">
            GitHub Link
          </Button>
          <Button variant="outlined" href="#top">
            Internal Link
          </Button>
        </div>
      </section>

      {/* Complex Example */}
      <section className={styles["component-demo-section"]}>
        <h2>Complex Example</h2>
        <div className={styles["demo-row"]}>
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon="✓"
            onClick={handleClick}
          >
            Submit Form
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="large"
            endIcon="✕"
            onClick={handleClick}
          >
            Cancel
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
