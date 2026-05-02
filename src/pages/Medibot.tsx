import bot from "/medirator_images/medibotlogo.png";
import sendIcon from "/medirator_images/send.png";
import voiceIcon from "/medirator_images/voice.png";
import uploadIcon from "/medirator_images/upload.svg";
import backIcon from "/medirator_images/back.png";
import sunIcon from "/medirator_images/lightmode.svg";
import moonIcon from "/medirator_images/darkmode.svg";
import deleteIcon from "/medirator_images/delete.png";
import editIcon from "/medirator_images/edit.png";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { tokenStore } from "../auth/tokenStore";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
  files?: Array<{ filename?: string; file_url?: string | null }>;
};

type Session = {
  id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
  message_count?: number;
};

export default function Medibot() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "processing">("idle");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceHint, setVoiceHint] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [draftIsVoice, setDraftIsVoice] = useState(false);

  const chatRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const voiceBaseTextRef = useRef("");
  const activeSessionLoadRef = useRef<string | null>(null);
  const currentChatIdRef = useRef<string | null>(null);

  // Load sessions on mount
  useEffect(() => {
    inputRef.current?.focus();
    loadSessions();
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

  useEffect(() => {
    currentChatIdRef.current = currentChatId;
  }, [currentChatId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatRef.current) {
      setTimeout(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
      }, 100);
    }
  }, [messages, loading]);

  const loadSessions = async () => {
    const token = tokenStore.getAccessToken();
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;

      const payload = await res.json();
      const data = (payload?.data || []) as Session[];
      setSessions(data);

      if (data.length > 0) {
        setCurrentChatId(data[0].id);
        loadSessionMessages(data[0].id);
      } else {
        // Create initial session
        const created = await createSession("New Chat");
        if (created) {
          setSessions([created]);
          setCurrentChatId(created.id);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  const createSession = async (title: string): Promise<Session | null> => {
    const token = tokenStore.getAccessToken();
    if (!token) return null;

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat/sessions", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) return null;

      const payload = await res.json();
      return payload?.data || null;
    } catch (err) {
      console.error("Failed to create session:", err);
      return null;
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    const token = tokenStore.getAccessToken();
    if (!token) return;
    activeSessionLoadRef.current = sessionId;

    try {
      const res = await fetch(`http://localhost:8000/api/v1/chat/sessions/${sessionId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (activeSessionLoadRef.current === sessionId) {
          setMessages([]);
        }
        return;
      }

      const payload = await res.json();
      const msgs = (payload?.data || []) as any[];
      const formatted: ChatMessage[] = msgs.map((m) => ({
        id: m.id,
        role: m.role === "assistant" ? "bot" : "user",
        text: m.content,
        files: m.files || [],
      }));
      if (activeSessionLoadRef.current === sessionId) {
        setMessages(formatted);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
      if (activeSessionLoadRef.current === sessionId) {
        setMessages([]);
      }
    }
  };

  const selectSession = (session: Session) => {
    setCurrentChatId(session.id);
    setMessages([]);
    loadSessionMessages(session.id);
  };

  const renameSession = async (sessionId: string) => {
    const newTitle = prompt("New chat title:");
    if (!newTitle || !newTitle.trim()) return;

    const token = tokenStore.getAccessToken();
    try {
      const res = await fetch(`http://localhost:8000/api/v1/chat/sessions/${sessionId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!res.ok) throw new Error("rename failed");

      setSessions((s) =>
        s.map((it) => (it.id === sessionId ? { ...it, title: newTitle } : it))
      );
    } catch (err) {
      console.error("Failed to rename:", err);
      alert("Failed to rename chat");
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!confirm("Delete this chat?")) return;

    const token = tokenStore.getAccessToken();
    try {
      const res = await fetch(`http://localhost:8000/api/v1/chat/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("delete failed");

      const remaining = sessions.filter((it) => it.id !== sessionId);
      setSessions(remaining);

      if (currentChatId === sessionId) {
        if (remaining.length > 0) {
          selectSession(remaining[0]);
        } else {
          const created = await createSession("New Chat");
          if (created) {
            setSessions([created]);
            setCurrentChatId(created.id);
            setMessages([]);
          }
        }
      }
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Failed to delete chat");
    }
  };

  const sendMessage = async (text: string, isVoice = false) => {
    if (!text.trim() && selectedFiles.length === 0) return;

    const trimmedText = text.trim();
    const outgoingFiles = [...selectedFiles];
    const optimisticUserMessage: ChatMessage = {
      id: `local-user-${Date.now()}`,
      role: "user",
      text: trimmedText || `Uploaded ${outgoingFiles.length} file(s)`,
      files: outgoingFiles.map((f) => ({ filename: f.name, file_url: null })),
    };

    setLoading(true);
    if (isVoice) {
      setVoiceState("processing");
    }
    let sendSucceeded = false;
    let activeTargetChatId: string | null = null;

    try {
      let chatId = currentChatId;

      // Auto-create session on first message if none exists
      if (!chatId) {
        const title = trimmedText.slice(0, 60) || "New Chat";
        const created = await createSession(title);
        if (!created) throw new Error("Failed to create chat");

        chatId = created.id;
        setSessions((s) => [created, ...s]);
        setCurrentChatId(chatId);
      }

      activeTargetChatId = chatId;

      setMessages((prev) => [...prev, optimisticUserMessage]);
      setInput("");
      setSelectedFiles([]);
      setDraftIsVoice(false);

      // Send message to backend
      const form = new FormData();
      form.append("chat_id", chatId);
      form.append("message", trimmedText || `Uploaded ${outgoingFiles.length} file(s)`);
      form.append("is_voice", String(Boolean(isVoice)));
      outgoingFiles.forEach((f) => form.append("files", f));

      const token = tokenStore.getAccessToken();
      const res = await fetch("http://localhost:8000/api/v1/chat/message", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.detail || "Send failed");

      const assistantReply = payload?.data?.assistant_reply || "";
      const assistantId = payload?.data?.message_id || `local-assistant-${Date.now()}`;

      if (currentChatIdRef.current === activeTargetChatId) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(assistantId),
            role: "bot",
            text: assistantReply,
          },
        ]);
      }

      sendSucceeded = true;

      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== activeTargetChatId) return session;
          if (session.title !== "New Chat") return session;
          const nextTitle = (trimmedText || "New Chat").slice(0, 60);
          return { ...session, title: nextTitle || "New Chat" };
        })
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      if (currentChatIdRef.current === activeTargetChatId) {
        setMessages((prev) => [
          ...prev,
          {
            id: `local-error-${Date.now()}`,
            role: "bot",
            text: "I could not process that message. Please try again.",
          },
        ]);
      }
    } finally {
      if (sendSucceeded && fileRef.current) {
        fileRef.current.value = "";
      }
      setLoading(false);
      setVoiceState("idle");
      inputRef.current?.focus();
    }
  };

  const adjustComposerHeight = () => {
    const composer = inputRef.current;
    if (!composer) return;

    composer.style.height = "0px";
    const nextHeight = Math.min(composer.scrollHeight, 160);
    composer.style.height = `${Math.max(nextHeight, 44)}px`;
  };

  const stopVoiceInput = (clearHint = false) => {
    try {
      recognitionRef.current?.stop?.();
    } catch (error) {
      console.error("Failed to stop voice input:", error);
    }
    recognitionRef.current = null;
    setVoiceState("idle");
    setInterimTranscript("");
    if (clearHint) {
      setVoiceHint(null);
    }
  };

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Microphone access required");
      return;
    }

    setVoiceError(null);
    setVoiceHint(null);
    setInterimTranscript("");

    if (voiceState === "processing") {
      return;
    }

    if (voiceState === "listening") {
      stopVoiceInput(true);
      return;
    }

    voiceBaseTextRef.current = input.trim();

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceState("listening");
      setVoiceError(null);
      setVoiceHint("Listening...");
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let liveTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const chunk = result?.[0]?.transcript ?? "";
        if (!chunk) continue;
        if (result.isFinal) {
          finalTranscript += `${chunk} `;
        } else {
          liveTranscript += `${chunk} `;
        }
      }

      const spokenText = `${voiceBaseTextRef.current}${voiceBaseTextRef.current ? " " : ""}${(finalTranscript + liveTranscript).trim()}`.trim();
      setInterimTranscript(liveTranscript.trim());
      if (spokenText) {
        setInput(spokenText);
        setDraftIsVoice(true);
        requestAnimationFrame(adjustComposerHeight);
      }
    };

    recognition.onerror = (event: any) => {
      const errorCode = String(event?.error || "").toLowerCase();
      if (errorCode === "not-allowed" || errorCode === "service-not-allowed" || errorCode === "audio-capture") {
        setVoiceError("Microphone access required");
      } else if (errorCode === "no-speech") {
        setVoiceError("Try speaking again");
      } else {
        setVoiceError("Voice input failed. Try again.");
      }
      stopVoiceInput();
    };

    recognition.onend = () => {
      if (voiceState !== "processing") {
        setVoiceState("idle");
      }
      setInterimTranscript("");
      if (!voiceError) {
        const hasText = Boolean(input.trim());
        setVoiceHint(hasText ? null : "Try speaking again");
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      setVoiceError("Microphone access required");
      stopVoiceInput();
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gradient-to-br from-black via-slate-900 to-black text-white" : "bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 text-black"}`}>
      {/* Sidebar - Fixed */}
      <aside className={`w-72 h-screen overflow-y-auto border-r ${darkMode ? "border-white/5 bg-white/3" : "border-blue-200 bg-white/40"} p-4 flex flex-col flex-shrink-0`}>
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center ${
              darkMode ? "hover:bg-[#0B3C5D]" : "hover:bg-gray-200"
            }`}
            title="Go back"
          >
            <img
              src={backIcon}
              alt="Back"
              className="w-5 h-5 pointer-events-none"
            />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center ${
              darkMode ? "hover:bg-[#0B3C5D]" : "hover:bg-gray-200"
            }`}
            title="Toggle dark mode"
          >
            <img
              src={darkMode ? moonIcon : sunIcon}
              alt="Toggle Dark Mode"
              className="w-5 h-5 pointer-events-none"
            />
          </button>
        </div>

        <button
          onClick={async () => {
            const created = await createSession("New Chat");
            if (created) {
              setSessions((s) => [created, ...s]);
              setCurrentChatId(created.id);
              setMessages([]);
            }
          }}
          className={`w-full py-2 rounded mb-4 font-semibold text-sm ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          + New Chat
        </button>

        <div className="flex-1 overflow-y-auto space-y-2">
          {sessions.length === 0 ? (
            <p className={`text-xs ${darkMode ? "text-white/40" : "text-black/40"}`}>No chats yet</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => selectSession(session)}
                className={`p-3 rounded cursor-pointer text-sm truncate transition-colors group ${
                  currentChatId === session.id
                    ? darkMode
                      ? "bg-white/10 text-white"
                      : "bg-blue-300 text-blue-900"
                    : darkMode
                    ? "hover:bg-white/5 text-white/70"
                    : "hover:bg-blue-100 text-black/70"
                }`}
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="truncate">{session.title}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        renameSession(session.id);
                      }}
                      className="flex items-center justify-center"
                      title="Rename"
                    >
                      <img src={editIcon} alt="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="flex items-center justify-center"
                      title="Delete"
                    >
                      <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main chat area - Flex column with scrollable messages */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`border-b ${darkMode ? "border-white/5 bg-white/3" : "border-blue-200 bg-white/40"} p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <img src={bot} alt="medibot" className="w-8 h-8 rounded-full" />
            <div>
              <div className="font-semibold text-lg">MediBot</div>
              <div className="text-xs opacity-70">AI Healthcare Assistant</div>
            </div>
          </div>
        </header>

        {/* Messages - Scrollable */}
        <section
          ref={chatRef}
          className={`flex-1 overflow-y-auto p-6 space-y-4 ${darkMode ? "bg-transparent" : "bg-white/20"}`}
        >
          <div className="max-w-2xl mx-auto space-y-3">
            {messages.length === 0 && (
              <div className={`text-center py-12 ${darkMode ? "text-white/40" : "text-black/40"}`}>
                <div className="text-sm">No messages yet</div>
                <div className="text-xs mt-2">Send a message to start the conversation</div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
                    m.role === "user"
                      ? darkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : darkMode
                      ? "bg-white/10 text-white"
                      : "bg-white text-black"
                  }`}
                  style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  <div>{m.text}</div>
                  {Array.isArray(m.files) && m.files.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.files.map((file, index) => {
                        const fileName = file?.filename || file?.name || `file-${index + 1}`;
                        const fileUrl = file?.file_url || file?.url || null;
                        return (
                          <div
                            key={`${m.id}-${index}`}
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] ${
                              darkMode ? "bg-white/10 text-white" : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            <span>📎</span>
                            {fileUrl ? (
                              <a href={fileUrl} target="_blank" rel="noreferrer" className="underline truncate max-w-[140px]">
                                {fileName}
                              </a>
                            ) : (
                              <span className="truncate max-w-[140px]">{fileName}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className={`text-sm ${darkMode ? "text-white/50" : "text-black/50"}`}>
                <span className="animate-pulse">Medibot is thinking...</span>
              </div>
            )}
          </div>
        </section>

        {/* Input area - Fixed at bottom */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input, draftIsVoice);
          }}
          className={`border-t ${darkMode ? "border-white/10 bg-black/20" : "border-blue-200 bg-blue-100/40"} p-4 backdrop-blur-xl`}
          style={{
            WebkitBackdropFilter: 'blur(8px)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Selected files preview */}
            {selectedFiles.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                      darkMode ? "bg-white/20 text-white" : "bg-blue-200 text-blue-900"
                    }`}
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFiles((p) => p.filter((_, j) => j !== idx))}
                      className="ml-1 opacity-70 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {(voiceError || voiceHint) && (
              <div className={`text-xs px-1 ${voiceError ? "text-red-500" : darkMode ? "text-white/60" : "text-slate-600"}`}>
                {voiceError || voiceHint}
              </div>
            )}

            {/* Input bar */}
            <div
              className={`flex items-end gap-2 px-3 py-2 rounded-full border ${
                darkMode
                  ? "bg-white/10 border-white/20"
                  : "bg-white border-blue-300"
              }`}
            >
              {/* FILE INPUT */}
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                multiple
                hidden
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedFiles((p) => [...p, ...Array.from(e.target.files!)]);
                  }
                }}
              />

              {/* TEXT INPUT */}
              <div className="flex-1 min-w-0">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setVoiceError(null);
                    setDraftIsVoice(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input, draftIsVoice);
                    }
                  }}
                  placeholder="Ask Medibot..."
                  rows={1}
                  onInput={adjustComposerHeight}
                  className={`w-full resize-none overflow-hidden bg-transparent outline-none text-sm px-2 py-2 leading-5 min-h-[44px] ${
                    darkMode ? "text-white placeholder-white/60" : "text-black placeholder-black/60"
                  }`}
                />
              </div>

              {voiceState === "listening" && (
                <div className="flex items-center gap-2 shrink-0 pl-1 pr-1">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                  </span>
                  <div className="flex items-end gap-0.5 h-4">
                    {[0, 1, 2].map((bar) => (
                      <span
                        key={bar}
                        className="w-1 rounded-full bg-red-400 animate-pulse"
                        style={{
                          height: `${9 + bar * 3}px`,
                          animationDelay: `${bar * 120}ms`,
                          opacity: 0.7 + bar * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 🎤 VOICE BUTTON */}
              <button
                type="button"
                onClick={startVoiceInput}
                aria-pressed={voiceState === "listening"}
                className={`relative w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 ${
                  voiceState === "listening"
                    ? darkMode
                      ? "border-red-400 bg-red-500/20"
                      : "border-red-500 bg-red-100"
                    : darkMode
                    ? "border-white/20 hover:bg-white/10"
                    : "border-blue-300 hover:bg-blue-200"
                }`}
                title={voiceState === "listening" ? "Stop voice input" : "Start voice input"}
              >
                <img src={voiceIcon} className="h-5 w-5" />
                {voiceState === "listening" && <span className="absolute inset-0 rounded-full border border-red-400 animate-ping opacity-60" />}
              </button>

              {/* 📎 UPLOAD BUTTON */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`w-9 h-9 flex items-center justify-center rounded-full border transition-colors ${
                  darkMode
                    ? "border-white/20 hover:bg-white/10"
                    : "border-blue-300 hover:bg-blue-200"
                }`}
              >
                <img src={uploadIcon} className="h-5 w-5" />
              </button>

              {/* 📩 SEND */}
              <button
                type="submit"
                disabled={loading || (!input.trim() && selectedFiles.length === 0)}
                className={`w-9 h-9 flex items-center justify-center rounded-full border transition-colors ${
                  darkMode
                    ? "border-white/20 hover:bg-white/10 disabled:opacity-50"
                    : "border-blue-300 hover:bg-blue-200 disabled:opacity-50"
                }`}
              >
                <img src={sendIcon} className="h-5 w-5" />
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}