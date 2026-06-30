import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/main.ts'],
  shims: true,
  minify: true,
  dts: true,
})
