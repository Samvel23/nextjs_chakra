import { Typography } from "@/shared/ui";
import { getManagedEvents, eventRepository } from "@/entities/event";

import styles from "./stats.module.scss";

const StatsPage = async () => {
  const events = await getManagedEvents();
  const capacity = events.reduce((total, event) => total + event.capacity, 0);
  const registrations = events.reduce(
    (total, event) =>
      total +
      event.capacity -
      eventRepository.remainingSeats(event.slug, event.capacity),
    0,
  );

  return (
    <section className={styles["dashboard-stats"]}>
      <h2 className={styles["dashboard-stats__title"]}>
        <Typography value="Dashboard.eventMetrics" />
      </h2>
      <dl className={styles["dashboard-stats__metrics"]}>
        <div>
          <dt>
            <Typography value="Dashboard.totalEvents" />
          </dt>
          <dd>{events.length}</dd>
        </div>
        <div>
          <dt>
            <Typography value="Dashboard.registrations" />
          </dt>
          <dd>{registrations}</dd>
        </div>
        <div>
          <dt>
            <Typography value="Dashboard.totalCapacity" />
          </dt>
          <dd>{capacity}</dd>
        </div>
      </dl>
    </section>
  );
};

export default StatsPage;
