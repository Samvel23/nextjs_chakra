export const locales = ["en", "fr"] as const;

export type TLocale = (typeof locales)[number];

type TNestedKeys<T> = {
  [Key in keyof T & string]: T[Key] extends string
    ? Key
    : `${Key}.${TNestedKeys<T[Key]>}`;
}[keyof T & string];

export type TTranslationKey = TNestedKeys<
  typeof import("./messages/en.json")
>;

export const isLocale = (value: unknown): value is TLocale =>
  locales.some((locale) => locale === value);
