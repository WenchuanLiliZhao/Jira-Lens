import { useEffect, useState } from 'react';

const DEV_TOOLS_STORAGE_KEY = 'dev-tools-settings';

function getEffectiveTheme(): 'light' | 'dark' {
  const dataTheme = document.documentElement.getAttribute('data-theme');
  if (dataTheme === 'dark' || dataTheme === 'light') return dataTheme;

  // Align with DevToolsFAB: read stored preference so initial render matches (avoids flash on refresh)
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(DEV_TOOLS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { theme?: string };
        if (parsed.theme === 'dark' || parsed.theme === 'light') return parsed.theme;
        if (parsed.theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
      }
    } catch {
      // ignore parse errors
    }
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Returns current theme variant (light/dark) and re-renders when data-theme changes. */
export function useThemeVariant(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>(getEffectiveTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(getEffectiveTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}
