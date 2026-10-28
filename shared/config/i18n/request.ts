import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { isLocale } from "./model";

export default getRequestConfig(async () => {
  let locale = "en";
  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get("preferred-locale")?.value;
    if (isLocale(localeCookie)) {
      locale = localeCookie;
    }
  } catch {
    // Fallback during static prerendering when request cookies aren't present
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
