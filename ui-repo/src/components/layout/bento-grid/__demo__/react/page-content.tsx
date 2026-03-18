import React from 'react';
import styles from './styles.module.scss';
import { BentoGrid, useBentoGridContext } from '../../the-component';
import { useContainerWidth } from '../../../../../hooks';

/**
 * BentoGrid Demo Page Content
 * 
 * Showcases all usage patterns of the BentoGrid component.
 */

/* =============================================================================
 * Helper Components
 * ========================================================================== */

/** Simple demo item */
const DemoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className={styles['demo-item']}>
    <span className={styles['demo-item-label']}>{label}</span>
    <span className={styles['demo-item-value']}>{value}</span>
  </div>
);

/** Feature card */
const FeatureCard: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div className={styles['feature-card']}>
    <div>
      <h3 className={styles['feature-card-title']}>{title}</h3>
      <p className={styles['feature-card-description']}>{description}</p>
    </div>
  </div>
);

/** Stat card */
const StatCard: React.FC<{ label: string; value: string; trend?: string }> = ({ label, value, trend }) => (
  <div className={styles['stat-card']}>
    <span className={styles['stat-card-label']}>{label}</span>
    <div className={styles['stat-card-value']}>{value}</div>
    {trend && <span className={styles['stat-card-trend']}>{trend}</span>}
  </div>
);

/** Image card */
const ImageCard: React.FC<{ title: string }> = ({ title }) => (
  <div className={styles['image-card']}>
    <div className={styles['image-card-image']} />
    <div className={styles['image-card-content']}>
      <h4 className={styles['image-card-title']}>{title}</h4>
    </div>
  </div>
);

/** Width indicator that reads from context */
const WidthIndicator: React.FC = () => {
  const { containerWidth } = useBentoGridContext();
  return (
    <BentoGrid.Item res={[{ cols: 'full', rows: 1 }]}>
      <div className={styles['width-indicator']}>
        Container width: {containerWidth ?? 'measuring...'}px
      </div>
    </BentoGrid.Item>
  );
};

/** Hook demo - standalone useContainerWidth usage */
const HookDemo: React.FC = () => {
  const { ref, width } = useContainerWidth<HTMLDivElement>();
  
  return (
    <div ref={ref} className={styles['resize-container']}>
      <div className={styles['width-indicator']}>
        Container width: {width ?? 'measuring...'}px
      </div>
      <p style={{ marginTop: '1rem', color: 'var(--use-text-secondary)', fontSize: '0.875rem' }}>
        This container uses the standalone useContainerWidth hook, independent of BentoGrid.
        Drag the edge to resize and see real-time updates.
      </p>
    </div>
  );
};

/* =============================================================================
 * Demo Page
 * ========================================================================== */

