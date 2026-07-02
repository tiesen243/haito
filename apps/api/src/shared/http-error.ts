import * as Data from 'effect/Data'

interface HttpErrorProps<TError> {
  status: number
  message: string
  data?: unknown | null
  error?: TError | null
}

export class HttpError<TError = unknown> extends Data.TaggedError('HttpError')<
  HttpErrorProps<TError> & { timestamp: Date }
> {
  constructor({
    status = 200,
    message = 'Resource fetched successfully',
    data = null,
    error = null,
  }: Partial<HttpErrorProps<TError>>) {
    super({ status, message, data, error, timestamp: new Date() })
  }

  static redirect(url: string) {
    return new HttpError({ status: 302, message: url })
  }

  // --- 4xx Client Errors ---

  static badRequest<TError>(message: string, error?: TError) {
    return new HttpError({ status: 400, message, error })
  }

  static unauthorized<TError>(message: string, error?: TError) {
    return new HttpError({ status: 401, message, error })
  }

  static forbidden<TError>(message: string, error?: TError) {
    return new HttpError({ status: 403, message, error })
  }

  static notFound<TError>(message: string, error?: TError) {
    return new HttpError({ status: 404, message, error })
  }

  static conflict<TError>(message: string, error?: TError) {
    return new HttpError({ status: 409, message, error })
  }

  static tooManyRequests<TError>(message: string, error?: TError) {
    return new HttpError({ status: 429, message, error })
  }

  // --- 5xx Server Errors ---

  static internalServerError<TError>(message: string, error?: TError) {
    return new HttpError({ status: 500, message, error })
  }

  static notImplemented<TError>(message: string, error?: TError) {
    return new HttpError({ status: 501, message, error })
  }

  toResponse() {
    const { _tag, status, message, ...rest } = this

    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    if (status === 302) headers.set('Location', message)

    return Response.json({ status, message, ...rest }, { status, headers })
  }
}
