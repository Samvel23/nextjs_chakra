import Link from "next/link";

import { Typography } from "@/shared/ui";

import styles from "../styles/not-found.module.scss";

const DashboardNotFound = () => (
  <main className={styles["not-found-page"]}>
    <section className={styles["not-found-page__card"]}>
      <p className={styles["not-found-page__code"]}>
        <Typography value="NotFound.code" />
      </p>
      <h1 className={styles["not-found-page__title"]}>
        <Typography value="NotFound.title" />
      </h1>
      <p className={styles["not-found-page__message"]}>
        <Typography value="NotFound.message" />
      </p>
      <Link className={styles["not-found-page__home-link"]} href="/dashboard">
        <Typography value="Dashboard.organizerDashboard" />
      </Link>
    </section>
  </main>
);

export default DashboardNotFound;
