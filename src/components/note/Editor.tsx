import { useEditor, EditorContent, EditorContext, useEditorState } from '@tiptap/react';
import { FloatingMenu, BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { useMemo } from 'react';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { MenuBar } from './MenuBar.tsx';
import "./editor.scss";

const Editor = ({ value = '', onChange }: { value?: string; onChange?: (html: string) => void }) => {
  const editor = useEditor({
    extensions: [TextStyleKit, StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  });

  const providerValue = useMemo(() => ({ editor }), [editor]);

  return (
    <EditorContext.Provider value={providerValue}>
      <MenuBar editor={editor} />
      <EditorContent className="tiptap" editor={editor} />
    </EditorContext.Provider>
  );
  /*<FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
  <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>*/
}

export default Editor;