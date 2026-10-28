"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Typography } from "@/shared/ui";
import type { TManagedEvent } from "@/entities/event";
import { deleteEventAction, saveEventAction } from "../model/actions";
import { initialEventActionState } from "../model/action-types";

import styles from "./EventForm.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IEventFormProps {
  events: TManagedEvent[];
}

const normalizeLocalEventDate = (formData: FormData) => {
  const startsAt = formData.get("startsAt");
  if (typeof startsAt !== "string" || /[zZ]|[+-]\d\d:\d\d$/.test(startsAt)) {
    return;
  }

  const parsedDate = new Date(startsAt);
  if (!Number.isNaN(parsedDate.getTime())) {
    formData.set("startsAt", parsedDate.toISOString());
  }
};

const SubmitButton = ({ customValue }: { customValue?: string }) => {
  const { pending } = useFormStatus();

  // If customValue is passed, it might be a raw string or translation key.
  // We type valueKey as string to satisfy TypeScript safely.
  const valueKey: string = customValue
    ? pending
      ? "Dashboard.saving"
      : customValue
    : pending
      ? "Dashboard.publishingEvent"
      : "Dashboard.publishEvent";

  return (
    <button
      className={styles["event-form__submit"]}
      type="submit"
      disabled={pending}
    >
      {/* Cast to string instead of any, or update Typography props if needed */}
      <Typography as="span" value={valueKey} />
    </button>
  );
};

/* Uncropped Event Card Image Preview */
const EventCardImages = ({
  imageUrl,
  title,
  onImageClick,
}: {
  imageUrl?: string | null;
  title: string;
  onImageClick?: (images: string[], index: number) => void;
}) => {
  const fallbackSrc = "/images/fallback/event-placeholder.jpg";
  const images = imageUrl
    ? imageUrl
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : [fallbackSrc];

  return (
    <div
      className={styles["event-form__card-image-wrapper"]}
      onClick={(e) => {
        e.stopPropagation();
        if (onImageClick) {
          onImageClick(images, 0);
        }
      }}
    >
      <Image
        src={images[0]}
        alt={title}
        width={300}
        height={200}
        className={styles["event-form__card-image"]}
        unoptimized
      />
      {images.length > 1 && (
        <span className={styles["event-form__image-count-badge"]}>
          +{images.length - 1}
        </span>
      )}
    </div>
  );
};

