"use client";

import { useEffect } from "react";

import { Typography } from "@/shared/ui";

import styles from "../styles/error.module.scss";

interface EventsErrorProps {
  error: Error & { digest?: string };
  retry: VoidFunction;
}

const EventsError = ({ error, retry }: EventsErrorProps) => {
  useEffect(() => {
    console.error("Events route failed:", error);
  }, [error]);

  return (
    <main className={styles["error-page"]}>
      <section className={styles["error-page__card"]}>
        <h1 className={styles["error-page__title"]}>
          <Typography value="Error.title" />
        </h1>
        <p className={styles["error-page__message"]}>
          <Typography value="Events.routeError" />
        </p>
        <button
          className={styles["error-page__retry-button"]}
          onClick={retry}
          type="button"
        >
          <Typography value="Error.retry" />
        </button>
      </section>
    </main>
  );
};

export default EventsError;
