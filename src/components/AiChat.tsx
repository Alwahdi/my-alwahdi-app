"use client"; // for Next.js App Router client component

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react"; // Importing icons for send and loading states

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Ref for textarea for auto-resize

  async function sendMessage() {
    if (!input.trim() || loading) return; // Prevent sending empty messages or multiple messages while loading

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user" as const,
    };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput(""); // Clear input immediately
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }), // Use userMessage.text to ensure latest input is sent
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch AI response");
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const aiMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "ai" as const,
      };
      setMessages((msgs) => [...msgs, aiMessage]);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
      // Auto-resize textarea after response
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // Effect to scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]); // Also scroll when loading state changes (for loader)

  // Effect to auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]); // Re-adjust height whenever input changes

  return (
    <div className="flex flex-col h-[70vh] max-h-[800px] min-h-[500px] w-full max-w-[960px] mx-auto bg-[#fafbf9] rounded-xl shadow-lg border border-[#ecf0ea] overflow-hidden">
      {/* Title */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#ecf0ea]">
        <h2 className="text-[#131811] text-xl font-bold leading-tight">
          AI Chat Assistant
        </h2>
      </div>

      {/* Chat messages display area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {messages.length === 0 && !loading && !error && (
          <div className="flex items-center justify-center h-full text-center text-[#6c8560] italic text-base px-4">
            <p>
              Ask me anything about groundwater analysis, predictions, or
              reports...
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {messages.map(({ id, text, sender }) => (
            <div
              key={id}
              className={`flex ${
                sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[85%] sm:max-w-[70%] whitespace-pre-wrap break-words text-sm md:text-base font-normal leading-normal shadow-sm
                  ${
                    sender === "user"
                      ? "bg-[#70b450] text-white rounded-br-none" // User messages
                      : "bg-[#d9e1d6] text-[#131811] rounded-bl-none" // AI messages
                  }
                `}
              >
                {text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#d9e1d6] text-[#131811] rounded-2xl rounded-bl-none px-4 py-2 max-w-[85%] sm:max-w-[70%] text-sm md:text-base shadow-sm">
                <Loader2 className="animate-spin inline-block mr-2" size={18} />
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 text-center text-sm border-t border-red-200">
          Error: {error}
        </div>
      )}

      {/* Input area */}
      <div className="relative p-4 border-t border-[#ecf0ea] flex items-end bg-white">
        <textarea
          ref={textareaRef}
          placeholder="Type your message..."
          className="flex-1 resize-none overflow-hidden rounded-xl text-[#131811] focus:outline-none focus:ring-2 focus:ring-[#70b450] focus:border-transparent border border-[#d9e1d6] bg-[#fafbf9] placeholder:text-[#6c8560] p-3 pr-12 text-base font-normal leading-normal transition-all duration-200 max-h-40 min-h-[44px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={1} // Start with 1 row and let JS adjust
        ></textarea>
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()} // Disable if loading or input is empty
          className="absolute right-6 bottom-6 flex items-center justify-center size-8 rounded-full bg-[#70b450] text-white hover:bg-[#539932] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 className="animate-spin size-4" />
          ) : (
            <Send className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
