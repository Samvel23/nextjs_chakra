import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ThumbsUp,
  ArrowLeft,
  Sparkles,
  GitPullRequest,
} from "lucide-react";

import {
  type TManagedEvent,
  getCachedDevtoArticles,
  getCachedGithubReleases,
} from "@/entities/event";

import type { TDevtoArticle } from "@/shared/api/devto";

import { Typography } from "@/shared/ui";
import { SeatsCounter } from "@/features/events";
import { EventCardImage } from "@/widgets/event-browser/ui/EventCardImage";

import styles from "./EventDetails.module.scss";

export type TEventDetailsData = TManagedEvent | TDevtoArticle;

const isManagedEvent = (event: TEventDetailsData): event is TManagedEvent =>
  "startsAt" in event;

const LatestRelease = async () => {
  const releases = await getCachedGithubReleases();
  const latestRelease = releases.find((release) => !release.prerelease);

  if (!latestRelease) {
    return (
      <p className={styles["event-details__unavailable"]}>
        <Typography value="Events.releaseUnavailable" />
      </p>
    );
  }

  return (
    <a
      className={styles["event-details__release-link"]}
      href={latestRelease.html_url}
      target="_blank"
      rel="noreferrer"
    >
      <GitPullRequest size={16} />
      <span>{latestRelease.name ?? latestRelease.tag_name}</span>
    </a>
  );
};

const RelatedArticles = async ({ slug }: { slug: string }) => {
  const articles = await getCachedDevtoArticles("nextjs");
  const related = articles
    .filter((article) => article.slug !== slug)
    .slice(0, 4);

  return related.length > 0 ? (
    <ul className={styles["event-details__related"]}>
      {related.map((article) => (
        <li key={article.id}>
          <a
            className={styles["event-details__related-link"]}
            href={article.url}
            target="_blank"
            rel="noreferrer"
          >
            <Sparkles
              size={14}
              className={styles["event-details__related-icon"]}
            />
            <span>{article.title}</span>
          </a>
        </li>
      ))}
    </ul>
  ) : (
    <p className={styles["event-details__unavailable"]}>
      <Typography value="Events.noResults" />
    </p>
  );
};

const WidgetFallback = () => (
  <p className={styles["event-details__unavailable"]}>
    <Typography value="Events.sourceUnavailable" />
  </p>
);

export const EventDetails = ({ event }: { event: TEventDetailsData }) => {
  const isManaged = isManagedEvent(event);
  const date = isManaged ? event.startsAt : event.published_at;
  const category = isManaged ? event.category : (event.tag_list[0] ?? "nextjs");
  const image = isManaged ? event.imageUrl : event.cover_image;

  return (
    <main className={styles["event-details"]}>
      <Link className={styles["event-details__back"]} href="/events">
        <ArrowLeft size={16} />
        <Typography value="Events.backToEvents" />
      </Link>

      <div className={styles["event-details__header-card"]}>
        <div className={styles["event-details__cover"]}>
          {image && (
            <div
              className={styles["event-details__cover-blur-bg"]}
              style={{ backgroundImage: `url(${image})` }}
            />
          )}
          <EventCardImage
            coverImage={image}
            title={event.title}
            className={styles["event-details__cover-img"]}
          />
          <span className={styles["event-details__category"]}>{category}</span>
        </div>

        <div className={styles["event-details__info-area"]}>
          <h1
            id="event-details-title"
            className={styles["event-details__title"]}
          >
            {event.title}
          </h1>

          <div className={styles["event-details__metadata"]}>
            <div className={styles["event-details__meta-item"]}>
              <Calendar size={16} />
              <span>
                <Typography value="Events.publishedDate" />:{" "}
                <time dateTime={date}>{new Date(date).toLocaleString()}</time>
              </span>
            </div>
            {!isManaged && (
              <div className={styles["event-details__meta-item"]}>
                <ThumbsUp size={16} />
                <span>
                  <Typography value="Events.reactions" />:{" "}
                  {event.positive_reactions_count}
                </span>
              </div>
            )}
            {isManaged && (
              <div className={styles["event-details__meta-item"]}>
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles["event-details__content-grid"]}>
        <div className={styles["event-details__main-pane"]}>
          <section className={styles["event-details__description-box"]}>
            <p className={styles["event-details__description"]}>
              {event.description}
            </p>
          </section>

          <div className={styles["event-details__columns"]}>
            <section className={styles["event-details__panel"]}>
              <h2 className={styles["event-details__panel-title"]}>
                <Typography value="Events.relatedArticles" />
              </h2>
              <ErrorBoundary fallback={<WidgetFallback />}>
                <Suspense fallback={<WidgetFallback />}>
                  <RelatedArticles slug={event.slug} />
                </Suspense>
              </ErrorBoundary>
            </section>

            <section className={styles["event-details__panel"]}>
              <h2 className={styles["event-details__panel-title"]}>
                <Typography value="Events.latestRelease" />
              </h2>
              <ErrorBoundary fallback={<WidgetFallback />}>
                <Suspense fallback={<WidgetFallback />}>
                  <LatestRelease />
                </Suspense>
              </ErrorBoundary>
            </section>
          </div>
        </div>

        <aside className={styles["event-details__sidebar"]}>
          <div className={styles["event-details__sticky-widget"]}>
            <Suspense fallback={<WidgetFallback />}>
              <SeatsCounter
                slug={event.slug}
                capacity={isManaged ? event.capacity : 24}
              />
            </Suspense>
          </div>
        </aside>
      </div>
    </main>
  );
};
