"use client";

import { Flex, Heading, Button } from "@chakra-ui/react";

export function Header() {
  return (
    <Flex
      as="header"
      px="6"
      py="4"
      borderBottomWidth="1px"
      borderColor="border"
      justifyContent="space-between"
      alignItems="center"
      bg="bg.panel"
    >
      <Heading size="md">My FSD Boilerplate</Heading>
      <Button size="sm" variant="outline">
        Notifications
      </Button>
    </Flex>
  );
}
