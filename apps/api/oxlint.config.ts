import core from '@haito/oxlint/core'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [core],
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        'typescript/no-extraneous-class': [
          'error',
          { allowWithDecorator: true },
        ],
      },
    },
  ],
})
