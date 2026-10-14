"use client";

import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";

interface ErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function Error({ retry }: ErrorProps) {
  return (
    <Flex
      flex="1"
      minH="100vh"
      align="center"
      justify="center"
      bg="bg.canvas"
      px="6"
    >
      <VStack
        gap="4"
        maxW="md"
        textAlign="center"
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        p={{ base: "6", md: "10" }}
      >
        <Heading size="xl">Something went wrong</Heading>
        <Text color="fg.muted">
          We couldn&apos;t load this page. Please try again.
        </Text>
        <Button colorPalette="blue" onClick={retry}>
          Try again
        </Button>
      </VStack>
    </Flex>
  );
}
