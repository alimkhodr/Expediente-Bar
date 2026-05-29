import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['app/**/*.spec.ts'],
    environment: 'node'
  }
})
