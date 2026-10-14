"use client";

import { useState } from "react";
import { Button, HStack, Text, Box } from "@chakra-ui/react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <Box
      p="6"
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      bg="bg.panel"
    >
      <Text fontSize="lg" fontWeight="semibold" mb="4">
        Interactive Counter Feature
      </Text>
      <HStack gap="4">
        <Button colorPalette="blue" onClick={() => setCount(count + 1)}>
          Count: {count}
        </Button>
        <Button variant="outline" onClick={() => setCount(0)}>
          Reset
        </Button>
      </HStack>
    </Box>
  );
}
