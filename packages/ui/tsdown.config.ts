import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  deps: { neverBundle: ['react', 'react-native'] },
  copy: ['./src/tailwind.css'],
  shims: true,
  minify: true,
  dts: true,
})
