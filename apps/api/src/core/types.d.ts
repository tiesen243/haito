// oxlint-disable typescript/no-explicit-any

export type AnyClass<T = any> = new (...args: any[]) => T

export type AnyFunction<T = any> = (...args: any[]) => T
