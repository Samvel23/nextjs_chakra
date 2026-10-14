"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./not-found.module.scss";

const NotFound = () => {
  const translate = useTranslations("NotFound");

  return (
    <main className={styles.notFoundPage}>
      <section className={styles.notFoundCard}>
        <p className={styles.code}>{translate("code")}</p>
        <h1 className={styles.title}>{translate("title")}</h1>
        <p className={styles.message}>{translate("message")}</p>
        <Link className={styles.homeLink} href="/">
          {translate("home")}
        </Link>
      </section>
    </main>
  );
};

export default NotFound;
