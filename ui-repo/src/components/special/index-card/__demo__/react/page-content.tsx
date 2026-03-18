import React from 'react';
import styles from './styles.module.scss';
import { IndexCard } from '../../the-component';

/**
 * IndexCard Demo Page Content
 *
 * AI Hint: This is a demo page showcasing all usage patterns of the IndexCard component.
 */
const PageContent: React.FC = () => {
  return (
    <div className={styles["component-demo-container"]}>
      <h1>IndexCard Component Demo</h1>

      <section className={styles["component-demo-section"]}>
        <h2>Basic Usage</h2>
        <p>Metric cards for ACE, NPS, Fits, VM and similar KPIs.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <IndexCard label="ACE" value={67} />
          <IndexCard label="NPS" value={70} />
          <IndexCard label="Fits" value={87} />
          <IndexCard label="VM" value={90} />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>With Trend</h2>
        <p>Positive trend = green, negative trend = red.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <IndexCard label="ACE" value={67} trend={4.0} />
          <IndexCard label="NPS" value={70} trend={-8} />
          <IndexCard label="Fits" value={87} sublabel="Attend" trend={2.5} />
          <IndexCard label="VM" value={90} sublabel="Create" trend={-1.2} />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Size Variants</h2>
        <p>Small (horizontal), medium (default), and large sizes.</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <IndexCard label="Attend" value={45} size="small" />
          <IndexCard label="ACE" value={67} size="medium" />
          <IndexCard label="ACE" value={67} size="large" />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>With Sublabel</h2>
        <p>Cards with optional sublabel (e.g. Attend, Create, Engage).</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <IndexCard label="ACE" value={67} sublabel="Attend" />
          <IndexCard label="ACE" value={78} sublabel="Create" />
          <IndexCard label="ACE" value={68} sublabel="Engage" />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>居中模式 (Center Align)</h2>
        <p>align="center" 时内容居中对齐。</p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <IndexCard label="ACE" value={67} align="center" />
          <IndexCard label="NPS" value={70} trend={4.0} align="center" />
          <IndexCard label="Fits" value={87} sublabel="Attend" align="center" />
        </div>
      </section>
    </div>
  );
};

export default PageContent;
