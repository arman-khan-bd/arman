'use client';

import { useEffect } from 'react';

export const ThemeProvider = () => {
  useEffect(() => {
    // Set the theme to dark by default
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return null;
};
