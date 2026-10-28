import { Suspense, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";

import Link from "next/link";
import { connection } from "next/server";

import type { TManagedEvent } from "@/entities/event";
import type { TDevtoArticle } from "@/shared/api/devto";

import { getCachedDevtoArticles, getManagedEvents } from "@/entities/event";

import { Typography } from "@/shared/ui";

import { SeatsCounter } from "@/features/events";

import { EventFilters } from "./EventFilters";
import { EventCardImage } from "./EventCardImage";

import styles from "./EventBrowser.module.scss";

interface EventBrowserProps {
  date: string;
  search: string;
  category: string;
}

const dateMatches = (value: string, filter: string, future: boolean) => {
  if (filter === "all") return true;

  const date = new Date(value).getTime();
  const now = Date.now();
  const days = filter === "week" ? 7 : 30;
  const boundary = days * 24 * 60 * 60 * 1000;

  return future
    ? date >= now && date <= now + boundary
    : date >= now - boundary;
};

const matchesSearch = (title: string, description: string, search: string) => {
  const normalizedSearch = search.trim().toLocaleLowerCase();
  return (
    !normalizedSearch ||
    `${title} ${description}`.toLocaleLowerCase().includes(normalizedSearch)
  );
};

const EventCard = ({
  slug,
  date,
  title,
  capacity,
  category,
  coverImage,
  description,
}: {
  slug: string;
  date: string;
  title: string;
  capacity?: number;
  category: string;
  coverImage?: string | null;
  description: string;
}) => {
  const eventHref = `/events/${encodeURIComponent(slug)}`;

  return (
    <Link href={eventHref} className={styles["event-browser__card-link"]}>
      <article className={styles["event-browser__card"]}>
        <div className={styles["event-browser__image"]}>
          <EventCardImage
            coverImage={coverImage}
            title={title}
            className={styles["event-browser__card-img"]}
          />
        </div>
        <div className={styles["event-browser__card-body"]}>
          <span className={styles["event-browser__category"]}>{category}</span>
          <h3 className={styles["event-browser__card-title"]}>{title}</h3>
          <p className={styles["event-browser__card-description"]}>
            {description}
          </p>
          <div className={styles["event-browser__metadata"]}>
            <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
          </div>
          <Suspense
            fallback={<Typography as="p" value="Events.loadingSeats" />}
          >
            <SeatsCounter slug={slug} capacity={capacity} />
          </Suspense>
        </div>
      </article>
    </Link>
  );
};

const CommunityTalks = async ({
  category,
  date,
  search,
}: EventBrowserProps) => {
  if (date !== "all") await connection();

  const safeCategory = /^[a-z0-9-]{1,40}$/.test(category) ? category : "nextjs";
  const articles = await getCachedDevtoArticles(
    safeCategory === "all" ? "nextjs" : safeCategory,
  );
  const filteredArticles = articles.filter(
    (article) =>
      matchesSearch(article.title, article.description, search) &&
      dateMatches(article.published_at, date, false),
  );

  return (
    <section className={styles["event-browser__section"]}>
      <Typography
        as="h2"
        className={styles["event-browser__section-title"]}
        value="Events.communityTalks"
      />
      {filteredArticles.length === 0 ? (
        <p className={styles["event-browser__empty"]}>
          <Typography value="Events.noResults" />
        </p>
      ) : (
        <div className={styles["event-browser__grid"]}>
          {filteredArticles.map((article: TDevtoArticle) => (
            <EventCard
              key={article.id}
              title={article.title}
              description={article.description}
              slug={article.slug}
              category={article.tag_list[0] ?? "nextjs"}
              date={article.published_at}
              coverImage={article.cover_image}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const OrganizerEvents = async ({ date, search }: EventBrowserProps) => {
  if (date !== "all") await connection();

  const events = await getManagedEvents();
  const filteredEvents = events.filter(
    (event) =>
      matchesSearch(event.title, event.description, search) &&
      dateMatches(event.startsAt, date, true),
  );

  return (
    <section className={styles["event-browser__section"]}>
      <Typography
        as="h2"
        className={styles["event-browser__section-title"]}
        value="Events.organizerEvents"
      />
      {filteredEvents.length === 0 ? (
        <p className={styles["event-browser__empty"]}>
          <Typography value="Events.noResults" />
        </p>
      ) : (
        <div className={styles["event-browser__grid"]}>
          {filteredEvents.map((event: TManagedEvent) => (
            <EventCard
              key={event.id}
              title={event.title}
              description={event.description}
              slug={event.slug}
              category={event.category}
              date={event.startsAt}
              capacity={event.capacity}
              coverImage={event.imageUrl}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const SourceFallback = () => (
  <p className={styles["event-browser__unavailable"]}>
    <Typography as="span" value="Events.sourceUnavailable" />
  </p>
);

const EventSourceBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary fallback={<SourceFallback />}>
    <Suspense
      fallback={
        <p className={styles["event-browser__empty"]}>
          <Typography value="Events.loading" />
        </p>
      }
    >
      {children}
    </Suspense>
  </ErrorBoundary>
);

const EventBrowser = ({ category, date, search }: EventBrowserProps) => (
  <main className={styles["event-browser"]}>
    <header>
      <Typography
        as="h1"
        className={styles["event-browser__heading"]}
        value="Events.title"
      />
      <Typography
        as="p"
        className={styles["event-browser__description"]}
        value="Events.description"
      />
    </header>
    <EventFilters category={category} date={date} search={search} />
    <EventSourceBoundary>
      <CommunityTalks category={category} date={date} search={search} />
    </EventSourceBoundary>
    <EventSourceBoundary>
      <OrganizerEvents category={category} date={date} search={search} />
    </EventSourceBoundary>
  </main>
);

export default EventBrowser;
