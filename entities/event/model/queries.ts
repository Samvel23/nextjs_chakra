import { cacheLife, cacheTag } from "next/cache";

import { fetchDevtoArticles, type TDevtoArticle } from "@/shared/api/devto";
import { fetchGithubReleases, type TGithubRelease } from "@/shared/api/github";

import type { TManagedEvent } from "./schema";

import { eventRepository } from "./repository";

export const getManagedEvents = async (): Promise<TManagedEvent[]> => {
  "use cache";

  cacheLife("hours");
  cacheTag("events:managed-list");

  return eventRepository.list();
};

export const getManagedEvent = async (
  slug: string,
): Promise<TManagedEvent | null> => {
  "use cache";

  cacheLife("hours");
  cacheTag("events:managed-list", `events:managed:${slug}`);

  return eventRepository.findBySlug(slug);
};

export const getCachedDevtoArticles = async (
  tag = "nextjs",
): Promise<TDevtoArticle[]> => {
  "use cache";

  cacheLife("hours");
  cacheTag("devto:articles", `devto:tag:${tag}`);

  return fetchDevtoArticles(tag);
};

export const getCachedEventBySlug = async (
  slug: string,
): Promise<TManagedEvent | TDevtoArticle | null> => {
  "use cache";

  cacheLife("hours");
  cacheTag("events:managed-list", `events:managed:${slug}`, "devto:articles");

  const managedEvent = await eventRepository.findBySlug(slug);
  if (managedEvent) return managedEvent;

  const tags = ["nextjs", "react", "typescript", "javascript", "webdev"];

  for (const tag of tags) {
    const articles = await fetchDevtoArticles(tag);
    const foundArticle = articles.find((article) => article.slug === slug);
    if (foundArticle) return foundArticle;
  }

  return null;
};

export const getCachedGithubReleases = async (): Promise<TGithubRelease[]> => {
  "use cache";

  cacheLife("days");
  cacheTag("github:nextjs-releases");

  return fetchGithubReleases();
};
