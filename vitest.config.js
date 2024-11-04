import { defineConfig } from 'vitest/config'
import { config } from 'dotenv'

// Load environment variables from the .env file
config({ path: '.env' })

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
})
