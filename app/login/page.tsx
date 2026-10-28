import type { Metadata } from "next";

import { LoginForm } from "@/features/auth";

import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Organizer sign in | Tech Events Dashboard",
};

const LoginPage = () => (
  <main className={styles["login-page"]}>
    <LoginForm showDemoPassword={process.env.NODE_ENV !== "production"} />
  </main>
);

export default LoginPage;
