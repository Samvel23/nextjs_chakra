"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { system } from "./chakra-system";

import {
  ColorModeProvider,
  type TColorModeProviderProps,
} from "../lib/color-mode";


export const Provider = (props: TColorModeProviderProps) => (
  <ColorModeProvider {...props}>
    <ChakraProvider value={system}>{props.children}</ChakraProvider>
  </ColorModeProvider>
);
