import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

// Load environment variables from the .env file
config({ path: '.env' })

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.{js,ts}'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/tests/**']
    },
    testTimeout: 10000, // Timeout plus long pour les tests d'intégration
    tags: {
      integration: {
        include: ['tests/integration/**/*.test.{js,ts}'],
        timeout: 15000 // Timeout encore plus long pour les tests d'intégration
      },
      performance: {
        include: ['tests/performance/**/*.test.{js,ts}'],
        timeout: 20000 // Timeout plus long pour les tests de performance
      }
    },
    mockReset: true, // Réinitialiser les mocks entre les tests
  },
})
