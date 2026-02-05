import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { ArrowLeft, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import DocumentEditor from "../components/editor/DocumentEditor";
import KnowledgePanel from "../components/knowledge/KnowledgePanel";
import AIChat from "../components/ai/AIChat";

export default function EditorPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();

  const document = useQuery(
    api.documents.get,
    documentId ? { documentId: documentId as Id<"documents"> } : "skip"
  );
  const knowledge = useQuery(
    api.knowledge.listByDocument,
    documentId ? { documentId: documentId as Id<"documents"> } : "skip"
  );
  const updateDocument = useMutation(api.documents.update);
  const generateContent = useAction(api.ai.generateContent);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [selectedText, setSelectedText] = useState("");

  // Initialize content from document
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    }
  }, [document]);

  // Auto-save with debounce
  const saveDocument = useCallback(
    async (newTitle: string, newContent: string) => {
      if (!documentId) return;

      setSaveStatus("saving");
      try {
        await updateDocument({
          documentId: documentId as Id<"documents">,
          title: newTitle,
          content: newContent,
          status: "saved",
        });
        setSaveStatus("saved");
      } catch (err) {
        console.error("Failed to save:", err);
        setSaveStatus("unsaved");
      }
    },
    [documentId, updateDocument]
  );

  // Debounced save
  useEffect(() => {
    if (!document) return;
    if (title === document.title && content === document.content) return;

    setSaveStatus("unsaved");
    const timeout = setTimeout(() => {
      saveDocument(title, content);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, content, document, saveDocument]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  const handleSelectionChange = (text: string) => {
    setSelectedText(text);
  };

  const handleAIInsert = async (prompt: string): Promise<string> => {
    const knowledgeContext = knowledge?.map((k) => `[${k.label}]\n${k.content}`) ?? [];

    const result = await generateContent({
      documentContent: content,
      knowledgeContext,
      userPrompt: prompt,
      selectedText: selectedText || undefined,
    });

    return result;
  };

  if (document === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <Loader2 className="h-8 w-8 animate-spin text-ink-400" />
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50">
        <p className="text-ink-600 mb-4">Document not found</p>
        <button onClick={() => navigate("/dashboard")} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-cream-50">
      {/* Top Bar */}
      <header className="flex-shrink-0 h-14 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 text-ink-600 hover:text-ink-800 hover:bg-cream-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="font-serif text-xl font-bold text-ink-900 bg-transparent border-none focus:outline-none focus:ring-0 min-w-0"
            placeholder="Untitled Document"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-400">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Saved</span>
            </>
          )}
          {saveStatus === "unsaved" && (
            <span className="text-amber-600">Unsaved changes</span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Knowledge */}
        <div
          className={`flex-shrink-0 border-r border-gray-200 bg-white transition-all duration-300 ${
            leftPanelOpen ? "w-72" : "w-0"
          } overflow-hidden`}
        >
          {leftPanelOpen && documentId && (
            <KnowledgePanel documentId={documentId as Id<"documents">} />
          )}
        </div>

        {/* Toggle Left Panel */}
        <button
          onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          className="flex-shrink-0 w-6 flex items-center justify-center bg-cream-100 hover:bg-cream-200 border-r border-gray-200"
        >
          {leftPanelOpen ? (
            <ChevronLeft className="h-4 w-4 text-ink-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-ink-400" />
          )}
        </button>

        {/* Center - Editor */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto py-8 px-8">
            <DocumentEditor
              content={content}
              onChange={handleContentChange}
              onSelectionChange={handleSelectionChange}
            />
          </div>
        </div>

        {/* Toggle Right Panel */}
        <button
          onClick={() => setRightPanelOpen(!rightPanelOpen)}
          className="flex-shrink-0 w-6 flex items-center justify-center bg-cream-100 hover:bg-cream-200 border-l border-gray-200"
        >
          {rightPanelOpen ? (
            <ChevronRight className="h-4 w-4 text-ink-400" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-ink-400" />
          )}
        </button>

        {/* Right Panel - AI Chat */}
        <div
          className={`flex-shrink-0 border-l border-gray-200 bg-white transition-all duration-300 ${
            rightPanelOpen ? "w-80" : "w-0"
          } overflow-hidden`}
        >
          {rightPanelOpen && (
            <AIChat
              onInsert={handleAIInsert}
              selectedText={selectedText}
              documentContent={content}
              knowledge={knowledge ?? []}
            />
          )}
        </div>
      </div>
    </div>
  );
}
