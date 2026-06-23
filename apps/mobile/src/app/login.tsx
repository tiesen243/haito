import { Button } from '@haito/ui/button'
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
import z from 'zod'

import { Container } from '@/components/container'

export default function LoginScreen() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    schema: z.object({
      email: z.email('Invalid email address'),
      password: z
        .string()
        .min(6, 'Password must be at least 6 characters long'),
    }),
    onSubmit: (values) => {
      console.log('Form submitted with values:', values)
    },
  })

  return (
    <Container id={form.formId}>
      <FieldSet>
        <FieldLegend>Login</FieldLegend>

        <FieldGroup>
          <form.Field
            name='email'
            render={({ field: { onChange, ...field }, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  keyboardType='email-address'
                  placeholder='Enter your email'
                  onChangeText={onChange}
                  {...field}
                />
                <FieldError errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='password'
            render={({ field: { onChange, ...field }, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel>Password</FieldLabel>
                <Input
                  secureTextEntry
                  placeholder='Enter your password'
                  onChangeText={onChange}
                  {...field}
                />
                <FieldError errors={meta.errors} />
              </Field>
            )}
          />

          <Field>
            <Button onPress={() => form.handleSubmit()}>Login</Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Container>
  )
}
