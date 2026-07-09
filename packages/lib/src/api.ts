export interface ApiResponse<TData, TError = Record<string, unknown>> {
  success: boolean
  message: string
  data: TData | null
  error: TError | null
}

export class Api {
  private readonly baseHeaders = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'unknown',
  }

  private readonly onError?: (
    status: number,
    message: string
  ) => void | Promise<void>

  constructor(
    private readonly baseUrl: string,
    options?: {
      headers?: Record<string, string>
      onError?: (status: number, message: string) => void | Promise<void>
    }
  ) {
    if (options?.headers)
      this.baseHeaders = {
        ...this.baseHeaders,
        ...options.headers,
      }

    if (options?.onError) this.onError = options.onError
  }

  public get<TData, TError = Record<string, unknown>>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<TData, TError>> {
    return this.request<TData, TError>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  public post<TData, TError = Record<string, unknown>>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: RequestInit
  ): Promise<ApiResponse<TData, TError>> {
    return this.request<TData, TError>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  public put<TData, TError = Record<string, unknown>>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: RequestInit
  ): Promise<ApiResponse<TData, TError>> {
    return this.request<TData, TError>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  public patch<TData, TError = Record<string, unknown>>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: RequestInit
  ): Promise<ApiResponse<TData, TError>> {
    return this.request<TData, TError>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  public delete<TData, TError = Record<string, unknown>>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<TData, TError>> {
    return this.request<TData, TError>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  private async request<TData, TError = Record<string, unknown>>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<TData, TError>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...this.baseHeaders,
        ...options?.headers,
      },
    })

    try {
      const { message, data, error } = (await response.json()) as ApiResponse<
        TData,
        TError
      >
      if (!response.ok) {
        await this.onError?.(response.status, message)
        return { success: false, message, data: null, error }
      }
      return { success: true, message, data, error: null }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: null,
        error: null,
      }
    }
  }
}
