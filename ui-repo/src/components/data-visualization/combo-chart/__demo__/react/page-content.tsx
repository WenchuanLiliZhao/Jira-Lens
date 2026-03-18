/**
 * ComboChart Demo Page Content
 *
 * Comprehensive demo showcasing ComboChart capabilities:
 * - Dual Y-axis visualizations (Pareto, Sales vs Growth)
 * - Pure column charts (Volume, Revenue Analysis)
 * - Pure line/area charts (Trends, Forecasts)
 * - Mixed visualizations (Actual vs Target, Multi-metric)
 * - Configuration options (Legend position, Grid control)
 */

import React from 'react';
import { ComboChart } from '../../the-component';
import type { ComboSeriesConfig, ChartDataPoint } from '../../the-component';
import styles from './styles.module.scss';

/* -------------------------------------------------------------------------- */
/*                              Sample Data                                   */
/* -------------------------------------------------------------------------- */

// 1. Pareto Analysis - Quality Defects
const paretoData: ChartDataPoint[] = [
  { label: 'Assembly Error', count: 2800000, cumulativePercent: 45.2 },
  { label: 'Component Defect', count: 2400000, cumulativePercent: 83.9 },
  { label: 'Packaging Issue', count: 1000000, cumulativePercent: 100 },
];

// 2. Monthly Sales & Growth Rate
const salesGrowthData: ChartDataPoint[] = [
  { label: 'Jan', revenue: 120000, growthRate: 0.05 },
  { label: 'Feb', revenue: 150000, growthRate: 0.25 },
  { label: 'Mar', revenue: 135000, growthRate: -0.10 },
  { label: 'Apr', revenue: 180000, growthRate: 0.33 },
  { label: 'May', revenue: 210000, growthRate: 0.17 },
  { label: 'Jun', revenue: 195000, growthRate: -0.07 },
];

// 3. Quarterly Performance - Pure Columns
const quarterlyRevenueData: ChartDataPoint[] = [
  { label: 'Q1 2025', product: 320000, service: 180000, subscription: 95000 },
  { label: 'Q2 2025', product: 380000, service: 210000, subscription: 125000 },
  { label: 'Q3 2025', product: 350000, service: 195000, subscription: 140000 },
  { label: 'Q4 2025', product: 420000, service: 240000, subscription: 168000 },
];

// 4. Website Traffic Trends - Pure Lines
const trafficData: ChartDataPoint[] = [
  { label: 'Week 1', pageViews: 12500, uniqueVisitors: 3200, bounceRate: 42 },
  { label: 'Week 2', pageViews: 15800, uniqueVisitors: 3850, bounceRate: 38 },
  { label: 'Week 3', pageViews: 14200, uniqueVisitors: 3600, bounceRate: 45 },
  { label: 'Week 4', pageViews: 18600, uniqueVisitors: 4500, bounceRate: 35 },
  { label: 'Week 5', pageViews: 21300, uniqueVisitors: 5200, bounceRate: 32 },
  { label: 'Week 6', pageViews: 19800, uniqueVisitors: 4800, bounceRate: 36 },
];

// 5. Sales Forecast - Area with Projection
const forecastData: ChartDataPoint[] = [
  { label: 'Jan', actual: 85000, forecast: 82000 },
  { label: 'Feb', actual: 92000, forecast: 88000 },
  { label: 'Mar', actual: 88000, forecast: 90000 },
  { label: 'Apr', actual: 105000, forecast: 95000 },
  { label: 'May', actual: 98000, forecast: 102000 },
  { label: 'Jun', actual: 115000, forecast: 110000 },
];

// 6. Production Metrics - Multi-Axis Dashboard (efficiency as percentage 0-100)
const productionData: ChartDataPoint[] = [
  { label: 'Mon', units: 850, efficiency: 92, downtime: 45 },
  { label: 'Tue', units: 920, efficiency: 95, downtime: 30 },
  { label: 'Wed', units: 880, efficiency: 89, downtime: 65 },
  { label: 'Thu', units: 1050, efficiency: 97, downtime: 20 },
  { label: 'Fri', units: 980, efficiency: 94, downtime: 35 },
];

