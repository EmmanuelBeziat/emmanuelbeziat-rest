import { describe, it, expect, vi } from 'vitest'
import Fastify from 'fastify'
import { byDateDesc, createResourceRoutes } from '../src/utils/resource.js'
import ModelHandler from '../src/classes/ModelHandler.js'
import { NotFoundError } from '../src/classes/NotFoundError.js'

interface Item { slug: string }

const itemSchema = {
	type: 'object',
	properties: { slug: { type: 'string' } },
	required: ['slug'],
}

describe('byDateDesc', () => {
	it('orders items by date string, most recent first', () => {
		const items = [
			{ slug: 'a', date: '2024-01-01' },
			{ slug: 'b', date: '2024-03-01' },
			{ slug: 'c', date: '2024-02-01' },
		]
		expect(byDateDesc(items).map(item => item.slug)).toEqual(['b', 'c', 'a'])
	})

	it('orders Date objects, most recent first', () => {
		const items = [
			{ slug: 'old', date: new Date('2020-01-01') },
			{ slug: 'new', date: new Date('2025-01-01') },
		]
		expect(byDateDesc(items).map(item => item.slug)).toEqual(['new', 'old'])
	})

	it('does not mutate the input array', () => {
		const items = [
			{ slug: 'a', date: '2024-01-01' },
			{ slug: 'b', date: '2024-03-01' },
		]
		const snapshot = [...items]
		byDateDesc(items)
		expect(items).toEqual(snapshot)
	})
})

describe('createResourceRoutes', () => {
	it('returns 200 with an empty array when the collection is legitimately empty', async () => {
		const model = new ModelHandler<Item>('/non-existent-path-for-resource-test')
		vi.spyOn(model, 'getAllFiles').mockResolvedValue([])

		const app = Fastify()
		app.register(createResourceRoutes({ basePath: 'items', model, itemSchema }))
		await app.ready()

		const response = await app.inject({ method: 'GET', url: '/items' })

		expect(response.statusCode).toBe(200)
		expect(JSON.parse(response.body)).toEqual([])

		await app.close()
	})

	it('returns 404 with the NotFoundError message when the collection fetch fails', async () => {
		const model = new ModelHandler<Item>('/non-existent-path-for-resource-test')
		vi.spyOn(model, 'getAllFiles').mockRejectedValue(new NotFoundError('No content found.'))

		const app = Fastify()
		app.register(createResourceRoutes({ basePath: 'items', model, itemSchema }))
		await app.ready()

		const response = await app.inject({ method: 'GET', url: '/items' })

		expect(response.statusCode).toBe(404)
		expect(JSON.parse(response.body)).toEqual({
			statusCode: 404,
			error: 'Not Found',
			message: 'No content found.',
		})

		await app.close()
	})

	it('returns a generic 500 without leaking details when the collection fetch throws unexpectedly', async () => {
		const model = new ModelHandler<Item>('/non-existent-path-for-resource-test')
		vi.spyOn(model, 'getAllFiles').mockRejectedValue(new Error('database exploded'))

		const app = Fastify()
		app.register(createResourceRoutes({ basePath: 'items', model, itemSchema }))
		await app.ready()

		const response = await app.inject({ method: 'GET', url: '/items' })

		expect(response.statusCode).toBe(500)
		const body = JSON.parse(response.body)
		expect(body).toEqual({ statusCode: 500, error: 'Internal Server Error', message: 'An error occurred' })
		expect(body.message).not.toContain('database')

		await app.close()
	})
})
