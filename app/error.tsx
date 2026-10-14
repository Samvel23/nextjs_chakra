"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import styles from "./error.module.scss";

interface IErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

const Error = ({ error, retry }: IErrorProps) => {
  const translate = useTranslations("Error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.errorPage}>
      <section className={styles.errorCard}>
        <h1 className={styles.title}>{translate("title")}</h1>
        <p className={styles.message}>{translate("message")}</p>
        <button className={styles.retryButton} type="button" onClick={retry}>
          {translate("retry")}
        </button>
      </section>
    </main>
  );
};

export default Error;
