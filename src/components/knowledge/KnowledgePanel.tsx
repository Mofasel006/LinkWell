import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface KnowledgePanelProps {
  documentId: Id<"documents">;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function KnowledgePanel({ documentId, isCollapsed, onToggle }: KnowledgePanelProps) {
  const knowledgeEntries = useQuery(api.knowledge.list, { documentId });
  const createKnowledge = useMutation(api.knowledge.create);
  const updateKnowledge = useMutation(api.knowledge.update);
  const deleteKnowledge = useMutation(api.knowledge.remove);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"knowledge"> | null>(null);
  const [label, setLabel] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (!label.trim() || !content.trim()) return;
    setIsLoading(true);
    try {
      await createKnowledge({
        documentId,
        label: label.trim(),
        content: content.trim(),
      });
      setLabel("");
      setContent("");
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to add knowledge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: Id<"knowledge">) => {
    if (!label.trim() || !content.trim()) return;
    setIsLoading(true);
    try {
      await updateKnowledge({
        id,
        label: label.trim(),
        content: content.trim(),
      });
      setLabel("");
      setContent("");
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update knowledge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: Id<"knowledge">) => {
    if (!confirm("Are you sure you want to delete this knowledge entry?")) return;
    try {
      await deleteKnowledge({ id });
    } catch (error) {
      console.error("Failed to delete knowledge:", error);
    }
  };

  const startEdit = (entry: { _id: Id<"knowledge">; label: string; content: string }) => {
    setEditingId(entry._id);
    setLabel(entry.label);
    setContent(entry.content);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setLabel("");
    setContent("");
  };

  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4">
        <button
          onClick={onToggle}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          title="Expand Knowledge Panel"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Knowledge</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setLabel("");
              setContent("");
            }}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Add Knowledge"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={onToggle}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            title="Collapse Panel"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Input
              placeholder="Label (e.g., Research Notes)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mb-2"
            />
            <textarea
              placeholder="Content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-400 text-sm resize-none"
              rows={4}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => (editingId ? handleUpdate(editingId) : handleAdd())}
                isLoading={isLoading}
              >
                {editingId ? "Update" : "Add"}
              </Button>
            </div>
          </div>
        )}

        {/* Knowledge List */}
        {knowledgeEntries === undefined ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          </div>
        ) : knowledgeEntries.length === 0 && !isAdding ? (
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">No knowledge entries yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Add reference materials for AI context
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {knowledgeEntries.map((entry) => (
              <div
                key={entry._id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 group"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-medium text-gray-900 text-sm">{entry.label}</h4>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEdit(entry)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                      title="Edit"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(entry._id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600 line-clamp-3">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500">
          Add reference materials here. The AI will use this knowledge when generating content.
        </p>
      </div>
    </div>
  );
}
