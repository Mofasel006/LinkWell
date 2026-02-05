import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  FileText,
  Plus,
  LogOut,
  MoreVertical,
  Trash2,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const documents = useQuery(api.documents.list);
  const createDocument = useMutation(api.documents.create);
  const deleteDocument = useMutation(api.documents.remove);
  const [isCreating, setIsCreating] = useState(false);
  const [menuOpen, setMenuOpen] = useState<Id<"documents"> | null>(null);

  const handleCreateDocument = async () => {
    setIsCreating(true);
    try {
      const documentId = await createDocument({});
      navigate(`/editor/${documentId}`);
    } catch (err) {
      console.error("Failed to create document:", err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteDocument = async (documentId: Id<"documents">) => {
    try {
      await deleteDocument({ documentId });
      setMenuOpen(null);
    } catch (err) {
      console.error("Failed to delete document:", err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-ink-800" />
            <span className="font-serif text-2xl font-bold text-ink-900">LinkWell</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-ink-600 hover:text-ink-800 font-medium"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-10 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-ink-900">Your Documents</h1>
          <button
            onClick={handleCreateDocument}
            disabled={isCreating}
            className="btn-primary flex items-center gap-2"
          >
            {isCreating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
            New Document
          </button>
        </div>

        {/* Document List */}
        {documents === undefined ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-ink-400" />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-ink-300 mx-auto mb-4" />
            <h2 className="font-serif text-xl font-bold text-ink-800 mb-2">
              No documents yet
            </h2>
            <p className="text-ink-600 mb-6">
              Create your first document to get started
            </p>
            <button
              onClick={handleCreateDocument}
              disabled={isCreating}
              className="btn-primary inline-flex items-center gap-2"
            >
              {isCreating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              Create Document
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-ink-400 transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <Link
                    to={`/editor/${doc._id}`}
                    className="flex-1 min-w-0"
                  >
                    <h3 className="font-serif text-lg font-bold text-ink-900 truncate group-hover:text-ink-600">
                      {doc.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-ink-400">
                      <span>Last edited {formatDate(doc.updatedAt)}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-cream-100 text-ink-600 text-xs font-medium">
                        {doc.status === "saved" ? "Saved" : "Draft"}
                      </span>
                    </div>
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === doc._id ? null : doc._id)}
                      className="p-2 text-ink-400 hover:text-ink-800 rounded-lg hover:bg-cream-100"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    {menuOpen === doc._id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => handleDeleteDocument(doc._id)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
