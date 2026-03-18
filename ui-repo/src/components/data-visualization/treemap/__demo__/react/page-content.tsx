/**
 * Treemap Demo Page Content
 *
 * Demonstrates various configurations and use cases for the Treemap component.
 */

import React from 'react';
import { Treemap } from '../../the-component';
import type { TreemapDataItem } from '../../the-component';
import { CHART_COLORS } from '../../the-component/constants';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Sample Data                                   */
/* -------------------------------------------------------------------------- */

/**
 * Basic flat data - budget allocation example.
 */
const budgetData: TreemapDataItem[] = [
  { id: 'marketing', name: 'Marketing', value: 35000, color: CHART_COLORS.blue, unit: '$', unitPosition: 'before' },
  { id: 'engineering', name: 'Engineering', value: 50000, color: CHART_COLORS.green, unit: '$', unitPosition: 'before' },
  { id: 'sales', name: 'Sales', value: 25000, color: CHART_COLORS.orange, unit: '$', unitPosition: 'before' },
  { id: 'operations', name: 'Operations', value: 20000, color: CHART_COLORS.purple, unit: '$', unitPosition: 'before' },
  { id: 'hr', name: 'HR', value: 15000, color: CHART_COLORS.pink, unit: '$', unitPosition: 'before' },
];

/**
 * Sales data by region.
 */
const salesByRegionData: TreemapDataItem[] = [
  { id: 'north', name: 'North', value: 4500, color: CHART_COLORS.blue },
  { id: 'south', name: 'South', value: 3200, color: CHART_COLORS.green },
  { id: 'east', name: 'East', value: 5800, color: CHART_COLORS.orange },
  { id: 'west', name: 'West', value: 2900, color: CHART_COLORS.red },
  { id: 'central', name: 'Central', value: 4100, color: CHART_COLORS.purple },
];

/**
 * Multi-line labels - Product category example.
 * Demonstrates 3-line layout: name, subtitle, tertiaryLabel
 */
const productCategoryData: TreemapDataItem[] = [
  {
    id: 'leggings',
    name: 'Leggings',
    value: 27000,
    color: '#3d4751',
    subtitle: 'WOS: 2.4',
    tertiaryLabel: '11.7% (27K)',
    // tertiaryColor: '#fff',
  },
  {
    id: 'tops',
    name: 'Tops',
    value: 35000,
    color: '#4a5568',
    subtitle: 'WOS: 3.1',
    tertiaryLabel: '15.2% (35K)',
    // tertiaryColor: '#fff',
  },
  {
    id: 'dresses',
    name: 'Dresses',
    value: 22000,
    color: '#5a6677',
    subtitle: 'WOS: 1.8',
    tertiaryLabel: '9.5% (22K)',
    // tertiaryColor: '#fff',
  },
  {
    id: 'pants',
    name: 'Pants',
    value: 18000,
    color: '#667788',
    subtitle: 'WOS: 2.0',
    tertiaryLabel: '7.8% (18K)',
    // tertiaryColor: '#fff',
  },
  {
    id: 'jackets',
    name: 'Jackets',
    value: 15000,
    color: '#718096',
    subtitle: 'WOS: 1.5',
    tertiaryLabel: '6.5% (15K)',
    // tertiaryColor: '#fff',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    value: 12000,
    color: '#7c8a9a',
    subtitle: 'WOS: 4.2',
    tertiaryLabel: '5.2% (12K)',
    // tertiaryColor: '#fff',
  },
];

/**
 * Many small items - stress test.
 */
const manyItemsData: TreemapDataItem[] = [
  { id: 'a', name: 'Item A', value: 100, color: CHART_COLORS.blue },
  { id: 'b', name: 'Item B', value: 90, color: CHART_COLORS.green },
  { id: 'c', name: 'Item C', value: 80, color: CHART_COLORS.orange },
  { id: 'd', name: 'Item D', value: 70, color: CHART_COLORS.red },
  { id: 'e', name: 'Item E', value: 60, color: CHART_COLORS.purple },
  { id: 'f', name: 'Item F', value: 50, color: CHART_COLORS.pink },
  { id: 'g', name: 'Item G', value: 40, color: CHART_COLORS.yellow },
  { id: 'h', name: 'Item H', value: 30, color: '#6366f1' },
  { id: 'i', name: 'Item I', value: 20, color: '#14b8a6' },
  { id: 'j', name: 'Item J', value: 15, color: '#f97316' },
  { id: 'k', name: 'Item K', value: 10, color: '#ec4899' },
  { id: 'l', name: 'Item L', value: 8, color: '#8b5cf6' },
];

/* -------------------------------------------------------------------------- */
/*                              Demo Page                                     */
/* -------------------------------------------------------------------------- */

