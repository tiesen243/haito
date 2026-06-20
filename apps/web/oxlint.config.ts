import core from '@haito/oxlint/core'
import react from '@haito/oxlint/react'
import { defineConfig } from 'oxlint'

export default defineConfig({
  extends: [core, react],
})
