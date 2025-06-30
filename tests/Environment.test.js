import { test, expect, describe } from 'vitest'

describe('Environment Variables', () => {
  test('should have PORT defined', () => {
    expect(process.env.PORT).toBeDefined()
  })

  test('should have Codes environment path defined', () => {
    expect(process.env.CODES).toBeDefined()
  })

  test('should have Posts environment path defined', () => {
    expect(process.env.POSTS).toBeDefined()
  })

  test('should have Portfolio environment path defined', () => {
    expect(process.env.PORTFOLIO).toBeDefined()
  })
})
