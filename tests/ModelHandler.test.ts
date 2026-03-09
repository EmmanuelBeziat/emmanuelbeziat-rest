import { describe, it, expect, vi, beforeEach } from 'vitest'
import ModelHandler from '../src/classes/ModelHandler.js'
import { MarkedFile } from '../src/types.js'

// Concrete subclass for testing
class TestModel extends ModelHandler {
	constructor (folder: string) {
		super(folder)
	}

	readFileContent (marked: MarkedFile) {
		return { slug: marked.slug, title: marked.meta.title }
	}
}

describe('ModelHandler', () => {
	describe('sanitize()', () => {
		it('returns the URL unchanged for a safe string', () => {
			const model = new TestModel('/tmp')
			expect(model.sanitize('my-slug')).toBe('my-slug')
		})

		it('sanitizes a javascript: URL', () => {
			const model = new TestModel('/tmp')
			const result = model.sanitize('javascript:alert(1)')
			expect(result).not.toContain('javascript:')
		})
	})

	describe('getAllFiles()', () => {
		it('throws when the cache is empty', async () => {
			const model = new TestModel('/non-existent-path-that-has-no-files')
			await expect(model.getAllFiles()).rejects.toThrow('No content found.')
		})
	})

	describe('getFile()', () => {
		it('throws when the slug is not found', async () => {
			const model = new TestModel('/non-existent-path-that-has-no-files')
			await expect(model.getFile('unknown-slug')).rejects.toThrow('No data found.')
		})
	})

	describe('readFileContent()', () => {
		it('throws when not overridden in base class', () => {
			// Access the base class method directly
			const base = new ModelHandler('/tmp')
			expect(() => base.readFileContent({} as MarkedFile)).toThrow('readFileContent must be implemented in a subclass.')
		})
	})
})
