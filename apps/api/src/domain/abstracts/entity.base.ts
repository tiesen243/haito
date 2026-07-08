import { createId } from '@haito/lib/create-id'
import * as Schema from 'effect/Schema'

export const EntityBaseProps = Schema.Struct({
  id: Schema.String.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => createId())
  ),
  createdAt: Schema.DateFromSelf.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => new Date())
  ),
  updatedAt: Schema.DateFromSelf.pipe(
    Schema.propertySignature,
    Schema.withConstructorDefault(() => new Date())
  ),
})

export class EntityBase extends Schema.Class<EntityBase>(
  'domain/abstracts/EntityBase'
)(EntityBaseProps) {
  public clone(props: Partial<this>): this {
    const constructor = this.constructor as new (props: unknown) => this
    return new constructor({
      ...structuredClone(this),
      ...props,
      updatedAt: new Date(),
    })
  }

  public toJSON(): EntityBase.SimplifyProps<this> {
    // oxlint-disable-next-line typescript/no-explicit-any
    const schema = this.constructor as unknown as Schema.Schema<any, any>
    const cleanData = Schema.encodeSync(schema)(this)

    return cleanData as EntityBase.SimplifyProps<this>
  }
}

export namespace EntityBase {
  // oxlint-disable-next-line typescript/no-explicit-any
  type FunctionLike = (...args: any[]) => any

  export type SimplifyProps<T> = {
    [K in keyof T as T[K] extends FunctionLike ? never : K]: T[K]
  }
}
