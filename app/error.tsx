"use client";

import { useEffect } from "react";

import { Typography } from "@/shared/ui";

import styles from "./styles/error.module.scss";

interface IErrorProps {
  error: Error & { digest?: string };
  retry: VoidFunction;
}

const Error = ({ error, retry }: IErrorProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles["error-page"]}>
      <section className={styles["error-page__card"]}>
        <Typography
          as="h1"
          className={styles["error-page__title"]}
          value="Error.title"
        />
        <Typography
          as="p"
          className={styles["error-page__message"]}
          value="Error.message"
        />
        <button
          className={styles["error-page__retry-button"]}
          type="button"
          onClick={retry}
        >
          <Typography value="Error.retry" />
        </button>
      </section>
    </main>
  );
};

export default Error;
