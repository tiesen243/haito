import { createId } from '@haito/lib/create-id'

interface DefaultEntityProps<TPk extends string | number> {
  id: TPk
  createdAt: Date
  updatedAt: Date
}

export abstract class EntityBase<TProps, TPk extends string | number = string> {
  public constructor(protected props: DefaultEntityProps<TPk> & TProps) {}

  static create<
    TProps,
    TPk extends string | number = string,
    TClass extends EntityBase<TProps, TPk> = EntityBase<TProps, TPk>,
  >(
    this: new (props: DefaultEntityProps<TPk> & TProps) => TClass,
    props: Partial<TProps & DefaultEntityProps<TPk>>
  ): TClass {
    const defaultProps = {
      id: createId() as TPk,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    }

    const entity = new this({
      ...defaultProps,
      ...props,
    } as DefaultEntityProps<TPk> & TProps)

    entity.validate()
    return entity
  }

  public clone(
    overrides: Partial<TProps & DefaultEntityProps<TPk>> = {}
  ): this {
    const clonedProps = structuredClone({
      ...this.props,
      ...Object.fromEntries(
        Object.entries(overrides).filter(([_, value]) => value !== undefined)
      ),
      updatedAt: overrides.updatedAt ?? new Date(),
    })

    const clonedEntity = new (this.constructor as new (
      props: Partial<TProps & DefaultEntityProps<TPk>>
    ) => this)(clonedProps)

    clonedEntity.validate()
    return clonedEntity
  }

  public mapToJson(): TProps & DefaultEntityProps<TPk> {
    return { ...this.props } as TProps & DefaultEntityProps<TPk>
  }

  protected abstract validate(): void

  get id(): TPk {
    return this.props.id
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }
  set updatedAt(value: Date) {
    this.props.updatedAt = value
  }
}
