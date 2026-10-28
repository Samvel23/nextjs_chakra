"use client";

import { useState } from "react";

import { Typography } from "@/shared/ui";

import styles from "./Counter.module.scss";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <section className={styles.counter}>
      <Typography
        as="h2"
        className={styles["counter__title"]}
        value="Counter.title"
      />
      <div className={styles["counter__actions"]}>
        <button
          className={`${styles["counter__button"]} ${styles["counter__button--count"]}`}
          type="button"
          onClick={() => setCount(count + 1)}
        >
          <Typography value="Counter.count" values={{ count }} />
        </button>
        <button
          className={`${styles["counter__button"]} ${styles["counter__button--reset"]}`}
          type="button"
          onClick={() => setCount(0)}
        >
          <Typography value="Counter.reset" />
        </button>
      </div>
    </section>
  );
};
