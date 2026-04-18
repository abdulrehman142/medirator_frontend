import { useEffect, useState } from "react";

import Complaints from "../../Complaints";
import stethoscopeImg from "/medirator_images/stethoscope.jpg";
import medicalrecordsImg from "/medirator_images/medicalrecords.jpg";
import medicinesImg from "/medirator_images/medicines.jpg";
import manImg from "/medirator_images/man.png";
import phoneImg from "/medirator_images/phone.png";
interface HomePageProps {
  darkMode?: boolean;
}

interface DoctorReview {
  id: number;
  name: string;
  text: string;
  date: string;
  rating: number;
}

const HomePage = ({ darkMode = false }: HomePageProps) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);

  const heroImages = [medicalrecordsImg, stethoscopeImg, medicinesImg];

  const doctorReviews: DoctorReview[] = [
    {
      id: 1,
      name: "Dr. Sana Ahmed",
      text: "Doctor workflow tools are responsive and make patient review much faster during busy shifts.",
      date: "12-01-2026 11:20",
      rating: 5,
    },
    {
      id: 2,
      name: "Dr. Adeel Khan",
      text: "The patient management flow keeps follow-ups organized and reduces missed tasks.",
      date: "03-02-2026 16:45",
      rating: 5,
    },
    {
      id: 3,
      name: "Dr. Hira Malik",
      text: "Prescription and appointment shortcuts help me stay focused on care instead of navigation.",
      date: "18-03-2026 09:12",
      rating: 5,
    },
    {
      id: 4,
      name: "Dr. Hamza Riaz",
      text: "The visualizer gives a clear snapshot of patient trends before consultations.",
      date: "27-04-2026 13:58",
      rating: 5,
    },
    {
      id: 5,
      name: "Dr. Mariam Noor",
      text: "Home page access to the doctor tools makes my daily routine much smoother.",
      date: "09-05-2026 18:33",
      rating: 5,
    },
    {
      id: 6,
      name: "Dr. Usman Qureshi",
      text: "The interface is simple, which helps when switching quickly between patients.",
      date: "22-06-2026 10:10",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % doctorReviews.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [doctorReviews.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const getVisibleReviews = () => {
    const prev =
      currentIndex === 0 ? doctorReviews.length - 1 : currentIndex - 1;
    const next = (currentIndex + 1) % doctorReviews.length;
    return [
      doctorReviews[prev],
      doctorReviews[currentIndex],
      doctorReviews[next],
    ];
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? doctorReviews.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % doctorReviews.length);
  };

  const renderStars = (rating: number) => (
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

  const visibleReviews = getVisibleReviews();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-white dark:bg-black">
        <div className="flex flex-col md:flex-row text-white transition-all duration-500 min-h-screen md:min-h-screen min-h-auto">
          <div className="flex flex-col p-4 md:p-10 flex-1 justify-center md:justify-center">
            <div className="font-ibm-plex-mono text-black dark:text-white font-bold text-3xl md:text-5xl py-2 md:py-4">
              Smart Care
              <br /> Starts Here
            </div>
            <div className="font-ibm-plex-mono text-black dark:text-white text-base md:text-xl py-2 md:py-4">
              Track patient data, assess
              <br /> risks, and deliver
              <br /> better outcomes.
            </div>
            <div className="bg-[#0B3C5D] border-2 border-[#0B3C5D] dark:bg-black rounded-full flex items-center w-fit">
              <a
                href="tel:03225455658"
                className="bg-[#0B3C5D] p-2 m-2 md:m-2 border-2 rounded-4xl border-[#0B3C5D] dark:hover:bg-[#0B3C5D] dark:bg-black rounded hover:bg-gray-800 flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <img
                  src={phoneImg}
                  alt="phone"
                  className="w-7 h-7"
                  loading="lazy"
                />
              </a>
            </div>
          </div>

          <div className="hidden md:flex flex-1 h-screen">
            <div className="relative w-full h-full rounded-l-full overflow-hidden shadow-2xl">
              {heroImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`hero-${idx}`}
                  loading="lazy"
                  className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                    idx === imageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === imageIndex
                        ? "bg-white w-6"
                        : "bg-white opacity-50"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Complaints darkMode={darkMode} />

      <div className="w-full py-6 md:py-12 px-3 md:px-4 bg-white dark:bg-black">
        <h2 className="text-2xl md:text-4xl font-ibm-plex-mono font-bold text-center mb-6 md:mb-12 text-[#0B3C5D] dark:text-white">
          Doctors Speak for Us!
        </h2>

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
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <div className="w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold flex-shrink-0">
                        <img
                          src={manImg}
                          alt="doctor-review"
                          className="pl-1"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#0B3C5D] dark:text-white text-sm md:text-base">
                          {review.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {review.date}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-3 md:mb-4 min-h-[60px] md:min-h-[80px] text-xs md:text-sm leading-relaxed">
                      {review.text}
                    </p>

                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
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
          </div>

          <div className="flex justify-center gap-2 mt-4 md:mt-8">
            {doctorReviews.map((_, idx) => (
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
    </div>
  );
};

export default HomePage;
