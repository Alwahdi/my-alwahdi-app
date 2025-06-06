"use client"; // Marks this component as a client component for Next.js App Router

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react"; // Importing icons for send and loading states
import ReactMarkdown from "react-markdown"; // Import ReactMarkdown
import remarkGfm from "remark-gfm"; // Import GitHub Flavored Markdown plugin

// --- Type Definitions ---
/**
 * @interface Message
 * Defines the structure for a single chat message.
 */
interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

// --- Main Component ---
export default function AiChat() {
  // --- State Management ---
  const [input, setInput] = useState(""); // Stores the current input text from the user
  const [messages, setMessages] = useState<Message[]>([]); // Stores all chat messages (user and AI)
  const [loading, setLoading] = useState(false); // Indicates if an AI response is being fetched
  const [error, setError] = useState<string | null>(null); // Stores any error messages from the API

  // --- Ref Management ---
  // Ref for the main scrollable chat container to enable auto-scrolling
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  // Ref for the auto-resizing textarea input field
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // --- Core Functions ---

  /**
   * Handles sending a message to the AI.
   * - Adds the user's message to the chat.
   * - Clears the input field.
   * - Calls the `/api/chat` endpoint to get an AI response.
   * - Adds the AI response (or error) to the chat.
   * - Manages loading and error states throughout the process.
   */
  async function sendMessage() {
    // Prevent sending empty messages or multiple messages while a response is loading
    if (!input.trim() || loading) {
      return;
    }

    // Prepare and add the user's message to the chat state
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(""); // Clear input immediately for a smooth user experience
    setLoading(true); // Activate loading state
    setError(null); // Clear any previous errors

    try {
      // Fetch AI response from the backend API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage.text }), // Send the user's message as the AI prompt
      });

      // Handle HTTP errors (e.g., 404, 500)
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch AI response");
      }

      // Parse the JSON response from the API
      const data = await res.json();
      // Handle application-specific errors returned in the response body
      if (data.error) {
        throw new Error(data.error);
      }

      // Prepare and add the AI's message to the chat state
      const aiMessage: Message = {
        id: Date.now() + 1, // Ensure unique ID for AI message
        text: data.reply,
        sender: "ai",
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (err: any) {
      // Catch and display any errors that occur during the fetch operation
      console.error("Chat API error:", err); // Log the error for debugging
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false); // Deactivate loading state regardless of success or failure
      // After processing, ensure textarea height is re-calculated to fit content
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  }

  /**
   * Handles keyboard events for the textarea.
   * - Sends message on 'Enter' key press (without 'Shift').
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} e - The keyboard event object.
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in the textarea
      sendMessage(); // Trigger message sending
    }
  }

  // --- Effect Hooks ---

  /**
   * `useEffect` hook to auto-scroll the chat container to the bottom.
   * This ensures the latest messages are always visible.
   * It uses `setTimeout(0)` to defer the scroll operation until after the DOM
   * has fully updated with new messages.
   */
  useEffect(() => {
    // Only scroll if there are messages to display
    if (messages.length > 0) {
      const lastMessageSender = messages[messages.length - 1].sender;

      // Scroll when an AI message is added or when a user message is added
      // and the loading spinner appears (for better UX)
      if (
        lastMessageSender === "ai" ||
        (lastMessageSender === "user" && loading)
      ) {
        if (chatContainerRef.current) {
          setTimeout(() => {
            chatContainerRef.current!.scrollTop =
              chatContainerRef.current!.scrollHeight;
          }, 0); // Defer to the next microtask
        }
      }
    }
  }, [messages, loading]); // Dependencies: Re-run when messages or loading state changes

  /**
   * `useEffect` hook to auto-resize the textarea based on its content.
   * This provides a better user experience by expanding the input field as text is typed,
   * up to a maximum height.
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to fit content
    }
  }, [input]); // Dependency: Re-run whenever the 'input' state changes

  // --- Rendered Component (JSX) ---
  return (
    <div className="flex flex-col h-[70vh] max-h-[800px] min-h-[500px] w-full max-w-[960px] mx-auto bg-[#fafbf9] rounded-xl shadow-lg border border-[#ecf0ea] overflow-hidden">
      {/* Chat Title */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#ecf0ea]">
        <h2 className="text-[#131811] text-xl font-bold leading-tight">
          AI Chat Assistant
        </h2>
      </div>

      {/* Chat Messages Display Area */}
      <div
        ref={chatContainerRef} // Attach ref for scrolling
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
                {/* Conditional rendering for text content */}
                {sender === "ai" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    // You can add custom components here to style markdown elements with TailwindCSS
                    // For example:
                    // components={{
                    //   h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                    //   p: ({node, ...props}) => <p className="mb-2" {...props} />,
                    //   ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-2" {...props} />,
                    //   li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    //   strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    //   em: ({node, ...props}) => <em className="italic" {...props} />,
                    //   code: ({node, inline, ...props}) => {
                    //     return inline ? (
                    //       <code className="bg-gray-200 text-gray-800 px-1 rounded" {...props} />
                    //     ) : (
                    //       <pre className="bg-gray-800 text-white p-2 rounded-md overflow-x-auto my-2">
                    //         <code {...props} />
                    //       </pre>
                    //     );
                    //   }
                    // }}
                  >
                    {text}
                  </ReactMarkdown>
                ) : (
                  // User messages are plain text
                  text
                )}
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
          ref={textareaRef} // Attach ref for auto-sizing
          placeholder="Type your message..."
          className="flex-1 resize-none overflow-hidden rounded-xl text-[#131811] focus:outline-none focus:ring-2 focus:ring-[#70b450] focus:border-transparent border border-[#d9e1d6] bg-[#fafbf9] placeholder:text-[#6c8560] p-3 pr-12 text-base font-normal leading-normal transition-all duration-200 max-h-40 min-h-[44px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading} // Disable input when an AI response is pending
          rows={1} // Start with 1 row; auto-resize will adjust as needed
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
