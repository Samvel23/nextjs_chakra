"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import styles from "./Sidebar.module.scss";
import { Box } from "@chakra-ui/react";

export const Sidebar = () => {
  const translate = useTranslations("Sidebar");

  return (
    <Box as="aside" className={styles.sidebar}>
      <Box as="nav" className={styles.navigation}>
        <Link className={styles.link} href="/">
          {translate("dashboard")}
        </Link>
        <Link className={styles.link} href="/items">
          {translate("items")}
        </Link>
      </Box>
    </Box>
  );
};
