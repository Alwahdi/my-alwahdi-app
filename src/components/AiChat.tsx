"use client"; // for Next.js App Router client component

import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export default function AiChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user" as const,
    };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      if (!res.ok) throw new Error("Failed to fetch AI response");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const aiMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "ai" as const,
      };
      setMessages((msgs) => [...msgs, aiMessage]);
      setInput("");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-[960px] mx-auto flex flex-col font-public-sans h-[600px] bg-[#fafbf9]">
      {/* Title */}
      <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        AI Chat Assistant
      </h2>

      {/* Chat messages display area */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="flex flex-col gap-3 rounded-xl p-4 bg-[#ecf0ea] min-h-[calc(100%-80px)]">
          {" "}
          {/* Adjusted background and padding */}
          {messages.length === 0 && (
            <p className="text-[#6c8560] italic text-base font-normal leading-normal">
              Ask me anything about groundwater analysis, predictions, or
              reports...
            </p>
          )}
          {messages.map(({ id, text, sender }) => (
            <div
              key={id}
              className={`mb-2 flex ${
                sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-xl px-4 py-2 max-w-[80%] whitespace-pre-wrap break-words text-sm font-normal leading-normal
                  ${
                    sender === "user"
                      ? "bg-[#70b450] text-white" // User messages in primary green
                      : "bg-[#d9e1d6] text-[#131811]" // AI messages in lighter grey/green
                  }
                `}
              >
                {text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {error && (
        <p className="text-red-600 mt-2 mb-1 text-center text-sm">{error}</p>
      )}

      {/* Input area */}
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <textarea
            placeholder="Ask me anything about groundwater analysis, predictions, or reports..."
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#131811] focus:outline-0 focus:ring-0 border border-[#d9e1d6] bg-[#fafbf9] focus:border-[#d9e1d6] min-h-36 placeholder:text-[#6c8560] p-[15px] text-base font-normal leading-normal"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          ></textarea>
        </label>
      </div>

      {/* Send button */}
      <div className="flex px-4 py-3 justify-end">
        <button
          onClick={sendMessage}
          disabled={loading}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#70b450] text-[#131811] text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <span className="truncate">{loading ? "Sending..." : "Send"}</span>
        </button>
      </div>
    </div>
  );
}
