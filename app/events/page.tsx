import { Suspense } from "react";

import type { Metadata } from "next";

import { Typography } from "@/shared/ui";
import { EventBrowser } from "@/widgets/event-browser";

import styles from "../styles/loading.module.scss";

export const metadata: Metadata = {
  title: "Tech events and talks",
  description:
    "Discover community articles and upcoming events across the Next.js ecosystem.",
};

interface EventSearchPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const EventSearchResults = async ({ searchParams }: EventSearchPageProps) => {
  const params = await searchParams;
  const value = (key: string) => {
    const current = params[key];
    return Array.isArray(current) ? (current[0] ?? "") : (current ?? "");
  };

  return (
    <EventBrowser
      category={value("category") || "nextjs"}
      date={value("date") || "all"}
      search={value("search")}
    />
  );
};

const EventsPage = ({ searchParams }: EventSearchPageProps) => (
  <Suspense
    fallback={
      <main className={styles["loading"]}>
        <p className={styles["loading__message"]}>
          <Typography value="Events.loading" />
        </p>
      </main>
    }
  >
    <EventSearchResults searchParams={searchParams} />
  </Suspense>
);

export default EventsPage;
