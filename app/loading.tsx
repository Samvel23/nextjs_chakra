import { Flex, Spinner, Text, VStack } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Flex
      flex="1"
      minH="100vh"
      align="center"
      justify="center"
      bg="bg.canvas"
      role="status"
      aria-live="polite"
    >
      <VStack gap="4">
        <Spinner size="xl" color="blue.500" />
        <Text color="fg.muted">Loading your workspace...</Text>
      </VStack>
    </Flex>
  );
}
