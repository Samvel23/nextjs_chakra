import type { TManagedEvent } from "@/entities/event";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventActionStatuses = ["idle", "success", "error"] as const;

export const eventActionMessages = [
  "saved",
  "deleted",
  "notFound",
  "unauthorized",
  "duplicateTitle",
] as const;

export const deleteEventMessages = [
  "deleted",
  "notFound",
  "unauthorized",
] as const;

export const eventFieldNames = [
  "title",
  "category",
  "startsAt",
  "location",
  "capacity",
  "description",
] as const;

export const optimisticEventKeys = [
  "id",
  "slug",
  "title",
  "category",
  "startsAt",
  "imageUrl",
  "location",
] as const;

export type TEventActionStatus = (typeof eventActionStatuses)[number];
export type TEventActionMessage = (typeof eventActionMessages)[number];
export type TDeleteEventMessage = (typeof deleteEventMessages)[number];
export type TEventFieldName = (typeof eventFieldNames)[number];
export type TOptimisticEventKey = (typeof optimisticEventKeys)[number];

export interface IEventActionState {
  status: TEventActionStatus;
  message: TEventActionMessage | null;
  fieldErrors?: Partial<Record<TEventFieldName, string[]>>;
}

export interface IDeleteEventState {
  message: TDeleteEventMessage;
  status: Extract<TEventActionStatus, "success" | "error">;
}

export const initialEventActionState: IEventActionState = {
  status: "idle",
  message: null,
};

export type TOptimisticEvent = Pick<TManagedEvent, TOptimisticEventKey> & {
  pending?: boolean;
};
