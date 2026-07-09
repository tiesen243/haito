import type { OneNoteDto } from '@haito/api/dto/note'

import { UpdateNoteDto } from '@haito/api/dto/note'
import { Button } from '@haito/ui/button'
import { Editor, EditorInput, EditorPreview } from '@haito/ui/editor'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@haito/ui/field'
import { useForm } from '@haito/ui/hooks/use-form'
import { Input } from '@haito/ui/input'
import { toast } from '@haito/ui/toast'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { api } from '@/lib/api'
import { useMeNote } from '@/routes/(main)/me/_lib/use-me-note'

import type { Route } from './+types/[id].edit'

export default function MeNoteEditPage({ params }: Route.ComponentProps) {
  const { data, isLoading } = useMeNote(params.id ?? '')

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Note not found</div>

  return (
    <main className='container py-4'>
      <NoteEditForm note={data} />
    </main>
  )
}

const NoteEditForm: React.FC<{
  note: OneNoteDto.Output
}> = ({ note }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { title: note.title, content: note.content },
    schema: UpdateNoteDto.input,
    onSubmit: async (values) => {
      const { success, message } = await api.patch(
        `/notes/update/${note.id}`,
        values
      )
      if (!success) return toast.add({ type: 'error', description: message })
      toast.add({ type: 'success', description: 'Note updated successfully' })
      await queryClient.invalidateQueries({ queryKey: ['notes', note.id] })
      navigate(`/me/${note.id}`)
    },
  })

  return (
    <form id={form.formId} onSubmit={form.handleSubmit}>
      <FieldSet disabled={form.state.isPending}>
        <FieldLegend>Edit Note: {note.title ?? 'Untitled Note'}</FieldLegend>

        <FieldGroup>
          <form.Field
            name='title'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Title</FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  placeholder='Enter note title'
                />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='content'
            render={({ field: { value, onChange, ...field }, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Content</FieldLabel>

                <Editor value={value} onValueChange={onChange}>
                  <EditorInput {...field} />
                  <EditorPreview />
                </Editor>
              </Field>
            )}
          />

          <Field>
            <Button type='submit'>
              {form.state.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
