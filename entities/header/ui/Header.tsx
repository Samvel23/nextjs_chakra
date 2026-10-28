"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { LuMoon, LuSun, LuLogOut, LuUser, LuMenu, LuX } from "react-icons/lu";
import { Flex, ClientOnly, Skeleton } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

import { Typography } from "@/shared/ui";
import { useLocaleSelection } from "@/shared/config/i18n";
import { logoutAction } from "@/features/auth/model/actions";

import styles from "./Header.module.scss";

interface HeaderProps {
  isAuthenticated?: boolean;
}

export const Header = ({ isAuthenticated = false }: HeaderProps) => {
  const translate = useTranslations("Header");
  const dashboardTranslate = useTranslations("Dashboard");
  const sidebarTranslate = useTranslations("Sidebar");
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { resolvedTheme, setTheme } = useTheme();
  const { locale, setLocale } = useLocaleSelection();

  const nextLanguage = translate("nextLanguage");
  const switchLanguageLabel = translate(
    locale === "en" ? "switchToFrench" : "switchToEnglish",
  );
  const toggleThemeLabel = translate("toggleTheme");

  const logoutText = dashboardTranslate("logout");
  const loginText = "Login";

  const switchTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const switchLanguage = () => {
    setLocale(locale === "en" ? "fr" : "en");
  };

  const closeMenu = () => setIsMenuOpen(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <Flex as="header" className={styles.header}>
      <div className={styles["header__left"]}>
        <Link
          href="/dashboard"
          className={styles["header__brand"]}
          onClick={closeMenu}
        >
          <Typography
            as="span"
            value="Header.title"
            className={styles["header__title"]}
          />
        </Link>
        <nav className={styles["header__nav"]}>
          <Link
            href="/dashboard"
            className={`${styles["header__nav-link"]} ${
              pathname === "/dashboard"
                ? styles["header__nav-link--active"]
                : ""
            }`}
          >
            {sidebarTranslate("dashboard")}
          </Link>
          <Link
            href="/events"
            className={`${styles["header__nav-link"]} ${
              pathname === "/events" ? styles["header__nav-link--active"] : ""
            }`}
          >
            {sidebarTranslate("events")}
          </Link>
        </nav>
      </div>

      {/* Desktop Actions Only */}
      <Flex
        className={`${styles["header__actions"]} ${styles["header__actions--desktop"]}`}
      >
        <ClientOnly
          fallback={<Skeleton className={styles["color-mode__skeleton"]} />}
        >
          <button
            className={styles["header__action-button"]}
            type="button"
            aria-label={toggleThemeLabel}
            title={toggleThemeLabel}
            onClick={switchTheme}
          >
            {resolvedTheme === "dark" ? (
              <LuSun aria-hidden="true" />
            ) : (
              <LuMoon aria-hidden="true" />
            )}
          </button>
        </ClientOnly>

        <button
          className={styles["header__action-button"]}
          type="button"
          aria-label={`${nextLanguage}: ${switchLanguageLabel}`}
          onClick={switchLanguage}
        >
          {nextLanguage}
        </button>

        {isAuthenticated ? (
          <form action={logoutAction}>
            <button
              type="submit"
              className={`${styles["header__action-button"]} ${styles["header__auth-button"]}`}
            >
              <LuLogOut aria-hidden="true" />
              <span>{logoutText}</span>
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className={`${styles["header__action-button"]} ${styles["header__auth-button"]}`}
          >
            <LuUser aria-hidden="true" />
            <span>{loginText}</span>
          </Link>
        )}
      </Flex>

      {/* Mobile Hamburger Toggle Button */}
      <button
        className={styles["header__hamburger"]}
        type="button"
        aria-label="Toggle navigation menu"
        onClick={toggleMenu}
      >
        {isMenuOpen ? <LuX size={22} /> : <LuMenu size={22} />}
      </button>

      {/* Refined Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={styles["header__mobile-menu"]}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <nav className={styles["header__mobile-nav"]}>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className={`${styles["header__mobile-link"]} ${
                  pathname === "/dashboard"
                    ? styles["header__mobile-link--active"]
                    : ""
                }`}
              >
                {sidebarTranslate("dashboard")}
              </Link>
              <Link
                href="/events"
                onClick={closeMenu}
                className={`${styles["header__mobile-link"]} ${
                  pathname === "/events"
                    ? styles["header__mobile-link--active"]
                    : ""
                }`}
              >
                {sidebarTranslate("events")}
              </Link>

              <div className={styles["header__mobile-divider"]} />

              {/* Mobile Actions Controls */}
              <div className={styles["header__mobile-actions"]}>
                <div className={styles["header__mobile-action-group"]}>
                  <ClientOnly
                    fallback={
                      <Skeleton className={styles["color-mode__skeleton"]} />
                    }
                  >
                    <button
                      className={styles["header__mobile-icon-btn"]}
                      type="button"
                      aria-label={toggleThemeLabel}
                      title={toggleThemeLabel}
                      onClick={switchTheme}
                    >
                      {resolvedTheme === "dark" ? (
                        <LuSun size={18} />
                      ) : (
                        <LuMoon size={18} />
                      )}
                    </button>
                  </ClientOnly>
                  <button
                    className={styles["header__mobile-icon-btn"]}
                    type="button"
                    aria-label={`${nextLanguage}: ${switchLanguageLabel}`}
                    onClick={switchLanguage}
                  >
                    {nextLanguage}
                  </button>
                </div>

                {isAuthenticated ? (
                  <form
                    action={logoutAction}
                    onClick={closeMenu}
                    style={{ width: "100%" }}
                  >
                    <button
                      type="submit"
                      className={styles["header__mobile-auth-btn"]}
                    >
                      <LuLogOut size={16} />
                      <span>{logoutText}</span>
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className={styles["header__mobile-auth-btn"]}
                  >
                    <LuUser size={16} />
                    <span>{loginText}</span>
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
};
