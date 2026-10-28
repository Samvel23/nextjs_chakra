import "./globals.scss";

import type { Metadata } from "next";
import { type ReactNode, Suspense } from "react";
import { cookies } from "next/headers";
import { getMessages } from "next-intl/server";

import styles from "./styles/layout.module.scss";
import { Geist } from "next/font/google";

import { Provider } from "@/shared/config/provider";
import { LocaleProvider, isLocale, type TLocale } from "@/shared/config/i18n";
import { AuthenticatedHeader } from "@/entities/header/ui/AuthenticatedHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tech Events Dashboard",
  description: "Discover community talks and tech events.",
};

interface RootLayoutProps {
  children: ReactNode;
}

async function LocaleWrapper({ children }: { children: ReactNode }) {
  let initialLocale: TLocale = "en";
  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("preferred-locale")?.value;
    if (isLocale(localeCookie)) {
      initialLocale = localeCookie;
    }
  } catch {
    // Fallback during static build
  }

  const messages = await getMessages();

  return (
    <LocaleProvider initialLocale={initialLocale} initialMessages={messages}>
      <Suspense fallback={null}>
        <AuthenticatedHeader />
      </Suspense>
      <main className={styles["document__main"]}>{children}</main>
    </LocaleProvider>
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${styles.document}`}
      suppressHydrationWarning
    >
      <body className={styles["document__body"]}>
        <Provider>
          <Suspense fallback={null}>
            <LocaleWrapper>{children}</LocaleWrapper>
          </Suspense>
        </Provider>
      </body>
    </html>
  );
}
