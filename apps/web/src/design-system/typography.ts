/**
 * Typography definitions for FloodGuard AI Public Information Portal
 */

export const typography = {
  headings: {
    h1: 'text-2xl sm:text-3xl font-bold tracking-tight text-slate-900',
    h2: 'text-xl sm:text-2xl font-semibold tracking-tight text-slate-900',
    h3: 'text-lg sm:text-xl font-semibold text-slate-900',
    h4: 'text-base font-semibold text-slate-800',
  },
  body: {
    large: 'text-base sm:text-lg text-slate-700 leading-relaxed',
    base: 'text-sm sm:text-base text-slate-700 leading-normal',
    small: 'text-xs sm:text-sm text-slate-600',
    caption: 'text-xs text-slate-500 font-mono',
  },
  label: {
    formal: 'text-xs font-semibold uppercase tracking-wider text-slate-600',
    required: 'text-xs font-semibold text-rose-700 after:content-["_*"]',
  },
  table: {
    header: 'text-xs font-bold uppercase tracking-wider text-slate-100 bg-slate-900 p-3 text-left',
    cell: 'text-sm text-slate-800 p-3 border-b border-slate-200',
  }
};
