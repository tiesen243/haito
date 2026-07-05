import * as Data from 'effect/Data'

export interface HttpErrorProps<TData, TError> {
  status: number
  message: string
  data?: TData | null
  error?: TError | null
}

export class HttpError<
  TData = unknown,
  TError = unknown,
> extends Data.TaggedError('shared/HttpError')<
  HttpErrorProps<TData, TError> & { timestamp: Date }
> {
  constructor(props: Partial<HttpErrorProps<TData, TError>>) {
    super({
      status: props.status ?? 200,
      message: props.message ?? 'Resource fetched successfully',
      data: props.data ?? null,
      error: props.error ?? null,
      timestamp: new Date(),
    })
  }

  public static redirect<TData, TError>(url: string) {
    return new HttpError<TData, TError>({ status: 302, message: url })
  }

  // --- 4xx Client Errors ---

  public static badRequest<TData, TError>(message: string, error?: TError) {
    return new HttpError<TData, TError>({ status: 400, message, error })
  }

  public static unauthorized<TData, TError>(message: string, error?: TError) {
    return new HttpError<TData, TError>({ status: 401, message, error })
  }

  public static forbidden<TData, TError>(message: string, error?: TError) {
    return new HttpError<TData, TError>({ status: 403, message, error })
  }

  public static notFound<TData, TError>(message: string, error?: TError) {
    return new HttpError<TData, TError>({ status: 404, message, error })
  }

  public static conflict<TData, TError>(message: string, error?: TError) {
    return new HttpError<TData, TError>({ status: 409, message, error })
  }

  // --- 5xx Server Errors ---

  public static internalServerError<TData, TError>(
    message: string,
    error?: TError
  ) {
    return new HttpError<TData, TError>({ status: 500, message, error })
  }

  public static notImplemented<TData, TError>(message: string, error?: TError) {
    return new HttpError<TData, TError>({ status: 501, message, error })
  }

  public toResponse() {
    const { _tag, status, message, ...rest } = this

    const headers = new Headers({ 'Content-Type': 'application/json' })
    if (status === 302) headers.set('Location', message)

    return Response.json({ status, message, ...rest }, { status, headers })
  }
}
