import { createId } from '@/shared/lib/create-id'

export abstract class EntityBase<TProps, TPrimaryKey = string> {
  public id: TPrimaryKey = createId() as unknown as TPrimaryKey
  public createdAt: Date = new Date()
  public updatedAt: Date = new Date()

  constructor(props: Partial<EntityBase.Initializer<TProps>>) {
    Object.assign(this, props)
    this.validate()
  }

  public clone(overrides: Partial<TProps> = {}): this {
    const clonedProps = { ...overrides, updatedAt: new Date() }
    // oxlint-disable-next-line typescript/no-explicit-any
    return new (this.constructor as any)(clonedProps)
  }

  protected abstract validate(): void

  public mapToJson(): Required<EntityBase.Initializer<TProps>> {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    } as unknown as Required<EntityBase.Initializer<TProps>>
  }
}

export namespace EntityBase {
  export type Initializer<T> = Omit<T, 'clone' | 'validate' | 'mapToJson'>
}
