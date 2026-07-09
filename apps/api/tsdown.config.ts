import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/main.ts', 'src/application/dto/*.dto.ts'],
  shims: true,
  minify: true,
  dts: true,
})
