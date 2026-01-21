import React, { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from '@site/src/components/ThemeProvider';
import { getColorHex } from '@site/src/config/tailwindColors';

// Wrapper komponentti joka käyttää ThemeContextia
function RootContent({ children }) {
  const { theme } = useTheme();

  useEffect(() => {
    // Aseta CSS-muuttujat koko sivustolle
    if (theme && typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Muunna värit hex-arvoiksi
      const primaryHex = getColorHex(theme.colors.primary);
      const secondaryHex = getColorHex(theme.colors.secondary);
      const accentHex = getColorHex(theme.colors.accent);
      const backgroundHex = getColorHex(theme.colors.background);
      const surfaceHex = getColorHex(theme.colors.surface);
      const textHex = getColorHex(theme.colors.text);
      const textMutedHex = getColorHex(theme.colors.textMuted);
      const borderHex = getColorHex(theme.colors.border);

      // Aseta CSS-muuttujat
      root.style.setProperty('--theme-primary', primaryHex);
      root.style.setProperty('--theme-secondary', secondaryHex);
      root.style.setProperty('--theme-accent', accentHex);
      root.style.setProperty('--theme-background', backgroundHex);
      root.style.setProperty('--theme-surface', surfaceHex);
      root.style.setProperty('--theme-text', textHex);
      root.style.setProperty('--theme-text-muted', textMutedHex);
      root.style.setProperty('--theme-border', borderHex);
    }
  }, [theme]);

  return children;
}

export default function Root({ children }) {
  return (
    <ThemeProvider>
      <RootContent>
        {children}
      </RootContent>
    </ThemeProvider>
  );
}