/* View Event Details Modal */
const EventDetailsModal = ({
  event,
  onClose,
  onEdit,
  onImageClick,
}: {
  event: TManagedEvent & { imageUrl?: string | null };
  onClose: VoidFunction;
  onEdit: VoidFunction;
  onImageClick: (images: string[], index: number) => void;
}) => {
  const images = event.imageUrl
    ? event.imageUrl
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : [];

  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div className={styles["event-form__modal-backdrop"]} onClick={onClose}>
      <div
        className={styles["event-form__modal-content"]}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles["event-form__modal-header"]}>
          <h3 className={styles["event-form__modal-title"]}>{event.title}</h3>
          <button
            className={styles["event-form__modal-close-btn"]}
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles["event-form__details-body"]}>
          {images.length > 0 && (
            <div className={styles["event-form__modal-image-gallery"]}>
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={styles["event-form__modal-img-wrap"]}
                  onClick={() => onImageClick(images, idx)}
                >
                  <Image
                    src={img}
                    alt={`${event.title} ${idx + 1}`}
                    width={400}
                    height={240}
                    className={styles["event-form__modal-img"]}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}

          <div className={styles["event-form__details-pills"]}>
            <span className={styles["event-form__pill"]}>{event.category}</span>
            <span className={styles["event-form__pill"]}>
              📍 {event.location}
            </span>
            <span className={styles["event-form__pill"]}>
              👥 {event.capacity}{" "}
              <Typography as="span" value="Dashboard.totalCapacity" />
            </span>
          </div>

          <div className={styles["event-form__details-field"]}>
            <label className={styles["event-form__label"]}>
              <Typography as="span" value="Dashboard.eventDate" />
            </label>
            <p className={styles["event-form__details-value"]}>
              {new Date(event.startsAt).toLocaleString()}
            </p>
          </div>

          <div className={styles["event-form__details-field"]}>
            <label className={styles["event-form__label"]}>
              <Typography as="span" value="Dashboard.eventDescription" />
            </label>
            <p className={styles["event-form__details-desc"]}>
              {event.description}
            </p>
          </div>

          <div className={styles["event-form__details-actions"]}>
            <button
              className={styles["event-form__button"]}
              onClick={() => {
                onClose();
                onEdit();
              }}
              type="button"
            >
              <Pencil size={14} />{" "}
              <Typography as="span" value="Dashboard.editEvent" />
            </button>
            <button
              className={styles["event-form__button"]}
              onClick={onClose}
              type="button"
            >
              <Typography as="span" value="Dashboard.close" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Edit Event Modal with React DatePicker */
const EditModal = ({
  event,
  onClose,
}: {
  event: TManagedEvent & { imageUrl?: string | null };
  onClose: () => void;
}) => {
  const [state, action] = useActionState(
    saveEventAction,
    initialEventActionState,
  );
  const [editDate, setEditDate] = useState<Date | null>(
    event.startsAt ? new Date(event.startsAt) : new Date(),
  );

  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    if (state.status === "success") {
      onClose();
    }
  }, [state.status, onClose]);

  const submitEdit = async (formData: FormData) => {
    normalizeLocalEventDate(formData);
    await action(formData);
  };

  return (
    <div className={styles["event-form__modal-backdrop"]} onClick={onClose}>
      <div
        className={styles["event-form__modal-content"]}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles["event-form__modal-header"]}>
          <h3 className={styles["event-form__modal-title"]}>
            <Typography as="span" value="Dashboard.editEvent" />
          </h3>
          <button
            className={styles["event-form__modal-close-btn"]}
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form className={styles["event-form"]} action={submitEdit}>
          <input type="hidden" name="id" value={event.id} />
          <label className={styles["event-form__field"]}>
            <span className={styles["event-form__label"]}>
              <Typography as="span" value="Dashboard.eventTitle" />
            </span>
            <input
              className={styles["event-form__input"]}
              name="title"
              defaultValue={event.title}
              minLength={3}
              maxLength={120}
              required
            />
            {state.fieldErrors?.title?.map((msg) => (
              <span className={styles["event-form__field-error"]} key={msg}>
                {msg}
              </span>
            ))}
          </label>

          <label className={styles["event-form__field"]}>
            <span className={styles["event-form__label"]}>
              <Typography as="span" value="Dashboard.imageUrlsLabel" />
            </span>
            <input
              className={styles["event-form__input"]}
              name="imageUrl"
              type="text"
              defaultValue={event.imageUrl || ""}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            />
          </label>

          <label className={styles["event-form__field"]}>
            <span className={styles["event-form__label"]}>
              <Typography as="span" value="Dashboard.eventDescription" />
            </span>
            <textarea
              className={styles["event-form__textarea"]}
              name="description"
              defaultValue={event.description}
              minLength={10}
              maxLength={5000}
              required
            />
            {state.fieldErrors?.description?.map((msg) => (
              <span className={styles["event-form__field-error"]} key={msg}>
                {msg}
              </span>
            ))}
          </label>

          <div className={styles["event-form__grid"]}>
            <label className={styles["event-form__field"]}>
              <span className={styles["event-form__label"]}>
                <Typography as="span" value="Dashboard.eventCategory" />
              </span>
              <input
                className={styles["event-form__input"]}
                name="category"
                defaultValue={event.category}
                maxLength={40}
                required
              />
            </label>

            {/* React DatePicker for Edit */}
            <div className={styles["event-form__field"]}>
              <span className={styles["event-form__label"]}>
                <Typography as="span" value="Dashboard.eventDate" />
              </span>
              <DatePicker
                selected={editDate}
                onChange={(date: Date | null) => setEditDate(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="yyyy-MM-dd HH:mm"
                className={styles["event-form__input"]}
                wrapperClassName={styles["event-form__datepicker-wrapper"]}
                required
              />
              <input
                type="hidden"
                name="startsAt"
                value={editDate ? editDate.toISOString() : ""}
              />
            </div>
          </div>

          <div className={styles["event-form__grid"]}>
            <label className={styles["event-form__field"]}>
              <span className={styles["event-form__label"]}>
                <Typography as="span" value="Dashboard.eventLocation" />
              </span>
              <input
                className={styles["event-form__input"]}
                name="location"
                defaultValue={event.location}
                maxLength={120}
                required
              />
            </label>
            <label className={styles["event-form__field"]}>
              <span className={styles["event-form__label"]}>
                <Typography as="span" value="Dashboard.eventCapacity" />
              </span>
              <input
                className={styles["event-form__input"]}
                name="capacity"
                type="number"
                min={1}
                max={10000}
                defaultValue={event.capacity}
                required
              />
            </label>
          </div>

          {state.message && (
            <p
              className={`${styles["event-form__message"]} ${
                styles[`event-form__message--${state.status}`]
              }`}
              role="status"
            >
              <Typography as="span" value={`Dashboard.${state.message}`} />
            </p>
          )}

          <SubmitButton customValue="Dashboard.editEvent" />
        </form>
      </div>
    </div>
  );
};

