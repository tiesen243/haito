import type { ApiResponse } from '@/shared/api-response'

export interface UseCaseBase<TInput, TOutput> {
  execute(input: TInput): Promise<ApiResponse<TOutput>>
}
