import styles from "./stats.module.scss";
import { Flex, Skeleton } from "@chakra-ui/react";

const StatsLoading = () => (
  <div
    className={styles["dashboard-stats"]}
    aria-busy="true"
    aria-hidden="true"
  >
    <Flex gap={4} w="100%">
      <Skeleton height="90px" borderRadius="lg" flex={1} />
      <Skeleton height="90px" borderRadius="lg" flex={1} />
      <Skeleton height="90px" borderRadius="lg" flex={1} />
    </Flex>
  </div>
);

export default StatsLoading;
