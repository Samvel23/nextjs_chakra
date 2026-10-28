"use client";

import { Typography } from "@/shared/ui";
import styles from "./styles/loading.module.scss";

export default function Loading() {
  return (
    <div
      className={styles.loading}
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className={styles["loading__spinner-wrapper"]}>
        <span className={styles["loading__spinner"]} aria-hidden="true" />
        <div className={styles["loading__spinner-glow"]} aria-hidden="true" />
      </div>
      <Typography
        as="p"
        className={styles["loading__message"]}
        value="Loading.message"
      />
    </div>
  );
}
