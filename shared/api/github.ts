import { z } from "zod";

export const GithubReleaseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().nullable(),
  tag_name: z.string().min(1),
  html_url: z.string().url(),
  published_at: z.string().datetime({ offset: true }),
  body: z.string().nullable(),
  prerelease: z.boolean(),
});

export type TGithubRelease = z.infer<typeof GithubReleaseSchema>;

export const parseGithubReleases = (response: unknown): TGithubRelease[] =>
  z.array(GithubReleaseSchema).parse(response);

export const fetchGithubReleases = async (): Promise<TGithubRelease[]> => {
  const headers = new Headers({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  });

  const token = process.env.GITHUB_TOKEN;
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(
    "https://api.github.com/repos/vercel/next.js/releases?per_page=10",
    {
      headers,
      signal: AbortSignal.timeout(8000),
    },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub releases request failed with status ${response.status}`,
    );
  }

  return parseGithubReleases(await response.json());
};