const PageContent: React.FC = () => {
  return (
    <div className={styles["component-demo-container"]}>
      <h1>BentoGrid Component Demo</h1>
      
      {/* Basic Usage */}
      <section className={styles["component-demo-section"]}>
        <h2 className={styles['section-title']}>Basic Usage</h2>
        <p className={styles['section-description']}>
          Simple grid with static column spans. Items use the new object-based responsive config.
        </p>
        
        <BentoGrid gap="md">
          <BentoGrid.Item res={[{ cols: 4, rows: 1 }]}>
            <DemoItem label="4 cols" value="A" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[{ cols: 4, rows: 1 }]}>
            <DemoItem label="4 cols" value="B" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[{ cols: 4, rows: 1 }]}>
            <DemoItem label="4 cols" value="C" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[{ cols: 6, rows: 1 }]}>
            <DemoItem label="6 cols" value="D" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[{ cols: 6, rows: 1 }]}>
            <DemoItem label="6 cols" value="E" />
          </BentoGrid.Item>
        </BentoGrid>
      </section>

      {/* Responsive Behavior */}
      <section className={styles["component-demo-section"]}>
        <h2 className={styles['section-title']}>Responsive Behavior (Container-based)</h2>
        <p className={styles['section-description']}>
          Drag the container edge to resize. Items respond to container width, not viewport.
          The width indicator shows the current container width.
        </p>
        
        <div className={styles['resize-container']}>
          <BentoGrid gap="md" rowHeight={[{ maxWidth: 600, height: 80 }, { height: 120 }]}>
            <WidthIndicator />
            
            <BentoGrid.Item res={[
              { maxWidth: 500, cols: 12, rows: 1 },
              { maxWidth: 800, cols: 6, rows: 1 },
              { cols: 4, rows: 1 }
            ]}>
              <DemoItem label="Responsive" value="1" />
            </BentoGrid.Item>
            
            <BentoGrid.Item res={[
              { maxWidth: 500, cols: 12, rows: 1 },
              { maxWidth: 800, cols: 6, rows: 1 },
              { cols: 4, rows: 1 }
            ]}>
              <DemoItem label="Responsive" value="2" />
            </BentoGrid.Item>
            
            <BentoGrid.Item res={[
              { maxWidth: 500, cols: 12, rows: 1 },
              { maxWidth: 800, cols: 12, rows: 1 },
              { cols: 4, rows: 1 }
            ]}>
              <DemoItem label="Responsive" value="3" />
            </BentoGrid.Item>
          </BentoGrid>
        </div>
      </section>

      {/* useContainerWidth Hook Demo */}
      <section className={styles["component-demo-section"]}>
        <h2 className={styles['section-title']}>useContainerWidth Hook (Standalone)</h2>
        <p className={styles['section-description']}>
          The useContainerWidth hook can be used independently to monitor any container's width.
          It uses ResizeObserver for real-time updates without page refresh.
        </p>
        
        <HookDemo />
      </section>

      {/* Row Spanning */}
      <section className={styles["component-demo-section"]}>
        <h2 className={styles['section-title']}>Row Spanning</h2>
        <p className={styles['section-description']}>
          Items can span multiple rows for asymmetric layouts.
        </p>
        
        <BentoGrid gap="md" rowHeight={[{ height: 100 }]}>
          <BentoGrid.Item res={[{ cols: 6, rows: 2 }]}>
            <FeatureCard 
              title="Featured Item" 
              description="This item spans 6 columns and 2 rows, creating a prominent featured area."
            />
          </BentoGrid.Item>
          <BentoGrid.Item res={[{ cols: 6, rows: 1 }]}>
            <StatCard label="Total Users" value="12,345" trend="+12.5%" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[{ cols: 3, rows: 1 }]}>
            <StatCard label="Revenue" value="$89K" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[{ cols: 3, rows: 1 }]}>
            <StatCard label="Growth" value="23%" />
          </BentoGrid.Item>
        </BentoGrid>
      </section>

      {/* Gap Variants */}
      <section className={styles["component-demo-section"]}>
        <h2 className={styles['section-title']}>Gap Variants</h2>
        <p className={styles['section-description']}>
          Different gap sizes: none, sm, md, lg
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {(['none', 'sm', 'md', 'lg'] as const).map((gap) => (
            <div key={gap}>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>gap="{gap}"</p>
              <BentoGrid gap={gap} rowHeight={[{ height: 60 }]}>
                {[1, 2, 3, 4].map((i) => (
                  <BentoGrid.Item key={i} res={[{ cols: 3, rows: 1 }]}>
                    <DemoItem label={`Item`} value={String(i)} />
                  </BentoGrid.Item>
                ))}
              </BentoGrid>
            </div>
          ))}
        </div>
      </section>

      {/* Full Width Item */}
      <section className={styles["component-demo-section"]}>
        <h2 className={styles['section-title']}>Full Width Item</h2>
        <p className={styles['section-description']}>
          Use cols: 'full' for items that span the entire grid width.
        </p>
        
        <BentoGrid gap="md" rowHeight={[{ height: 80 }]}>
          <BentoGrid.Item res={[{ cols: 'full', rows: 1 }]}>
            <FeatureCard 
              title="Full Width Header" 
              description="This item uses cols: 'full' to span all 12 columns regardless of breakpoint."
            />
          </BentoGrid.Item>
          <BentoGrid.Item res={[{ cols: 4, rows: 1 }]}>
            <ImageCard title="Card 1" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[{ cols: 4, rows: 1 }]}>
            <ImageCard title="Card 2" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[{ cols: 4, rows: 1 }]}>
            <ImageCard title="Card 3" />
          </BentoGrid.Item>
        </BentoGrid>
      </section>

      {/* Dashboard Example */}
      <section className={styles["component-demo-section"]}>
        <h2 className={styles['section-title']}>Dashboard Layout Example</h2>
        <p className={styles['section-description']}>
          A realistic dashboard layout with mixed content types.
        </p>
        
        <BentoGrid 
          gap="md" 
          rowHeight={[
            { maxWidth: 600, height: 100 },
            { maxWidth: 900, height: 120 },
            { height: 140 }
          ]}
        >
          {/* Stats Row */}
          <BentoGrid.Item res={[
            { maxWidth: 600, cols: 6, rows: 1 },
            { cols: 3, rows: 1 }
          ]}>
            <StatCard label="Total Revenue" value="$124K" trend="+18.2%" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[
            { maxWidth: 600, cols: 6, rows: 1 },
            { cols: 3, rows: 1 }
          ]}>
            <StatCard label="Active Users" value="8,432" trend="+5.3%" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[
            { maxWidth: 600, cols: 6, rows: 1 },
            { cols: 3, rows: 1 }
          ]}>
            <StatCard label="Conversion" value="3.24%" trend="+0.8%" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[
            { maxWidth: 600, cols: 6, rows: 1 },
            { cols: 3, rows: 1 }
          ]}>
            <StatCard label="Avg. Order" value="$86" trend="-2.1%" />
          </BentoGrid.Item>
          
          {/* Main Chart Area */}
          <BentoGrid.Item res={[
            { maxWidth: 600, cols: 12, rows: 2 },
            { cols: 8, rows: 2 }
          ]}>
            <FeatureCard 
              title="Revenue Overview" 
              description="Main chart area spanning 8 columns and 2 rows on desktop, full width on mobile."
            />
          </BentoGrid.Item>
          
          {/* Side Cards */}
          <BentoGrid.Item res={[
            { maxWidth: 600, cols: 6, rows: 1 },
            { cols: 4, rows: 1 }
          ]}>
            <ImageCard title="Top Products" />
          </BentoGrid.Item>
          <BentoGrid.Item res={[
            { maxWidth: 600, cols: 6, rows: 1 },
            { cols: 4, rows: 1 }
          ]}>
            <ImageCard title="Recent Orders" />
          </BentoGrid.Item>
        </BentoGrid>
      </section>
    </div>
  );
};

export default PageContent;
