import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts'],
  deps: { neverBundle: ['@tanstack/react-query'] },
  shims: true,
  minify: true,
  dts: true,
})
