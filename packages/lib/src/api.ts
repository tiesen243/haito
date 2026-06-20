export interface ApiResponse<TData, TError = Record<string, unknown>> {
  message: string
  data: TData | null
  error: TError | null
}

export class Api {
  private readonly baseHeaders = {
    'Content-Type': 'application/json',
    'x-client': 'unknown',
  }

  constructor(
    private readonly baseUrl: string,
    headers?: Record<string, string>
  ) {
    if (headers)
      this.baseHeaders = {
        ...this.baseHeaders,
        ...headers,
      }
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
      if (!response.ok) return { message, data: null, error }
      return { message, data, error: null }
    } catch (error) {
      return {
        message: error instanceof Error ? error.message : 'Unknown error',
        data: null,
        error: null,
      }
    }
  }
}
