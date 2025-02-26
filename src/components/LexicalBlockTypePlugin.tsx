'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { 
  $createParagraphNode, 
  $getSelection, 
  $isRangeSelection,
  $createTextNode,
  $getNodeByKey,
  $getRoot,
  $createRangeSelection,
  $setSelection
} from 'lexical'
import { $createHeadingNode } from '@lexical/rich-text'
import { 
  $createListNode,
  $createListItemNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  ListType
} from '@lexical/list'
import { $createCodeNode } from '@lexical/code'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FaPlus } from 'react-icons/fa'
import { 
  BsTextParagraph, 
  BsCode, 
  BsListUl, 
  BsListOl,
  BsCardHeading
} from 'react-icons/bs'

export default function LexicalBlockTypePlugin() {
  const [editor] = useLexicalComposerContext()
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const updateMenuPosition = useCallback(() => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        x: buttonRect.left - 180, // Position menu to the left of the button
        y: buttonRect.top + window.scrollY // Align with button vertically
      })
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const createListCommand = (listType: ListType) => {
        editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor
          const anchorNode = anchor.getNode()
          const parentNode = anchorNode.getParent()
          
          // Create list node
          const listNode = $createListNode(listType)
          const listItemNode = $createListItemNode()
          listNode.append(listItemNode)
          
          // Insert after current block
          if (parentNode) {
            parentNode.insertAfter(listNode)
            
            // Create and set new selection
            const newSelection = $createRangeSelection()
            newSelection.anchor.set(listItemNode.getKey(), 0, 'element')
            newSelection.focus.set(listItemNode.getKey(), 0, 'element')
            $setSelection(newSelection)
          }
        }
      })
      setShowMenu(false)
  }


  const blockTypes = [
    {
      label: 'Text',
      icon: BsTextParagraph,
      command: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const paragraphNode = $createParagraphNode()
            selection.insertNodes([paragraphNode])
          }
        })
        setShowMenu(false)
      }
    },
    {
      label: 'Heading 1',
      icon: BsCardHeading,
      command: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const headingNode = $createHeadingNode('h1')
            selection.insertNodes([headingNode])
          }
        })
        setShowMenu(false)
      }
    },
    {
      label: 'Bullet List',
      icon: BsListUl,
      command: () => {
        createListCommand('bullet')
      }
    },
    {
      label: 'Numbered List',
      icon: BsListOl,
      command: () => {
        createListCommand('number')
      }
    },
    {
      label: 'Code Block',
      icon: BsCode,
      command: () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const codeNode = $createCodeNode()
            selection.insertNodes([codeNode])
          }
        })
        setShowMenu(false)
      }
    }
  ]

  return (
    <>
      <button
        ref={buttonRef}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 
          text-white/40 hover:text-white/90 transition-colors"
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(!showMenu)
          updateMenuPosition()
        }}
      >
        <FaPlus size={12} />
      </button>

      {showMenu && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
          }}
          className="z-50 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg 
            shadow-2xl p-1 min-w-[180px]"
        >
          {blockTypes.map((type, index) => (
            <button
              key={index}
              onClick={type.command}
              className="flex items-center gap-2 w-full p-2 text-sm text-white/70 
                hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <type.icon size={15} />
              {type.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  )
} 