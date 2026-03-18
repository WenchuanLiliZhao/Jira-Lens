/**
 * DevToolsFAB Component
 *
 * A development tools FAB that provides theme switching and other dev utilities.
 * Persists settings to localStorage.
 *
 * AI Hints:
 * - This component manages theme mode (light/dark/system)
 * - Uses localStorage to persist user preferences
 * - Provides a reset function to restore defaults
 *
 * Modification Guide:
 * - To add new settings: Update DevSettings interface and localStorage logic
 * - To add new menu items: Add to the DropdownMenu.Content
 */

import React, { useEffect, useState } from "react";
import { FAB } from "../../../general/fab";
import { DropdownMenu } from "../../../general/dropdown-menu";
import styles from "./styles.module.scss";

// ============ TYPES ============

type ThemeMode = 'light' | 'dark' | 'system';

interface DevSettings {
  theme: ThemeMode;
}

export interface DevToolsFABProps {
  // No props needed for now - component is self-contained
  
  trivial?: string; // add a trivial to deal the warning of no props
}

// ============ CONSTANTS ============

const STORAGE_KEY = 'dev-tools-settings';

const DEFAULT_SETTINGS: DevSettings = {
  theme: 'system'
};

// ============ COMPONENT ============

export const DevToolsFAB: React.FC<DevToolsFABProps> = () => {
  const [settings, setSettings] = useState<DevSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings(parsed);
        }
      } catch (error) {
        console.error('Failed to load dev settings:', error);
      }
    };

    loadSettings();
  }, []);

  // Apply theme when settings change
  useEffect(() => {
    const applyTheme = (theme: ThemeMode) => {
      const root = document.documentElement;
      
      if (theme === 'system') {
        // Listen to system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const applySystemTheme = () => {
          if (mediaQuery.matches) {
            root.setAttribute('data-theme', 'dark');
          } else {
            root.setAttribute('data-theme', 'light');
          }
        };
        
        // Apply initial system theme
        applySystemTheme();
        
        // Listen for changes
        mediaQuery.addEventListener('change', applySystemTheme);
        
        return () => {
          mediaQuery.removeEventListener('change', applySystemTheme);
        };
      } else if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
      }
    };

    const cleanup = applyTheme(settings.theme);
    return cleanup;
  }, [settings.theme]);

  // Save settings to localStorage
  const saveSettings = (newSettings: DevSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save dev settings:', error);
    }
  };

  // Handle theme change
  const handleThemeChange = (theme: ThemeMode) => {
    saveSettings({ ...settings, theme });
  };

  // Reset to default settings
  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className={styles["dev-tools-fab"]}>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <FAB icon="build" color="secondary" size="medium" />
        </DropdownMenu.Trigger>
        
        <DropdownMenu.Content align="end" side="top">
          <DropdownMenu.Label>Theme Mode</DropdownMenu.Label>
          <DropdownMenu.ItemButton 
            label="Light" 
            icon="light_mode"
            active={settings.theme === 'light'}
            onSelect={() => handleThemeChange('light')}
          />
          <DropdownMenu.ItemButton 
            label="Dark" 
            icon="dark_mode"
            active={settings.theme === 'dark'}
            onSelect={() => handleThemeChange('dark')}
          />
          <DropdownMenu.ItemButton 
            label="System" 
            icon="contrast"
            active={settings.theme === 'system'}
            onSelect={() => handleThemeChange('system')}
          />
          
          <DropdownMenu.Separator />
          
          <DropdownMenu.ItemButton 
            label="Reset Settings" 
            icon="restart_alt"
            onSelect={handleReset}
          />
          <DropdownMenu.ItemButton 
            label="Clear localStorage" 
            icon="delete_sweep"
            onSelect={() => {
              localStorage.clear();
              window.location.reload();
            }}
          />
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

DevToolsFAB.displayName = "DevToolsFAB";
