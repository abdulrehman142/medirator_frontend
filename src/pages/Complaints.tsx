import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

interface ComplaintsProps {
  darkMode?: boolean;
}

const Complaints = ({ darkMode = false }: ComplaintsProps) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (e: string) => /\S+@\S+\.\S+/.test(e);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    setLoading(true);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(t("complaints", "errorFill", "Please fill in your name, email and message."));
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError(t("complaints", "errorEmail", "Please enter a valid email address."));
      setLoading(false);
      return;
    }

    if (message.trim().length < 10) {
      setError(t("complaints", "errorLength", "Message should be at least 10 characters."));
      setLoading(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t("complaints", "errorFailed", "Failed to send message. Please try again later.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row dark:text-white justify-between dark:bg-black font-sans gap-4 md:gap-0">
        <div className="flex flex-col justify-center p-2 md:p-6 m-2 md:m-4">
          <div className="text-xl text-[#0B3C5D] dark:text-white md:text-2xl font-bold pl-0 md:pl-4 md:ml-4">
            {t("complaints", "title", "Resolving your complaints!")}
          </div>
          <div className="pl-0 md:pl-4 md:ml-4 p-2 m-2 text-sm text-[#8e8e93] md:text-base">
            {t("complaints", "subtitle", "Help us improve Medirator - share your complaint so we can serve you better.")}
          </div>
        </div>
        <div className="w-full max-w-4xl m-2 md:m-4 px-3 md:px-4 md:px-8 py-6 md:py-8 relative z-10">
          <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-8">
            {error && <div className="mb-4 text-red-500 text-sm md:text-base">{error}</div>}
            {success && (
              <div className="mb-4 text-green-600 text-sm md:text-base">
                {t("complaints", "success", "Message sent - thanks! We'll reply soon.")}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm text-black dark:text-white mb-1">
                    {t("complaints", "name", "Name")}
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-2xl border-[#0B3C5D] p-2 rounded bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
                    placeholder={t("complaints", "namePlaceholder", "Your full name")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm text-black dark:text-white mb-1">
                    {t("complaints", "email", "Email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
                    placeholder={t("auth", "emailPlaceholder", "you@example.com")}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm text-black dark:text-white mb-1">
                  {t("complaints", "message", "Message")}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white min-h-[100px] md:min-h-[180px] focus:outline-none text-sm"
                  placeholder={t("complaints", "messagePlaceholder", "Write your message")}
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black p-2 px-4 rounded w-full md:w-auto text-sm disabled:opacity-50"
                >
                  {loading ? t("complaints", "sending", "Sending...") : t("complaints", "sendMessage", "Send message")}
                </button>
                <div className="text-xs md:text-sm text-black dark:text-gray-300 text-center md:text-right">
                  {t("complaints", "contactLine", "Or email us at")}{" "}
                  <a href="mailto:mediratorinfo@gmail.com" className="underline">
                    mediratorinfo@gmail.com
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
