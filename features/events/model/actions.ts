"use server";

import { refresh, updateTag } from "next/cache";

import { hasDashboardSession } from "@/entities/session";
import { eventRepository, EventInputSchema } from "@/entities/event";

import type { IDeleteEventState, IEventActionState } from "./action-types";

const getEventInput = (formData: FormData) => {
  // Handle multiple images joined by comma or first valid URL
  const imageUrls = formData.getAll("imageUrl").filter(Boolean);
  const primaryImageUrl =
    imageUrls.length > 0 ? imageUrls.join(",") : formData.get("imageUrl");

  return {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    startsAt: normalizeDateTime(formData.get("startsAt")),
    location: formData.get("location"),
    capacity: formData.get("capacity"),
    imageUrl: primaryImageUrl || null,
  };
};

const normalizeDateTime = (value: FormDataEntryValue | null): unknown => {
  if (typeof value !== "string" || !value) return value;
  if (/[zZ]|[+-]\d\d:\d\d$/.test(value)) return value;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

export const saveEventAction = async (
  _previousState: IEventActionState,
  formData: FormData,
): Promise<IEventActionState> => {
  if (!(await hasDashboardSession())) {
    return { status: "error", message: "unauthorized" };
  }

  const rawInput = getEventInput(formData);
  const parsedInput = EventInputSchema.safeParse(rawInput);

  if (!parsedInput.success) {
    return {
      status: "error",
      message: null,
      fieldErrors: parsedInput.error.flatten().fieldErrors,
    };
  }

  const eventId = formData.get("id");
  const isEditing = typeof eventId === "string" && Boolean(eventId);

  const existingEvent = eventRepository.findByTitle(parsedInput.data.title);

  if (existingEvent) {
    if (!isEditing || existingEvent.id !== eventId) {
      return {
        status: "error",
        message: "duplicateTitle",
        fieldErrors: { title: ["An event with this name already exists."] },
      };
    }
  }

  const event = isEditing
    ? eventRepository.update(eventId as string, parsedInput.data)
    : eventRepository.create(parsedInput.data);

  if (!event) return { status: "error", message: "notFound" };

  updateTag("events:managed-list");
  updateTag(`events:managed:${event.slug}`);

  return { status: "success", message: "saved" };
};

export const deleteEventAction = async (
  _previousState: IDeleteEventState,
  formData: FormData,
): Promise<IDeleteEventState> => {
  if (!(await hasDashboardSession())) {
    return { status: "error", message: "unauthorized" };
  }

  const eventId = formData.get("id");

  if (typeof eventId !== "string" || !eventId) {
    return { status: "error", message: "notFound" };
  }

  const deletedSlug = eventRepository.delete(eventId);

  if (!deletedSlug) return { status: "error", message: "notFound" };

  updateTag("events:managed-list");
  updateTag(`events:managed:${deletedSlug}`);

  return { status: "success", message: "deleted" };
};

export const registerForEventAction = async (
  slug: string,
): Promise<{ success: boolean; remainingSeats: number | null }> => {
  if (!/^[a-z0-9-]{1,100}$/.test(slug)) {
    return { success: false, remainingSeats: null };
  }

  const remainingSeats = eventRepository.register(slug);

  if (remainingSeats !== null) refresh();

  return { success: remainingSeats !== null, remainingSeats };
};