import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/models/*.ts'],
  shims: true,
  minify: true,
  dts: true,
})
