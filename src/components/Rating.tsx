import RoleReviews from "./RoleReviews";
import { useLanguage } from "../context/LanguageContext";

const Rating = () => {
  const { t } = useLanguage();

  const patientSeedReviews = [
    {
      id: "patient-seed-1",
      name: "Abdul Rehman",
      text: t(
        "rating",
        "review1",
        "I can now view my family history, medications, and family background in one place without confusion."
      ),
      date: "12-01-2026 11:20",
      rating: 5,
    },
    {
      id: "patient-seed-2",
      name: "Sameer Shahzad",
      text: t(
        "rating",
        "review2",
        "The risk alerts helped me act early on my health issues and schedule follow-up care on time."
      ),
      date: "03-02-2026 16:45",
      rating: 5,
    },
    {
      id: "patient-seed-3",
      name: "Abdullah Aslam",
      text: t(
        "rating",
        "review3",
        "I feel safe sharing records because my personal information is protected with strong privacy controls."
      ),
      date: "18-03-2026 09:12",
      rating: 5,
    },
    {
      id: "patient-seed-4",
      name: "Raahim Chaudry",
      text: t(
        "rating",
        "review4",
        "It helped me avoid repeated tests and flagged medication conflicts before they became a problem."
      ),
      date: "27-04-2026 13:58",
      rating: 5,
    },
    {
      id: "patient-seed-5",
      name: "Nawal Tassadaq",
      text: t(
        "rating",
        "review5",
        "Managing appointments, test reports, and medical records in one dashboard saves me a lot of time."
      ),
      date: "09-05-2026 18:33",
      rating: 5,
    },
    {
      id: "patient-seed-6",
      name: "Aina Ali",
      text: t(
        "rating",
        "review6",
        "The interface is simple and clear, so I can use it easily even without technical knowledge."
      ),
      date: "22-06-2026 10:10",
      rating: 5,
    },
  ];

  return (
    <RoleReviews
      role="patient"
      title={t("rating", "title", "Our Patients Speak for Us!")}
      seedReviews={patientSeedReviews}
    />
  );
};

export default Rating;
