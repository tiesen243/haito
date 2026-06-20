import core from '@haito/oxlint/core'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [core],
  overrides: [
    {
      files: ['**/*.repository.ts'],
      rules: {
        'typescript/no-empty-interface': 'off',
        'typescript/no-empty-object-type': 'off',
      },
    },
  ],
})
