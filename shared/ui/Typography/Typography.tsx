"use client";

import { Text } from "@chakra-ui/react";

import { useTranslations } from "next-intl";

import styles from "./Typography.module.scss";

import type { TTranslationKey } from "@/shared/config/i18n/model";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TYPOGRAPHY_ELEMENTS = ["h1", "h2", "p", "span"] as const;

type TTypographyElement = (typeof TYPOGRAPHY_ELEMENTS)[number];

interface ITypographyProps {
  className?: string;
  value: TTranslationKey | string;
  as?: TTypographyElement;
  values?: Record<string, string | number | Date>;
}

export const Typography = ({
  value,
  values,
  className,
  as = "span",
}: ITypographyProps) => {
  const translate = useTranslations();

  return (
    <Text
      as={as}
      className={[styles.typography, className].filter(Boolean).join(" ")}
    >
      {translate(value, values)}
    </Text>
  );
};
