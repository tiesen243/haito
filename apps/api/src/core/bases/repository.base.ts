export abstract class RepositoryBase<TEntity, TPk> {
  abstract find(): Promise<TEntity[]>

  abstract findOne(id: TPk): Promise<TEntity | null>

  abstract save(entity: TEntity): Promise<void>

  abstract delete(id: TPk): Promise<void>
}
