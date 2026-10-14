import { Header } from "@/entities/header";
import { Sidebar } from "@/entities/sidebar";
import { Counter } from "@/features/counter";
import { DashboardWelcome } from "@/features/dashboard";
import styles from "./page.module.scss";

const Page = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.workspace}>
        <Header />
        <main className={styles.main}>
          <DashboardWelcome />
          <Counter />
        </main>
      </div>
    </div>
  );
};

export default Page;
