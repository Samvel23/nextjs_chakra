"use client";

import { useTransition, useState, useCallback, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Typography } from "@/shared/ui";
import styles from "./EventFilters.module.scss";

interface IEventFiltersProps {
  date: string;
  search: string;
  category: string;
}

interface ISearchInputProps {
  search: string;
  updateParam: (key: string, value: string) => void;
}

const SearchInput = ({ search, updateParam }: ISearchInputProps) => {
  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== search) {
        updateParam("search", searchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, search, updateParam]);

  return (
    <div className={styles["event-filters__filter"]}>
      <label className={styles["event-filters__label"]} htmlFor="search-input">
        <Typography as="span" value="Events.searchLabel" />
      </label>

      <input
        id="search-input"
        className={styles["event-filters__input"]}
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search titles and descriptions"
      />
    </div>
  );
};

export const EventFilters = ({
  date,
  search,
  category,
}: IEventFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.push(url, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  return (
    <div
      className={`${styles["event-filters"]} ${
        isPending ? styles["event-filters--pending"] : ""
      }`}
    >
      <SearchInput key={search} search={search} updateParam={updateParam} />

      <div className={styles["event-filters__filter"]}>
        <label
          className={styles["event-filters__label"]}
          htmlFor="category-select"
        >
          <Typography as="span" value="Events.categoryLabel" />
        </label>

        <select
          id="category-select"
          className={styles["event-filters__select"]}
          value={category || "all"}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="all">
            <Typography as="span" value="Events.categoryAll" />
          </option>
          <option value="nextjs">Next.js</option>
          <option value="react">React</option>
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      <div className={styles["event-filters__filter"]}>
        <label className={styles["event-filters__label"]} htmlFor="date-select">
          <Typography as="span" value="Events.dateLabel" />
        </label>

        <select
          id="date-select"
          className={styles["event-filters__select"]}
          value={date || "all"}
          onChange={(e) => updateParam("date", e.target.value)}
        >
          <option value="all">
            <Typography as="span" value="Events.dateAll" />
          </option>
          <option value="week">
            <Typography as="span" value="Events.dateWeek" />
          </option>
          <option value="month">
            <Typography as="span" value="Events.dateMonth" />
          </option>
        </select>
      </div>
    </div>
  );
};
