import { EntityBase } from '@/shared/bases/entity.base'

export class PostEntity extends EntityBase<PostEntity> {
  declare public title: string

  protected override validate(): void {
    if (!this.title || this.title.trim() === '' || this.title.length < 4)
      throw new Error(
        'Title is required and must be at least 4 characters long'
      )
  }

  public override mapToJson(): Required<EntityBase.Initializer<PostEntity>> {
    return {
      ...super.mapToJson(),
      title: this.title,
    }
  }
}
