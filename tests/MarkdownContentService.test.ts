import { describe, it, expect, vi, beforeEach } from 'vitest'
import MarkdownContentService from '../src/services/MarkdownContentService.js'
import { MarkedFile } from '../src/types.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES_PATH = path.resolve(__dirname, 'fixtures/markdown')

// Simple data shaping function for tests
const dataShapeFn = (marked: MarkedFile) => ({
	slug: marked.slug,
	title: marked.meta.title,
	html: marked.html
})

describe('MarkdownContentService', () => {
	describe('constructor', () => {
		it('throws if no contentPath is provided', () => {
			expect(() => new MarkdownContentService('', dataShapeFn)).toThrow('A content path must be provided.')
		})

		it('throws if dataShapeFn is not a function', () => {
			expect(() => new MarkdownContentService('/some/path', null as any)).toThrow('A data shaping function must be provided.')
		})
	})

	describe('initialize()', () => {
		it('loads markdown files from a valid directory', async () => {
			const service = new MarkdownContentService(FIXTURES_PATH, dataShapeFn)
			await service.initialize()

			const all = service.getAll()
			expect(all.length).toBeGreaterThan(0)
		})

		it('does not reinitialize if already initialized', async () => {
			const service = new MarkdownContentService(FIXTURES_PATH, dataShapeFn)
			await service.initialize()
			const sizeBefore = service.getAll().length

			// Second call should be a no-op
			await service.initialize()
			const sizeAfter = service.getAll().length

			expect(sizeAfter).toBe(sizeBefore)
		})

		it('warns but does not throw when no markdown files are found', async () => {
			const service = new MarkdownContentService('/non-existent-empty-path', dataShapeFn)
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
			// Should not throw
			await expect(service.initialize()).resolves.toBeUndefined()
			expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('No markdown files found'))
			warnSpy.mockRestore()
		})
	})

	describe('getAll()', () => {
		it('returns an empty array before initialization', () => {
			const service = new MarkdownContentService(FIXTURES_PATH, dataShapeFn)
			expect(service.getAll()).toEqual([])
		})

		it('returns all items after initialization', async () => {
			const service = new MarkdownContentService(FIXTURES_PATH, dataShapeFn)
			await service.initialize()

			const all = service.getAll()
			expect(Array.isArray(all)).toBe(true)
			expect(all.length).toBeGreaterThan(0)
		})
	})

	describe('findBySlug()', () => {
		it('returns undefined for an unknown slug', async () => {
			const service = new MarkdownContentService(FIXTURES_PATH, dataShapeFn)
			await service.initialize()

			expect(service.findBySlug('non-existent-slug')).toBeUndefined()
		})

		it('returns the correct item for a known slug', async () => {
			const service = new MarkdownContentService(FIXTURES_PATH, dataShapeFn)
			await service.initialize()

			const item = service.findBySlug('test-post')
			expect(item).toBeDefined()
			expect(item.slug).toBe('test-post')
		})
	})
})
