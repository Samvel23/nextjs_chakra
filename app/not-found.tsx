import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
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
        <Text color="blue.500" fontSize="sm" fontWeight="semibold">
          ERROR 404
        </Text>
        <Heading size="xl">Page not found</Heading>
        <Text color="fg.muted">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </Text>
        <Button asChild colorPalette="blue">
          <Link href="/">Back to dashboard</Link>
        </Button>
      </VStack>
    </Flex>
  );
}
