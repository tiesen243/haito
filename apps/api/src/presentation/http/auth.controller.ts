import Elysia from 'elysia'

import { LoginDto, RegisterDto } from '@/application/dto/auth.dto'
import usecase from '@/application/use-case/auth.use-case'

export const authController = new Elysia({
  name: 'presentation/http/auth.controller',
  prefix: '/api/auth',
  tags: ['auth'],
})

  .post('/login', ({ body }) => usecase.login(body), {
    body: LoginDto.input,
  })

  .post('/register', ({ body }) => usecase.register(body), {
    body: RegisterDto.input,
  })
