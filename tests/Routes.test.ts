import App from '../src/classes/App.js'
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
	let response: LightMyRequestResponse, responseBody: any

	beforeAll(async () => {
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
		responseBody.forEach((item: any) => {
			expect(item).toHaveProperty('title')
			expect(typeof item.title).toBe('string')
			expect(item.title).not.toBe('')
		})
	})
})

describe('Posts Single Item Route (dynamic slug)', () => {
    let response: LightMyRequestResponse, responseBody: any

    beforeAll(async () => {
        const list = await App.inject({ method: 'GET', url: '/posts' })
        const items = JSON.parse(list.body)
        const slug = items?.[0]?.slug
        if (slug) {
            response = await App.inject({ method: 'GET', url: `/posts/${slug}` })
            responseBody = JSON.parse(response.body)
        }
    })

    it('responds with status code 200 for a valid post', () => {
        if (!response) return
        expect(response.statusCode).toBe(200)
    })

    it('returns a post with a title', () => {
        if (!responseBody) return
        expect(responseBody).toHaveProperty('title')
        expect(typeof responseBody.title).toBe('string')
        expect(responseBody.title).not.toBe('')
    })
})

describe('Portfolio Route', () => {
	let response: LightMyRequestResponse, responseBody: any

	beforeAll(async () => {
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
		responseBody.forEach((item: any) => {
			expect(item).toHaveProperty('title')
			expect(typeof item.title).toBe('string')
			expect(item.title).not.toBe('')
		})
	})
})

describe('Portfolio Single Item Route (dynamic slug)', () => {
    let response: LightMyRequestResponse, responseBody: any

    beforeAll(async () => {
        const list = await App.inject({ method: 'GET', url: '/portfolio' })
        const items = JSON.parse(list.body)
        const slug = items?.[0]?.slug
        if (slug) {
            response = await App.inject({ method: 'GET', url: `/portfolio/${slug}` })
            responseBody = JSON.parse(response.body)
        }
    })

    it('responds with status code 200 for a valid portfolio item', () => {
        if (!response) return
        expect(response.statusCode).toBe(200)
    })

    it('returns a portfolio item with a title', () => {
        if (!responseBody) return
        expect(responseBody).toHaveProperty('title')
        expect(typeof responseBody.title).toBe('string')
        expect(responseBody.title).not.toBe('')
    })
})

describe('Codes Route', () => {
	let response: LightMyRequestResponse, responseBody: any

	beforeAll(async () => {
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
	let response: LightMyRequestResponse

	beforeAll(async () => {
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
        const body = JSON.parse(response.body)
        expect(body).toHaveProperty('statusCode', 404)
        expect(body).toHaveProperty('error')
        expect(body).toHaveProperty('message')
	})

	it('should return a 404 error for a non-existent portfolio route', async () => {
        const response = await App.inject({ method: 'GET', url: '/portfolio/non-existent-route' })
        expect(response.statusCode).toBe(404)
        const body = JSON.parse(response.body)
        expect(body).toHaveProperty('statusCode', 404)
        expect(body).toHaveProperty('error')
        expect(body).toHaveProperty('message')
	})

	it('should return a 404 error for a non-existent code route', async () => {
        const response = await App.inject({ method: 'GET', url: '/codes/non-existent-route' })
        expect(response.statusCode).toBe(404)
        const body = JSON.parse(response.body)
        expect(body).toHaveProperty('statusCode', 404)
        expect(body).toHaveProperty('error')
        expect(body).toHaveProperty('message')
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
        const contentType = response.headers['content-type']
        expect(contentType).toContain('application/xml')
    })
})
