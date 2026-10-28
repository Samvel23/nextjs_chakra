"use client";

import {
  useEffect,
  useContext,
  createContext,
  type ReactNode,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { isLocale, type TLocale } from "./model";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";

import frenchMessages from "./messages/fr.json";
import englishMessages from "./messages/en.json";

interface ILocaleSelection {
  locale: TLocale;
  setLocale: (locale: TLocale) => void;
}

interface ILocaleProviderProps {
  initialLocale: TLocale;
  initialMessages: Record<string, AbstractIntlMessages>;
  children: ReactNode;
}

const messagesMap = {
  en: englishMessages,
  fr: frenchMessages,
};

const LocaleSelectionContext = createContext<ILocaleSelection | null>(null);
const localeListeners = new Set<() => void>();

const subscribeToLocale = (listener: () => void) => {
  localeListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    localeListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
};

const getLocaleSnapshot = (): TLocale => {
  if (typeof window === "undefined") return "en";
  const match = document.cookie.match(/(^|;\s*)preferred-locale=([^;]*)/);
  const val = match ? decodeURIComponent(match[2]) : null;
  return isLocale(val) ? val : "en";
};

export const useLocaleSelection = (): ILocaleSelection => {
  const selection = useContext(LocaleSelectionContext);
  if (!selection) {
    throw new Error("useLocaleSelection must be used inside LocaleProvider");
  }
  return selection;
};

export const LocaleProvider = ({
  initialLocale,
  initialMessages,
  children,
}: ILocaleProviderProps) => {
  const router = useRouter();
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    () => initialLocale,
  );

  const activeLocale = locale || initialLocale;
  const activeMessages = messagesMap[activeLocale] || initialMessages;

  const setLocale = (newLocale: TLocale) => {
    document.cookie = `preferred-locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    localeListeners.forEach((listener) => listener());
    router.refresh();
  };

  useEffect(() => {
    document.documentElement.lang = activeLocale;
  }, [activeLocale]);

  return (
    <LocaleSelectionContext.Provider
      value={{ locale: activeLocale, setLocale }}
    >
      <NextIntlClientProvider
        locale={activeLocale}
        messages={activeMessages}
        timeZone="UTC"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleSelectionContext.Provider>
  );
};
