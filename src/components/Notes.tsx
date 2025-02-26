'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { CodeNode, CodeHighlightNode } from '@lexical/code'
import { ListItemNode, ListNode } from '@lexical/list'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { useState, useEffect } from 'react'
import LexicalToolbarPlugin from './LexicalToolbarPlugin'
import { EditorState } from 'lexical'
import LexicalBlockTypePlugin from './LexicalBlockTypePlugin'
import { LexicalCodePlugin } from './LexicalCodePlugin'

// Separate plugin component
function OnChangePlugin({ onChange }: { onChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext()
  
  useEffect(() => {
    console.log('OnChangePlugin mounted') // Debug
    
    return editor.registerUpdateListener(({ editorState }) => {
      console.log('Editor updated') // Debug
      
      // Get the latest editor state
      editorState.read(() => {
        const json = editorState.toJSON()
        console.log('Editor content:', json) // Debug
        onChange(JSON.stringify(json))
      })
    })
  }, [editor, onChange])
  
  return null
}

const theme = {
  paragraph: 'mb-2 text-white/90',
  heading: {
    h1: 'text-3xl font-bold mb-4 text-white/90',
    h2: 'text-2xl font-bold mb-3 text-white/90',
    h3: 'text-xl font-bold mb-2 text-white/90',
  },
  list: {
    ul: 'list-disc ml-4 mb-2 text-white/90',
    ol: 'list-decimal ml-4 mb-2 text-white/90',
  },
  quote: 'border-l-4 border-white/20 pl-4 my-4 italic text-white/70',
  code: 'block mb-4 relative bg-white/5 font-mono text-sm text-white/90 p-4 mt-6 rounded-lg border border-white/10 shadow-lg before:content-["code"] before:absolute before:-top-0.5 before:left-0 before:px-2  before:text-xs before:bg-black/50 before:text-white/50 before:rounded before:z-10 whitespace-pre-wrap break-words overflow-x-auto',
  codeHighlight: {
    atrule: 'rgb(249, 168, 212)',
    attr: 'rgb(134, 239, 172)',
    boolean: 'rgb(249, 168, 212)',
    builtin: 'rgb(134, 239, 172)',
    cdata: 'rgb(192, 192, 192)',
    char: 'rgb(249, 168, 212)',
    class: 'rgb(134, 239, 172)',
    'class-name': 'rgb(134, 239, 172)',
    comment: 'rgb(148, 163, 184)',
    constant: 'rgb(249, 168, 212)',
    deleted: 'rgb(252, 165, 165)',
    doctype: 'rgb(148, 163, 184)',
    entity: 'rgb(252, 165, 165)',
    function: 'rgb(134, 239, 172)',
    important: 'rgb(249, 168, 212)',
    inserted: 'rgb(134, 239, 172)',
    keyword: 'rgb(249, 168, 212)',
    namespace: 'rgb(252, 165, 165)',
    number: 'rgb(249, 168, 212)',
    operator: 'rgb(249, 168, 212)',
    prolog: 'rgb(148, 163, 184)',
    property: 'rgb(134, 239, 172)',
    punctuation: 'rgb(148, 163, 184)',
    regex: 'rgb(134, 239, 172)',
    selector: 'rgb(252, 165, 165)',
    string: 'rgb(134, 239, 172)',
    symbol: 'rgb(249, 168, 212)',
    tag: 'rgb(252, 165, 165)',
    url: 'rgb(252, 165, 165)',
    variable: 'rgb(252, 165, 165)',
  },
}

interface NotesProps {
  isOpen: boolean
  onClose: () => void
}

export default function Notes({ isOpen, onClose }: NotesProps) {
  const [content, setContent] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isFirstLoad = isMounted ? !localStorage.getItem('notes-content') : true

  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError: (error: Error) => console.error(error),
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      QuoteNode,
    ],
    editorState: !isFirstLoad ? content : undefined,
  }

  useEffect(() => {
    if (!isFirstLoad) {
      const savedContent = localStorage.getItem('notes-content')
      if (savedContent) {
        try {
          setContent(savedContent)
        } catch (error) {
          console.error('Error loading notes:', error)
        }
      }
    }
  }, [isFirstLoad])

  const handleChange = (serializedState: string) => {
    console.log('handleChange called with:', serializedState)
    setContent(serializedState)
    localStorage.setItem('notes-content', serializedState)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed right-0 top-0 bottom-0 w-[50%] bg-black/30 backdrop-blur-xl 
            border-l border-white/10 shadow-2xl z-50"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-light text-white">Notes</h2>
              <button onClick={onClose} className="text-white/60 hover:text-white/90 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto p-6">
              <LexicalComposer initialConfig={initialConfig}>
                <div className="editor-container">
                  <LexicalToolbarPlugin />
                  <div className="editor-inner bg-white/5 rounded-xl relative">
                    <LexicalBlockTypePlugin />
                    <RichTextPlugin
                      contentEditable={
                        <ContentEditable 
                          className="outline-none min-h-[500px] p-4 pl-10 text-white/90"
                        />
                      }
                      placeholder={
                        <div className="absolute top-[52px] left-[40px] text-white/30 pointer-events-none">
                          Start typing your notes...
                        </div>
                      }
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LexicalCodePlugin />
                    <OnChangePlugin onChange={handleChange} />
                  </div>
                </div>
              </LexicalComposer>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}