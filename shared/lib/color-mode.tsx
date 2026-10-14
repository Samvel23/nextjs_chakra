"use client";

import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import * as React from "react";
import { LuMoon, LuSun } from "react-icons/lu";

export type IColorModeProviderProps = ThemeProviderProps;

export const ColorModeProvider = (props: IColorModeProviderProps) => {
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

export interface IUseColorModeReturn {
  colorMode: TColorMode;
  setColorMode: (colorMode: TColorMode) => void;
  toggleColorMode: () => void;
}

export const useColorMode = () => {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const colorMode = forcedTheme || resolvedTheme;
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode: colorMode as TColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
};

export const useColorModeValue = <T,>(light: T, dark: T) => {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
};

export const ColorModeIcon = () => {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <LuMoon /> : <LuSun />;
};

type IColorModeButtonProps = Omit<IconButtonProps, "aria-label">;

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  IColorModeButtonProps
>((props, ref) => {
  const { toggleColorMode } = useColorMode();
  return (
    <ClientOnly fallback={<Skeleton boxSize="9" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
        css={{
          _icon: {
            width: "5",
            height: "5",
          },
        }}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  );
});
ColorModeButton.displayName = "ColorModeButton";

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  (props, ref) => {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  },
);
LightMode.displayName = "LightMode";

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  (props, ref) => {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    );
  },
);
DarkMode.displayName = "DarkMode";
