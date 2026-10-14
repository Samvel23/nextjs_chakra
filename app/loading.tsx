"use client";

import { useTranslations } from "next-intl";
import styles from "./loading.module.scss";

const Loading = () => {
  const translate = useTranslations("Loading");

  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <p className={styles.message}>{translate("message")}</p>
    </div>
  );
};

export default Loading;
