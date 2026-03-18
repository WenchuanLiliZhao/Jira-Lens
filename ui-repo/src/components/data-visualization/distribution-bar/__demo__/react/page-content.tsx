/**
 * DistributionBar Demo Page Content
 *
 * Demonstrates various configurations and use cases for the DistributionBar component.
 *
 * ========== DEMO SECTIONS (调试用) ==========
 * 
 * 1. Basic Usage         - Default configuration
 * 2. Height Variants     - sm/md/lg sizes
 * 3. Label Display       - always/hover/none
 * 4. Legend Options      - With/without legend
 * 5. Segment Gaps        - Different gap values
 * 6. Border Radius       - Different corner styles
 * 7. Interactions        - Click and hover callbacks
 * 8. Custom Tooltip      - Custom tooltip formatter
 * 9. Empty State         - No data handling
 * ============================================
 */

import React from 'react';
import { DistributionBar } from '../../the-component';
import type { DistributionBarSegment } from '../../the-component';
import { CHART_COLORS } from '../../the-component/constants';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Sample Data                                   */
/* -------------------------------------------------------------------------- */

/**
 * Sample budget allocation data.
 */
const budgetData: DistributionBarSegment[] = [
  { id: 'engineering', name: 'Engineering', value: 45, color: CHART_COLORS.blue },
  { id: 'marketing', name: 'Marketing', value: 25, color: CHART_COLORS.green },
  { id: 'operations', name: 'Operations', value: 20, color: CHART_COLORS.orange },
  { id: 'hr', name: 'HR', value: 10, color: CHART_COLORS.purple },
];

/**
 * Sample market share data.
 */
const marketShareData: DistributionBarSegment[] = [
  { id: 'company-a', name: 'Company A', value: 35, color: CHART_COLORS.blue },
  { id: 'company-b', name: 'Company B', value: 28, color: CHART_COLORS.green },
  { id: 'company-c', name: 'Company C', value: 22, color: CHART_COLORS.orange },
  { id: 'company-d', name: 'Company D', value: 15, color: CHART_COLORS.red },
];

/**
 * Sample vote share data.
 */
const voteData: DistributionBarSegment[] = [
  { id: 'yes', name: 'Yes', value: 62, color: CHART_COLORS.green },
  { id: 'no', name: 'No', value: 28, color: CHART_COLORS.red },
  { id: 'abstain', name: 'Abstain', value: 10, color: CHART_COLORS.purple },
];

/**
 * Sample category mix data.
 */
const categoryMixData: DistributionBarSegment[] = [
  { id: 'cat-1', name: 'Category 1', value: 30, color: CHART_COLORS.blue },
  { id: 'cat-2', name: 'Category 2', value: 25, color: CHART_COLORS.pink },
  { id: 'cat-3', name: 'Category 3', value: 20, color: CHART_COLORS.yellow },
  { id: 'cat-4', name: 'Category 4', value: 15, color: CHART_COLORS.purple },
  { id: 'cat-5', name: 'Category 5', value: 10, color: CHART_COLORS.orange },
];

/* -------------------------------------------------------------------------- */
/*                              Demo Page                                     */
/* -------------------------------------------------------------------------- */

