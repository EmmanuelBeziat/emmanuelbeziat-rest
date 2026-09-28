import { describe, it, expect } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'
import ModelHandler from '../src/classes/ModelHandler.js'
import { MarkedFile } from '../src/types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EMPTY_FIXTURES_PATH = path.resolve(__dirname, 'fixtures/empty-content')

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
		it('returns an empty array when the content folder is empty', async () => {
			const model = new TestModel(EMPTY_FIXTURES_PATH)
			await model.initialize()
			await expect(model.getAllFiles()).resolves.toEqual([])
		})

		it('rejects when called before initialize()', async () => {
			const model = new TestModel(EMPTY_FIXTURES_PATH)
			await expect(model.getAllFiles()).rejects.toThrow('before initialize() completed')
		})
	})

	describe('getFile()', () => {
		it('throws when the slug is not found', async () => {
			const model = new TestModel(EMPTY_FIXTURES_PATH)
			await model.initialize()
			await expect(model.getFile('unknown-slug')).rejects.toThrow('No data found.')
		})
	})
})
