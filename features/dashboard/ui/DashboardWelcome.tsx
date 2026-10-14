"use client";

import { useTranslations } from "next-intl";
import styles from "./DashboardWelcome.module.scss";

export const DashboardWelcome = () => {
  const translate = useTranslations("Dashboard");

  return (
    <section className={styles.welcome}>
      <h2 className={styles.title}>{translate("welcome")}</h2>
      <p className={styles.description}>{translate("description")}</p>
    </section>
  );
};
