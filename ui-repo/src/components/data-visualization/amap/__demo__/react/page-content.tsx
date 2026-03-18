import React, { useState } from 'react';
import { AmapMap } from '../../the-component';
import styles from './styles.module.scss';
import {
  COLOR_SCHEMES,
  getSchemeStyles,
  getSchemeToggles,
  type ColorSchemeKey,
} from './config/exampleColorSchemes';
import { useThemeVariant } from './config/useThemeVariant';

const PageContent: React.FC = () => {
  const [keyInput, setKeyInput] = useState('');
  const [amapKey, setAmapKey] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [modeLabel, setModeLabel] = useState('Vector map mode');
  const [modeActive, setModeActive] = useState(false);
  const [colorScheme, setColorScheme] = useState<ColorSchemeKey>('Default');
  const themeVariant = useThemeVariant();

  const handleLoadAmap = () => {
    const key = keyInput.trim();
    if (!key) return;
    setIsLoading(true);
    setAmapKey(key);
  };

  const handleAmapLoad = (inst: unknown) => {
    if (inst) {
      setModeLabel('AMap Key loaded');
      setModeActive(true);
    } else {
      setModeLabel('Vector map mode');
      setModeActive(false);
    }
    setIsLoading(false);
  };

  const handleAmapError = (err: unknown) => {
    console.error('AMap load failed', err);
    setIsLoading(false);
    setAmapKey(undefined);
  };

  return (
    <div className={styles.demoContainer}>
      <div className={styles.demoHeader}>
        <div className={styles.logo}>
          <span>Map Style Demo</span>
        </div>

        <select
          value={colorScheme}
          onChange={(e) => setColorScheme(e.target.value as ColorSchemeKey)}
          className={styles.schemeSelect}
          aria-label="Color scheme"
        >
          {Object.keys(COLOR_SCHEMES).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <div className={styles.keyGroup}>
          <div className={styles.keyStatus}>
            <span className={`${styles.dot} ${modeActive ? styles.dotActive : ''}`} />
            <span>{modeLabel}</span>
          </div>
          <input
            type="text"
            className={styles.keyInput}
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLoadAmap();
            }}
            placeholder="Enter AMap Key to switch (optional)"
            aria-label="AMap Key"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className={styles.keyBtn}
            onClick={handleLoadAmap}
            disabled={isLoading}
          >
            {isLoading ? 'Loading…' : 'Load'}
          </button>
        </div>
      </div>
      <div className={styles.mapArea}>
        <AmapMap
          style={{ flex: 1, minHeight: 0 }}
          onAmapLoad={handleAmapLoad}
          onAmapError={handleAmapError}
          amapKey={amapKey}
          initialColors={COLOR_SCHEMES[colorScheme][themeVariant]}
          initialStyles={getSchemeStyles(colorScheme, themeVariant)}
          initialToggles={getSchemeToggles(colorScheme, themeVariant)}
          colorSchemeLabel={colorScheme}
          themeVariant={themeVariant}
          showDebugPanel
          debugPanelDefaultOpen
        />
      </div>
    </div>
  );
};

export default PageContent;
