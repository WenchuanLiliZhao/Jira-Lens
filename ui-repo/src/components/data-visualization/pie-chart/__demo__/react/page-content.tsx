/**
 * PieChart Demo Page Content
 *
 * Demonstrates various configurations and use cases for the PieChart component.
 */

import React from 'react';
import { PieChart } from '../../the-component';
import type { PieChartDataItem } from '../../the-component';
import { CHART_COLORS, PIE_CHART_SIZES } from '../../the-component/constants';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Sample Data                                   */
/* -------------------------------------------------------------------------- */

/**
 * Sample transport data using global chart colors.
 * Colors come from ui-repo/src/global-styles/color.scss
 */
const transportData: PieChartDataItem[] = [
  { id: 'train', name: 'Train', value: 45, color: CHART_COLORS.blue, unit: '%' },
  { id: 'bus', name: 'Bus', value: 30, color: CHART_COLORS.green, unit: '%' },
  { id: 'car', name: 'Car', value: 15, color: CHART_COLORS.orange, unit: '%' },
  { id: 'bike', name: 'Bike', value: 10, color: CHART_COLORS.red, unit: '%' },
];

const transportDataWithIcons: PieChartDataItem[] = [
  {
    id: 'train',
    name: 'Train',
    value: 45,
    color: CHART_COLORS.blue,
    unit: '%',
    legendValue: 4523,
    legendUnit: ' pax',
    icon: 'train',
  },
  {
    id: 'bus',
    name: 'Bus',
    value: 30,
    color: CHART_COLORS.green,
    unit: '%',
    legendValue: 3012,
    legendUnit: ' pax',
    icon: 'directions_bus',
  },
  {
    id: 'car',
    name: 'Car',
    value: 15,
    color: CHART_COLORS.orange,
    unit: '%',
    legendValue: 1506,
    legendUnit: ' pax',
    icon: 'directions_car',
  },
  {
    id: 'bike',
    name: 'Bike',
    value: 10,
    color: CHART_COLORS.red,
    unit: '%',
    legendValue: 1004,
    legendUnit: ' pax',
    icon: 'pedal_bike',
  },
];

const marketShareData: PieChartDataItem[] = [
  { id: 'company-a', name: 'Company A', value: 35, color: CHART_COLORS.purple },
  { id: 'company-b', name: 'Company B', value: 28, color: CHART_COLORS.pink },
  { id: 'company-c', name: 'Company C', value: 22, color: CHART_COLORS.blue },
  { id: 'company-d', name: 'Company D', value: 15, color: CHART_COLORS.yellow },
];

/* -------------------------------------------------------------------------- */
/*                        Edge Case Test Data                                  */
/* -------------------------------------------------------------------------- */

/**
 * Many small slices - tests collision avoidance algorithm.
 * All slices on roughly the same side to stress test the collision resolution.
 */
const manySmallSlicesData: PieChartDataItem[] = [
  { id: 's1', name: 'Segment 1', value: 3.2, color: CHART_COLORS.blue, unit: '%' },
  { id: 's2', name: 'Segment 2', value: 2.8, color: CHART_COLORS.green, unit: '%' },
  { id: 's3', name: 'Segment 3', value: 2.5, color: CHART_COLORS.orange, unit: '%' },
  { id: 's4', name: 'Segment 4', value: 2.3, color: CHART_COLORS.red, unit: '%' },
  { id: 's5', name: 'Segment 5', value: 2.1, color: CHART_COLORS.purple, unit: '%' },
  { id: 's6', name: 'Segment 6', value: 1.9, color: CHART_COLORS.pink, unit: '%' },
  { id: 's7', name: 'Segment 7', value: 1.8, color: CHART_COLORS.yellow, unit: '%' },
  { id: 's8', name: 'Segment 8', value: 1.6, color: '#6366f1', unit: '%' },
  { id: 's9', name: 'Segment 9', value: 1.4, color: '#14b8a6', unit: '%' },
  { id: 's10', name: 'Segment 10', value: 1.2, color: '#f97316', unit: '%' },
  { id: 's11', name: 'Segment 11', value: 1.1, color: '#ec4899', unit: '%' },
  { id: 's12', name: 'Segment 12', value: 1.0, color: '#8b5cf6', unit: '%' },
  { id: 'major', name: 'Major Segment', value: 77.1, color: '#64748b', unit: '%' },
];

/**
 * Data with tiny slices (< 0.5%) - tiny slices should have their labels filtered out.
 */
const mixedWithTinySlicesData: PieChartDataItem[] = [
  { id: 'large', name: 'Large', value: 60, color: CHART_COLORS.blue, unit: '%' },
  { id: 'medium', name: 'Medium', value: 25, color: CHART_COLORS.green, unit: '%' },
  { id: 'small', name: 'Small', value: 10, color: CHART_COLORS.orange, unit: '%' },
  { id: 'tiny1', name: 'Tiny 1', value: 2, color: CHART_COLORS.red, unit: '%' },
  { id: 'tiny2', name: 'Tiny 2', value: 1.5, color: CHART_COLORS.purple, unit: '%' },
  { id: 'tiny3', name: 'Tiny 3', value: 0.8, color: CHART_COLORS.pink, unit: '%' },
  { id: 'micro1', name: 'Micro 1', value: 0.4, color: CHART_COLORS.yellow, unit: '%' },
  { id: 'micro2', name: 'Micro 2', value: 0.3, color: '#6366f1', unit: '%' },
];

/* -------------------------------------------------------------------------- */
/*                              Demo Page                                     */
/* -------------------------------------------------------------------------- */

