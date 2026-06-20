export interface ApiError {
  message: string
  details?: Record<string, unknown>
}

export interface ApiResponse<TData, TError = ApiError> {
  data: TData | null
  error: TError | null
}

export class Api {
  private readonly baseHeaders = {
    'Content-Type': 'application/json',
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

  public get<TData, TError = ApiError>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<TData, TError>> {
    return this.request<TData, TError>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  public post<TData, TError = ApiError>(
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

  public put<TData, TError = ApiError>(
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

  public delete<TData, TError = ApiError>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<TData, TError>> {
    return this.request<TData, TError>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  private async request<TData, TError = ApiError>(
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
      const json = await response.json()
      if (!response.ok) return { data: null, error: json as TError }
      return { data: json as TData, error: null }
    } catch (error) {
      return {
        data: null,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
        } as TError,
      }
    }
  }
}
