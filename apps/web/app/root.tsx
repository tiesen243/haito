import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

import { Provider } from '@/components/provider'
import globalsCss from '@/globals.css?url'
import { createMetadata } from '@/lib/metadata'

import type { Route } from './+types/root'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Geist+Mono:ital,wght@0,100..900;1,100..900&family=Geist:ital,wght@0,100..900;1,100..900&display=swap',
  },
  { rel: 'stylesheet', href: globalsCss },
]

export const meta: Route.MetaFunction = () => createMetadata()

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='flex min-h-dvh flex-col font-sans antialiased'>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <Provider>
      <Outlet />
    </Provider>
  )
}
