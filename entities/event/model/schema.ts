import { z } from "zod";

export const EventInputSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(5000),
  category: z.string().trim().min(2).max(40),
  startsAt: z.iso.datetime({ offset: true }),
  location: z.string().trim().min(2).max(120),
  capacity: z.coerce.number().int().min(1).max(10000),
  imageUrl: z.string().trim().url().optional().or(z.literal("")).nullable(),
});

export type TEventInput = z.infer<typeof EventInputSchema>;

export const ManagedEventSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  startsAt: z.string(),
  location: z.string(),
  capacity: z.number().int().positive(),
  imageUrl: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TManagedEvent = z.infer<typeof ManagedEventSchema>;
