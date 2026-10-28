import styles from "./page.module.scss";

import { Typography } from "@/shared/ui";

const LoginLoading = () => (
  <main className={styles["login-page"]} aria-busy="true">
    <Typography value="Loading.message" />
  </main>
);

export default LoginLoading;
