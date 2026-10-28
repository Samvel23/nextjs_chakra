import { Suspense } from "react";

import { connection } from "next/server";

import { redirect } from "next/navigation";

import { Typography } from "@/shared/ui";
import { getManagedEvents } from "@/entities/event";
import { DashboardWelcome } from "@/features/dashboard";
import { hasDashboardSession } from "@/entities/session";
import { EventForm } from "@/features/events";

import styles from "./page.module.scss";

const DashboardContent = async () => {
  await connection();
  if (!(await hasDashboardSession())) redirect("/login");

  const events = await getManagedEvents();

  return (
    <main className={styles["dashboard-page"]}>
      <header className={styles["dashboard-page__intro"]}>
        <div>
          <DashboardWelcome />
          <p className={styles["dashboard-page__description"]}>
            <Typography value="Dashboard.manageDescription" />
          </p>
        </div>
      </header>

      <div className={styles["dashboard-page__content"]}>
        <EventForm events={events} />
      </div>
    </main>
  );
};

const DashboardPage = () => (
  <Suspense
    fallback={
      <div className={styles["dashboard-page__loading"]} aria-busy="true">
        <Typography value="Loading.message" />
      </div>
    }
  >
    <DashboardContent />
  </Suspense>
);

export default DashboardPage;
