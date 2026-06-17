import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/app.ts', 'src/server.ts'],
  shims: true,
  minify: true,
  dts: true,
})
