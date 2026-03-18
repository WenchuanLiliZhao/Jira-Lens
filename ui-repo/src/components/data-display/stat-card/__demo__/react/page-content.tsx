import React from 'react';
import styles from './styles.module.scss';
import { StatCard } from '../../the-component';
import { chartRainbow } from '../../../../../global-styles/colors';

/** Default NPS colors: green=Promoter, yellow=Passive, red=Detractor */
const NPS_COLORS = {
  promoter: chartRainbow['green-100'],
  passive: chartRainbow['yellow-100'],
  detractor: chartRainbow['red-100'],
} as const;

/**
 * StatCard Demo Page Content
 *
 * AI Hint: This is a demo page showcasing all usage patterns of the StatCard component.
 */
const PageContent: React.FC = () => {
  const npsItems = [
    {
      label: 'Promoter',
      percentage: 89,
      count: 1390,
      color: NPS_COLORS.promoter,
      icon: 'sentiment_satisfied',
    },
    {
      label: 'Passive',
      percentage: 6,
      count: 197,
      color: NPS_COLORS.passive,
      icon: 'sentiment_neutral',
    },
    {
      label: 'Detractor',
      percentage: 5,
      count: 71,
      color: NPS_COLORS.detractor,
      icon: 'sentiment_dissatisfied',
    },
  ];

  return (
    <div className={styles["component-demo-container"]}>
      <h1>StatCard Component Demo</h1>

      <section className={styles["component-demo-section"]}>
        <h2>NPS Distribution</h2>
        <p>Default colors: green=Promoter, yellow=Passive, red=Detractor.</p>
        <div className={styles["stat-card-demo-wrapper"]}>
          <StatCard items={npsItems} />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Without Count</h2>
        <p>showCount=false hides the count values.</p>
        <div className={styles["stat-card-demo-wrapper"]}>
          <StatCard items={npsItems} showCount={false} />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Horizontal Layout</h2>
        <p>layout="horizontal" arranges items in a row.</p>
        <div className={styles["stat-card-demo-wrapper"]}>
          <StatCard items={npsItems} layout="horizontal" />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Small Size</h2>
        <p>size="small" uses smaller font sizes for compact display.</p>
        <div className={styles["stat-card-demo-wrapper"]}>
          <StatCard items={npsItems} size="small" />
        </div>
      </section>
    </div>
  );
};

export default PageContent;
