import * as Context from 'effect/Context'
import * as Layer from 'effect/Layer'

import type { BaseProvider } from '@/infrastructure/oauth/providers/base.provider'

export class Config extends Context.Tag('Config')<Config, Config.Options>() {
  static create = (config: Config.Options) =>
    Layer.succeed(
      Config,
      this.mergeConfig(this.defaultConfig, config) as Config.Options
    )

  static defaultConfig = {
    auth: {
      secret: 'secret',
      algorithm: 'HS256',
      providers: [],
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        expiresThreshold: 60 * 60 * 24, // 1 day
        accessTokenExpiresIn: 60 * 15, // 15 minutes
      },
      cookieOptions: {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  } satisfies Omit<Config.Options, 'persistenceDriver'>

  private static isObject(item: unknown): item is Record<string, unknown> {
    return (item && typeof item === 'object' && !Array.isArray(item)) as boolean
  }

  private static mergeConfig(target: unknown, source: unknown) {
    if (!source) return target

    const output = structuredClone(target) as Record<string, unknown>
    if (this.isObject(target) && this.isObject(source)) {
      for (const key in Object.keys(source)) {
        if (this.isObject(source[key])) {
          if (key in target)
            output[key] = this.mergeConfig(target[key], source[key])
          else Object.assign(output, { [key]: source[key] })
        } else Object.assign(output, { [key]: source[key] })
      }
    }

    return output
  }
}

export namespace Config {
  export interface Options {
    persistenceDriver: 'in-memory' | 'drizzle'

    auth: {
      secret: string
      algorithm?: 'HS256' | 'HS384' | 'HS512'

      providers: BaseProvider[]

      session?: {
        expiresIn: number
        expiresThreshold: number
        accessTokenExpiresIn: number
      }

      cookieOptions?: {
        path: string
        httpOnly: true
        sameSite: 'lax' | 'strict' | 'none'
        secure: boolean
      }
    }
  }
}
