import App from '../src/classes/App.js'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Home Route', () => {
	let response, responseBody

	beforeEach(async () => {
		response = await App.inject({ method: 'GET', url: '/' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns the expected response body', () => {
		expect(responseBody).toEqual([{ hello: 'world' }])
	})
})

describe('Posts Route', () => {
	let response, responseBody

	beforeEach(async () => {
		response = await App.inject({ method: 'GET', url: '/posts' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns an array', () => {
		expect(Array.isArray(responseBody)).toBeTruthy()
	})

	it('each item in the array has a title', () => {
		responseBody.forEach(item => {
			expect(item).toHaveProperty('title')
			expect(typeof item.title).toBe('string')
			expect(item.title).not.toBe('')
		})
	})
})

describe('Posts Single Item Route', () => {
	let response, responseBody

	beforeEach(async () => {
		response = await App.inject({ method: 'GET', url: '/posts/les-unites-css' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200 for a valid post', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns a post with a title', () => {
		expect(responseBody).toHaveProperty('title')
		expect(typeof responseBody.title).toBe('string')
		expect(responseBody.title).not.toBe('')
	})
})

describe('Portfolio Route', () => {
	let response, responseBody

	beforeEach(async () => {
		response = await App.inject({ method: 'GET', url: '/portfolio' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns an array', () => {
		expect(Array.isArray(responseBody)).toBeTruthy()
	})

	it('each item in the array has a title', () => {
		responseBody.forEach(item => {
			expect(item).toHaveProperty('title')
			expect(typeof item.title).toBe('string')
			expect(item.title).not.toBe('')
		})
	})
})

describe('Portfolio Single Item Route', () => {
	let response, responseBody

	beforeEach(async () => {
		response = await App.inject({ method: 'GET', url: '/portfolio/hit-the-road' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200 for a valid portfolio item', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns a portfolio item with a title', () => {
		expect(responseBody).toHaveProperty('title')
		expect(typeof responseBody.title).toBe('string')
		expect(responseBody.title).not.toBe('')
	})
})

describe('Codes Route', () => {
	let response, responseBody

	beforeEach(async () => {
		response = await App.inject({ method: 'GET', url: '/codes' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns an array', () => {
		expect(Array.isArray(responseBody)).toBeTruthy()
	})
})

describe('Codes Single Item Route', () => {
	let response

	beforeEach(async () => {
		response = await App.inject({ method: 'GET', url: '/codes/css' })
	})

	it('responds with status code 200 for a valid code', () => {
		expect(response.statusCode).toBe(200)
	})
})

describe('404 Routes', () => {
	it('should return a 404 error for a non-existent root route', async () => {
		const response = await App.inject({ method: 'GET', url: '/non-existent-route' })
		expect(response.statusCode).toBe(404)
	})

	it('should return a 404 error for a non-existent post route', async () => {
		const response = await App.inject({ method: 'GET', url: '/posts/non-existent-route' })
		expect(response.statusCode).toBe(404)
	})

	it('should return a 404 error for a non-existent portfolio route', async () => {
		const response = await App.inject({ method: 'GET', url: '/portfolio/non-existent-route' })
		expect(response.statusCode).toBe(404)
	})

	it('should return a 404 error for a non-existent code route', async () => {
		const response = await App.inject({ method: 'GET', url: '/codes/non-existent-route' })
		expect(response.statusCode).toBe(404)
	})
})

describe('RSS Route', () => {
	let response

	beforeEach(async () => {
		response = await App.inject({ method: 'GET', url: '/rss/blog.xml' })
	})

	it('responds with status code 200 for the RSS feed', () => {
		expect(response.statusCode).toBe(200)
	})
})