export const TreemapDemoPageContent: React.FC = () => {
  const [hoveredItem, setHoveredItem] = React.useState<TreemapDataItem | null>(null);
  const [clickedItem, setClickedItem] = React.useState<TreemapDataItem | null>(null);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Treemap Component Demo</h1>

      {/* Basic Usage */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Basic Usage</h2>
        <p className={styles.description}>
          Simple flat data visualization showing budget allocation.
          Rectangle area represents value size.
        </p>
        <div className={styles['demo-box']}>
          <Treemap data={budgetData} width={500} height={300} showLegend={true} legendPosition="top" />
        </div>
      </section>

      {/* Multi-line Labels */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Multi-line Labels</h2>
        <p className={styles.description}>
          Supports 3-line layout: name (bold), subtitle (medium), tertiaryLabel (colored).
          Each line can be customized independently. Great for showing KPIs like WOS, percentage, etc.
        </p>
        <div className={styles['demo-box']}>
          <Treemap 
            data={productCategoryData} 
            width={700} 
            height={400}
            showValue={false}
          />
        </div>
      </section>

      {/* Size Variants */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Size Variants</h2>
        <p className={styles.description}>
          Treemap supports different sizes. Use fixed pixel values or &apos;100%&apos; for responsive width.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>300 x 200</span>
            <Treemap data={salesByRegionData} width={300} height={200} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>400 x 250</span>
            <Treemap data={salesByRegionData} width={400} height={250} />
          </div>
        </div>
      </section>

      {/* Responsive Width */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Responsive Width</h2>
        <p className={styles.description}>
          Use width=&quot;100%&quot; for responsive treemap that fills its container.
        </p>
        <div className={styles['demo-box']} style={{ maxWidth: 700 }}>
          <Treemap data={budgetData} width="100%" height={250} />
        </div>
      </section>

      {/* Responsive Width and Height */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Responsive Width and Height</h2>
        <p className={styles.description}>
          Use width=&quot;100%&quot; and height=&quot;100%&quot; for fully responsive treemap.
          The container must have a defined height.
        </p>
        <div className={styles['demo-box']} style={{ width: '100%', height: 300 }}>
          <Treemap data={budgetData} width="100%" height="100%" />
        </div>
      </section>

      {/* Without Labels */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Without Labels</h2>
        <p className={styles.description}>
          Disable labels for a cleaner look when you have many items or small cells.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>showLabels=true (default)</span>
            <Treemap data={salesByRegionData} width={300} height={200} showLabels />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>showLabels=false</span>
            <Treemap data={salesByRegionData} width={300} height={200} showLabels={false} />
          </div>
        </div>
      </section>

      {/* Custom Tooltip */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Custom Tooltip</h2>
        <p className={styles.description}>
          Customize tooltip content using the tooltipFormatter prop.
        </p>
        <div className={styles['demo-box']}>
          <Treemap
            data={budgetData}
            width={500}
            height={300}
            tooltipFormatter={(item) => (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  {item.name}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: item.color }}>
                  ${item.value?.toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>
                  {((item.value || 0) / 1450).toFixed(1)}% of total budget
                </div>
              </div>
            )}
          />
        </div>
      </section>

      {/* Interactions */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Interactions</h2>
        <p className={styles.description}>
          Node click and hover callbacks provide interactive feedback.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']} style={{ flex: 1 }}>
            <Treemap
              data={salesByRegionData}
              width={400}
              height={250}
              onNodeClick={(item) => setClickedItem(item)}
              onNodeHover={(item) => setHoveredItem(item)}
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

      {/* Custom Stroke */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Custom Stroke</h2>
        <p className={styles.description}>
          Customize cell border color and width.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>Default stroke</span>
            <Treemap data={salesByRegionData} width={280} height={180} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>strokeWidth: 4</span>
            <Treemap data={salesByRegionData} width={280} height={180} strokeWidth={4} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>No stroke</span>
            <Treemap data={salesByRegionData} width={280} height={180} strokeWidth={0} />
          </div>
        </div>
      </section>

      {/* Many Items */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Many Items</h2>
        <p className={styles.description}>
          Treemap handles many items gracefully. Small cells automatically hide labels.
        </p>
        <div className={styles['demo-box']}>
          <Treemap data={manyItemsData} width={600} height={350} />
        </div>
      </section>

      {/* Aspect Ratio */}
      <section className={styles.section}>
        <h2 className={styles['section-title']}>Aspect Ratio</h2>
        <p className={styles.description}>
          Adjust aspectRatio to control how rectangles are laid out.
          Higher values create more horizontal rectangles.
        </p>
        <div className={styles['demo-row']}>
          <div className={styles['demo-item']}>
            <span className={styles.label}>aspectRatio: 1</span>
            <Treemap data={salesByRegionData} width={280} height={200} aspectRatio={1} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>aspectRatio: 4/3 (default)</span>
            <Treemap data={salesByRegionData} width={280} height={200} aspectRatio={4 / 3} />
          </div>
          <div className={styles['demo-item']}>
            <span className={styles.label}>aspectRatio: 2</span>
            <Treemap data={salesByRegionData} width={280} height={200} aspectRatio={2} />
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
          <Treemap data={[]} width={400} height={200} />
        </div>
      </section>
    </div>
  );
};

export default TreemapDemoPageContent;
