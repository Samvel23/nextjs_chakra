import { z } from "zod";

export const DevtoArticleSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  url: z.string().url(),
  slug: z.string().min(1),
  readable_publish_date: z.string(),
  published_at: z.string().datetime({ offset: true }),
  tag_list: z.array(z.string()),
  positive_reactions_count: z.number().int().nonnegative(),
  cover_image: z.string().url().nullable().optional(),
});

export type TDevtoArticle = z.infer<typeof DevtoArticleSchema>;

export const parseDevtoArticles = (response: unknown): TDevtoArticle[] =>
  z.array(DevtoArticleSchema).parse(response);

export const fetchDevtoArticles = async (
  tag = "nextjs",
): Promise<TDevtoArticle[]> => {
  const response = await fetch(
    `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}`,
    {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    },
  );

  if (!response.ok) {
    throw new Error(`Dev.to API request failed with status ${response.status}`);
  }

  return parseDevtoArticles(await response.json());
};
