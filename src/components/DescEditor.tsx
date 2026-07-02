import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import { EditorButtonProps } from "@/types/Form";

const EditorButton: React.FC<EditorButtonProps> = ({ onClick, isActive = false, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-md pr-2 py-1 text-[11px] font-medium transition-colors ${
      isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

const HeadingButtons = ({ editor }: { editor: any }) => {
  const headingLevels = [1, 2, 3] as const;

  return headingLevels.map((level) => (
    <EditorButton
      key={`heading-${level}`}
      onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
      isActive={editor.isActive("heading", { level })}
    >
      H{level}
    </EditorButton>
  ));
};

const MenuBar = ({ onChange }: { onChange: (value: string) => void }) => {
  const { editor } = useCurrentEditor();

  useEffect(() => {
    if (!editor) return;
    const updateHandler = () => {
      onChange(editor.getHTML());
    };
    editor.on("update", updateHandler);
    return () => {
      editor.off("update", updateHandler);
    };
  }, [editor, onChange]);

  if (!editor) return null;

  return (
    <div className="mb-1 flex flex-wrap items-center gap-0.5">
      <EditorButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
      >
        Bold
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
      >
        Italic
      </EditorButton>

      <HeadingButtons editor={editor} />

      <EditorButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
      >
        List
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
      >
        1. List
      </EditorButton>
    </div>
  );
};

const editorExtensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Placeholder.configure({ placeholder: "Add a description…" }),
];

interface DescEditorProps {
  value: string;
  onChange: (value: string) => void;
}

/** Free-form description editing - no box; the text sits directly on the page. */
export default function DescEditor({ value, onChange }: DescEditorProps) {
  return (
    <div className="text-sm">
      <EditorProvider
        slotBefore={<MenuBar onChange={onChange} />}
        extensions={editorExtensions}
        content={value}
        onUpdate={({ editor }) => onChange(editor.getHTML())}
      />
    </div>
  );
}
