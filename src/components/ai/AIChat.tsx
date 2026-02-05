import { useState, useRef, useEffect } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Button from "../ui/Button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  documentId: Id<"documents">;
  documentContent: string;
  selectedText: string;
  isCollapsed: boolean;
  onToggle: () => void;
  onInsertContent: (content: string) => void;
}

export default function AIChat({
  documentId,
  documentContent,
  selectedText,
  isCollapsed,
  onToggle,
  onInsertContent,
}: AIChatProps) {
  const knowledgeEntries = useQuery(api.knowledge.list, { documentId });
  const chat = useAction(api.ai.chat);
  const generateContent = useAction(api.ai.generateContent);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const knowledgeContext = knowledgeEntries?.map((e) => `[${e.label}]: ${e.content}`) || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chat({
        documentContent,
        knowledgeContext,
        messages: [...messages, { role: "user", content: userMessage }],
      });

      if (response) {
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    if (isLoading) return;

    let prompt = "";
    switch (action) {
      case "expand":
        prompt = selectedText
          ? `Please expand on this text with more detail: "${selectedText}"`
          : "Please expand on the last paragraph of the document with more detail.";
        break;
      case "summarize":
        prompt = selectedText
          ? `Please summarize this text concisely: "${selectedText}"`
          : "Please provide a brief summary of the entire document.";
        break;
      case "rewrite":
        prompt = selectedText
          ? `Please rewrite this text to improve clarity and flow: "${selectedText}"`
          : "Please suggest improvements for the document's writing style.";
        break;
      case "continue":
        prompt = "Please continue writing from where the document ends, maintaining the same style and tone.";
        break;
      default:
        return;
    }

    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setIsLoading(true);

    try {
      const response = await generateContent({
        documentContent,
        knowledgeContext,
        userPrompt: prompt,
        selectedText: selectedText || undefined,
      });

      if (response) {
        setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      }
    } catch (error) {
      console.error("Quick action error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4">
        <button
          onClick={onToggle}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          title="Expand AI Panel"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h2 className="font-semibold text-gray-900">AI Assistant</h2>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
          title="Collapse Panel"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap gap-2">
          <QuickActionButton onClick={() => handleQuickAction("continue")} disabled={isLoading}>
            Continue Writing
          </QuickActionButton>
          <QuickActionButton onClick={() => handleQuickAction("expand")} disabled={isLoading}>
            Expand
          </QuickActionButton>
          <QuickActionButton onClick={() => handleQuickAction("summarize")} disabled={isLoading}>
            Summarize
          </QuickActionButton>
          <QuickActionButton onClick={() => handleQuickAction("rewrite")} disabled={isLoading}>
            Rewrite
          </QuickActionButton>
        </div>
        {selectedText && (
          <p className="mt-2 text-xs text-primary-600 truncate">
            Selected: "{selectedText.substring(0, 50)}..."
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-10 w-10 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">Ask me anything about your document</p>
            <p className="text-xs text-gray-400 mt-1">
              Or use the quick actions above
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.role === "assistant" && (
                <button
                  onClick={() => onInsertContent(message.content)}
                  className="mt-2 text-xs text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Insert into document</span>
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask AI to help with your writing..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface QuickActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function QuickActionButton({ onClick, disabled, children }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}
