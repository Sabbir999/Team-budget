import React, { useEffect } from "react";
import { Extension } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";

const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]+/g, "") || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },

      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

function ToolbarButton({ active, onClick, children, title }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-blue-300 bg-blue-50 text-blue-700"
          : "border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value = "", onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class:
          "blog-editor min-h-[420px] rounded-b-xl px-4 py-4 leading-8 text-gray-800 outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();

    if (value !== currentHtml) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setFontSize = (size) => {
    editor.chain().focus().setFontSize(size).run();
  };

  const addLink = () => {
    const url = window.prompt("Enter link URL", "https://");

    if (!url) {
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-gray-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-3">
        <select
          value={editor.getAttributes("textStyle").fontSize || "12px"}
          onChange={(event) => setFontSize(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          title="Font size"
        >
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="22px">22</option>
          <option value="28px">28</option>
          <option value="36px">36</option>
        </select>

        <ToolbarButton
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Add link"
          active={editor.isActive("link")}
          onClick={addLink}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          title="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}