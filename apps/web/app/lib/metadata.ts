import type { MetaDescriptor } from 'react-router'

import { env } from '@/env'

interface Metadata {
  title?: string
  description?: string
  openGraph?: {
    images?: string[]
    url?: string
    type?: string
  }
}

export const createMetadata = (overrides: Metadata = {}): MetaDescriptor[] => {
  const siteName = 'Haito'

  const title = overrides.title ? `${overrides.title} | ${siteName}` : siteName
  const description =
    overrides.description ??
    'Haito is a modern web application built with Remix and React.'

  const images = overrides.openGraph?.images ?? []
  const url = overrides.openGraph?.url
    ? `${env.VITE_WEB_URL}${overrides.openGraph.url}`
    : env.VITE_WEB_URL

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:url', content: url },
    { name: 'og:type', content: overrides.openGraph?.type ?? 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    ...(images.length > 0
      ? images.flatMap((image) => [
          { name: 'og:image', content: image },
          { name: 'twitter:image', content: image },
        ])
      : []),
    { tagName: 'link', rel: 'canonical', href: url },
  ]
}
