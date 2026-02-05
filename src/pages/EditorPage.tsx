import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import TiptapEditor from "../components/editor/TiptapEditor";
import KnowledgePanel from "../components/knowledge/KnowledgePanel";
import AIChat from "../components/ai/AIChat";
import { debounce } from "../lib/utils";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const documentId = id as Id<"documents">;

  const document = useQuery(api.documents.get, { id: documentId });
  const updateDocument = useMutation(api.documents.update);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [isKnowledgePanelCollapsed, setIsKnowledgePanelCollapsed] = useState(false);
  const [isAIPanelCollapsed, setIsAIPanelCollapsed] = useState(false);

  // Initialize state from document
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    }
  }, [document]);

  // Debounced save function
  const debouncedSave = useMemo(
    () =>
      debounce(async (newContent: string, newTitle: string) => {
        try {
          await updateDocument({
            id: documentId,
            content: newContent,
            title: newTitle,
            status: "saved",
          });
          setSaveStatus("saved");
        } catch (error) {
          console.error("Failed to save:", error);
          setSaveStatus("unsaved");
        }
      }, 1000),
    [documentId, updateDocument]
  );

  const handleContentChange = useCallback(
    (newContent: string) => {
      setContent(newContent);
      setSaveStatus("saving");
      debouncedSave(newContent, title);
    },
    [title, debouncedSave]
  );

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setTitle(newTitle);
      setSaveStatus("saving");
      debouncedSave(content, newTitle);
    },
    [content, debouncedSave]
  );

  const handleInsertContent = useCallback((text: string) => {
    // Use the global function exposed by TiptapEditor
    const insertFn = (window as unknown as { insertEditorContent?: (text: string) => void }).insertEditorContent;
    if (insertFn) {
      insertFn(text);
    }
  }, []);

  if (document === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (document === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <svg
          className="h-16 w-16 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Document not found</h2>
        <p className="mt-2 text-gray-500">
          The document you're looking for doesn't exist or has been deleted.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              title="Back to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 px-0"
                placeholder="Untitled Document"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span
              className={`text-sm ${
                saveStatus === "saved"
                  ? "text-green-600"
                  : saveStatus === "saving"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {saveStatus === "saved" && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Saved</span>
                </span>
              )}
              {saveStatus === "saving" && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Saving...</span>
                </span>
              )}
              {saveStatus === "unsaved" && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Unsaved</span>
                </span>
              )}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Knowledge */}
        <div
          className={`transition-all duration-300 ${
            isKnowledgePanelCollapsed ? "w-12" : "w-80"
          } flex-shrink-0`}
        >
          <KnowledgePanel
            documentId={documentId}
            isCollapsed={isKnowledgePanelCollapsed}
            onToggle={() => setIsKnowledgePanelCollapsed(!isKnowledgePanelCollapsed)}
          />
        </div>

        {/* Center - Editor */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <TiptapEditor
              content={content}
              onUpdate={handleContentChange}
              onSelectionChange={setSelectedText}
            />
          </div>
        </div>

        {/* Right Panel - AI Chat */}
        <div
          className={`transition-all duration-300 ${
            isAIPanelCollapsed ? "w-12" : "w-96"
          } flex-shrink-0`}
        >
          <AIChat
            documentId={documentId}
            documentContent={content}
            selectedText={selectedText}
            isCollapsed={isAIPanelCollapsed}
            onToggle={() => setIsAIPanelCollapsed(!isAIPanelCollapsed)}
            onInsertContent={handleInsertContent}
          />
        </div>
      </div>
    </div>
  );
}
