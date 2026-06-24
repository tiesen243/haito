import { EntityBase } from '@/core/bases/entity.base'

export class PostEntity extends EntityBase<{
  title: string
  content: string
}> {
  get title(): string {
    return this.props.title
  }
  set title(value: string) {
    this.props.title = value
  }

  get content(): string {
    return this.props.content
  }
  set content(value: string) {
    this.props.content = value
  }

  protected override validate(): void {
    if (!this.props.title || this.props.title.length < 4)
      throw new Error('Title must be at least 4 characters long')

    if (!this.props.content || this.props.content.length < 10)
      throw new Error('Content must be at least 10 characters long')
  }
}
