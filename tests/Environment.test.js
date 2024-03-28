import App from '../src/App.js'

describe('Environment Variables', () => {
  it('should have PORT defined', () => {
    expect(process.env.PORT).toBeDefined()
  })

	it('should have Codes environment path defined', () => {
		expect(process.env.CODES).toBeDefined()
	})

	it('should have Posts environment path defined', () => {
		expect(process.env.POSTS).toBeDefined()
	})

	it('should have Portfolio environment path defined', () => {
		expect(process.env.PORTFOLIO).toBeDefined()
	})
})
