import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/server.ts'],
  shims: true,
  minify: true,
  dts: true,
})
