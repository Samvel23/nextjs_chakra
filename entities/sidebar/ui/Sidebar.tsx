"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useTranslations } from "next-intl";

import { Box } from "@chakra-ui/react";

import { Menu, X } from "lucide-react";

import { Typography } from "@/shared/ui";

import styles from "./Sidebar.module.scss";

export const Sidebar = () => {
  const translate = useTranslations("Sidebar");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <button
        className={styles["sidebar__toggle"]}
        type="button"
        aria-label={translate(isOpen ? "closeNavigation" : "openNavigation")}
        aria-controls="primary-navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {isOpen && (
        <button
          className={styles["sidebar__backdrop"]}
          type="button"
          aria-label={translate("closeNavigation")}
          tabIndex={-1}
          onClick={() => setIsOpen(false)}
        />
      )}
      <Box
        as="aside"
        id="primary-navigation"
        className={`${styles.sidebar} ${isOpen ? styles["sidebar--open"] : ""}`}
      >
        <Box as="nav" className={styles["sidebar__navigation"]}>
          <Link
            className={styles["sidebar__link"]}
            href="/dashboard"
            onClick={() => setIsOpen(false)}
          >
            <Typography value="Sidebar.dashboard" />
          </Link>
          <Link
            className={styles["sidebar__link"]}
            href="/events"
            onClick={() => setIsOpen(false)}
          >
            <Typography value="Sidebar.events" />
          </Link>
        </Box>
      </Box>
    </>
  );
};
