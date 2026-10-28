"use client";

import { useEffect } from "react";

import { Typography } from "@/shared/ui";

import styles from "./page.module.scss";

interface LoginErrorProps {
  error: Error & { digest?: string };
  retry: VoidFunction;
}

const LoginError = ({ error, retry }: LoginErrorProps) => {
  useEffect(() => {
    console.error("Login route failed:", error);
  }, [error]);

  return (
    <main className={styles["login-page"]}>
      <section className={styles["login-page__error"]}>
        <h1>
          <Typography value="Error.title" />
        </h1>
        <p>
          <Typography value="Error.message" />
        </p>
        <button onClick={retry} type="button">
          <Typography value="Error.retry" />
        </button>
      </section>
    </main>
  );
};

export default LoginError;
