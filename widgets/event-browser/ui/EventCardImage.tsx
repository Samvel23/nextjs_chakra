"use client";

import { useState } from "react";
import styles from "./EventBrowser.module.scss";

interface IEventCardImageProps {
  title: string;
  className?: string;
  coverImage?: string | null;
}

export const EventCardImage = ({
  title,
  className,
  coverImage,
}: IEventCardImageProps) => {
  const fallbackSrc = "/images/fallback/event-placeholder.jpg";
  const [hasError, setHasError] = useState<boolean>(false);
  const [prevCoverImage, setPrevCoverImage] = useState<
    string | null | undefined
  >(coverImage);

  if (coverImage !== prevCoverImage) {
    setPrevCoverImage(coverImage);
    setHasError(false);
  }

  const imgSrc = !hasError && coverImage ? coverImage : fallbackSrc;

  return (
    <>
      {/* Ambient background blur for letterboxed images/logos */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt=""
        className={styles["event-browser__card-img-bg"]}
        aria-hidden="true"
      />

      {/* Your original main image element */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={title}
        className={className}
        onError={() => setHasError(true)}
      />
    </>
  );
};
