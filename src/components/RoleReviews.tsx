import { useEffect, useMemo, useState } from "react";

import manImg from "/medirator_images/man.png";
import editIcon from "/medirator_images/edit.png";
import { feedbackApi, type FeedbackRole } from "../api/feedbackApi";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

interface SeedReview {
  id: string;
  name: string;
  text: string;
  date: string;
  rating: number;
}

interface RoleReviewsProps {
  role: FeedbackRole;
  title: string;
  seedReviews: SeedReview[];
}

interface UiReview {
  id: string;
  name: string;
  text: string;
  date: string;
  rating: number;
  source: "seed" | "user";
  userId?: string;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const RoleReviews = ({ role, title, seedReviews }: RoleReviewsProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remoteReviews, setRemoteReviews] = useState<UiReview[]>([]);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [composerRating, setComposerRating] = useState(0);
  const [composerText, setComposerText] = useState("");
  const [composerMessage, setComposerMessage] = useState<string | null>(null);

  const reviews = useMemo(() => [...remoteReviews, ...seedReviews.map((item) => ({ ...item, source: "seed" as const }))], [remoteReviews, seedReviews]);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await feedbackApi.list(role);
        setRemoteReviews(
          items.map((item) => ({
            id: item.id,
            name: item.user_name,
            text: item.comment,
            date: formatDate(item.created_at),
            rating: item.score,
            source: "user",
            userId: item.user_id,
          }))
        );
      } catch {
        setRemoteReviews([]);
      }
    };
    void load();
  }, [role]);

  useEffect(() => {
    if (currentIndex >= reviews.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, reviews.length]);

  useEffect(() => {
    if (reviews.length === 0) {
      return;
    }
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const getVisibleReviews = () => {
    if (reviews.length <= 2) {
      return reviews;
    }
    const prev = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1;
    const next = (currentIndex + 1) % reviews.length;
    return [reviews[prev], reviews[currentIndex], reviews[next]];
  };

  const handlePrev = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const openCreateComposer = () => {
    setEditingId(null);
    setComposerRating(0);
    setComposerText("");
    setComposerMessage(null);
    setIsComposerOpen(true);
  };

  const openEditComposer = (review: UiReview) => {
    setEditingId(review.id);
    setComposerRating(review.rating);
    setComposerText(review.text);
    setComposerMessage(null);
    setIsComposerOpen(true);
  };

  const handleSubmit = async () => {
    if (!user) {
      setComposerMessage(t("reviews", "signInMessage", "Please sign in to submit a review."));
      return;
    }
    if (composerRating === 0) {
      setComposerMessage(t("reviews", "chooseRatingMessage", "Please choose a rating before submitting."));
      return;
    }
    const text = composerText.trim();
    if (!text) {
      setComposerMessage(t("reviews", "writeReviewMessage", "Please write a short review before submitting."));
      return;
    }
    try {
      if (editingId) {
        const updated = await feedbackApi.update(editingId, { score: composerRating, comment: text });
        setRemoteReviews((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  text: updated.comment,
                  rating: updated.score,
                }
              : item
          )
        );
        setComposerMessage(t("reviews", "updatedMessage", "Your review was updated."));
      } else {
        const created = await feedbackApi.create({
          target_type: role,
          score: composerRating,
          comment: text,
        });
        const nextItem: UiReview = {
          id: created.id,
          name: created.user_name,
          text: created.comment,
          date: formatDate(created.created_at),
          rating: created.score,
          source: "user",
          userId: created.user_id,
        };
        setRemoteReviews((prev) => [nextItem, ...prev]);
        setCurrentIndex(0);
        setComposerMessage(t("reviews", "addedMessage", "Your review was added."));
      }
      setComposerRating(0);
      setComposerText("");
      setEditingId(null);
      setIsComposerOpen(false);
    } catch {
      setComposerMessage(t("reviews", "unableToSaveMessage", "Unable to save review right now."));
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-xl ${i < rating ? "text-[#0B3C5D] dark:text-white" : "text-gray-300 dark:text-gray-700"}`}>
          ★
        </span>
      ))}
    </div>
  );

  const visibleReviews = getVisibleReviews();

  return (
    <div className="w-full py-6 md:py-12 px-3 md:px-4 bg-white dark:bg-black">
      <h2 className="text-2xl md:text-4xl font-ibm-plex-mono font-bold text-center mb-6 md:mb-12 text-[#0B3C5D] dark:text-white">{title}</h2>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <button
            onClick={handlePrev}
            className="hidden md:flex border-4 border-[#0B3C5D] items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#0B3C5D] dark:bg-black text-white hover:bg-gray-800 dark:hover:bg-[#0B3C5D] duration-300 hover:text-white text-lg md:text-2xl flex-shrink-0"
          >
            ❮
          </button>

          <div className="flex gap-2 md:gap-4 justify-center flex-wrap md:flex-nowrap">
            {visibleReviews.map((review, idx) => {
              const isCenter = visibleReviews.length === 1 || idx === 1;
              const canEdit = review.source === "user" && user?.id && review.userId === user.id;
              return (
                <div
                  key={review.id}
                  className={`transition-all duration-300 ${
                    isCenter
                      ? "md:w-96 w-full border-4 border-[#0B3C5D] dark:bg-black shadow-2xl scale-100 md:scale-105"
                      : "md:w-80 w-full border-2 border-[#0B3C5D] dark:bg-black opacity-60 scale-75 md:scale-95 hidden md:flex md:flex-col"
                  } p-3 md:p-6 rounded-2xl bg-white dark:bg-[#1a1a1a]`}
                >
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold flex-shrink-0">
                      <img src={manImg} alt="review-user" className="pl-1" loading="lazy" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0B3C5D] dark:text-white text-sm md:text-base">{review.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
                    </div>
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => openEditComposer(review)}
                        className="rounded-full border border-[#0B3C5D] px-3 py-1 text-xs font-semibold text-[#0B3C5D] dark:text-white inline-flex items-center gap-1.5"
                      >
                        <img src={editIcon} alt="Edit" className="h-3.5 w-3.5 object-contain" />
                        {t("reviews", "edit", "Edit")}
                      </button>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 min-h-[60px] md:min-h-[80px] text-xs md:text-sm leading-relaxed">{review.text}</p>
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="hidden md:flex border-4 border-[#0B3C5D] items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#0B3C5D] dark:bg-black text-white hover:bg-gray-800 dark:hover:bg-[#0B3C5D] duration-300 hover:text-white text-lg md:text-2xl flex-shrink-0"
          >
            ❯
          </button>

          {user && (
            <button
              onClick={openCreateComposer}
              className="hidden md:flex border-4 border-[#0B3C5D] items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-white dark:bg-black text-[#0B3C5D] dark:text-white hover:bg-[#0B3C5D] hover:text-white duration-300 flex-shrink-0 text-lg md:text-2xl font-bold"
              aria-label={t("reviews", "addReviewAria", "Add your review")}
              title={t("reviews", "addReviewTitle", "Add your review")}
            >
              +
            </button>
          )}
        </div>

        {composerMessage && (
          <div className="mt-4 mx-auto max-w-3xl rounded-2xl border border-amber-500 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
            {composerMessage}
          </div>
        )}

        {isComposerOpen && (
          <div className="mt-5 max-w-3xl mx-auto rounded-3xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-5 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg md:text-xl font-bold text-[#0B3C5D] dark:text-white">{editingId ? t("reviews", "editYourReview", "Edit your review") : t("reviews", "addYourReview", "Add your review")}</h3>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="rounded-full border border-[#0B3C5D] px-3 py-1 text-xs font-semibold text-[#0B3C5D] dark:text-white"
              >
                {t("reviews", "close", "Close")}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setComposerRating(value)}
                  className={`rounded-full border px-3 py-2 text-sm transition-all duration-300 ${
                    value <= composerRating
                      ? "border-[#0B3C5D] bg-[#0B3C5D] text-white"
                      : "border-[#0B3C5D] bg-white text-black dark:bg-black dark:text-white"
                  }`}
                >
                  {value} ★
                </button>
              ))}
            </div>

            <textarea
              value={composerText}
              onChange={(event) => setComposerText(event.target.value)}
              className="mt-4 w-full min-h-[96px] rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-sm text-black dark:text-white focus:outline-none"
              placeholder={t("reviews", "typeReviewPlaceholder", "Type your review here")}
            />

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90"
              >
                {editingId ? t("reviews", "save", "Save") : t("reviews", "submitReview", "Submit Review")}
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-4 md:mt-8">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-[#0B3C5D] dark:bg-white w-6 md:w-8" : "bg-[#0B3C5D] dark:bg-white"
              }`}
              aria-label={`${t("reviews", "goToReview", "Go to review")} ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleReviews;
