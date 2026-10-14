export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

export const isLocale = (value: unknown): value is Locale =>
  locales.some((locale) => locale === value);
