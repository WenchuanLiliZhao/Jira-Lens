import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';


/**
 * DevToolsFAB Demo Page Content
 * 
 * AI Hint: This is a demo page showcasing the DevToolsFAB component.
 */
const PageContent: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<string>('');
  const [storedSettings, setStoredSettings] = useState<string>('');

  useEffect(() => {
    // Monitor theme changes
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme');
      setCurrentTheme(theme || 'light');
      
      // Check localStorage
      const stored = localStorage.getItem('dev-tools-settings');
      setStoredSettings(stored || 'No settings stored');
    };

    checkTheme();

    // Set up an interval to check for changes
    const interval = setInterval(checkTheme, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles["component-demo-container"]}>
      <h1>DevToolsFAB Component Demo</h1>
      
      <section className={styles["component-demo-section"]}>
        <h2>About This Component</h2>
        <p>
          The DevToolsFAB is a floating action button positioned at the bottom-right 
          corner of the screen. Click it to access development tools.
        </p>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Current State</h2>
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'var(--chart-black-alpha-4-hex)', 
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          <p><strong>Active Theme:</strong> {currentTheme}</p>
          <p><strong>LocalStorage:</strong> {storedSettings}</p>
        </div>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Features</h2>
        <ul>
          <li><strong>Light Mode</strong>: Force light theme regardless of system preference</li>
          <li><strong>Dark Mode</strong>: Force dark theme regardless of system preference</li>
          <li><strong>System Mode</strong>: Follow the system's color scheme preference</li>
          <li><strong>Persistence</strong>: Settings are saved to localStorage and persist across page reloads</li>
          <li><strong>Reset</strong>: Restore all settings to defaults (system mode)</li>
        </ul>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Try It Out</h2>
        <p>
          Look for the floating action button with a <strong>build</strong> icon at the 
          bottom-right corner of this page. Click it to:
        </p>
        <ol>
          <li>Change the theme mode</li>
          <li>Observe how the page colors update in real-time</li>
          <li>Reload the page to see your settings persist</li>
          <li>Click "Reset Settings" to restore defaults</li>
        </ol>
      </section>

      <section className={styles["component-demo-section"]}>
        <h2>Visual Feedback</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'var(--chart-rainbow-blue-100)', 
            color: 'white',
            borderRadius: '8px'
          }}>
            Primary Color
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'var(--chart-black-alpha-15-hex)', 
            color: 'var(--use-text-prime)',
            borderRadius: '8px'
          }}>
            Neutral Color
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: 'var(--chart-rainbow-green-100)', 
            color: 'white',
            borderRadius: '8px'
          }}>
            Success Color
          </div>
        </div>
        <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--use-text-secondary)' }}>
          These colors will change based on the selected theme mode.
        </p>
      </section>

      {/* The DevToolsFAB is already rendered globally in App.tsx */}
      {/* We don't need to render it again here */}
    </div>
  );
};

export default PageContent;
