import React, { useState } from 'react';
import styles from './styles.module.scss';
import { ToggleSwitch } from '../../the-component';

/**
 * ToggleSwitch Demo Page Content
 * 
 * AI Hint: This is a demo page showcasing all usage patterns of the ToggleSwitch component.
 *
 * AI COLOR GUIDANCE:
 * Import colors from '@/global-styles/colors.ts' for inline styles:
 *   import { use, chartRainbow, chartNeutral, chartBlackAlpha } from '@/global-styles/colors';
 * Example: style={{ color: use['text-prime'], background: chartRainbow['blue-100'] }}
 * DO NOT use hardcoded hex values - always use design token variables.
 */
const PageContent: React.FC = () => {
  // State for controlled switches
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [switch3, setSwitch3] = useState(false);
  const [switch4, setSwitch4] = useState(true);
  const [switch5, setSwitch5] = useState(false);
  const [switch6, setSwitch6] = useState(true);
  const [switch7, setSwitch7] = useState(false);
  const [switch8, setSwitch8] = useState(true);

  return (
    <div className={styles["component-demo-container"]}>
      <h1>ToggleSwitch Component Demo</h1>
      
      {/* Basic Switch (No Label) */}
      <section className={styles["component-demo-section"]}>
        <h2>Basic Switch (No Label)</h2>
        <p>Standalone switch without a label.</p>
        <div className={styles["demo-row"]}>
          <ToggleSwitch
            checked={switch1}
            onCheckedChange={setSwitch1}
          />
          <ToggleSwitch
            checked={switch2}
            onCheckedChange={setSwitch2}
          />
        </div>
      </section>

      {/* Switch with Label */}
      <section className={styles["component-demo-section"]}>
        <h2>Switch with Label</h2>
        <p>Switch with descriptive label text.</p>
        <div className={styles["demo-row"]} style={{ flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch
            label="Enable notifications"
            checked={switch3}
            onCheckedChange={setSwitch3}
          />
          <ToggleSwitch
            label="Dark mode"
            checked={switch4}
            onCheckedChange={setSwitch4}
          />
          <ToggleSwitch
            label="Auto-save documents"
            checked={switch5}
            onCheckedChange={setSwitch5}
          />
        </div>
      </section>

      {/* Disabled States */}
      <section className={styles["component-demo-section"]}>
        <h2>Disabled States</h2>
        <p>Switches in disabled state (both checked and unchecked).</p>
        <div className={styles["demo-row"]} style={{ flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch
            label="Disabled (unchecked)"
            checked={false}
            onCheckedChange={() => {}}
            disabled
          />
          <ToggleSwitch
            label="Disabled (checked)"
            checked={true}
            onCheckedChange={() => {}}
            disabled
          />
          <ToggleSwitch
            checked={false}
            onCheckedChange={() => {}}
            disabled
          />
          <ToggleSwitch
            checked={true}
            onCheckedChange={() => {}}
            disabled
          />
        </div>
      </section>

      {/* Controlled Usage */}
      <section className={styles["component-demo-section"]}>
        <h2>Controlled Usage</h2>
        <p>Examples of controlled switches with state management.</p>
        <div className={styles["demo-row"]} style={{ flexDirection: 'column', gap: '16px' }}>
          <div>
            <ToggleSwitch
              label="Feature A"
              checked={switch6}
              onCheckedChange={setSwitch6}
            />
            <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--use-text-secondary)' }}>
              Current state: {switch6 ? 'ON' : 'OFF'}
            </p>
          </div>
          <div>
            <ToggleSwitch
              label="Feature B"
              checked={switch7}
              onCheckedChange={setSwitch7}
            />
            <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--use-text-secondary)' }}>
              Current state: {switch7 ? 'ON' : 'OFF'}
            </p>
          </div>
        </div>
      </section>

      {/* Settings Example */}
      <section className={styles["component-demo-section"]}>
        <h2>Settings Panel Example</h2>
        <p>Real-world usage in a settings panel.</p>
        <div style={{ 
          padding: '24px', 
          border: '1px solid var(--use-border-prime)', 
          borderRadius: '8px',
          backgroundColor: 'var(--use-bg-prime)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <ToggleSwitch
              label="Email notifications"
              checked={switch8}
              onCheckedChange={setSwitch8}
            />
            <ToggleSwitch
              label="SMS notifications"
              checked={switch1}
              onCheckedChange={setSwitch1}
            />
            <ToggleSwitch
              label="Push notifications"
              checked={switch2}
              onCheckedChange={setSwitch2}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PageContent;
