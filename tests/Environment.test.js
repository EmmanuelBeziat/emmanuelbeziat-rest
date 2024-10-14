import { describe, it, expect } from 'vitest'

describe('Environment Variables', () => {
  it('should have PORT defined', () => {
    expect(process.env.VITE_PORT).toBeDefined()
  })

	it('should have Codes environment path defined', () => {
		expect(process.env.VITE_CODES).toBeDefined()
	})

	it('should have Posts environment path defined', () => {
		expect(process.env.VITE_POSTS).toBeDefined()
	})

	it('should have Portfolio environment path defined', () => {
		expect(process.env.VITE_PORTFOLIO).toBeDefined()
	})
})
