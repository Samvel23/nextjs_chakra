"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { fetchDevtoArticles, TDevtoArticle } from "@/shared/api/devto";

export const getCachedEvents = async (
  category?: string,
): Promise<TDevtoArticle[]> => {
  cacheLife("hours");
  cacheTag("events-list");

  const tag = category && category !== "all" ? category : "nextjs";
  const articles = await fetchDevtoArticles(tag);

  return articles;
};
