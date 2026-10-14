"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";
import englishMessages from "./messages/en.json";
import frenchMessages from "./messages/fr.json";
import { isLocale, type Locale } from "./model";

interface LocaleSelection {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

interface LocaleProviderProps {
  children: ReactNode;
}

const messages = {
  en: englishMessages,
  fr: frenchMessages,
};

const LocaleSelectionContext = createContext<LocaleSelection | null>(null);
const localeListeners = new Set<() => void>();

const subscribeToLocale = (listener: () => void) => {
  localeListeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    localeListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const getLocaleSnapshot = (): Locale => {
  const savedLocale = window.localStorage.getItem("preferred-locale");

  return isLocale(savedLocale) ? savedLocale : "en";
};

const getServerLocaleSnapshot = (): Locale => "en";

const selectLocale = (locale: Locale) => {
  window.localStorage.setItem("preferred-locale", locale);
  localeListeners.forEach((listener) => listener());
};

export const useLocaleSelection = (): LocaleSelection => {
  const selection = useContext(LocaleSelectionContext);

  if (!selection) {
    throw new Error("useLocaleSelection must be used inside LocaleProvider");
  }

  return selection;
};

export const LocaleProvider = ({ children }: LocaleProviderProps) => {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleSelectionContext.Provider
      value={{ locale, setLocale: selectLocale }}
    >
      <NextIntlClientProvider
        locale={locale}
        messages={messages[locale]}
        timeZone="UTC"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleSelectionContext.Provider>
  );
};
