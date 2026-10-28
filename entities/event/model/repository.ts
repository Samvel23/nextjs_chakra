import path from "node:path";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import Database from "better-sqlite3";
import { z } from "zod";

import {
  type TEventInput,
  type TManagedEvent,
  ManagedEventSchema,
} from "./schema";

const databaseFile =
  process.env.EVENTS_DB_PATH ??
  path.join(process.cwd(), ".data", "tech-events.sqlite");

mkdirSync(path.dirname(databaseFile), { recursive: true });

const database = new Database(databaseFile);

database.pragma("journal_mode = WAL");
database.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    starts_at TEXT NOT NULL,
    location TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    image_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS event_seats (
    event_slug TEXT PRIMARY KEY,
    seats_remaining INTEGER NOT NULL CHECK (seats_remaining >= 0)
  );
`);

// Migration safeguard for existing local SQLite databases
try {
  database.exec(`ALTER TABLE events ADD COLUMN image_url TEXT;`);
} catch {
  // Column already exists
}

const eventFromRow = (row: unknown): TManagedEvent =>
  ManagedEventSchema.parse(row);

const slugRowSchema = z.object({ slug: z.string() });
const seatRowSchema = z.object({
  seats_remaining: z.number().int().nonnegative(),
});

const createSlug = (title: string) =>
  `${title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64)}-${randomUUID().slice(0, 8)}`;

const all = database.prepare(`
  SELECT id, slug, title, description, category,
         starts_at AS startsAt, location, capacity,
         image_url AS imageUrl,
         created_at AS createdAt, updated_at AS updatedAt
  FROM events
  ORDER BY starts_at ASC, created_at DESC
`);

const bySlug = database.prepare(`
  SELECT id, slug, title, description, category,
         starts_at AS startsAt, location, capacity,
         image_url AS imageUrl,
         created_at AS createdAt, updated_at AS updatedAt
  FROM events WHERE slug = ?
`);

const byTitle = database.prepare(`
  SELECT id, slug, title, description, category,
         starts_at AS startsAt, location, capacity,
         image_url AS imageUrl,
         created_at AS createdAt, updated_at AS updatedAt
  FROM events WHERE LOWER(title) = LOWER(?)
`);

export const eventRepository = {
  list: (): TManagedEvent[] => all.all().map(eventFromRow),

  findBySlug: (slug: string): TManagedEvent | null => {
    const row = bySlug.get(slug);
    return row ? eventFromRow(row) : null;
  },

  findByTitle: (title: string): TManagedEvent | null => {
    const row = byTitle.get(title);
    return row ? eventFromRow(row) : null;
  },

  create: (input: TEventInput): TManagedEvent => {
    const now = new Date().toISOString();
    const row = {
      id: randomUUID(),
      slug: createSlug(input.title),
      title: input.title,
      description: input.description,
      category: input.category,
      startsAt: input.startsAt,
      location: input.location,
      capacity: input.capacity,
      imageUrl: input.imageUrl || null,
      createdAt: now,
      updatedAt: now,
    };

    database
      .prepare(
        `INSERT INTO events
         (id, slug, title, description, category, starts_at, location, capacity, image_url, created_at, updated_at)
         VALUES (@id, @slug, @title, @description, @category, @startsAt, @location, @capacity, @imageUrl, @createdAt, @updatedAt)`,
      )
      .run(row);

    return ManagedEventSchema.parse(row);
  },

  update: (id: string, input: TEventInput): TManagedEvent | null => {
    const existing = database
      .prepare("SELECT slug FROM events WHERE id = ?")
      .get(id);

    if (!existing) return null;
    const { slug } = slugRowSchema.parse(existing);

    const now = new Date().toISOString();
    database
      .prepare(
        `UPDATE events SET title = ?, description = ?, category = ?, starts_at = ?,
         location = ?, capacity = ?, image_url = ?, updated_at = ? WHERE id = ?`,
      )
      .run(
        input.title,
        input.description,
        input.category,
        input.startsAt,
        input.location,
        input.capacity,
        input.imageUrl || null,
        now,
        id,
      );

    return eventRepository.findBySlug(slug);
  },

  delete: (id: string): string | null => {
    const row = database
      .prepare("SELECT slug FROM events WHERE id = ?")
      .get(id);

    if (!row) return null;
    const { slug } = slugRowSchema.parse(row);

    database.transaction(() => {
      database
        .prepare("DELETE FROM event_seats WHERE event_slug = ?")
        .run(slug);
      database.prepare("DELETE FROM events WHERE id = ?").run(id);
    })();

    return slug;
  },

  remainingSeats: (slug: string, initialCapacity = 24): number => {
    database
      .prepare(
        "INSERT OR IGNORE INTO event_seats (event_slug, seats_remaining) VALUES (?, ?)",
      )
      .run(slug, initialCapacity);

    const row = database
      .prepare("SELECT seats_remaining FROM event_seats WHERE event_slug = ?")
      .get(slug);

    return seatRowSchema.parse(row).seats_remaining;
  },

  register: (slug: string, initialCapacity = 24): number | null => {
    const registerTransaction = database.transaction(() => {
      database
        .prepare(
          "INSERT OR IGNORE INTO event_seats (event_slug, seats_remaining) VALUES (?, ?)",
        )
        .run(slug, initialCapacity);

      const result = database
        .prepare(
          "UPDATE event_seats SET seats_remaining = seats_remaining - 1 WHERE event_slug = ? AND seats_remaining > 0",
        )
        .run(slug);

      if (result.changes === 0) return null;

      const row = database
        .prepare("SELECT seats_remaining FROM event_seats WHERE event_slug = ?")
        .get(slug);

      return seatRowSchema.parse(row).seats_remaining;
    });

    return registerTransaction();
  },
};
