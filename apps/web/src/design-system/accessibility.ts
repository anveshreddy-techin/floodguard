/**
 * Accessibility helper functions and contrast checks
 */

export type FontSizeMultiplier = 'NORMAL' | 'LARGE' | 'XLARGE';

export const fontSizeClasses: Record<FontSizeMultiplier, string> = {
  NORMAL: 'portal-text-normal',
  LARGE: 'portal-text-large',
  XLARGE: 'portal-text-xlarge',
};

export const focusRing = 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900 focus:ring-offset-white';

export const skipLink = 'sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-amber-600 focus:text-white focus:px-4 focus:py-2 focus:font-bold focus:shadow-md focus:outline-none';
