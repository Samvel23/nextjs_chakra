"use client";

import {
  Flex,
  Button,
  Heading,
  ClientOnly,
  IconButton,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";

import { useTheme } from "next-themes";
import { LuMoon, LuSun } from "react-icons/lu";
import { useLocaleSelection } from "@/shared/config/i18n";

import styles from "./Header.module.scss";

export const Header = () => {
  const translate = useTranslations("Header");
  const { locale, setLocale } = useLocaleSelection();
  const { resolvedTheme, setTheme } = useTheme();

  const switchTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const switchLanguage = () => {
    setLocale(locale === "en" ? "fr" : "en");
  };

  return (
    <Flex as="header" className={styles.header}>
      <Heading as="h1" className={styles.title}>
        {translate("title")}
      </Heading>
      <Flex className={styles.actions}>
        <IconButton
          className={styles.actionButton}
          type="button"
          aria-label={translate("toggleTheme")}
          title={translate("toggleTheme")}
          onClick={switchTheme}
        >
          <ClientOnly fallback={<LuMoon aria-hidden="true" />}>
            {resolvedTheme === "dark" ? (
              <LuSun aria-hidden="true" />
            ) : (
              <LuMoon aria-hidden="true" />
            )}
          </ClientOnly>
        </IconButton>
        <Button
          className={styles.actionButton}
          type="button"
          aria-label={translate(
            locale === "en" ? "switchToFrench" : "switchToEnglish",
          )}
          onClick={switchLanguage}
        >
          {translate("nextLanguage")}
        </Button>
        <Button className={styles.notificationButton} type="button">
          {translate("notifications")}
        </Button>
      </Flex>
    </Flex>
  );
};
