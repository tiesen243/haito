import { Data } from 'effect'

interface ResponseProps {
  status: number
  message: string
  data?: unknown | null
  error?: unknown | null
}

export class ApiResponse extends Data.TaggedError('ApiResponse')<
  ResponseProps & { timestamp: Date }
> {
  constructor({ data = null, error = null, ...props }: ResponseProps) {
    super({ ...props, data, error, timestamp: new Date() })
  }

  static ok<TData>(message: string, data?: TData) {
    return new ApiResponse({ status: 200, message, data })
  }

  static created<TData>(message: string, data?: TData) {
    return new ApiResponse({ status: 201, message, data })
  }

  static redirect(message: string) {
    return new ApiResponse({ status: 302, message })
  }

  static badRequest<TError>(message: string, error?: TError) {
    return new ApiResponse({ status: 400, message, error })
  }

  static unauthorized<TError>(message: string, error?: TError) {
    return new ApiResponse({ status: 401, message, error })
  }

  static forbidden<TError>(message: string, error?: TError) {
    return new ApiResponse({ status: 403, message, error })
  }

  static notFound<TError>(message: string, error?: TError) {
    return new ApiResponse({ status: 404, message, error })
  }

  static internalServerError<TError>(message: string, error?: TError) {
    return new ApiResponse({ status: 500, message, error })
  }

  toResponse() {
    return Response.json(this, { status: this.status })
  }
}
