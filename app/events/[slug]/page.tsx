import type { Metadata } from "next";

import { notFound } from "next/navigation";

import {
  getManagedEvents,
  getCachedEventBySlug,
  getCachedDevtoArticles,
} from "@/entities/event";
import { EventDetails } from "@/widgets/event-details";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = async () => {
  try {
    const articles = await getCachedDevtoArticles("nextjs");
    const events = await getManagedEvents();
    return [
      ...articles.map((article) => ({ slug: article.slug })),
      ...events.map((event) => ({ slug: event.slug })),
    ];
  } catch (error) {
    console.error("Could not pre-render community event pages:", error);
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: EventPageProps): Promise<Metadata> => {
  const { slug } = await params;

  try {
    const event = await getCachedEventBySlug(slug);
    return event
      ? {
          title: `${event.title} | Tech Events Dashboard`,
          description: event.description,
          openGraph: {
            title: event.title,
            description: event.description,
            type: "article",
          },
        }
      : { title: "Event not found | Tech Events Dashboard" };
  } catch (error) {
    console.error(`Could not load event metadata for "${slug}":`, error);
    return { title: "Tech Events Dashboard" };
  }
};

const EventPage = async ({ params }: EventPageProps) => {
  const { slug } = await params;
  if (!/^[a-z0-9-]{1,128}$/.test(slug)) notFound();

  const event = await getCachedEventBySlug(slug);
  if (!event) notFound();

  return <EventDetails event={event} />;
};

export default EventPage;
