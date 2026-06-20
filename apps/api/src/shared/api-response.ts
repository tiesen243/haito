import { EntityBase } from '@/shared/bases/entity.base'

// oxlint-disable-next-line unicorn/custom-error-definition
export class ApiResponse<
  TData,
  TError = Record<string, unknown>,
> extends Error {
  constructor(
    public status: number,
    message: string,
    public data: TData,
    public error: TError | null = null,
    public timestamp: string = new Date().toISOString()
  ) {
    super(message)
    this.name = 'ApiResponse'
  }

  public toResponse() {
    if (
      this.status === 302 &&
      this.data &&
      typeof this.data === 'object' &&
      'url' in this.data &&
      typeof this.data.url === 'string'
    )
      return Response.redirect(this.data.url, this.status)

    const data =
      this.data instanceof EntityBase ? this.data.mapToJson() : this.data
    return Response.json(
      {
        status: this.status,
        message: this.message,
        data: this.status < 400 ? data : null,
        error: this.status >= 400 ? this.error : null,
        timestamp: this.timestamp,
      },
      { status: this.status }
    )
  }

  static ok<TData>(message: string, data: TData) {
    return new ApiResponse(200, message, data)
  }

  static created<TData>(message: string, data: TData) {
    return new ApiResponse(201, message, data)
  }

  static redirect(message: string, url: string) {
    return new ApiResponse(302, message, { url })
  }

  static badRequest<TError>(message: string, error?: TError) {
    return new ApiResponse(400, message, null, error)
  }

  static notFound<TError>(message: string, error?: TError) {
    return new ApiResponse(404, message, null, error)
  }

  static internalServerError<TError>(message: string, error?: TError) {
    return new ApiResponse(500, message, null, error)
  }
}
