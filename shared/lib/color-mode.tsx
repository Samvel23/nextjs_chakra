"use client";

import { forwardRef } from "react";

import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react";

import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

import { useTranslations } from "next-intl";

import { LuMoon, LuSun } from "react-icons/lu";
import styles from "./color-mode.module.scss";

export type TColorModeProviderProps = ThemeProviderProps;

export const ColorModeProvider = (props: TColorModeProviderProps) => {
  return (
    <ThemeProvider
      attribute="class"
      disableTransitionOnChange
      enableColorScheme={false}
      scriptProps={{
        type: typeof window === "undefined" ? "text/javascript" : "text/plain",
      }}
      {...props}
    />
  );
};

export const ColorMode = {
  light: "light",
  dark: "dark",
} as const;

export type TColorMode = (typeof ColorMode)[keyof typeof ColorMode];

const getColorModeValue = <T,>(
  colorMode: string | undefined,
  light: T,
  dark: T,
): T => (colorMode === ColorMode.dark ? dark : light);

export interface IUseColorModeReturn {
  colorMode: TColorMode;
  setColorMode: (colorMode: TColorMode) => void;
  toggleColorMode: () => void;
}

export const useColorMode = () => {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const colorMode = forcedTheme || resolvedTheme;
  const toggleColorMode = () => {
    setTheme(getColorModeValue(resolvedTheme, ColorMode.dark, ColorMode.light));
  };
  return {
    colorMode: colorMode as TColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
};

export const useColorModeValue = <T,>(light: T, dark: T) => {
  const { colorMode } = useColorMode();
  return getColorModeValue(colorMode, light, dark);
};

export const ColorModeIcon = () => {
  const { colorMode } = useColorMode();
  return getColorModeValue(colorMode, <LuSun />, <LuMoon />);
};

type TColorModeButtonProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeButton = forwardRef<
  HTMLButtonElement,
  TColorModeButtonProps
>((props, ref) => {
  const translate = useTranslations("Header");
  const { toggleColorMode } = useColorMode();
  return (
    <ClientOnly fallback={<Skeleton className={styles["color-mode__skeleton"]} />}>
      <IconButton
        className={styles["color-mode__button"]}
        onClick={toggleColorMode}
        aria-label={translate("toggleTheme")}
        ref={ref}
        {...props}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});
ColorModeButton.displayName = "ColorModeButton";

export const LightMode = forwardRef<HTMLSpanElement, SpanProps>(
  (props, ref) => {
    return (
      <Span
        className={`chakra-theme light ${styles["color-mode__light"]}`}
        ref={ref}
        {...props}
      />
    );
  },
);
LightMode.displayName = "LightMode";

export const DarkMode = forwardRef<HTMLSpanElement, SpanProps>((props, ref) => {
  return (
    <Span
      className={`chakra-theme dark ${styles["color-mode__dark"]}`}
      ref={ref}
      {...props}
    />
  );
});
DarkMode.displayName = "DarkMode";
