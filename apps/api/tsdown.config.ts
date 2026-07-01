import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/main.ts', 'src/application/dtos/*.dto.ts'],
  shims: true,
  minify: true,
  dts: true,
})