// 6b. Production Metrics with decimal efficiency (for percent format demo)
const productionDataDecimal: ChartDataPoint[] = [
  { label: 'Mon', units: 850, efficiency: 0.92, downtime: 45 },
  { label: 'Tue', units: 920, efficiency: 0.95, downtime: 30 },
  { label: 'Wed', units: 880, efficiency: 0.89, downtime: 65 },
  { label: 'Thu', units: 1050, efficiency: 0.97, downtime: 20 },
  { label: 'Fri', units: 980, efficiency: 0.94, downtime: 35 },
];

// 7. Customer Satisfaction - Mixed Types Single Axis
const satisfactionData: ChartDataPoint[] = [
  { label: 'Product Quality', score: 4.5, target: 4.2 },
  { label: 'Delivery Time', score: 4.1, target: 4.0 },
  { label: 'Customer Service', score: 4.7, target: 4.5 },
  { label: 'Price Value', score: 3.9, target: 4.3 },
  { label: 'User Experience', score: 4.3, target: 4.1 },
];

// 8. Marketing Campaign - ROI Analysis
const campaignData: ChartDataPoint[] = [
  { label: 'Email', spend: -5000, conversions: 5180, roi: 360 },
  { label: 'Social', spend: 8000, conversions: 240, roi: 300 },
  { label: 'Search', spend: 12000, conversions: 450, roi: 375 },
  { label: 'Display', spend: 6000, conversions: 120, roi: 200 },
];

// 9. Sparse/Incomplete Data - 10 months on x-axis, only months 3-8 have values
const sparseData: ChartDataPoint[] = [
  { label: 'Jan', revenue: null, growthRate: null },
  { label: 'Feb', revenue: null, growthRate: 1.00 },
  { label: 'Mar', revenue: 135000, growthRate: -0.10 },
  { label: 'Apr', revenue: 180000, growthRate: null },
  { label: 'May', revenue: 210000, growthRate: 0.17 },
  { label: 'Jun', revenue: 195000, growthRate: -0.07 },
  { label: 'Jul', revenue: 220000, growthRate: 0.13 },
  { label: 'Aug', revenue: 200000, growthRate: -0.09 },
  { label: 'Sep', revenue: null, growthRate: 0.13 },
  { label: 'Oct', revenue: null, growthRate: null },
];

/* -------------------------------------------------------------------------- */
/*                              Demo Section Component                        */
/* -------------------------------------------------------------------------- */

const DemoSection: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>{title}</h2>
    {description && <p className={styles.sectionDescription}>{description}</p>}
    <div className={styles.chartContainer}>{children}</div>
  </section>
);

/* -------------------------------------------------------------------------- */
/*                              Page Content                                  */
/* -------------------------------------------------------------------------- */

