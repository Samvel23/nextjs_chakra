import { getRequestConfig } from "next-intl/server";

const getRequestConfiguration = getRequestConfig(async () => ({
  locale: "en",
  messages: (await import("./messages/en.json")).default,
}));

export default getRequestConfiguration;
