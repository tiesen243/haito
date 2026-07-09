import * as z from 'zod'

import { userSchema } from '@/application/dto/user.dto'

export const passwordRegex = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
    'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character'
  )

export namespace WhoAmIDto {
  export const input = z.void()
  export type Input = z.infer<typeof input>

  export const output = userSchema
  export type Output = z.infer<typeof output>
}

export namespace LoginDto {
  export const input = z.object({
    email: z.email(),
    password: z.string().min(8),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    expiresAt: z.date(),
  })
  export type Output = z.infer<typeof output>
}

export namespace RegisterDto {
  export const input = z
    .object({
      username: z.string().min(4).max(24),
      email: z.email(),
      password: passwordRegex,
      confirmPassword: passwordRegex,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.string() })
  export type Output = z.infer<typeof output>
}

export namespace LogoutDto {
  export const input = z.object({
    refreshToken: z.string(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}

export namespace ChangePasswordDto {
  export const input = z
    .object({
      oldPassword: passwordRegex.optional(),
      newPassword: passwordRegex,
      confirmNewPassword: passwordRegex,
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'New passwords do not match',
      path: ['confirmNewPassword'],
    })
  export type Input = z.infer<typeof input>

  export const output = z.void()
  export type Output = z.infer<typeof output>
}

export namespace RefreshTokenDto {
  export const input = z.object({
    refreshToken: z.string(),
  })
  export type Input = z.infer<typeof input>

  export const { output } = LoginDto
  export type Output = z.infer<typeof output>
}
