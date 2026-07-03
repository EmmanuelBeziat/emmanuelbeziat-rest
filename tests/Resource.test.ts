import { describe, it, expect } from 'vitest'
import { byDateDesc } from '../src/utils/resource'

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
