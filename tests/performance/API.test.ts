import { describe, it, expect, beforeAll } from 'vitest'
import App from '../../src/classes/App.js'

describe('API Performance', () => {
	// Définir un seuil de temps de réponse acceptable (en ms)
	const RESPONSE_TIME_THRESHOLD = 200

	// Fonction utilitaire pour mesurer le temps de réponse
	async function measureResponseTime(url: string): Promise<number> {
		const start = performance.now()
		await App.inject({ method: 'GET', url })
		const end = performance.now()
		return end - start
	}

	it('should respond to / within acceptable time', async () => {
		const responseTime = await measureResponseTime('/')

		expect(responseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD)
		console.log(`Home route response time: ${responseTime.toFixed(2)}ms`)
	})

	it('should respond to /posts within acceptable time', async () => {
		const responseTime = await measureResponseTime('/posts')

		expect(responseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD)
		console.log(`Posts route response time: ${responseTime.toFixed(2)}ms`)
	})

	it('should respond to /portfolio within acceptable time', async () => {
		const responseTime = await measureResponseTime('/portfolio')

		expect(responseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD)
		console.log(`Portfolio route response time: ${responseTime.toFixed(2)}ms`)
	})

	it('should respond to /codes within acceptable time', async () => {
		const responseTime = await measureResponseTime('/codes')

		expect(responseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD)
		console.log(`Codes route response time: ${responseTime.toFixed(2)}ms`)
	})

	it('should respond to single post within acceptable time', async () => {
		const responseTime = await measureResponseTime('/posts/les-unites-css')

		expect(responseTime).toBeLessThan(RESPONSE_TIME_THRESHOLD)
		console.log(`Single post route response time: ${responseTime.toFixed(2)}ms`)
	})

	it('handles multiple concurrent requests efficiently', async () => {
		const start = performance.now()

		// Exécuter 10 requêtes simultanées
		await Promise.all([
			App.inject({ method: 'GET', url: '/' }),
			App.inject({ method: 'GET', url: '/posts' }),
			App.inject({ method: 'GET', url: '/portfolio' }),
			App.inject({ method: 'GET', url: '/codes' }),
			App.inject({ method: 'GET', url: '/posts/les-unites-css' }),
			App.inject({ method: 'GET', url: '/portfolio/hit-the-road' }),
			App.inject({ method: 'GET', url: '/codes/css' }),
			App.inject({ method: 'GET', url: '/rss/blog.xml' }),
			App.inject({ method: 'GET', url: '/posts' }),
			App.inject({ method: 'GET', url: '/portfolio' })
		])

		const end = performance.now()
		const totalTime = end - start

		// Le temps total devrait être inférieur à 10 fois le temps d'une seule requête
		// grâce à la mise en cache et au traitement parallèle
		expect(totalTime).toBeLessThan(RESPONSE_TIME_THRESHOLD * 5)
		console.log(`10 concurrent requests total time: ${totalTime.toFixed(2)}ms`)
	})

	it('maintains performance under repeated requests', async () => {
		const iterations = 5
		const url = '/posts'
		let times: number[] = []

		// Effectuer plusieurs requêtes séquentielles
		for (let i = 0; i < iterations; i++) {
			const responseTime = await measureResponseTime(url)
			times.push(responseTime)
		}

		// Calculer le temps moyen
		const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length

		// Le temps moyen devrait être inférieur au seuil
		expect(averageTime).toBeLessThan(RESPONSE_TIME_THRESHOLD)

		// La dernière requête devrait être plus rapide que la première (mise en cache)
		expect(times[times.length - 1]).toBeLessThanOrEqual(times[0] * 1.2)

		console.log(`Average response time over ${iterations} requests: ${averageTime.toFixed(2)}ms`)
		console.log(`First request: ${times[0].toFixed(2)}ms, Last request: ${times[times.length - 1].toFixed(2)}ms`)
	})
})
