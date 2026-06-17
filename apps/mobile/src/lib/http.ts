import { getTokens } from '@/lib/tokens'

interface HttpReturns<TData, TError = Record<string, unknown>> {
  message: string
  data: TData | null
  error: TError | null
}

export class Http {
  private static readonly baseUrl: string = 'http://localhost:3000/api'
  private static readonly headers: HeadersInit_ = {
    'Content-Type': 'application/json',
    'x-client': 'react-native',
  }

  public static get<TData>(endpoint: string): Promise<HttpReturns<TData>> {
    return Http.request<TData>(endpoint, {
      method: 'GET',
      headers: Http.headers,
    })
  }

  public static post<TData, TBody>(
    endpoint: string,
    body: TBody
  ): Promise<HttpReturns<TData>> {
    return Http.request<TData>(endpoint, {
      method: 'POST',
      headers: Http.headers,
      body: JSON.stringify(body),
    })
  }

  public static put<TData, TBody>(
    endpoint: string,
    body: TBody
  ): Promise<HttpReturns<TData>> {
    return Http.request<TData>(endpoint, {
      method: 'PUT',
      headers: Http.headers,
      body: JSON.stringify(body),
    })
  }

  public static delete<TData>(endpoint: string): Promise<HttpReturns<TData>> {
    return Http.request<TData>(endpoint, {
      method: 'DELETE',
      headers: Http.headers,
    })
  }

  private static async request<TData>(
    endpoint: string,
    options?: RequestInit
  ): Promise<HttpReturns<TData>> {
    const headers = new Headers(options?.headers)

    const { accessToken } = await getTokens()
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

    const response = await fetch(`${Http.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    try {
      const json = (await response.json()) as HttpReturns<TData>
      if (!response.ok)
        return { message: json.message, data: null, error: json.error }
      return { message: json.message, data: json.data, error: null }
    } catch (error) {
      let message = 'An unknown error occurred'
      if (error instanceof Error) message = error.message
      return { message, data: null, error: null }
    }
  }
}
