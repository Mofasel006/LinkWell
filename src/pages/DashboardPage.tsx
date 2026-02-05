import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { formatDate } from "../lib/utils";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const documents = useQuery(api.documents.list);
  const createDocument = useMutation(api.documents.create);
  const deleteDocument = useMutation(api.documents.remove);
  const updateDocument = useMutation(api.documents.update);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: Id<"documents">;
    title: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDocument = async () => {
    setIsLoading(true);
    try {
      const id = await createDocument({ title: newTitle || "Untitled Document" });
      setIsCreateModalOpen(false);
      setNewTitle("");
      navigate(`/editor/${id}`);
    } catch (error) {
      console.error("Failed to create document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;
    setIsLoading(true);
    try {
      await deleteDocument({ id: selectedDocument.id });
      setIsDeleteModalOpen(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error("Failed to delete document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenameDocument = async () => {
    if (!selectedDocument || !newTitle.trim()) return;
    setIsLoading(true);
    try {
      await updateDocument({ id: selectedDocument.id, title: newTitle.trim() });
      setIsRenameModalOpen(false);
      setSelectedDocument(null);
      setNewTitle("");
    } catch (error) {
      console.error("Failed to rename document:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">LinkWell</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Document
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600 mt-1">Create, edit, and manage your documents</p>
        </div>

        {documents === undefined ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-4 text-lg font-medium text-gray-900">No documents yet</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first document.</p>
            <div className="mt-6">
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Document
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between">
                  <Link to={`/editor/${doc._id}`} className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(doc.updatedAt)}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-3 ${
                        doc.status === "saved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {doc.status === "saved" ? "Saved" : "Draft"}
                    </span>
                  </Link>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setSelectedDocument({ id: doc._id, title: doc.title });
                        setNewTitle(doc.title);
                        setIsRenameModalOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      title="Rename"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDocument({ id: doc._id, title: doc.title });
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Document Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewTitle("");
        }}
        title="Create New Document"
      >
        <div className="space-y-4">
          <Input
            label="Document Title"
            placeholder="Enter document title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewTitle("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateDocument} isLoading={isLoading}>
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Document Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDocument(null);
        }}
        title="Delete Document"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete "{selectedDocument?.title}"? This action cannot be
            undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedDocument(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteDocument} isLoading={isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rename Document Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => {
          setIsRenameModalOpen(false);
          setSelectedDocument(null);
          setNewTitle("");
        }}
        title="Rename Document"
      >
        <div className="space-y-4">
          <Input
            label="New Title"
            placeholder="Enter new title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsRenameModalOpen(false);
                setSelectedDocument(null);
                setNewTitle("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRenameDocument} isLoading={isLoading}>
              Rename
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
