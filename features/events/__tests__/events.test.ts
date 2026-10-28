import { afterEach, describe, expect, it, vi } from "vitest";
import { EventInputSchema, ManagedEventSchema } from "@/entities/event/model/schema";
import { parseDevtoArticles } from "@/shared/api/devto";
import { parseGithubReleases } from "@/shared/api/github";

const { mockHasDashboardSession, mockUpdateTag, mockCreateEvent } = vi.hoisted(
  () => ({
    mockHasDashboardSession: vi.fn(),
    mockUpdateTag: vi.fn(),
    mockCreateEvent: vi.fn(),
  }),
);

vi.mock("@/entities/session", () => ({
  hasDashboardSession: mockHasDashboardSession,
}));

vi.mock("@/entities/event", async () => {
  const { EventInputSchema } = await import(
    "@/entities/event/model/schema"
  );
  return {
    EventInputSchema,
    eventRepository: {
      create: mockCreateEvent,
      update: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock("next/cache", () => ({
  refresh: vi.fn(),
  revalidateTag: vi.fn(),
  updateTag: mockUpdateTag,
}));

const validEventInput = {
  title: "Next.js Summit",
  description: "A community event focused on modern web development.",
  category: "nextjs",
  startsAt: "2026-06-15T18:00:00.000Z",
  location: "Online",
  capacity: 120,
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("event dashboard validation and API parsers", () => {
  it("validates event input and rejects invalid capacity", () => {
    expect(EventInputSchema.safeParse(validEventInput).success).toBe(true);
    expect(
      EventInputSchema.safeParse({ ...validEventInput, capacity: 0 }).success,
    ).toBe(false);
  });

  it("validates persisted event records", () => {
    const managedEvent = {
      ...validEventInput,
      id: "ddeb27fb-d9a0-4624-8a32-7f8b6df74f92",
      slug: "nextjs-summit-1234abcd",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };

    expect(ManagedEventSchema.safeParse(managedEvent).success).toBe(true);
    expect(
      ManagedEventSchema.safeParse({ ...managedEvent, id: "not-a-uuid" })
        .success,
    ).toBe(false);
  });

  it("parses valid Dev.to articles and rejects malformed payloads", () => {
    const article = {
      id: 12,
      title: "Cache Components in Next.js",
      description: "A short article description.",
      url: "https://dev.to/example/cache-components",
      slug: "cache-components",
      readable_publish_date: "Jun 15",
      published_at: "2026-06-15T18:00:00Z",
      tag_list: ["nextjs"],
      positive_reactions_count: 4,
      cover_image: null,
    };

    expect(parseDevtoArticles([article])).toEqual([article]);
    expect(() => parseDevtoArticles([{ ...article, id: "12" }])).toThrow();
  });

  it("parses valid GitHub releases and rejects invalid release URLs", () => {
    const release = {
      id: 42,
      name: "Next.js 16.4.0",
      tag_name: "v16.4.0",
      html_url: "https://github.com/vercel/next.js/releases/tag/v16.4.0",
      published_at: "2026-06-15T18:00:00Z",
      body: "Release notes",
      prerelease: false,
    };

    expect(parseGithubReleases([release])).toEqual([release]);
    expect(() =>
      parseGithubReleases([{ ...release, html_url: "not-a-url" }]),
    ).toThrow();
  });

  it("saves a valid event with an authenticated session and updates its cache tags", async () => {
    mockHasDashboardSession.mockResolvedValue(true);
    const createdEvent = {
      ...validEventInput,
      id: "ddeb27fb-d9a0-4624-8a32-7f8b6df74f92",
      slug: "nextjs-summit-1234abcd",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    mockCreateEvent.mockReturnValue(createdEvent);

    const { saveEventAction } = await import("../model/actions");
    const formData = new FormData();
    Object.entries(validEventInput).forEach(([key, value]) => {
      formData.set(key, String(value));
    });

    const result = await saveEventAction(
      { status: "idle", message: null },
      formData,
    );

    expect(result).toEqual({ status: "success", message: "saved" });
    expect(mockCreateEvent).toHaveBeenCalledOnce();
    expect(mockUpdateTag).toHaveBeenCalledWith("events:managed-list");
    expect(mockUpdateTag).toHaveBeenCalledWith(
      "events:managed:nextjs-summit-1234abcd",
    );
  });
});
