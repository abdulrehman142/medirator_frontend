import manImg from "/medirator_images/man.png";
import { useState, useEffect } from "react";

interface Review {
  id: number;
  name: string;
  text: string;
  date: string;
  rating: number;
}

const Rating = () => {
  const [currentIndex, setCurrentIndex] = useState(1); // Start with middle card highlighted

  const reviews: Review[] = [
    {
      id: 1,
      name: "Abdul Rehman",
      text: "I can now view my medical history, medications, and family background in one place without confusion.",
      date: "12-01-2026 11:20",
      rating: 5,
    },
    {
      id: 2,
      name: "Sameer Shahzad",
      text: "The risk alerts helped me act early on my health issues and schedule follow-up care on time.",
      date: "03-02-2026 16:45",
      rating: 5,
    },
    {
      id: 3,
      name: "Abdullah Aslam",
      text: "I feel safe sharing records because my personal information is protected with strong privacy controls.",
      date: "18-03-2026 09:12",
      rating: 5,
    },
    {
      id: 4,
      name: "Raahim Chaudry",
      text: "It helped me avoid repeated tests and flagged medication conflicts before they became a problem.",
      date: "27-04-2026 13:58",
      rating: 5,
    },
    {
      id: 5,
      name: "Nawal Tassadaq",
      text: "Managing appointments, test results, and medical records in one dashboard saves me a lot of time.",
      date: "09-05-2026 18:33",
      rating: 5,
    },
    {
      id: 6,
      name: "Aina Ali",
      text: "The interface is simple and clear, so I can use it easily even without technical knowledge.",
      date: "22-06-2026 10:10",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 10000); // Auto-scroll every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [reviews.length]);

  const getVisibleReviews = () => {
    const prev = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1;
    const next = (currentIndex + 1) % reviews.length;
    return [reviews[prev], reviews[currentIndex], reviews[next]];
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${i < rating ? "text-[#0B3C5D] dark:text-white" : "text-gray-300 dark:text-gray-700"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const visibleReviews = getVisibleReviews();

  return (
    <div className="w-full py-6 md:py-12 px-3 md:px-4 bg-white dark:bg-black">
      {/* Heading */}
      <h2 className="text-2xl md:text-4xl font-ibm-plex-mono font-bold text-center mb-6 md:mb-12 text-[#0B3C5D] dark:text-white">
        Our Patients Speak for Us!
      </h2>

      {/* Carousel Container */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
           className="hidden md:flex border-4 border-[#0B3C5D] items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#0B3C5D] dark:bg-black text-white hover:bg-gray-800 dark:hover:bg-[#0B3C5D] duration-300 hover:text-white text-lg md:text-2xl flex-shrink-0">
            ❮
          </button>

          {/* Cards Container */}
          <div className="flex gap-2 md:gap-4 justify-center flex-wrap md:flex-nowrap">
            {visibleReviews.map((review, idx) => {
              const isCenter = idx === 1;
              return (
                <div
                  key={review.id}
                  className={`transition-all duration-300 ${
                    isCenter
                      ? "md:w-96 w-full border-4 border-[#0B3C5D] dark:bg-black shadow-2xl scale-100 md:scale-105"
                      : "md:w-80 w-full border-2 border-[#0B3C5D] dark:bg-black opacity-60 scale-75 md:scale-95 hidden md:flex md:flex-col"
                  } p-3 md:p-6 rounded-2xl bg-white dark:bg-[#1a1a1a]`}
                >
                  {/* User Profile */}
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold flex-shrink-0">
                      <img src={manImg} alt="man" className="pl-1" loading="lazy" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0B3C5D] dark:text-white text-sm md:text-base">
                        {review.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{review.date}</p>
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 min-h-[60px] md:min-h-[80px] text-xs md:text-sm leading-relaxed">
                    {review.text}
                  </p>

                  {/* Stars Rating */}
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="hidden md:flex border-4 border-[#0B3C5D] items-center justify-center w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#0B3C5D] dark:bg-black text-white hover:bg-gray-800 dark:hover:bg-[#0B3C5D] duration-300 hover:text-white text-lg md:text-2xl flex-shrink-0"
          >
            ❯
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4 md:mt-8">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-[#0B3C5D] dark:bg-white w-6 md:w-8"
                  : "bg-[#0B3C5D] dark:bg-white"
              }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rating;
