"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import {
  ColorModeProvider,
  type IColorModeProviderProps,
} from "../lib/color-mode";

export const Provider = (props: IColorModeProviderProps) => {
  return (
    <ColorModeProvider {...props}>
      <ChakraProvider value={defaultSystem}>{props.children}</ChakraProvider>
    </ColorModeProvider>
  );
};
