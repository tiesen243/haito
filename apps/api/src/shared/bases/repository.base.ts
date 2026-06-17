export interface RepositoryBase<
  TEntity extends { id: TPrimaryKey },
  TDatabase = unknown,
  TPrimaryKey = TEntity extends { id: infer P } ? P : never,
> {
  find(criteria?: Partial<TEntity>[], tx?: TDatabase): Promise<TEntity[]>

  one(id: TPrimaryKey, tx?: TDatabase): Promise<TEntity | null>

  insert(entity: TEntity, tx?: TDatabase): Promise<TPrimaryKey>

  update(entity: TEntity, tx?: TDatabase): Promise<TPrimaryKey>

  delete(id: TPrimaryKey, tx?: TDatabase): Promise<void>
}
