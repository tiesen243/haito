'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { marked } from 'marked'
import * as React from 'react'

import { cn } from '@/utils'

interface EditorContextValue {
  value: string
  onValueChange: (value: string) => unknown
}

const EditorContext = React.createContext<EditorContextValue | null>(null)

const useEditor = () => {
  const context = React.use(EditorContext)
  if (!context)
    throw new Error('useEditor must be used within an EditorProvider')
  return context
}

const parseMarkdown = (content: string) => {
  try {
    return marked(content, { gfm: true, breaks: true })
  } catch (error) {
    if (process.env.NODE_ENV === 'development')
      console.error('Error parsing content:', error)
    return 'Error parsing content'
  }
}

function Editor({
  className,
  value,
  onValueChange,
  children,
  ...props
}: React.ComponentProps<'div'> & EditorContextValue) {
  const contextValue = React.useMemo(
    () => ({ value, onValueChange }),
    [value, onValueChange]
  )

  return (
    <EditorContext value={contextValue}>
      <TabsPrimitive.Root
        data-slot='editor'
        className={cn(
          'group/editor border-input dark:bg-input/30 flex min-w-0 flex-col rounded-md border bg-transparent',
          'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-3',
          'data-invalid:divide-destructive data-invalid:border-destructive data-invalid:ring-destructive/20 dark:data-invalid:divide-destructive/50 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40 data-invalid:ring-3',
          className
        )}
        {...props}
      >
        <TabsPrimitive.List
          data-slot='editor-tabs'
          className='inline-flex w-full items-center justify-start gap-2 border-b bg-transparent p-2 text-sm'
        >
          <TabsPrimitive.Tab
            value='editor'
            className='text-muted-foreground data-active:text-foreground bg-transparent'
          >
            Editor
          </TabsPrimitive.Tab>
          <TabsPrimitive.Tab
            value='preview'
            className='text-muted-foreground data-active:text-foreground bg-transparent'
          >
            Preview
          </TabsPrimitive.Tab>
        </TabsPrimitive.List>

        {children}
      </TabsPrimitive.Root>
    </EditorContext>
  )
}

function EditorInput({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  const { value, onValueChange } = useEditor()

  return (
    <TabsPrimitive.Panel
      value='editor'
      data-slot='editor-textarea'
      className={cn('m-0 p-0', className)}
    >
      <textarea
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className='flex field-sizing-content h-full min-h-20 w-full px-2.5 py-2 outline-none'
        aria-label='Editor input'
        {...props}
      />
    </TabsPrimitive.Panel>
  )
}

function RenderMarkdown({
  content,
  className,
  children: _,
  ...props
}: React.ComponentProps<'div'> & { content: string }) {
  const parsedContent = React.useMemo(() => parseMarkdown(content), [content])

  return (
    <div
      data-slot='markdown-renderer'
      className={cn(
        '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-pretty',
        '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-pretty',
        '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-pretty',
        '[&_p]:leading-7 [&_p]:text-balance',
        '[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6',
        '[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_blockquote]:italic',
        '[&_code]:border-accent [&_code]:bg-accent/40 [&_code]:text-accent-foreground [&_code]:relative [&_code]:w-fit [&_code]:rounded-sm [&_code]:border [&_code]:px-[0.3rem] [&_code]:py-[0.2rem] [&_code]:font-mono [&_code]:text-sm [&_code]:font-medium',
        '[&_table]:my-6 [&_table]:w-full [&_table]:overflow-y-auto',
        '[&_tr]:m-0 [&_tr]:border-t [&_tr]:p-0',
        '[&_th]:bg-muted [&_th]:border [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:font-bold',
        '[&_td]:border [&_td]:px-4 [&_td]:py-2 [&_td]:text-left',
        className
      )}
      dangerouslySetInnerHTML={{ __html: parsedContent }}
      {...props}
    />
  )
}

function EditorPreview({ className, ...props }: React.ComponentProps<'div'>) {
  const { value } = useEditor()

  return (
    <TabsPrimitive.Panel
      value='preview'
      data-slot='editor-preview'
      className={cn('min-h-20 px-2.5 py-2', className)}
      {...props}
    >
      <RenderMarkdown content={value} />
    </TabsPrimitive.Panel>
  )
}

export { Editor, EditorInput, EditorPreview, RenderMarkdown }
