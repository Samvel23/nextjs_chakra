import { Header } from "@/widgets/header/ui/Header";
import { Sidebar } from "@/entities/sidebar/ui/Sidebar";
import { Counter } from "@/features/counter/ui/Counter";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export default function Page() {
  return (
    <Flex h="screen" overflow="hidden">
      <Sidebar />
      <Flex direction="column" flex="1" overflow="hidden">
        <Header />
        <Box as="main" flex="1" p="8" overflowY="auto" bg="bg.canvas">
          <Heading size="xl" mb="2">
            Welcome Back!
          </Heading>
          <Text color="fg.muted" mb="6">
            Your Feature-Sliced Design architecture is fully set up and ready.
          </Text>
          <Counter />
        </Box>
      </Flex>
    </Flex>
  );
}
