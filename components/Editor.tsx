"use client";

// 1. Core React components
import { useEditor, EditorContent } from "@tiptap/react";

// 2. V3 Menu components (Must be imported from /menus)
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";

// 3. Extensions
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold,
  Italic,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  ImagePlus,
  Plus,
} from "lucide-react";
import { uploadImageToStorage } from "@/lib/uploadImage";

type EditorProps = {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export default function Editor({
  content,
  onChange,
  placeholder = "Start telling your story...",
}: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-xl" },
      }),
      Placeholder.configure({ placeholder }),
    ],

    content,

    onUpdate: ({ editor }) => onChange(editor.getHTML()),

    editorProps: {
      attributes: {
        class: "tiptap px-8 md:px-12 py-12 focus:outline-none",
      },

      // Handle image drops
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));

        if (imageFiles.length === 0) return false;

        event.preventDefault();

        imageFiles.forEach(async (file) => {
          const url = await uploadImageToStorage(file);
          if (url) {
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: url });
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          }
        });

        return true;
      },

      // Handle image pastes
      handlePaste: (view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        const imageFiles = files.filter((f) => f.type.startsWith("image/"));

        if (imageFiles.length === 0) return false;

        event.preventDefault();

        imageFiles.forEach(async (file) => {
          const url = await uploadImageToStorage(file);
          if (url) {
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: url });
            const transaction = view.state.tr.replaceSelectionWith(node);
            view.dispatch(transaction);
          }
        });

        return true;
      },
    },
  });

  // Trigger file picker and upload
  const handleImageButton = () => {
    if (!editor) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const url = await uploadImageToStorage(file);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    };
    input.click();
  };

  // Shared button class
  const menuBtn =
    "flex items-center justify-center w-9 h-9 rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors";

  return (
    <div className="relative">
      {/* Bubble menu — appears on text selection */}
      {editor && (
        <BubbleMenu
          editor={editor}
          options={{ placement: "top" }} // V3 specific: replaced tippyOptions
          className="flex items-center gap-0.5 p-1 bg-surface rounded-lg shadow-lg border border-outline-variant bg-white"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${menuBtn} ${editor.isActive("bold") ? "bg-primary text-blue-500" : ""}`}
            aria-label="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${menuBtn} ${editor.isActive("italic") ? "bg-primary text-blue-500" : ""}`}
            aria-label="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-outline-variant mx-0.5" />
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${menuBtn} ${editor.isActive("heading", { level: 1 }) ? "bg-primary text-blue-500" : ""}`}
            aria-label="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${menuBtn} ${editor.isActive("heading", { level: 2 }) ? "bg-primary text-blue-500" : ""}`}
            aria-label="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`${menuBtn} ${editor.isActive("heading", { level: 3 }) ? "bg-primary text-blue-500" : ""}`}
            aria-label="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-outline-variant mx-0.5" />
          <button
            type="button"
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href;
              const url = window.prompt("Enter URL", previousUrl ?? "https://");
              if (url === null) return;
              if (url === "") {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                return;
              }
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }}
            className={`${menuBtn} ${editor.isActive("link") ? "bg-primary text-blue-500" : ""}`}
            aria-label="Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </BubbleMenu>
      )}

      {/* Floating menu — appears on empty line */}
      {editor && (
        <FloatingMenu
          editor={editor}
          options={{ placement: "right" }} // V3 specific: replaced tippyOptions
          className="flex items-center gap-0.5 p-1 bg-surface rounded-lg shadow-lg border border-outline-variant bg-white"
        >
          <span className="flex items-center justify-center w-7 h-7 text-on-surface-variant">
            <Plus className="w-4 h-4" />
          </span>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${menuBtn} ${editor.isActive('heading', { level: 1 }) ? 'text-blue-500' : ''}`}
            aria-label="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${menuBtn} ${editor.isActive('heading', { level: 2 }) ? 'text-blue-500' : ''}`}
            aria-label="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${menuBtn} ${editor.isActive('bulletList') ? 'text-blue-500' : ''}`}
            aria-label="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${menuBtn} ${editor.isActive('orderedList') ? 'text-blue-500' : ''}`}
            aria-label="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${menuBtn} ${editor.isActive('blockquote') ? 'text-blue-500' : ''}`}
            aria-label="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleImageButton}
            className={menuBtn}
            aria-label="Image"
          >
            <ImagePlus className="w-4 h-4" />
          </button>
        </FloatingMenu>
      )}

      {/* Main writing area */}
      <EditorContent editor={editor} />
    </div>
  );
}