export const DistributionBarDemoPageContent: React.FC = () => {
  const [hoveredItem, setHoveredItem] = React.useState<DistributionBarSegment | null>(null);
  const [clickedItem, setClickedItem] = React.useState<DistributionBarSegment | null>(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>DistributionBar Component Demo</h1>

      {/* Basic Usage */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Basic Usage</h2>
        <p className={styles.description}>
          Default distribution bar with hover labels, legend, and tooltip.
        </p>
        <div className={styles['demo-box']}>
          <div className={styles['demo-wide']}>
            <DistributionBar data={budgetData} />
          </div>
        </div>
      </section>

      {/* Height Variants */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Height Variants</h2>
        <p className={styles.description}>
          Available heights: sm (4px), md (8px), lg (16px), or custom pixel value.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>sm (4px)</span>
            <DistributionBar data={voteData} height="sm" />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>md (8px) - default</span>
            <DistributionBar data={voteData} height="md" />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>lg (16px)</span>
            <DistributionBar data={voteData} height="lg" />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>custom (24px)</span>
            <DistributionBar data={voteData} height={32} />
          </div>
        </div>
      </section>

      {/* Label Display Modes */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Label Display Modes</h2>
        <p className={styles.description}>
          Labels can be shown always, on hover, or hidden entirely.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>hover (default)</span>
            <DistributionBar data={marketShareData} height="lg" showLabels="hover" />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>always</span>
            <DistributionBar data={marketShareData} height="lg" showLabels="always" />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>none</span>
            <DistributionBar data={marketShareData} height="lg" showLabels="none" />
          </div>
        </div>
      </section>

      {/* Legend Options */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Legend Options</h2>
        <p className={styles.description}>
          Legend can be shown below the bar or hidden.
        </p>
        <div className={styles['demo-grid']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>with legend (default)</span>
            <DistributionBar data={voteData} showLegend={true} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>without legend</span>
            <DistributionBar data={voteData} showLegend={false} />
          </div>
        </div>
      </section>

      {/* Segment Gaps */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Segment Gaps</h2>
        <p className={styles.description}>
          Adjust the gap between segments for different visual effects.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>gap: 0 (no gap)</span>
            <DistributionBar data={categoryMixData} gap={0} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>gap: 1 (default)</span>
            <DistributionBar data={categoryMixData} gap={1} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>gap: 2</span>
            <DistributionBar data={categoryMixData} gap={2} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>gap: 4</span>
            <DistributionBar data={categoryMixData} gap={4} />
          </div>
        </div>
      </section>

      {/* Border Radius */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Border Radius</h2>
        <p className={styles.description}>
          Customize corner rounding for different visual styles.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>borderRadius: 0 (square)</span>
            <DistributionBar data={voteData} borderRadius={0} height="lg" />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>borderRadius: 4 (default)</span>
            <DistributionBar data={voteData} borderRadius={4} height="lg" />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>borderRadius: 8</span>
            <DistributionBar data={voteData} borderRadius={8} height="lg" />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>borderRadius: 12 (pill)</span>
            <DistributionBar data={voteData} borderRadius={12} height="lg" />
          </div>
        </div>
      </section>

      {/* Interactions */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Interactions</h2>
        <p className={styles.description}>
          Segment click and hover callbacks provide interactive feedback.
        </p>
        <div className={styles['demo-box']}>
          <div className={styles['demo-wide']}>
            <DistributionBar
              data={budgetData}
              height="lg"
              onSegmentClick={(segment) => setClickedItem(segment)}
              onSegmentHover={(segment) => setHoveredItem(segment)}
            />
            <div className={styles['interaction-info']}>
              <div className={styles['info-item']}>
                <strong>Hovered:</strong>{' '}
                {hoveredItem ? `${hoveredItem.name} (${hoveredItem.value})` : 'None'}
              </div>
              <div className={styles['info-item']}>
                <strong>Clicked:</strong>{' '}
                {clickedItem ? `${clickedItem.name} (${clickedItem.value})` : 'None'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Tooltip */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Custom Tooltip</h2>
        <p className={styles.description}>
          Tooltip content can be fully customized using the tooltipFormatter prop.
        </p>
        <div className={styles['demo-box']}>
          <div className={styles['demo-wide']}>
            <DistributionBar
              data={budgetData}
              height="lg"
              tooltipFormatter={(segment, percentage) => (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                    {segment.name}
                  </div>
                  <div style={{ color: segment.color, fontSize: 20, fontWeight: 700 }}>
                    {percentage.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    ${(segment.value * 10000).toLocaleString()}
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </section>

      {/* Without Animation */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Animation Control</h2>
        <p className={styles.description}>
          Animation can be disabled for instant rendering.
        </p>
        <div className={styles['demo-grid']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>animated: true (default)</span>
            <DistributionBar data={voteData} animated={true} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>animated: false</span>
            <DistributionBar data={voteData} animated={false} />
          </div>
        </div>
      </section>

      {/* Empty State */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Empty State</h2>
        <p className={styles.description}>
          When no data is provided, an empty message is shown.
        </p>
        <div className={styles['demo-box']}>
          <DistributionBar data={[]} />
        </div>
      </section>
    </div>
  );
};

export default DistributionBarDemoPageContent;
