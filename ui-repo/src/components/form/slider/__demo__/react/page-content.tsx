import React, { useState } from 'react';
import styles from './styles.module.scss';
import { Slider } from '../../the-component';

/**
 * Slider Demo Page Content
 *
 * AI Hint: This is a demo page showcasing all usage patterns of the Slider component.
 * Supports both single-value mode (default) and range mode (range=true).
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 */
const PageContent: React.FC = () => {
  const [controlledValue, setControlledValue] = useState(50);
  const [controlledRange, setControlledRange] = useState<[number, number]>([30, 70]);

  return (
    <div className={styles['component-demo-container']}>
      <h1>Slider Component Demo</h1>

      <section className={styles['component-demo-section']}>
        <h2>Single Value Mode (Uncontrolled)</h2>
        <p>Default mode with one thumb. Uses defaultValue.</p>
        <Slider min={0} max={100} defaultValue={50} aria-label="Volume" />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Single Value Mode (Controlled)</h2>
        <p>Value: {controlledValue}</p>
        <Slider
          min={0}
          max={100}
          value={controlledValue}
          onChange={(v) => setControlledValue(v)}
          aria-label="Volume"
        />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Range Mode (Uncontrolled)</h2>
        <p>Two thumbs for min/max selection.</p>
        <Slider range min={0} max={100} defaultValue={[20, 80]} aria-label="Price range" />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Range Mode (Controlled)</h2>
        <p>Range: {controlledRange[0]} - {controlledRange[1]}</p>
        <Slider
          range
          min={0}
          max={100}
          value={controlledRange}
          onChange={(v) => setControlledRange(v)}
          aria-label="Price range"
        />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Disabled</h2>
        <Slider min={0} max={100} defaultValue={50} disabled aria-label="Volume" />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Size Variants</h2>
        <p>Small:</p>
        <Slider size="small" min={0} max={100} defaultValue={50} aria-label="Volume" />
        <p>Medium (default):</p>
        <Slider size="medium" min={0} max={100} defaultValue={50} aria-label="Volume" />
        <p>Large:</p>
        <Slider size="large" min={0} max={100} defaultValue={50} aria-label="Volume" />
      </section>

      <section className={styles['component-demo-section']}>
        <h2>Thumb Variant Override</h2>
        <p>Range mode with circular thumbs (default is rectangular):</p>
        <Slider
          range
          thumbVariant="circular"
          min={0}
          max={100}
          defaultValue={[30, 70]}
          aria-label="Range with circular thumbs"
        />
        <p>Single value with rectangular thumb (default is circular):</p>
        <Slider
          thumbVariant="rectangular"
          min={0}
          max={100}
          defaultValue={50}
          aria-label="Volume with rectangular thumb"
        />
      </section>
    </div>
  );
};

export default PageContent;
