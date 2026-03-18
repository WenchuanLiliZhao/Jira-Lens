import React from 'react';
import styles from './styles.module.scss';
import { FeedbackCard } from '../../the-component';
import { Label } from '../../../../general/label/the-component';
import { chartRainbow, chartNeutral } from '../../../../../global-styles/colors';

/** Default NPS colors: green=Promoter, yellow=Passive, red=Detractor */
const NPS_COLORS = {
  promoter: chartRainbow['green-100'],
  passive: chartRainbow['yellow-100'],
  detractor: chartRainbow['red-100'],
} as const;

/** Preset meta content using Label from component library */
const FEEDBACK_META = {
  needsFollowUp: (
    <Label size="small" variant="filled" textColor={chartNeutral['9']} borderColor={chartNeutral['6']}>
      需回访
    </Label>
  ),
  processed: (
    <Label size="small" variant="filled" textColor={chartNeutral['9']} borderColor={chartNeutral['6']}>
      已处理
    </Label>
  ),
} as const;

/**
 * FeedbackCard Demo Page Content
 *
 * AI Hint: This is a demo page showcasing all usage patterns of the FeedbackCard component.
 */
const PageContent: React.FC = () => {
  return (
    <div className={styles["component-demo-container"]}>
      <h1>FeedbackCard Component Demo</h1>

      <section className={styles["component-demo-section"]}>
        <h2>Basic Card (matches screenshot)</h2>
        <p>Sentiment icon, comment, score 10, date/time, metaContent (Label), chevron. Green = Promoter.</p>
        <div className={styles["feedback-list"]}>
          <FeedbackCard
            comment="都很好，很满意的购物体验！"
            score={10}
            datetime="2025/12/10 15:30"
            sentimentIcon="sentiment_satisfied"
            sentimentColor={NPS_COLORS.promoter}
            metaContent={[FEEDBACK_META.needsFollowUp]}
            onClick={() => alert('Clicked feedback card')}
          />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Multiple Cards (NPS score variants)</h2>
        <p>Default colors: green=Promoter (9-10), yellow=Passive (7-8), red=Detractor (0-6). metaContent uses Label.</p>
        <div className={styles["feedback-list"]}>
          <FeedbackCard
            comment="都很好，很满意的购物体验！"
            score={10}
            datetime="2025/12/10 15:30"
            sentimentIcon="sentiment_satisfied"
            sentimentColor={NPS_COLORS.promoter}
            metaContent={[FEEDBACK_META.needsFollowUp]}
            onClick={() => {}}
          />
          <FeedbackCard
            comment="服务还可以，但等待时间有点长。"
            score={7}
            datetime="2025/12/09 10:20"
            sentimentIcon="sentiment_neutral"
            sentimentColor={NPS_COLORS.passive}
            onClick={() => {}}
          />
          <FeedbackCard
            comment="商品质量有问题，希望改进。"
            score={4}
            datetime="2025/12/08 14:15"
            sentimentIcon="sentiment_dissatisfied"
            sentimentColor={NPS_COLORS.detractor}
            metaContent={[FEEDBACK_META.processed]}
            onClick={() => {}}
          />
        </div>
      </section>
    </div>
  );
};

export default PageContent;
