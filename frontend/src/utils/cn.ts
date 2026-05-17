// Utility: merge Tailwind class names without clsx dependency
export const cn = (...classes: (string | undefined | null | false)[]): string =>
  classes.filter(Boolean).join(' ');
