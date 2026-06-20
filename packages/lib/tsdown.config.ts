import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/*.ts'],
  shims: true,
  minify: true,
  dts: true,
})
