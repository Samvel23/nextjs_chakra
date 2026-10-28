"use client";

import Link from "next/link";
import { Typography } from "@/shared/ui";
import styles from "./styles/not-found.module.scss";

const NotFound = () => (
  <main className={styles["not-found-page"]}>
      <section className={styles["not-found-page__card"]}>
        <Typography
          as="p"
          className={styles["not-found-page__code"]}
          value="NotFound.code"
        />
        <Typography
          as="h1"
          className={styles["not-found-page__title"]}
          value="NotFound.title"
        />
        <Typography
          as="p"
          className={styles["not-found-page__message"]}
          value="NotFound.message"
        />
        <Link className={styles["not-found-page__home-link"]} href="/events">
          <Typography value="Events.backToEvents" />
        </Link>
      </section>
  </main>
);

export default NotFound;
