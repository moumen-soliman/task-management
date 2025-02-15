import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React, { useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { EditorButtonProps } from '@/types/Form'

// Reusable Editor Button
const EditorButton: React.FC<EditorButtonProps> = ({ 
  onClick, 
  isActive = false, 
  children 
}) => (
  <Badge
    onClick={onClick}
    className='cursor-pointer'
    variant={isActive ? "default" : "outline"}
  >
    {children}
  </Badge>
)

const HeadingButtons = ({ editor }: { editor: any }) => {
  const headingLevels = [1, 2, 3, 4, 5, 6] as const

  return headingLevels.map(level => (
    <EditorButton
      key={`heading-${level}`}
      onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
      isActive={editor.isActive('heading', { level })}
    >
      H{level}
    </EditorButton>
  ))
}

const MenuBar = ({ onChange }: { onChange: (value: string) => void }) => {
  const { editor } = useCurrentEditor()

  useEffect(() => {
    if (!editor) return;
    const updateHandler = () => {
      onChange(editor.getHTML()) // Ensure onChange is triggered with the latest content
    };
    editor.on('update', updateHandler);
    return () => {
      editor.off('update', updateHandler);
    };
  }, [editor, onChange]);

  if (!editor) return null

  return (
    <div className='space-x-2 mb-5'>
      <EditorButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
      >
        Bold
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
      >
        Italic
      </EditorButton>

      <HeadingButtons editor={editor} />

      <EditorButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
      >
        Bullet list
      </EditorButton>
      <EditorButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
      >
        Ordered list
      </EditorButton>
    </div>
  )
}

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
]

interface TaskEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ value, onChange }) => {
  return (
    <div className='border border-gray-200 rounded p-4'>
      <EditorProvider 
        slotBefore={<MenuBar onChange={onChange} />} 
        extensions={editorExtensions} 
        content={value}
        onUpdate={({ editor }) => onChange(editor.getHTML())} // Ensure updates trigger onChange
      />
    </div>
  )
}

export default TaskEditor
