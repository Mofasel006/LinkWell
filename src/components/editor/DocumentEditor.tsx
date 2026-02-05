import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";

interface DocumentEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSelectionChange: (text: string) => void;
}

export default function DocumentEditor({
  content,
  onChange,
  onSelectionChange,
}: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-800",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "editor-content prose prose-lg max-w-none focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        const text = editor.state.doc.textBetween(from, to);
        onSelectionChange(text);
      } else {
        onSelectionChange("");
      }
    },
  });

  // Sync content when it changes from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "");
    }
  }, [content, editor]);

  const insertContent = (text: string) => {
    if (editor) {
      editor.chain().focus().insertContent(text).run();
    }
  };

  // Expose insertContent to parent via window for AI integration
  useEffect(() => {
    (window as unknown as { insertEditorContent: (text: string) => void }).insertEditorContent = insertContent;
    return () => {
      delete (window as unknown as { insertEditorContent?: (text: string) => void }).insertEditorContent;
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <EditorToolbar editor={editor} />
      <div className="p-8">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