/* Delete Form Icon Button */
const DeleteEventForm = ({ eventId }: { eventId: string }) => {
  const [, action] = useActionState(deleteEventAction, {
    status: "error" as const,
    message: "notFound" as const,
  });

  return (
    <form action={action} onClick={(e) => e.stopPropagation()}>
      <input type="hidden" name="id" value={eventId} />
      <button
        className={`${styles["event-form__icon-button"]} ${styles["event-form__icon-button--danger"]}`}
        type="submit"
        aria-label="Delete Event"
        title="Delete Event"
      >
        <Trash2 size={15} />
      </button>
    </form>
  );
};

export const EventForm = ({ events }: IEventFormProps) => {
  const [editingEvent, setEditingEvent] = useState<TManagedEvent | null>(null);
  const [viewingEvent, setViewingEvent] = useState<TManagedEvent | null>(null);

  const [lightboxData, setLightboxData] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  const [imageInputs, setImageInputs] = useState<string[]>([""]);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [state, action] = useActionState(
    saveEventAction,
    initialEventActionState,
  );

  const addImageInput = () => setImageInputs([...imageInputs, ""]);
  const updateImageInput = (index: number, value: string) => {
    const updated = [...imageInputs];
    updated[index] = value;
    setImageInputs(updated);
  };

  const handleCreateSubmit = async (formData: FormData) => {
    normalizeLocalEventDate(formData);
    const validUrls = imageInputs.filter((url) => url.trim().length > 0);
    if (validUrls.length > 0) {
      formData.set("imageUrl", validUrls.join(","));
    }
    await action(formData);
  };

  const handleOpenLightbox = (images: string[], index: number) => {
    setLightboxData({ images, index });
  };

  const handlePrevLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lightboxData) return;
    setLightboxData({
      ...lightboxData,
      index:
        lightboxData.index === 0
          ? lightboxData.images.length - 1
          : lightboxData.index - 1,
    });
  };

  const handleNextLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lightboxData) return;
    setLightboxData({
      ...lightboxData,
      index:
        lightboxData.index === lightboxData.images.length - 1
          ? 0
          : lightboxData.index + 1,
    });
  };

  return (
    <div className={styles["event-form__layout"]}>
      {/* Event Creation Form */}
      <form className={styles["event-form"]} action={handleCreateSubmit}>
        <h2 className={styles["event-form__title"]}>
          <Typography as="span" value="Dashboard.createEvent" />
        </h2>

        <label className={styles["event-form__field"]}>
          <span className={styles["event-form__label"]}>
            <Typography as="span" value="Dashboard.eventTitle" />
          </span>
          <input
            className={styles["event-form__input"]}
            name="title"
            minLength={3}
            maxLength={120}
            required
          />
          {state.message && (
            <p
              className={`${styles["event-form__message"]} ${
                styles[`event-form__message--${state.status}`]
              }`}
              role="status"
            >
              <Typography as="span" value={`Dashboard.${state.message}`} />
            </p>
          )}
        </label>

        <div className={styles["event-form__field"]}>
          <span className={styles["event-form__label"]}>
            <Typography as="span" value="Dashboard.imageUrlsLabel" />
          </span>
          {imageInputs.map((url, idx) => (
            <input
              key={idx}
              className={styles["event-form__input"]}
              type="url"
              value={url}
              onChange={(e) => updateImageInput(idx, e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{ marginBottom: "8px" }}
            />
          ))}
          <button
            type="button"
            onClick={addImageInput}
            className={styles["event-form__add-image-btn"]}
          >
            <Plus size={14} />{" "}
            <Typography as="span" value="Dashboard.addImage" />
          </button>
        </div>

        <label className={styles["event-form__field"]}>
          <span className={styles["event-form__label"]}>
            <Typography as="span" value="Dashboard.eventDescription" />
          </span>
          <textarea
            className={styles["event-form__textarea"]}
            name="description"
            minLength={10}
            maxLength={5000}
            required
          />
          {state.fieldErrors?.description?.map((message) => (
            <span className={styles["event-form__field-error"]} key={message}>
              {message}
            </span>
          ))}
        </label>

        <div className={styles["event-form__grid"]}>
          <label className={styles["event-form__field"]}>
            <span className={styles["event-form__label"]}>
              <Typography as="span" value="Dashboard.eventCategory" />
            </span>
            <input
              className={styles["event-form__input"]}
              name="category"
              maxLength={40}
              required
            />
          </label>

          {/* React DatePicker Component */}
          <div className={styles["event-form__field"]}>
            <span className={styles["event-form__label"]}>
              <Typography as="span" value="Dashboard.eventDate" />
            </span>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              className={styles["event-form__input"]}
              wrapperClassName={styles["event-form__datepicker-wrapper"]}
              required
            />
            <input
              type="hidden"
              name="startsAt"
              value={startDate ? startDate.toISOString() : ""}
            />
          </div>
        </div>

        <div className={styles["event-form__grid"]}>
          <label className={styles["event-form__field"]}>
            <span className={styles["event-form__label"]}>
              <Typography as="span" value="Dashboard.eventLocation" />
            </span>
            <input
              className={styles["event-form__input"]}
              name="location"
              maxLength={120}
              required
            />
          </label>
          <label className={styles["event-form__field"]}>
            <span className={styles["event-form__label"]}>
              <Typography as="span" value="Dashboard.eventCapacity" />
            </span>
            <input
              className={styles["event-form__input"]}
              name="capacity"
              type="number"
              min={1}
              max={10000}
              defaultValue={24}
              required
            />
          </label>
        </div>

        {state.message && (
          <p
            className={`${styles["event-form__message"]} ${
              styles[`event-form__message--${state.status}`]
            }`}
            role="status"
          >
            <Typography as="span" value={`Dashboard.${state.message}`} />
          </p>
        )}

        <SubmitButton />
      </form>

      {/* Wrapped Managed Events Container */}
      <section className={styles["event-form__section"]} aria-live="polite">
        <h2 className={styles["event-form__title"]}>
          <Typography as="span" value="Dashboard.managedEvents" /> (
          {events.length})
        </h2>
        {events.length === 0 ? (
          <p className={styles["event-form__empty"]}>
            <Typography as="span" value="Dashboard.noManagedEvents" />
          </p>
        ) : (
          <div className={styles["event-form__wrapped-events-container"]}>
            {events.map((event) => (
              <div
                key={event.id}
                className={styles["event-form__compact-card"]}
                onClick={() => setViewingEvent(event)}
              >
                <EventCardImages
                  imageUrl={event.imageUrl}
                  title={event.title}
                  onImageClick={handleOpenLightbox}
                />

                <div className={styles["event-form__compact-body"]}>
                  <h3 className={styles["event-form__compact-title"]}>
                    {event.title || (
                      <Typography as="span" value="Dashboard.untitledEvent" />
                    )}
                  </h3>
                  <p className={styles["event-form__compact-meta"]}>
                    {event.category} · {event.location}
                  </p>

                  <div className={styles["event-form__compact-actions"]}>
                    <button
                      className={styles["event-form__icon-button"]}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingEvent(event);
                      }}
                      type="button"
                      aria-label="Edit Event"
                      title="Edit Event"
                    >
                      <Pencil size={15} />
                    </button>

                    <DeleteEventForm eventId={event.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {viewingEvent && (
        <EventDetailsModal
          event={viewingEvent}
          onClose={() => setViewingEvent(null)}
          onEdit={() => setEditingEvent(viewingEvent)}
          onImageClick={handleOpenLightbox}
        />
      )}

      {editingEvent && (
        <EditModal event={editingEvent} onClose={() => setEditingEvent(null)} />
      )}

      {/* Refined Image Lightbox Preview Modal */}
      {lightboxData && (
        <div
          className={styles["event-form__lightbox-overlay"]}
          onClick={() => setLightboxData(null)}
        >
          <div
            className={styles["event-form__lightbox-modal"]}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles["event-form__lightbox-close-btn"]}
              onClick={() => setLightboxData(null)}
              type="button"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className={styles["event-form__lightbox-stage"]}>
              <Image
                src={lightboxData.images[lightboxData.index]}
                alt="Event Preview"
                width={900}
                height={600}
                className={styles["event-form__lightbox-full-img"]}
                unoptimized
              />

              {lightboxData.images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles["event-form__lightbox-arrow"]} ${styles["event-form__lightbox-arrow--prev"]}`}
                    onClick={handlePrevLightboxImage}
                    aria-label="Previous"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    className={`${styles["event-form__lightbox-arrow"]} ${styles["event-form__lightbox-arrow--next"]}`}
                    onClick={handleNextLightboxImage}
                    aria-label="Next"
                  >
                    <ChevronRight size={24} />
                  </button>

                  <div className={styles["event-form__lightbox-counter-pill"]}>
                    {lightboxData.index + 1} / {lightboxData.images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
