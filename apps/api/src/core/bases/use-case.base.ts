export interface UseCaseBase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>
}