export const PieChartDemoPageContent: React.FC = () => {
  const [hoveredItem, setHoveredItem] = React.useState<PieChartDataItem | null>(null);
  const [clickedItem, setClickedItem] = React.useState<PieChartDataItem | null>(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>PieChart Component Demo</h1>

      {/* Basic Usage */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Basic Usage</h2>
        <p className={styles.description}>
          Default pie chart with bottom legend and hover labels.
        </p>
        <div className={styles['demo-box']}>
          <PieChart data={transportData} />
        </div>
      </section>

      {/* Size Variants */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Size Variants</h2>
        <p className={styles.description}>
          Use PIE_CHART_SIZES constants for common sizes (sm: 80px, md: 120px, lg: 160px),
          or pass any custom pixel value.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>PIE_CHART_SIZES.sm (80px)</span>
            <PieChart data={transportData} size={PIE_CHART_SIZES.sm} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>PIE_CHART_SIZES.md (120px, default)</span>
            <PieChart data={transportData} size={PIE_CHART_SIZES.md} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>PIE_CHART_SIZES.lg (160px)</span>
            <PieChart data={transportData} size={PIE_CHART_SIZES.lg} />
          </div>
        </div>
      </section>

      {/* Legend Positions */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Legend Positions</h2>
        <p className={styles.description}>
          Legend can be positioned at bottom, right, or hidden entirely.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>bottom (default)</span>
            <PieChart data={transportData} legendPosition="bottom" />
          </div>
          <div className={styles['demo-item']} style={{ minWidth: 300 }}>
            <span className={styles.label}>right</span>
            <PieChart 
              data={transportData} 
              legendPosition="right"
              legendWidth={120}
            />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>none</span>
            <PieChart data={transportData} legendPosition="none" />
          </div>
        </div>
      </section>

      {/* With Icons */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>With Icons in Legend</h2>
        <p className={styles.description}>
          Legend items can include icons for better category recognition.
          Also showing legend values with different display values.
        </p>
        <div className={styles['demo-box']}>
          <PieChart
            data={transportDataWithIcons}
            legendPosition="right"
            legendWidth={150}
            showLegendValue
            showLegendUnit
            size={PIE_CHART_SIZES.lg}
          />
        </div>
      </section>

      {/* Label Display Modes */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Label Display Modes</h2>
        <p className={styles.description}>
          Labels can be shown always, on hover, or hidden.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>hover (default)</span>
            <PieChart data={transportData} labelDisplay="hover" />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>always</span>
            <PieChart data={transportData} labelDisplay="always" />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>none</span>
            <PieChart data={transportData} labelDisplay="none" />
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
          <PieChart
            data={transportDataWithIcons}
            tooltipFormatter={(item) => (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</div>
                <div style={{ color: item.color, fontSize: 24, fontWeight: 700 }}>
                  {item.value}%
                </div>
                {item.legendValue && (
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {item.legendValue.toLocaleString()} passengers
                  </div>
                )}
              </div>
            )}
          />
        </div>
      </section>

      {/* Interactions */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Interactions</h2>
        <p className={styles.description}>
          Slice click and hover callbacks provide interactive feedback.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']} style={{ flex: 1 }}>
            <PieChart
              data={marketShareData}
              onSliceClick={(item) => setClickedItem(item)}
              onSliceHover={(item) => setHoveredItem(item)}
            />
          </div>
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
      </section>

      {/* Custom Ring Width */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Custom Ring Width</h2>
        <p className={styles.description}>
          Adjust the donut ring thickness for different visual effects.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>ringWidth: 12</span>
            <PieChart data={marketShareData} ringWidth={12} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>ringWidth: 24 (default)</span>
            <PieChart data={marketShareData} ringWidth={24} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>ringWidth: 40</span>
            <PieChart data={marketShareData} ringWidth={40} />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*                     Edge Case Tests                              */}
      {/* ================================================================ */}

      <h2 className={styles['section-title']} style={{ marginTop: 48, borderTop: '2px solid #e5e7eb', paddingTop: 24 }}>
        Edge Case Tests (Label Collision Avoidance)
      </h2>

      {/* Many Small Slices */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Many Small Slices (12+ items)</h2>
        <p className={styles.description}>
          Tests the collision avoidance algorithm with many small slices on one side.
          Labels should be automatically spaced to avoid overlapping, with dynamic gap
          adjustment if needed.
        </p>
        <div className={styles['demo-box']}>
          <PieChart 
            data={manySmallSlicesData} 
            size={200}
            labelDisplay="always"
            legendPosition="none"
          />
        </div>
      </section>

      {/* Mixed with Tiny Slices */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Mixed with Tiny Slices (&lt; 0.5%)</h2>
        <p className={styles.description}>
          Slices below 0.5% have their labels filtered out to prevent clutter.
          In this example, &quot;Micro 1&quot; (0.4%) and &quot;Micro 2&quot; (0.3%) should not show labels.
        </p>
        <div className={styles['demo-box']}>
          <PieChart 
            data={mixedWithTinySlicesData} 
            size={180}
            labelDisplay="always"
            legendPosition="right"
            legendWidth={100}
          />
        </div>
      </section>

      {/* Always Labels - Large Chart */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Always Labels - Large Chart</h2>
        <p className={styles.description}>
          Demonstrates the dual-column layout with guide lines at a larger size
          where all labels are visible with proper collision avoidance.
        </p>
        <div className={styles['demo-box']}>
          <PieChart 
            data={transportData} 
            size={200}
            labelDisplay="always"
            legendPosition="none"
          />
        </div>
      </section>

      {/* Empty State */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Empty State</h2>
        <p className={styles.description}>
          When no data is provided, an empty message is shown.
        </p>
        <div className={styles['demo-box']}>
          <PieChart data={[]} />
        </div>
      </section>
    </div>
  );
};

export default PieChartDemoPageContent;
