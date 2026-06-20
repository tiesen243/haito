import core from '@haito/oxlint/core'
import react from '@haito/oxlint/react'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [core, react],
  overrides: [
    {
      files: ['**/*.tsx'],
      rules: {
        'node/global-require': 'off',
        'unicorn/prefer-module': 'off',
        'typescript/no-empty-object-type': 'off',
        'typescript/no-empty-interface': 'off',
      },
    },
  ],
})
