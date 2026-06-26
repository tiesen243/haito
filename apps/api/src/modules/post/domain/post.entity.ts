import { EntityBase } from '@/core/bases/entity.base'

export class PostEntity extends EntityBase<{
  title: string
  content: string
}> {
  protected override validate(): void {
    if (!this.props.title || this.props.title.trim() === '')
      throw new Error('Title is required')

    if (!this.props.content || this.props.content.trim() === '')
      throw new Error('Content is required')
  }

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
}
