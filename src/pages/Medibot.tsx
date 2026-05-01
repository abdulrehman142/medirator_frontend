import bot from "/medirator_images/medibotlogo.png";
import React, { useMemo, useState } from "react";

import { useLanguage } from "../context/LanguageContext";


type ChatMessage = {
  id: number;
  role: "bot" | "user";
  text: string;
};

const Medibot: React.FC = () => {
  const { t } = useLanguage();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "bot",
      text: t("chatbot", "greeting", "Hi! I’m Medibot. Ask me about services, appointments, test reports, or records."),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const quickPrompts = useMemo(
    () => [
      t("chatbot", "promptAppointment", "How do I book an appointment?"),
      t("chatbot", "promptReports", "Where can I view test reports?"),
      t("chatbot", "promptPrivacy", "How is my data protected?"),
    ],
    [t]
  );

  const getBotReply = (userText: string) => {
    const normalized = userText.toLowerCase();

    if (normalized.includes("appointment") || normalized.includes("اپائنٹمنٹ") || normalized.includes("ملاقات")) {
      return t(
        "chatbot",
        "replyAppointment",
        "You can go to Services → Appointments to manage upcoming visits and history."
      );
    }
    if (normalized.includes("test") || normalized.includes("result") || normalized.includes("رپورٹ")) {
      return t(
        "chatbot",
        "replyReports",
        "Open Services → Test Reports to review your reports and keep them organized."
      );
    }
    if (normalized.includes("security") || normalized.includes("data") || normalized.includes("privacy") || normalized.includes("محفوظ")) {
      return t(
        "chatbot",
        "replyPrivacy",
        "Medirator keeps your records protected with controlled access and secure handling of sensitive data."
      );
    }
    if (normalized.includes("history") || normalized.includes("record") || normalized.includes("تاریخ")) {
      return t(
        "chatbot",
        "replyHistory",
        "Family History helps you keep all healthcare information in one place."
      );
    }

    return t(
      "chatbot",
      "replyGeneral",
      "I can help with Family History, Salts, Health Risks, Appointments, Test Reports, and Visualizer."
    );
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "bot",
        text: getBotReply(trimmed),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark:text-white dark:bg-black font-sans min-h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 md:p-6 shadow-md gap-4">
        <div className="">
          <h2 className="text-3xl md:text-5xl font-bold text-center md:text-left">{t("chatbot", "title", "Medibot")}</h2>
        </div>
        <img src={bot} alt="Medibot banner" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="w-full flex-1 px-3 md:px-6 py-4 relative z-10">
        <div className="h-full bg-[#0B3C5D] dark:bg-black border-2 border-[#0B3C5D] dark:border-[#0B3C5D] rounded-lg shadow p-4 md:p-6 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto rounded-lg bg-white dark:bg-[#0B3C5D]/20 p-3 md:p-4 space-y-3 min-h-[320px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm md:text-base  ${
                    message.role === "user"
                      ? "bg-[#0B3C5D] text-white"
                      : "bg-[#EEF2F7] text-[#0B3C5D] dark:bg-black dark:text-white"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-[#8e8e93]">{t("chatbot", "typing", "Medibot is typing...")}</div>}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-xs md:text-sm bg-white dark:bg-black text-[#0B3C5D] dark:text-white border border-[#0B3C5D] rounded-full px-3 py-1 hover:bg-gray-800 hover:text-white transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              handleSend(input);
            }}
            className="mt-4 flex gap-2"
          >
            <input
              value={input}
              onChange={(ev) => setInput(ev.target.value)}
              className="flex-1 p-2 border-2 rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
              placeholder={t("chatbot", "placeholder", "Ask Medibot something...")}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-white dark:bg-black border-2 rounded-2xl border-[#0B3C5D] hover:text-white dark:text-white hover:bg-gray-800 dark:hover:bg-[#0B3C5D] text-black px-4 rounded text-sm"
            >
              {t("chatbot", "send", "Send")}
            </button>
          </form>

          <div className="text-xs md:text-sm text-black md:text-white dark:text-gray-300 text-center md:text-right mt-3">
            {t("chatbot", "humanHelp", "Need human help?")} {" "}
            <a href="mailto:mediratorinfo@gmail.com" className="underline">
              mediratorinfo@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Medibot;
