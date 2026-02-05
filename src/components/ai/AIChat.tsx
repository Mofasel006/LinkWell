import { useState, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Sparkles,
  Send,
  Loader2,
  Copy,
  Check,
  Plus,
  FileText,
  Edit,
  Expand,
  Minimize2,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  onInsert: (prompt: string) => Promise<string>;
  selectedText: string;
  documentContent: string;
  knowledge: { label: string; content: string }[];
}

export default function AIChat({
  onInsert,
  selectedText,
  documentContent,
  knowledge,
}: AIChatProps) {
  const chat = useAction(api.ai.chat);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      const knowledgeContext = knowledge.map((k) => `[${k.label}]\n${k.content}`);
      const response = await chat({
        messages: [...messages, { role: "user", content: userMessage }],
        documentContent,
        knowledgeContext,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      console.error("AI chat error:", err);
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
    let prompt = "";

    switch (action) {
      case "continue":
        prompt = "Continue writing from where the document left off.";
        break;
      case "improve":
        prompt = selectedText
          ? `Improve the following text: "${selectedText}"`
          : "Improve the clarity and flow of the document.";
        break;
      case "expand":
        prompt = selectedText
          ? `Expand on this section: "${selectedText}"`
          : "Expand on the main points in the document.";
        break;
      case "summarize":
        prompt = "Summarize the key points of the document.";
        break;
      default:
        return;
    }

    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setIsLoading(true);

    try {
      const response = await onInsert(prompt);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      console.error("AI action error:", err);
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

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInsertToDocument = (text: string) => {
    const insertFn = (window as unknown as { insertEditorContent?: (text: string) => void }).insertEditorContent;
    if (insertFn) {
      insertFn(text);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-ink-600" />
          <h2 className="font-semibold text-ink-800">AI Assistant</h2>
        </div>
        {selectedText && (
          <p className="text-xs text-ink-400 mt-1 truncate">
            Selected: "{selectedText.slice(0, 30)}..."
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
        <p className="text-xs text-ink-400 mb-2">Quick actions</p>
        <div className="grid grid-cols-2 gap-2">
          <QuickActionButton
            icon={<Plus className="h-3.5 w-3.5" />}
            label="Continue"
            onClick={() => handleQuickAction("continue")}
            disabled={isLoading}
          />
          <QuickActionButton
            icon={<Edit className="h-3.5 w-3.5" />}
            label="Improve"
            onClick={() => handleQuickAction("improve")}
            disabled={isLoading}
          />
          <QuickActionButton
            icon={<Expand className="h-3.5 w-3.5" />}
            label="Expand"
            onClick={() => handleQuickAction("expand")}
            disabled={isLoading}
          />
          <QuickActionButton
            icon={<Minimize2 className="h-3.5 w-3.5" />}
            label="Summarize"
            onClick={() => handleQuickAction("summarize")}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-10 w-10 text-ink-300 mx-auto mb-2" />
            <p className="text-sm text-ink-400">
              Ask me to help with your document
            </p>
            <p className="text-xs text-ink-300 mt-1">
              I'll use your knowledge references for context
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`${
                msg.role === "user"
                  ? "ml-8"
                  : "mr-4"
              }`}
            >
              <div
                className={`rounded-lg p-3 ${
                  msg.role === "user"
                    ? "bg-ink-800 text-white"
                    : "bg-cream-100 text-ink-800"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    onClick={() => handleCopy(msg.content, i)}
                    className="flex items-center gap-1 text-xs text-ink-400 hover:text-ink-600"
                  >
                    {copiedIndex === i ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleInsertToDocument(msg.content)}
                    className="flex items-center gap-1 text-xs text-ink-400 hover:text-ink-600"
                  >
                    <FileText className="h-3 w-3" />
                    Insert
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && (
          <div className="mr-4">
            <div className="bg-cream-100 rounded-lg p-3 inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-ink-600" />
              <span className="text-sm text-ink-600">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask AI to help..."
            rows={2}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ink-800"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-ink-800 text-white rounded-lg hover:bg-ink-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-ink-600 bg-cream-50 rounded hover:bg-cream-100 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
      {label}
    </button>
  );
}
