import { describe, it, expect } from 'vitest'
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
	describe('getAllFiles()', () => {
		it('returns an empty array when the cache is empty', async () => {
			const model = new TestModel('/non-existent-path-that-has-no-files')
			await expect(model.getAllFiles()).resolves.toEqual([])
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
