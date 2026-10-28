import { Typography } from "@/shared/ui";

import styles from "../styles/loading.module.scss";

const EventsLoading = () => (
  <main className={styles["loading"]}>
    <p className={styles["loading__message"]}>
      <Typography value="Events.loading" />
    </p>
  </main>
);

export default EventsLoading;
