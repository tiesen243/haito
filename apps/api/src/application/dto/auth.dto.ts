import * as z from 'zod'

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
  export const input = z.object({
    username: z.string().min(4).max(24),
    email: z.email(),
    password: z.string().min(8),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({ id: z.string() })
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
