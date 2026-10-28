"use client";

import { useOptimistic, useState, useTransition, type MouseEvent } from "react";

import { useRouter } from "next/navigation";

import { Typography } from "@/shared/ui";
import { registerForEventAction } from "../model/actions";

import styles from "./SeatsCounter.module.scss";

interface IEventRegisterButtonProps {
  slug: string;
  initialSeats: number;
}

export const EventRegisterButton = ({
  slug,
  initialSeats,
}: IEventRegisterButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [hasError, setHasError] = useState(false);

  const [optimisticSeats, setOptimisticSeats] = useOptimistic<number, boolean>(
    initialSeats,
    (currentSeats: number, reserveSeat: boolean) =>
      reserveSeat ? Math.max(0, currentSeats - 1) : currentSeats,
  );

  const register = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    startTransition(async () => {
      setHasError(false);
      setOptimisticSeats(true);
      const result = await registerForEventAction(slug);
      setHasError(!result.success);
      if (result.success) {
        router.refresh(); // Triggers server component re-fetch
      }
    });
  };

  const buttonKey: "Events.registering" | "Events.register" = isPending 
  ? "Events.registering" 
  : "Events.register";

  return (
    <div
      className={styles["seats-counter"]}
      aria-live="polite"
      onClick={(e) => e.stopPropagation()} // Extra safeguard for container
    >
      <p className={styles["seats-counter__count"]}>
        <Typography
          value="Events.availableSeats"
          values={{ count: optimisticSeats }}
        />
      </p>
      {hasError && (
        <p className={styles["seats-counter__error"]} role="alert">
          <Typography as="span" value="Events.registrationFailed" />
        </p>
      )}
      <button
        className={styles["seats-counter__button"]}
        type="button"
        onClick={register}
        disabled={isPending || optimisticSeats <= 0}
      >
        <Typography as="span" value={buttonKey} />
      </button>
    </div>
  );
};
