import { Typography } from "@/shared/ui";
import styles from "./DashboardWelcome.module.scss";

export const DashboardWelcome = () => (
  <section className={styles["dashboard-welcome"]}>
    <Typography
      as="h2"
      className={styles["dashboard-welcome__title"]}
      value="Dashboard.welcome"
    />
  </section>
);
