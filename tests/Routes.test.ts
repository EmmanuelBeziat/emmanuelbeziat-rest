import App from '../src/classes/App'
import { describe, it, expect, beforeAll } from 'vitest'
import { LightMyRequestResponse } from 'fastify'

describe('Home Route', () => {
	let response: LightMyRequestResponse, responseBody: any

	beforeAll(async () => {
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
	let response: LightMyRequestResponse, responseBody: any[]

	beforeAll(async () => {
		response = await App.inject({ method: 'GET', url: '/posts' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns all fixture posts', () => {
		expect(Array.isArray(responseBody)).toBe(true)
		expect(responseBody).toHaveLength(3)
	})

	it('orders posts by date, most recent first', () => {
		expect(responseBody.map(post => post.slug)).toEqual(['second-post', 'third-post', 'first-post'])
	})

	it('strips the date prefix from the slug', () => {
		responseBody.forEach(post => expect(post.slug).not.toMatch(/^\d{4}-\d{2}-\d{2}-/))
	})

	it('passes the publish flag through (including false)', () => {
		const third = responseBody.find(post => post.slug === 'third-post')
		expect(third.publish).toBe(false)
	})
})

describe('Posts Single Item Route', () => {
	let response: LightMyRequestResponse, responseBody: any

	beforeAll(async () => {
		response = await App.inject({ method: 'GET', url: '/posts/second-post' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns the requested post with rendered markup', () => {
		expect(responseBody.title).toBe('Second Post')
		expect(responseBody.slug).toBe('second-post')
		expect(responseBody.markup).toContain('<h1')
	})
})

describe('Portfolio Route', () => {
	let response: LightMyRequestResponse, responseBody: any[]

	beforeAll(async () => {
		response = await App.inject({ method: 'GET', url: '/portfolio' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200', () => {
		expect(response.statusCode).toBe(200)
	})

	it('orders portfolio items by date, most recent first', () => {
		expect(responseBody.map(item => item.slug)).toEqual(['project-beta', 'project-alpha'])
	})
})

describe('Portfolio Single Item Route', () => {
	let response: LightMyRequestResponse, responseBody: any

	beforeAll(async () => {
		response = await App.inject({ method: 'GET', url: '/portfolio/project-alpha' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns the portfolio-specific fields', () => {
		expect(responseBody.title).toBe('Project Alpha')
		expect(responseBody.color).toBe('#ff0000')
		expect(responseBody.clients).toEqual(['Client A'])
	})
})

describe('Codes Route', () => {
	let response: LightMyRequestResponse, responseBody: any[]

	beforeAll(async () => {
		response = await App.inject({ method: 'GET', url: '/codes' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns all fixture codes with the "code-" prefix stripped', () => {
		expect(responseBody).toHaveLength(2)
		expect(responseBody.map(code => code.slug).sort()).toEqual(['css', 'javascript'])
	})
})

describe('Codes Single Item Route', () => {
	let response: LightMyRequestResponse, responseBody: any

	beforeAll(async () => {
		response = await App.inject({ method: 'GET', url: '/codes/css' })
		responseBody = JSON.parse(response.body)
	})

	it('responds with status code 200 for a valid code', () => {
		expect(response.statusCode).toBe(200)
	})

	it('returns rendered markup for the snippet', () => {
		expect(responseBody.slug).toBe('css')
		expect(responseBody.markup).toContain('language-css')
	})
})

describe('404 Routes', () => {
	it('returns 404 for a non-existent root route', async () => {
		const response = await App.inject({ method: 'GET', url: '/non-existent-route' })
		expect(response.statusCode).toBe(404)
	})

	it.each(['/posts/no-such-post', '/portfolio/no-such-item', '/codes/no-such-code'])(
		'returns a structured 404 body for %s',
		async url => {
			const response = await App.inject({ method: 'GET', url })
			expect(response.statusCode).toBe(404)
			const body = JSON.parse(response.body)
			expect(body).toMatchObject({ statusCode: 404, error: 'Not Found' })
			expect(body).toHaveProperty('message')
		}
	)
})

describe('Slug Validation', () => {
	it('rejects a malformed post slug with 400', async () => {
		const response = await App.inject({ method: 'GET', url: '/posts/Invalid_Slug!' })
		expect(response.statusCode).toBe(400)
	})

	it('rejects a malformed code slug with 400', async () => {
		const response = await App.inject({ method: 'GET', url: '/codes/UPPER_CASE' })
		expect(response.statusCode).toBe(400)
	})
})

describe('Unsupported HTTP Methods', () => {
	it.each([
		{ method: 'POST', url: '/posts' },
		{ method: 'PUT', url: '/portfolio' },
		{ method: 'DELETE', url: '/codes' },
	])('returns 404 for $method $url', async ({ method, url }) => {
		const response = await App.inject({ method: method as any, url })
		expect(response.statusCode).toBe(404)
	})
})

describe('RSS Route', () => {
	let response: LightMyRequestResponse

	beforeAll(async () => {
		response = await App.inject({ method: 'GET', url: '/rss/blog.xml' })
	})

	it('responds with status code 200 for the RSS feed', () => {
		expect(response.statusCode).toBe(200)
	})

	it('responds with application/xml content-type', () => {
		expect(response.headers['content-type']).toContain('application/xml')
	})

	it('returns the feed contents', () => {
		expect(response.body).toContain('<rss')
		expect(response.body).toContain('Test Feed')
	})
})
