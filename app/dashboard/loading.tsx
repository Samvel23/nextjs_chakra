import { Box, Flex, Skeleton } from "@chakra-ui/react";
import styles from "./page.module.scss";

export default function DashboardLoading() {
  return (
    <main
      className={styles["dashboard-page"]}
      aria-busy="true"
      aria-label="Loading dashboard..."
    >
      <header className={styles["dashboard-page__intro"]}>
        <Box w="100%" maxW="400px">
          <Skeleton height="36px" borderRadius="md" mb={3} />

          <Skeleton height="20px" width="85%" borderRadius="sm" />
        </Box>
      </header>

      <div className={styles["dashboard-page__content"]}>
        <Flex direction="column" gap={6} w="100%">
          <Skeleton height="48px" borderRadius="lg" w="100%" />

          <Flex direction={{ base: "column", md: "row" }} gap={4}>
            <Skeleton height="120px" borderRadius="lg" flex={1} />
            <Skeleton height="120px" borderRadius="lg" flex={1} />
          </Flex>

          <Skeleton height="260px" borderRadius="lg" w="100%" />
        </Flex>
      </div>
    </main>
  );
}
