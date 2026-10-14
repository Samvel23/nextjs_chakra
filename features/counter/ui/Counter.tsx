"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./Counter.module.scss";

export const Counter = () => {
  const [count, setCount] = useState(0);
  const translate = useTranslations("Counter");

  return (
    <section className={styles.counter}>
      <h2 className={styles.title}>
        {translate("title")}
      </h2>
      <div className={styles.actions}>
        <button
          className={styles.countButton}
          type="button"
          onClick={() => setCount(count + 1)}
        >
          {translate("count", { count })}
        </button>
        <button
          className={styles.resetButton}
          type="button"
          onClick={() => setCount(0)}
        >
          {translate("reset")}
        </button>
      </div>
    </section>
  );
};
