import Link from "next/link";

import { Typography } from "@/shared/ui";
import styles from "../styles/not-found.module.scss";

const EventNotFound = () => (
  <main className={styles["not-found-page"]}>
    <section className={styles["not-found-page__card"]}>
      <p className={styles["not-found-page__code"]}>
        <Typography value="NotFound.code" />
      </p>
      <h1 className={styles["not-found-page__title"]}>
        <Typography value="Events.eventNotFound" />
      </h1>
      <p className={styles["not-found-page__message"]}>
        <Typography value="Events.eventNotFoundDescription" />
      </p>
      <Link className={styles["not-found-page__home-link"]} href="/events">
        <Typography value="Events.backToEvents" />
      </Link>
    </section>
  </main>
);

export default EventNotFound;