const PageContent: React.FC = () => {
  /* ========================================================================= */
  /*   SECTION 1: DUAL Y-AXIS COMBO CHARTS (Primary Use Case)                 */
  /* ========================================================================= */

  // Pareto Chart Series
  const paretoSeries: ComboSeriesConfig[] = [
    {
      key: 'count',
      type: 'column',
      title: 'Defect Count',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-blue-100)',
      icon: 'warning',
    },
    {
      key: 'cumulativePercent',
      type: 'line',
      displayAs: 'line',
      title: 'Cumulative %',
      yAxisId: 'right',
      color: 'var(--chart-rainbow-red-100)',
      // strokeWidth: 2,
      icon: 'trending_up',
    },
  ];

  // Sales vs Growth Series
  const salesGrowthSeries: ComboSeriesConfig[] = [
    {
      key: 'revenue',
      type: 'column',
      title: 'Monthly Revenue',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-blue-100)',
      icon: 'payments',
    },
    {
      key: 'growthRate',
      type: 'line',
      displayAs: 'line',
      title: 'Growth Rate',
      yAxisId: 'right',
      color: 'var(--chart-rainbow-green-100)',
      strokeWidth: 2,
      icon: 'trending_up',
    },
  ];

  /* ========================================================================= */
  /*   SECTION 2: PURE COLUMN CHARTS                                          */
  /* ========================================================================= */

  // Single Column Series
  // Note: Single-axis charts MUST explicitly set yAxisId to 'left'
  const singleColumnSeries: ComboSeriesConfig[] = [
    {
      key: 'product',
      type: 'column',
      title: 'Product Revenue',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-blue-100)',
    },
  ];

  // Multi-Column Series
  // Note: Single-axis charts MUST explicitly set yAxisId to 'left'
  const multiColumnSeries: ComboSeriesConfig[] = [
    {
      key: 'product',
      type: 'column',
      title: 'Product',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-blue-100)',
      icon: 'inventory_2',
    },
    {
      key: 'service',
      type: 'column',
      title: 'Service',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-green-100)',
      icon: 'support_agent',
    },
    {
      key: 'subscription',
      type: 'column',
      title: 'Subscription',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-purple-100)',
      icon: 'subscriptions',
    },
  ];

  /* ========================================================================= */
  /*   SECTION 3: PURE LINE/AREA CHARTS                                       */
  /* ========================================================================= */

  // Multi-Line Series
  // Note: Single-axis charts MUST explicitly set yAxisId to 'left'
  const multiLineSeries: ComboSeriesConfig[] = [
    {
      key: 'pageViews',
      type: 'line',
      displayAs: 'line',
      title: 'Page Views',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-blue-100)',
      strokeWidth: 2,
      icon: 'visibility',
    },
    {
      key: 'uniqueVisitors',
      type: 'line',
      displayAs: 'line',
      title: 'Unique Visitors',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-green-100)',
      strokeWidth: 2,
      icon: 'person',
    },
  ];

  // Line + Area Series
  // Note: Single-axis charts MUST explicitly set yAxisId to 'left'
  const forecastSeries: ComboSeriesConfig[] = [
    {
      key: 'actual',
      type: 'line',
      displayAs: 'line-area',
      title: 'Actual Sales',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-blue-100)',
      strokeWidth: 2,
      fillOpacity: 0.3,
      icon: 'check_circle',
    },
    {
      key: 'forecast',
      type: 'line',
      displayAs: 'line',
      title: 'Forecast',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-orange-100)',
      strokeDasharray: '5 5',
      strokeWidth: 2,
      icon: 'query_stats',
    },
  ];

  // Pure Area Series
  // Note: Single-axis charts MUST explicitly set yAxisId to 'left'
  const areaSeries: ComboSeriesConfig[] = [
    {
      key: 'actual',
      type: 'line',
      displayAs: 'area',
      title: 'Actual Sales',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-purple-100)',
      fillOpacity: 0.4,
    },
  ];

  /* ========================================================================= */
  /*   SECTION 4: MIXED VISUALIZATIONS (SINGLE AXIS)                          */
  /* ========================================================================= */

  // Column + Line on Same Axis
  const satisfactionSeries: ComboSeriesConfig[] = [
    {
      key: 'score',
      type: 'column',
      title: 'Actual Score',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-blue-100)',
    },
    {
      key: 'target',
      type: 'line',
      displayAs: 'line',
      title: 'Target Score',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-red-100)',
      strokeDasharray: '4 4',
      strokeWidth: 2,
    },
  ];

  /* ========================================================================= */
  /*   SECTION 5: MULTI-METRIC DASHBOARD                                      */
  /* ========================================================================= */

  // Production Dashboard Series
  const productionSeries: ComboSeriesConfig[] = [
    {
      key: 'units',
      type: 'column',
      title: 'Units Produced',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-blue-100)',
      icon: 'factory',
    },
    {
      key: 'efficiency',
      type: 'line',
      displayAs: 'line',
      title: 'Efficiency %',
      yAxisId: 'right',
      color: 'var(--chart-rainbow-green-100)',
      strokeWidth: 2,
      icon: 'speed',
    },
  ];

  // Marketing ROI Series
  const campaignSeries: ComboSeriesConfig[] = [
    {
      key: 'spend',
      type: 'column',
      title: 'Ad Spend',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-orange-100)',
      icon: 'account_balance_wallet',
    },
    {
      key: 'conversions',
      type: 'column',
      title: 'Conversions',
      yAxisId: 'left',
      color: 'var(--chart-rainbow-blue-100)',
      icon: 'emoji_events',
    },
    {
      key: 'roi',
      type: 'line',
      displayAs: 'line',
      title: 'ROI %',
      yAxisId: 'right',
      color: 'var(--chart-rainbow-green-100)',
      strokeWidth: 2,
      icon: 'trending_up',
    },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>ComboChart Component</h1>
      <p className={styles.pageDescription}>
        Flexible dual-axis combination charts for mixed visualizations and multi-metric analysis.
      </p>

      {/* ===================================================================== */}
      {/*   SECTION 1: DUAL Y-AXIS COMBO CHARTS                                */}
      {/* ===================================================================== */}

      <div className={styles.categoryTitle}>Dual Y-Axis Charts</div>

      <DemoSection
        title="Pareto Analysis"
        description="Classic Pareto chart: defect counts (left axis) with cumulative percentage (right axis). Perfect for quality analysis."
      >
        <ComboChart
          data={paretoData}
          series={paretoSeries}
          leftYAxis={{ label: 'Defect Count' }}
          rightYAxis={{ label: 'Cumulative %', domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100] }}
        />
      </DemoSection>

      <DemoSection
        title="Sales vs Growth Rate"
        description="Revenue columns (left axis) overlaid with growth rate line (right axis). Shows volume and percentage trends together."
      >
        <ComboChart
          data={salesGrowthData}
          series={salesGrowthSeries}
          leftYAxis={{ label: 'Revenue ($)' }}
          rightYAxis={{ label: 'Growth Rate (%)' }}
        />
      </DemoSection>

      <DemoSection
        title="Production Performance Dashboard"
        description="Daily units produced (left axis) with efficiency percentage (right axis). Multi-metric operational view."
      >
        <ComboChart
          data={productionData}
          series={productionSeries}
          leftYAxis={{ label: 'Units Produced' }}
          rightYAxis={{ label: 'Efficiency (%)', domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100] }}
        />
      </DemoSection>

      {/* ===================================================================== */}
      {/*   SECTION 2: PURE COLUMN CHARTS                                      */}
      {/* ===================================================================== */}

      <div className={styles.categoryTitle}>Pure Column Charts</div>

      <DemoSection
        title="Basic Column Chart"
        description="Simple column chart with single series. Clean and minimal for single-metric visualization."
      >
        <ComboChart data={quarterlyRevenueData} series={singleColumnSeries} leftYAxis={{ label: 'Revenue ($)' }} />
      </DemoSection>

      <DemoSection
        title="Multi-Series Column Chart"
        description="Multiple column series with Material icons in legend. Compare related metrics side by side."
      >
        <ComboChart data={quarterlyRevenueData} series={multiColumnSeries} leftYAxis={{ label: 'Revenue ($)' }} />
      </DemoSection>

      {/* ===================================================================== */}
      {/*   SECTION 3: PURE LINE/AREA CHARTS                                   */}
      {/* ===================================================================== */}

      <div className={styles.categoryTitle}>Line & Area Charts</div>

      <DemoSection
        title="Multi-Line Chart"
        description="Multiple line series for comparing trends. Ideal for tracking related metrics over time."
      >
        <ComboChart data={trafficData} series={multiLineSeries} leftYAxis={{ label: 'Count' }} />
      </DemoSection>

      <DemoSection
        title="Line + Area with Forecast"
        description="Solid area for actual data, dashed line for forecast. Combines confidence (area fill) with projection."
      >
        <ComboChart data={forecastData} series={forecastSeries} leftYAxis={{ label: 'Sales ($)' }} />
      </DemoSection>

      <DemoSection
        title="Pure Area Chart"
        description="Filled area without stroke for emphasis on volume/magnitude. Clean and modern aesthetic."
      >
        <ComboChart data={forecastData} series={areaSeries} leftYAxis={{ label: 'Sales ($)' }} />
      </DemoSection>

      {/* ===================================================================== */}
      {/*   SECTION 4: MIXED VISUALIZATIONS (SINGLE AXIS)                      */}
      {/* ===================================================================== */}

      <div className={styles.categoryTitle}>Mixed Types (Single Axis)</div>

      <DemoSection
        title="Actual vs Target"
        description="Column bars for actual values with dashed target line. Both use the same Y-axis for direct comparison."
      >
        <ComboChart
          data={satisfactionData}
          series={satisfactionSeries}
          leftYAxis={{ label: 'Score (out of 5)', domain: [0, 5], ticks: [0, 1, 2, 3, 4, 5] }}
        />
      </DemoSection>

      {/* ===================================================================== */}
      {/*   SECTION 5: ADVANCED MULTI-METRIC                                   */}
      {/* ===================================================================== */}

      <div className={styles.categoryTitle}>Advanced Multi-Metric</div>

      <DemoSection
        title="Marketing Campaign ROI"
        description="Three-series chart: spend + conversions (left axis) with ROI percentage (right axis). Complete campaign performance view."
      >
        <ComboChart
          data={campaignData}
          series={campaignSeries}
          leftYAxis={{ label: 'Spend ($) / Conversions' }}
          rightYAxis={{ label: 'ROI (%)' }}
        />
      </DemoSection>

      {/* ===================================================================== */}
      {/*   SECTION 5b: INCOMPLETE / SPARSE DATA                               */}
      {/* ===================================================================== */}

      <div className={styles.categoryTitle}>Incomplete / Sparse Data</div>

      <DemoSection
        title="Sparse Data with Gaps"
        description="When x-axis has 10 units but data exists only for a subset (e.g., months 3–8). Use null for missing values. Bars are absent and lines show visible gaps at null points."
      >
        <ComboChart
          data={sparseData}
          series={salesGrowthSeries}
          leftYAxis={{ label: 'Revenue ($)' }}
          rightYAxis={{ label: 'Growth Rate (%)' }}
        />
      </DemoSection>

      <DemoSection
        title="Sparse Data with Connected Lines"
        description="Same data with connectNulls: true on line series. The growth rate line bridges across null gaps instead of showing breaks."
      >
        <ComboChart
          data={sparseData}
          series={[
            {
              key: 'revenue',
              type: 'column',
              title: 'Monthly Revenue',
              yAxisId: 'left',
              color: 'var(--chart-rainbow-blue-100)',
              icon: 'payments',
            },
            {
              key: 'growthRate',
              type: 'line',
              displayAs: 'line',
              title: 'Growth Rate',
              yAxisId: 'right',
              color: 'var(--chart-rainbow-green-100)',
              strokeWidth: 2,
              icon: 'trending_up',
              connectNulls: true,
            },
          ]}
          leftYAxis={{ label: 'Revenue ($)' }}
          rightYAxis={{ label: 'Growth Rate (%)' }}
        />
      </DemoSection>

      {/* ===================================================================== */}
      {/*   SECTION 6: CONFIGURATION OPTIONS                                   */}
      {/* ===================================================================== */}

      <div className={styles.categoryTitle}>Configuration Options</div>

      <DemoSection
        title="Legend at Top"
        description="Position legend above the chart for space-constrained layouts."
      >
        <ComboChart data={trafficData} series={multiLineSeries} leftYAxis={{ label: 'Count' }} legendPosition="top" />
      </DemoSection>

      <DemoSection
        title="No Legend"
        description="Hide legend for embedded charts or when series are labeled elsewhere."
      >
        <ComboChart data={quarterlyRevenueData} series={singleColumnSeries} leftYAxis={{ label: 'Revenue ($)' }} showLegend={false} />
      </DemoSection>

      <DemoSection
        title="No Grid Lines"
        description="Remove all grid lines for cleaner, minimalist aesthetic. Use grid={false}."
      >
        <ComboChart data={forecastData} series={forecastSeries} leftYAxis={{ label: 'Sales ($)' }} grid={false} />
      </DemoSection>

      <DemoSection
        title="Horizontal Grid Only (Default)"
        description="Default behavior: horizontal grid lines help read Y-axis values. Use grid={{ horizontal: true }}."
      >
        <ComboChart
          data={trafficData}
          series={multiLineSeries}
          leftYAxis={{ label: 'Count' }}
          grid={{ horizontal: true }}
        />
      </DemoSection>

      <DemoSection
        title="Vertical Grid Only"
        description="Vertical grid lines at X-axis ticks. Useful for time-series data. Use grid={{ horizontal: false, vertical: true }}."
      >
        <ComboChart
          data={forecastData}
          series={forecastSeries}
          leftYAxis={{ label: 'Sales ($)' }}
          grid={{ horizontal: false, vertical: true }}
        />
      </DemoSection>

      <DemoSection
        title="Both Grid Lines"
        description="Full grid with both horizontal and vertical lines. Use grid={{ horizontal: true, vertical: true }}."
      >
        <ComboChart
          data={salesGrowthData}
          series={salesGrowthSeries}
          leftYAxis={{ label: 'Revenue ($)' }}
          rightYAxis={{ label: 'Growth Rate (%)' }}
          grid={{ horizontal: true, vertical: true }}
        />
      </DemoSection>

      <DemoSection
        title="Hidden Y-Axis Labels"
        description="Hide axis labels for compact displays or when labels are obvious from context."
      >
        <ComboChart
          data={salesGrowthData}
          series={salesGrowthSeries}
          leftYAxis={{ label: 'Revenue ($)', showLabel: false }}
          rightYAxis={{ label: 'Growth Rate (%)', showLabel: false }}
        />
      </DemoSection>

      {/* ===================================================================== */}
      {/*   SECTION 7: NUMBER FORMATTING                                       */}
      {/* ===================================================================== */}

      <div className={styles.categoryTitle}>Number Formatting</div>

      <DemoSection
        title="Compact Format (K/M/B)"
        description="Large numbers displayed with K, M, B suffixes. Ideal for revenue, population, or large metrics."
      >
        <ComboChart
          data={salesGrowthData}
          series={salesGrowthSeries}
          leftYAxis={{ label: 'Revenue', format: 'compact' }}
          rightYAxis={{ label: 'Growth Rate (%)' }}
        />
      </DemoSection>

      <DemoSection
        title="Comma Separator"
        description="Thousands separated by commas for better readability of large numbers."
      >
        <ComboChart
          data={productionData}
          series={productionSeries}
          leftYAxis={{ label: 'Units Produced', format: 'comma' }}
          rightYAxis={{ label: 'Efficiency (%)', domain: [0, 100], ticks: [0, 20, 40, 60, 80, 100] }}
        />
      </DemoSection>

      <DemoSection
        title="Percentage Format"
        description="Decimal values displayed as percentages (0.92 → 92%). Right axis uses percentage format."
      >
        <ComboChart
          data={productionDataDecimal}
          series={productionSeries}
          leftYAxis={{ label: 'Units Produced' }}
          rightYAxis={{ label: 'Efficiency', format: 'percent', domain: [0, 1], ticks: [0, 0.2, 0.4, 0.6, 0.8, 1.0] }}
        />
      </DemoSection>

      <DemoSection
        title="Currency Format"
        description="Numbers formatted with dollar sign and comma separators."
      >
        <ComboChart
          data={salesGrowthData}
          series={salesGrowthSeries}
          leftYAxis={{ label: 'Revenue', format: 'currency' }}
          rightYAxis={{ label: 'Growth Rate (%)' }}
        />
      </DemoSection>

      <DemoSection
        title="Decimal Precision"
        description="Fixed decimal places for precise measurements. Here showing 1 decimal place for rating scores."
      >
        <ComboChart
          data={satisfactionData}
          series={satisfactionSeries}
          leftYAxis={{ label: 'Score (out of 5)', format: 'decimal', decimalPrecision: 1, domain: [0, 5], ticks: [0, 1, 2, 3, 4, 5] }}
        />
      </DemoSection>

      <DemoSection
        title="Mixed Formatting"
        description="Different formats for left and right axes. Compact for revenue, percentage for growth rate."
      >
        <ComboChart
          data={salesGrowthData}
          series={salesGrowthSeries}
          leftYAxis={{ label: 'Revenue', format: 'compact' }}
          rightYAxis={{ label: 'Growth Rate', format: 'percent', domain: [-0.15, 0.35], ticks: [-0.1, 0, 0.1, 0.2, 0.3] }}
        />
      </DemoSection>
    </div>
  );
};

export default PageContent;
