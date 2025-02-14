import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { Badge } from "@/components/ui/badge"

// Separate button component for reusability
interface EditorButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: React.ReactNode;
}

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

const HeadingButtons = ({ editor }: { editor: Editor }) => {
  const headingLevels = [1, 2, 3, 4, 5, 6]
  
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

const MenuBar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) return null

  const basicMarkButtons = [
    {
      label: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      canRun: editor.can().chain().focus().toggleBold().run(),
    },
    {
      label: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      canRun: editor.can().chain().focus().toggleItalic().run(),
    },
  ]

  return (
    <div className='space-x-2'>
        {basicMarkButtons.map(({ label, action, isActive, canRun }) => (
          <EditorButton
            key={label}
            onClick={action}
            disabled={!canRun}
            isActive={isActive}
          >
            {label}
          </EditorButton>
        ))}
        
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
  Color.configure({ 
    types: [TextStyle.name, ListItem.name] 
  }),
  TextStyle.configure({ 
    types: [ListItem.name] 
  }),
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
}

const TaskEditor: React.FC<TaskEditorProps> = ({ value }) => { 
  return (
  <div className='border border-gray-200 rounded p-4'>
    <EditorProvider 
      slotBefore={<MenuBar />} 
      extensions={editorExtensions} 
      content={value}
    />
  </div>
)}

export default TaskEditor
