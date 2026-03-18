/**
 * Spinner Component Demo - Content
 * 
 * Demonstrates all usage patterns of the Spinner component.
 */

import React, { useState } from 'react';
import { Spinner } from '../../the-component';
import { Button } from '../../../../general/button';
import { Search } from '../../../../form/search';
import styles from './styles.module.scss';

const PageContent: React.FC = () => {
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const handleSearch = () => {
    setIsSearchLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearchLoading(false);
    }, 2000);
  };

  return (
    <div className={styles['demo-container']}>
      <h1>Spinner Component Demo</h1>
      <p className={styles['demo-intro']}>
        A loading spinner component with smooth rotation animation.
        Supports different sizes and customizable colors.
      </p>

      {/* Sizes */}
      <section className={styles['demo-section']}>
        <h2>Sizes</h2>
        <p>Three size variants: small (16px), medium (24px), and large (32px).</p>

        <div className={styles['demo-example']}>
          <div className={styles['demo-row']}>
            <div className={styles['demo-item']}>
              <Spinner size="small" />
              <span>Small (16px)</span>
            </div>
            <div className={styles['demo-item']}>
              <Spinner size="medium" />
              <span>Medium (24px)</span>
            </div>
            <div className={styles['demo-item']}>
              <Spinner size="large" />
              <span>Large (32px)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Colors */}
      <section className={styles['demo-section']}>
        <h2>Custom Colors</h2>
        <p>Customize border and top colors using CSS variables or custom values.</p>

        <div className={styles['demo-example']}>
          <div className={styles['demo-row']}>
            <div className={styles['demo-item']}>
              <Spinner 
                size="medium" 
                borderColor="var(--chart-rainbow-blue-40)"
                topColor="var(--chart-rainbow-blue-100)"
              />
              <span>Blue</span>
            </div>
            <div className={styles['demo-item']}>
              <Spinner 
                size="medium" 
                borderColor="var(--chart-rainbow-green-40)"
                topColor="var(--chart-rainbow-green-100)"
              />
              <span>Green</span>
            </div>
            <div className={styles['demo-item']}>
              <Spinner 
                size="medium" 
                borderColor="var(--chart-rainbow-orange-40)"
                topColor="var(--chart-rainbow-orange-100)"
              />
              <span>Orange</span>
            </div>
            <div className={styles['demo-item']}>
              <Spinner 
                size="medium" 
                borderColor="var(--chart-rainbow-purple-40)"
                topColor="var(--chart-rainbow-purple-100)"
              />
              <span>Purple</span>
            </div>
          </div>
        </div>
      </section>

      {/* In Context */}
      <section className={styles['demo-section']}>
        <h2>In Context</h2>
        <p>Spinner used in different contexts: button, input, and container.</p>

        <div className={styles['demo-example']}>
          <div className={styles['demo-context']}>
            <div className={styles['demo-context-item']}>
              <h3>In Button</h3>
              <Button 
                variant="contained" 
                color="primary" 
                disabled
              >
                <Spinner size="small" absolute />
                Generate Report
              </Button>
            </div>

            <div className={styles['demo-context-item']}>
              <h3>In Input</h3>
              <Search onSearch={handleSearch} loading={isSearchLoading}>
                <Search.Input placeholder="Search..." size="medium" />
              </Search>
            </div>

            <div className={styles['demo-context-item']}>
              <h3>In Container</h3>
              <div className={styles['demo-container-loading']}>
                <Spinner size="medium" />
                <p>Loading content...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
