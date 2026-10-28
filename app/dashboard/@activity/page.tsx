import { getManagedEvents } from "@/entities/event";
import { Typography } from "@/shared/ui";

import styles from "./activity.module.scss";

const ActivityPage = async () => {
  const events = (await getManagedEvents())
    .toSorted(
      (first, second) =>
        new Date(second.updatedAt).getTime() -
        new Date(first.updatedAt).getTime(),
    )
    .slice(0, 4);

  return (
    <section className={styles["dashboard-activity"]}>
      <h2 className={styles["dashboard-activity__title"]}>
        <Typography value="Dashboard.recentActivity" />
      </h2>
      {events.length === 0 ? (
        <p className={styles["dashboard-activity__empty"]}>
          <Typography value="Dashboard.noActivity" />
        </p>
      ) : (
        <ul className={styles["dashboard-activity__list"]}>
          {events.map((event) => (
            <li className={styles["dashboard-activity__item"]} key={event.id}>
              <span>{event.title}</span>
              <time dateTime={event.updatedAt}>
                {new Date(event.updatedAt).toLocaleDateString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ActivityPage;
