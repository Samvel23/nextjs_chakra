import styles from "./activity.module.scss";
import { Flex, Skeleton } from "@chakra-ui/react";

const ActivityLoading = () => (
  <div
    className={styles["dashboard-activity"]}
    aria-busy="true"
    aria-hidden="true"
  >
    <Flex direction="column" gap={3} w="100%">
      <Skeleton height="48px" borderRadius="md" />
      <Skeleton height="48px" borderRadius="md" />
      <Skeleton height="48px" borderRadius="md" />
    </Flex>
  </div>
);

export default ActivityLoading;
