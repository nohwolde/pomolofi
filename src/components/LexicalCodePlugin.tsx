import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isCodeNode } from '@lexical/code'
import { $getSelection, COMMAND_PRIORITY_LOW, PASTE_COMMAND } from 'lexical'
import { useEffect } from 'react'

export function LexicalCodePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        const selection = window.getSelection()
        if (!selection) return false

        const anchorNode = selection.anchorNode
        if (!anchorNode) return false

        // Check if we're pasting into a code block
        let element = anchorNode.parentElement
        while (element) {
          console.log("node", element.tagName)
          if (element.tagName === 'CODE') {
            // Get plain text from clipboard
            const text = event instanceof ClipboardEvent 
              ? event.clipboardData?.getData('text/plain')
              : ''
            
            if (text) {
              // Insert as plain text
              editor.update(() => {
                const selection = $getSelection()
                if (selection) {
                  selection.insertText(text)
                }
              })
              return true // Prevent default paste behavior
            }
          }
          element = element.parentElement
        }
        return false // Allow default paste behavior outside code blocks
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor])

  return null
}