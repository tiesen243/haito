import * as React from 'react'

import { Typography } from '@/components/native/typography'
import { cn } from '@/utils'

function Label({
  className,
  ...props
}: React.ComponentProps<typeof Typography>) {
  return (
    <Typography
      data-slot='label'
      className={cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Label }
