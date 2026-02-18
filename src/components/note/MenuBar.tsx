import type { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { Button, Flex } from "antd";
import { menuBarStateSelector } from './menuBarState'
import { useTranslate } from "@refinedev/core";

export const MenuBar = ({ editor }: { editor: Editor }) => {
  const t = useTranslate();
  const editorState = useEditorState({
    editor,
    selector: menuBarStateSelector,
  });

  const buttons = [
    {
      name: t('editor.bold', {}, 'Bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
      disabled: !editorState.canBold,
      className: editorState.isBold ? 'is-active' : '',
    },
    {
      name: t('editor.italic', {}, 'Italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editorState.canItalic,
      className: editorState.isItalic ? 'is-active' : '',
    },
    {
      name: t('editor.strike', {}, 'Strike'),
      onClick: () => editor.chain().focus().toggleStrike().run(),
      disabled: !editorState.canStrike,
      className: editorState.isStrike ? 'is-active' : '',
    },
    {
      name: t('editor.code', {}, 'Code'),
      onClick: () => editor.chain().focus().toggleCode().run(),
      disabled: !editorState.canCode,
      className: editorState.isCode ? 'is-active' : '',
    },
    {
      name: t('editor.clear.marks', {}, 'Clear marks'),
      onClick: () => editor.chain().focus().unsetAllMarks().run(),
    },
    {
      name: t('editor.clear.nodes', {}, 'Clear nodes'),
      onClick: () => editor.chain().focus().clearNodes().run(),
    },
    {
      name: t('editor.paragraph', {}, 'Paragraph'),
      onClick: () => editor.chain().focus().setParagraph().run(),
      disabled: !editorState.isParagraph,
    },
    {
      name: t('editor.h1', {}, 'H1'),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      className: editorState.isHeading1 ? 'is-active' : '',
    },
    {
      name: t('editor.h2', {}, 'H2'),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      className: editorState.isHeading2 ? 'is-active' : '',
    },
    {
      name: t('editor.h3', {}, 'H3'),
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      className: editorState.isHeading3 ? 'is-active' : '',
    },
    {
      name: t('editor.bullet.list', {}, 'Bullet list'),
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      className: editorState.isBulletList ? 'is-active' : '',
    },
    {
      name: t('editor.ordered.list', {}, 'Ordered list'),
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      className: editorState.isOrderedList ? 'is-active' : '',
    },
    {
      name: t('editor.code.block', {}, 'Code block'),
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      className: editorState.isCodeBlock ? 'is-active' : '',
    },
    {
      name: t('editor.blockquote', {}, 'Blockquote'),
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      className: editorState.isBlockquote ? 'is-active' : '',
    },
  ];

  return (
    <Flex>
      { buttons.map((item, index) =>
        <Button key={`button-${index}`} {...item}>
          { item.name }
        </Button>
      )}
    </Flex>
  )
}