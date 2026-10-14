import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.scss";
import { Provider } from "@/shared/config/provider";
import { LocaleProvider } from "@/shared/config/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js | Chakra UI",
  description: "A Next.js project with Chakra UI and TypeScript",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html
    lang="en"
    className={`${geistSans.variable} ${geistMono.variable} ${styles.html}`}
    suppressHydrationWarning
  >
    <body className={styles.body}>
      <Provider>
        <LocaleProvider>{children}</LocaleProvider>
      </Provider>
    </body>
  </html>
);

export default RootLayout;
