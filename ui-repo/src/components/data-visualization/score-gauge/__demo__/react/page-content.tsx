import React, { useState } from 'react';
import styles from './styles.module.scss';
import { ScoreGauge } from '../../the-component';
import { Slider } from '../../../../form/slider';
import { chartRainbow } from '../../../../../global-styles/colors';

/** NPS-style pink-to-teal gradient (screenshot reference) */
const NPS_COLOR_STOPS = [
  { value: -100, color: chartRainbow['pink-100'] },
  { value: 100, color: chartRainbow['green-100'] },
];

/** Default red/yellow/green for low/mid/high */
const DEFAULT_COLOR_STOPS = [
  { value: -100, color: chartRainbow['red-100'] },
  { value: 0, color: chartRainbow['yellow-100'] },
  { value: 100, color: chartRainbow['green-100'] },
];

/** NPS distribution segments: Detractor / Passive / Promoter */
const NPS_DISTRIBUTION_SEGMENTS = [
  { value: 5, color: chartRainbow['red-100'], label: 'Detractor' },
  { value: 6, color: chartRainbow['yellow-100'], label: 'Passive' },
  { value: 89, color: chartRainbow['green-100'], label: 'Promoter' },
];

/**
 * ScoreGauge Demo Page Content
 *
 * AI Hint: This is a demo page showcasing all usage patterns of the ScoreGauge component.
 */
const PageContent: React.FC = () => {
  const [demoArcAngle, setDemoArcAngle] = useState(180);
  const [demoSize, setDemoSize] = useState(180);

  return (
    <div className={styles["component-demo-container"]}>
      <h1>ScoreGauge Component Demo</h1>

      <section className={styles["component-demo-section"]}>
        <h2>Interactive Playground</h2>
        <p>Adjust <code>arcAngle</code> and <code>size</code> to preview all combinations.</p>
        <div className={styles["playground-controls"]}>
          <div className={styles["playground-control-row"]}>
            <label className={styles["playground-label"]}>
              arcAngle: <strong>{demoArcAngle}°</strong>
            </label>
            <Slider
              min={90}
              max={270}
              step={1}
              value={demoArcAngle}
              onChange={setDemoArcAngle}
            />
          </div>
          <div className={styles["playground-control-row"]}>
            <label className={styles["playground-label"]}>
              size: <strong>{demoSize}px</strong>
            </label>
            <Slider
              min={80}
              max={280}
              step={4}
              value={demoSize}
              onChange={setDemoSize}
            />
          </div>
        </div>
        <div className={styles["score-gauge-demo-row"]}>
          <ScoreGauge
            value={84}
            label="+4.0"
            arcAngle={demoArcAngle}
            size={demoSize}
            colorStops={NPS_COLOR_STOPS}
          />
          <ScoreGauge
            segments={NPS_DISTRIBUTION_SEGMENTS}
            value={84}
            label="+4.0"
            arcAngle={demoArcAngle}
            size={demoSize}
            showRangeLabels
          />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>NPS Style (screenshot reference)</h2>
        <p>value=84, min=-100, max=100, label="+4.0", pink-to-teal gradient.</p>
        <div className={styles["score-gauge-demo-row"]}>
          <ScoreGauge
            value={84}
            min={-100}
            max={100}
            label="+4.0"
            colorStops={NPS_COLOR_STOPS}
          />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Score Range (red / yellow / green)</h2>
        <p>Low score (red), mid score (yellow), high score (green).</p>
        <div className={styles["score-gauge-demo-row"]}>
          <ScoreGauge value={20} colorStops={DEFAULT_COLOR_STOPS} />
          <ScoreGauge value={50} colorStops={DEFAULT_COLOR_STOPS} />
          <ScoreGauge value={84} colorStops={DEFAULT_COLOR_STOPS} />
          <ScoreGauge value={90} colorStops={DEFAULT_COLOR_STOPS} />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Size Variants</h2>
        <p>size=120, 180 (default), 240.</p>
        <div className={styles["score-gauge-demo-row"]}>
          <ScoreGauge value={67} size={120} />
          <ScoreGauge value={67} size={180} />
          <ScoreGauge value={67} size={240} />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Arc Angle Variants</h2>
        <p>arcAngle=120, 180 (default), 240, 270.</p>
        <div className={styles["score-gauge-demo-row"]}>
          <ScoreGauge value={84} arcAngle={120} />
          <ScoreGauge value={84} arcAngle={180} />
          <ScoreGauge value={84} arcAngle={240} />
          <ScoreGauge value={84} arcAngle={270} />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Without Label</h2>
        <p>Omit the label prop for value-only display.</p>
        <div className={styles["score-gauge-demo-row"]}>
          <ScoreGauge value={84} min={-100} max={100} />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>No Animation</h2>
        <p>animated=false for instant display.</p>
        <div className={styles["score-gauge-demo-row"]}>
          <ScoreGauge value={84} animated={false} />
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Distribution Mode (segments prop)</h2>
        <p>
          Arc divided into proportional colored segments — 5% Detractor (red),
          6% Passive (yellow), 89% Promoter (green). Center still shows score + label.
        </p>
        <div className={styles["score-gauge-demo-row"]}>
          <ScoreGauge
            segments={NPS_DISTRIBUTION_SEGMENTS}
            value={84}
            label="+4.0"
            min={-100}
            max={100}
            showRangeLabels
          />
          <ScoreGauge
            segments={NPS_DISTRIBUTION_SEGMENTS}
            size={240}
            value={84}
            label="+4.0"
            min={-100}
            max={100}
            showRangeLabels
          />
          <ScoreGauge
            segments={NPS_DISTRIBUTION_SEGMENTS}
            size={120}
            showRangeLabels={false}
          />
        </div>
      </section>
    </div>
  );
};

export default PageContent;
