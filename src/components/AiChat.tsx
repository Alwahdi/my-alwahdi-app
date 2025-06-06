"use client"; // Marks this component as a client component for Next.js App Router

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react"; // Importing icons for send and loading states

// Define the shape of a message object
interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

export default function AiChat() {
  // State variables for managing chat functionality
  const [input, setInput] = useState(""); // Stores the current input text
  const [messages, setMessages] = useState<Message[]>([]); // Stores all chat messages
  const [loading, setLoading] = useState(false); // Indicates if an AI response is being fetched
  const [error, setError] = useState<string | null>(null); // Stores any error messages

  // Refs for DOM manipulation
  // Ref for the main scrollable chat container
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  // Ref for auto-resizing textarea
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  /**
   * Handles sending a message to the AI.
   * - Adds user message to the chat.
   * - Clears the input field.
   * - Calls the `/api/chat` endpoint to get an AI response.
   * - Adds the AI response (or error) to the chat.
   * - Manages loading and error states.
   */
  async function sendMessage() {
    if (!input.trim() || loading) return; // Prevent sending empty messages or multiple messages while loading

    // Create and add the user's message to the state
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user" as const,
    };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput(""); // Clear input immediately for a responsive feel
    setLoading(true); // Set loading state to true
    setError(null); // Clear any previous errors

    try {
      // Fetch AI response from the backend API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }), // Send user's message as prompt
      });

      // Handle non-OK HTTP responses
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch AI response");
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error); // Handle API-specific errors

      // Create and add the AI's message to the state
      const aiMessage = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "ai" as const,
      };
      setMessages((msgs) => [...msgs, aiMessage]);
    } catch (err: any) {
      // Catch and display any errors during the fetch process
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false); // Reset loading state
      // After response, ensure textarea height is correct
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  }

  /**
   * Handles keyboard events for the textarea.
   * - Sends message on 'Enter' key press (without Shift).
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in textarea
      sendMessage(); // Send the message
    }
  }

  /**
   * Effect hook to scroll to the bottom of the chat.
   * This effect now directly sets the `scrollTop` of the chat container
   * to its maximum scrollable height, ensuring it's always at the very bottom.
   * It uses `setTimeout(0)` to ensure the DOM has fully updated.
   */
  useEffect(() => {
    // Only attempt to scroll if the last message is from the AI
    // or if a user message was just sent and the loader appeared (optional, but good for UX)
    if (messages.length > 0) {
      const lastMessageSender = messages[messages.length - 1].sender;

      // Only scroll when an AI message is added, or a user message is added and loading starts
      if (
        lastMessageSender === "ai" ||
        (lastMessageSender === "user" && loading)
      ) {
        if (chatContainerRef.current) {
          // Use setTimeout with 0ms to defer scroll until after DOM update
          setTimeout(() => {
            chatContainerRef.current!.scrollTop =
              chatContainerRef.current!.scrollHeight;
          }, 0);
        }
      }
    }
  }, [messages, loading]); // Depend on both messages and loading state

  /**
   * Effect hook to auto-resize the textarea based on its content.
   * This provides a better user experience by expanding the input field as text is typed.
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scroll height
    }
  }, [input]); // Dependency array: Re-run whenever 'input' state changes

  return (
    <div className="flex flex-col h-[70vh] max-h-[800px] min-h-[500px] w-full max-w-[960px] mx-auto bg-[#fafbf9] rounded-xl shadow-lg border border-[#ecf0ea] overflow-hidden">
      {/* Chat Title */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#ecf0ea]">
        <h2 className="text-[#131811] text-xl font-bold leading-tight">
          AI Chat Assistant
        </h2>
      </div>

      {/* Chat Messages Display Area */}
      {/* Assign the chatContainerRef here */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 custom-scrollbar"
      >
        {/* Initial prompt message when no messages are present */}
        {messages.length === 0 && !loading && !error && (
          <div className="flex items-center justify-center h-full text-center text-[#6c8560] italic text-base px-4">
            <p>
              Ask me anything about groundwater analysis, predictions, or
              reports...
            </p>
          </div>
        )}

        {/* Container for individual messages */}
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
                      ? "bg-[#70b450] text-white rounded-br-none" // Styling for user messages
                      : "bg-[#d9e1d6] text-[#131811] rounded-bl-none" // Styling for AI messages
                  }
                `}
              >
                {text}
              </div>
            </div>
          ))}

          {/* Loading indicator for AI response */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#d9e1d6] text-[#131811] rounded-2xl rounded-bl-none px-4 py-2 max-w-[85%] sm:max-w-[70%] text-sm md:text-base shadow-sm">
                <Loader2 className="animate-spin inline-block mr-2" size={18} />
                Thinking...
              </div>
            </div>
          )}
          {/* Removed messagesEndRef as we are now scrolling the container directly */}
        </div>
      </div>

      {/* Error display area */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 text-center text-sm border-t border-red-200">
          Error: {error}
        </div>
      )}

      {/* Message Input Area */}
      <div className="relative p-4 border-t border-[#ecf0ea] flex items-end bg-white">
        <textarea
          ref={textareaRef}
          placeholder="Type your message..."
          className="flex-1 resize-none overflow-hidden rounded-xl text-[#131811] focus:outline-none focus:ring-2 focus:ring-[#70b450] focus:border-transparent border border-[#d9e1d6] bg-[#fafbf9] placeholder:text-[#6c8560] p-3 pr-12 text-base font-normal leading-normal transition-all duration-200 max-h-40 min-h-[44px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading} // Disable input when loading
          rows={1} // Start with 1 row, auto-resize will adjust
        ></textarea>
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()} // Disable if loading or input is empty
          className="absolute right-6 bottom-6 flex items-center justify-center size-8 rounded-full bg-[#70b450] text-white hover:bg-[#539932] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 className="animate-spin size-4" /> // Show loader icon when loading
          ) : (
            <Send className="size-4" /> // Show send icon when not loading
          )}
        </button>
      </div>
    </div>
  );
}
