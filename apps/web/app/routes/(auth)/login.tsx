import { LoginDto } from '@haito/api/dto/auth'
import { Button } from '@haito/ui/button'
import {
  Field,
  FieldDescription,
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

import { env } from '@/env'
import { api } from '@/lib/api'

export default function AuthLoginPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { email: '', password: '' },
    schema: LoginDto.input,
    onSubmit: async (data) => {
      const { success, message } = await api.post<LoginDto.Output>(
        '/auth/login',
        data
      )
      if (!success) return toast.add({ type: 'error', description: message })

      toast.add({ type: 'success', description: 'Login successful' })
      await queryClient.invalidateQueries({ queryKey: ['auth', 'whoami'] })
      navigate('/')
    },
  })

  return (
    <form id={form.formId} onSubmit={form.handleSubmit}>
      <FieldSet disabled={form.state.isPending}>
        <FieldLegend>Login</FieldLegend>
        <FieldDescription>
          Fill in your credentials to access your account.
        </FieldDescription>

        <FieldGroup>
          <form.Field
            name='email'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Email</FieldLabel>
                <Input
                  {...field}
                  type='email'
                  placeholder='haito@example.com'
                />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='password'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel htmlFor={field.id}>Password</FieldLabel>
                <Input {...field} type='password' placeholder='••••••••' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <Field>
            <Button type='submit'>Login</Button>
          </Field>

          <Field orientation='responsive'>
            <Button
              variant='outline'
              nativeButton={false}
              render={
                <a
                  href={`${env.VITE_API_URL}/api/auth/github?redirect_uri=${env.VITE_WEB_URL}/api/auth`}
                >
                  Login with GitHub
                </a>
              }
            />
            <Button
              variant='outline'
              nativeButton={false}
              render={
                <a
                  href={`${env.VITE_API_URL}/api/auth/google?redirect_uri=${env.VITE_WEB_URL}/api/auth`}
                >
                  Login with Google
                </a>
              }
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
