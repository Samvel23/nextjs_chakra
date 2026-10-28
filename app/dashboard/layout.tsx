import { Suspense, type ReactNode } from "react";

import { Typography } from "@/shared/ui";

import styles from "./layout.module.scss";

interface IDashboardLayoutProps {
  stats: ReactNode;
  activity: ReactNode;
  children: ReactNode;
}

const SlotLoading = () => (
  <div
    className={styles["dashboard-layout__slot-loading"]}
    aria-hidden="true"
  />
);

const DashboardLayout = ({
  children,
  stats,
  activity,
}: IDashboardLayoutProps) => (
  <div className={styles["dashboard-layout"]}>
    <header className={styles["dashboard-layout__header"]}>
      <Typography
        as="h1"
        className={styles["dashboard-layout__title"]}
        value="Dashboard.organizerDashboard"
      />
    </header>
    <div className={styles["dashboard-layout__slots"]}>
      <Suspense fallback={<SlotLoading />}>{stats}</Suspense>
      <Suspense fallback={<SlotLoading />}>{activity}</Suspense>
    </div>
    {children}
  </div>
);

export default DashboardLayout;
