import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  BookOpen,
  Plus,
  X,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface KnowledgePanelProps {
  documentId: Id<"documents">;
}

export default function KnowledgePanel({ documentId }: KnowledgePanelProps) {
  const knowledge = useQuery(api.knowledge.listByDocument, { documentId });
  const createKnowledge = useMutation(api.knowledge.create);
  const updateKnowledge = useMutation(api.knowledge.update);
  const deleteKnowledge = useMutation(api.knowledge.remove);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"knowledge"> | null>(null);
  const [expandedId, setExpandedId] = useState<Id<"knowledge"> | null>(null);

  const [label, setLabel] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!label.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await createKnowledge({
        documentId,
        label: label.trim(),
        content: content.trim(),
      });
      setLabel("");
      setContent("");
      setIsAdding(false);
    } catch (err) {
      console.error("Failed to add knowledge:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (knowledgeId: Id<"knowledge">) => {
    if (!label.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await updateKnowledge({
        knowledgeId,
        label: label.trim(),
        content: content.trim(),
      });
      setEditingId(null);
      setLabel("");
      setContent("");
    } catch (err) {
      console.error("Failed to update knowledge:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (knowledgeId: Id<"knowledge">) => {
    try {
      await deleteKnowledge({ knowledgeId });
    } catch (err) {
      console.error("Failed to delete knowledge:", err);
    }
  };

  const startEdit = (item: { _id: Id<"knowledge">; label: string; content: string }) => {
    setEditingId(item._id);
    setLabel(item.label);
    setContent(item.content);
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setLabel("");
    setContent("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-ink-600" />
            <h2 className="font-semibold text-ink-800">Knowledge</h2>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setLabel("");
              setContent("");
            }}
            className="p-1.5 text-ink-600 hover:text-ink-800 hover:bg-cream-100 rounded"
            title="Add knowledge"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-ink-400 mt-1">
          Add references for AI to use
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="mb-4 p-3 bg-cream-100 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-ink-800">
                {editingId ? "Edit Reference" : "Add Reference"}
              </span>
              <button
                onClick={cancelEdit}
                className="p-1 text-ink-400 hover:text-ink-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label (e.g., Research Notes)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-ink-800"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your reference content here..."
              rows={5}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-ink-800"
            />
            <button
              onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              disabled={isSubmitting || !label.trim() || !content.trim()}
              className="mt-2 w-full px-3 py-2 bg-ink-800 text-white text-sm font-medium rounded hover:bg-ink-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {editingId ? "Updating..." : "Adding..."}
                </>
              ) : (
                editingId ? "Update" : "Add Reference"
              )}
            </button>
          </div>
        )}

        {/* Knowledge List */}
        {knowledge === undefined ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-ink-400" />
          </div>
        ) : knowledge.length === 0 && !isAdding ? (
          <div className="text-center py-8">
            <BookOpen className="h-10 w-10 text-ink-300 mx-auto mb-2" />
            <p className="text-sm text-ink-400">No references yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-2 text-sm text-ink-600 hover:text-ink-800 font-medium"
            >
              Add your first reference
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {knowledge.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-lg bg-white"
              >
                <div
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-cream-50"
                  onClick={() =>
                    setExpandedId(expandedId === item._id ? null : item._id)
                  }
                >
                  {expandedId === item._id ? (
                    <ChevronDown className="h-4 w-4 text-ink-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-ink-400 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium text-ink-800 truncate flex-1">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(item);
                      }}
                      className="p-1 text-ink-400 hover:text-ink-800"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item._id);
                      }}
                      className="p-1 text-ink-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                {expandedId === item._id && (
                  <div className="px-3 pb-3 pt-1">
                    <p className="text-xs text-ink-600 whitespace-pre-wrap break-words bg-cream-50 p-2 rounded max-h-40 overflow-auto">
                      {item.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
