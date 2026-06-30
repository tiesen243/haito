import core from '@haito/oxlint/core'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [core],
  overrides: [
    {
      files: ['**/*.module.ts'],
      rules: {
        'unicorn/no-static-only-class': 'off',
        'typescript/no-extraneous-class': 'off',
      },
    },
  ],
})
