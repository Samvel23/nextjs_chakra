import { connection } from "next/server";
import { eventRepository } from "@/entities/event";
import { EventRegisterButton } from "./EventRegisterButton";

interface ISeatsCounterProps {
  slug: string;
  capacity?: number;
}

export const SeatsCounter = async ({
  slug,
  capacity = 24,
}: ISeatsCounterProps) => {
  await connection();
  const remainingSeats = eventRepository.remainingSeats(slug, capacity);

  return (
    <EventRegisterButton slug={slug} initialSeats={remainingSeats} />
  );
};
