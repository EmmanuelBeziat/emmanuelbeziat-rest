import { describe, it, expect, beforeAll } from 'vitest'
import App from '../src/classes/App.js'

// Replaces the former wall-clock "performance" suite, which was flaky on shared
// runners and depended on production slugs. These checks are deterministic:
// they assert correctness under concurrency and cache stability, not timings.
describe('API concurrency & caching', () => {
	beforeAll(async () => {
		await App.ready()
	})

	it('handles many concurrent requests without errors', async () => {
		const urls = [
			'/',
			'/posts',
			'/portfolio',
			'/codes',
			'/posts/second-post',
			'/portfolio/project-alpha',
			'/codes/css',
			'/rss/blog.xml',
		]
		const responses = await Promise.all(
			Array.from({ length: 40 }, (_, i) => App.inject({ method: 'GET', url: urls[i % urls.length] }))
		)
		responses.forEach(response => expect(response.statusCode).toBe(200))
	})

	it('returns identical bodies across repeated requests (cache is stable)', async () => {
		const first = await App.inject({ method: 'GET', url: '/posts' })
		const second = await App.inject({ method: 'GET', url: '/posts' })
		expect(second.body).toBe(first.body)
	})
})
