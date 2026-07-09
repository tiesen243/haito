import { CreateNoteDto } from '@haito/api/dto/note'
import { Button } from '@haito/ui/button'
import { Editor, EditorInput, EditorPreview } from '@haito/ui/editor'
import {
  FieldSet,
  FieldLegend,
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from '@haito/ui/field'
import { useForm } from '@haito/ui/hooks/use-form'
import { Input } from '@haito/ui/input'
import { toast } from '@haito/ui/toast'
import { useQueryClient } from '@tanstack/react-query'

import { api } from '@/lib/api'

export default function NoteCreatePage() {
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: { title: '', content: '' },
    schema: CreateNoteDto.input,
    onSubmit: async (values) => {
      const { success, message } = await api.post<CreateNoteDto.Output>(
        '/notes/create',
        values
      )
      if (!success) return toast.add({ type: 'error', description: message })
      toast.add({ type: 'success', description: 'Note added successfully' })
      await queryClient.invalidateQueries({ queryKey: ['notes', 'me'] })
    },
  })

  return (
    <form
      id={form.formId}
      onSubmit={form.handleSubmit}
      className='container py-4'
    >
      <FieldSet disabled={form.state.isPending}>
        <FieldLegend>Create Note</FieldLegend>

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
              {form.state.isPending ? 'Saving...' : 'Create Note'}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
