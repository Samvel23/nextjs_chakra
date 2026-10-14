"use client";

import { Box, VStack, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";

export function Sidebar() {
  return (
    <Box
      as="aside"
      w="64"
      h="full"
      borderRightWidth="1px"
      borderColor="border"
      p="6"
      bg="bg.panel"
    >
      <VStack align="stretch" gap="4">
        <ChakraLink asChild fontWeight="medium">
          <Link href="/">Dashboard</Link>
        </ChakraLink>
        <ChakraLink asChild fontWeight="medium">
          <Link href="/items">Items</Link>
        </ChakraLink>
      </VStack>
    </Box>
  );
}
