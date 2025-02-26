'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { useCallback, useEffect, useState } from 'react'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaUndo,
  FaRedo,
} from 'react-icons/fa'

const LowPriority = 1

export default function LexicalToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar()
          return false
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        LowPriority,
      ),
    )
  }, [editor, $updateToolbar])

  const buttonBaseClass = "p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
  const activeButtonClass = "bg-white/20 text-white"

  return (
    <div className="flex items-center gap-1 p-1 mb-2 border-b border-white/10">
      <button
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        className={`${buttonBaseClass} ${!canUndo && 'opacity-50 cursor-not-allowed'}`}
        title="Undo"
      >
        <FaUndo size={14} />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        className={`${buttonBaseClass} ${!canRedo && 'opacity-50 cursor-not-allowed'}`}
        title="Redo"
      >
        <FaRedo size={14} />
      </button>

      <div className="w-px h-4 bg-white/10 mx-1" />

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={`${buttonBaseClass} ${isBold ? activeButtonClass : ''}`}
        title="Bold"
      >
        <FaBold size={14} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={`${buttonBaseClass} ${isItalic ? activeButtonClass : ''}`}
        title="Italic"
      >
        <FaItalic size={14} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={`${buttonBaseClass} ${isUnderline ? activeButtonClass : ''}`}
        title="Underline"
      >
        <FaUnderline size={14} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        className={`${buttonBaseClass} ${isStrikethrough ? activeButtonClass : ''}`}
        title="Strikethrough"
      >
        <FaStrikethrough size={14} />
      </button>

      <div className="w-px h-4 bg-white/10 mx-1" />

      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        className={buttonBaseClass}
        title="Align Left"
      >
        <FaAlignLeft size={14} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        className={buttonBaseClass}
        title="Align Center"
      >
        <FaAlignCenter size={14} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        className={buttonBaseClass}
        title="Align Right"
      >
        <FaAlignRight size={14} />
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        className={buttonBaseClass}
        title="Justify"
      >
        <FaAlignJustify size={14} />
      </button>
    </div>
  )
} 