import { describe, it, expect } from 'vitest'
import path from 'path'
import { fileURLToPath } from 'url'
import ModelHandler from '../src/classes/ModelHandler.js'
import { MarkedFile } from '../src/types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EMPTY_FIXTURES_PATH = path.resolve(__dirname, 'fixtures/empty-content')
const FIXTURES_PATH = path.resolve(__dirname, 'fixtures/markdown')

// Concrete subclass for testing
class TestModel extends ModelHandler {
	constructor (folder: string) {
		super(folder)
	}

	readFileContent (marked: MarkedFile) {
		return { slug: marked.slug, title: marked.meta.title }
	}
}

// Hides every item, to exercise isVisible()
class HiddenModel extends TestModel {
	protected isVisible () {
		return false
	}
}

describe('ModelHandler', () => {
	describe('getAllFiles()', () => {
		it('returns an empty array when the content folder is empty', async () => {
			const model = new TestModel(EMPTY_FIXTURES_PATH)
			await model.initialize()
			expect(model.getAllFiles()).toEqual([])
		})

		it('throws when called before initialize()', () => {
			const model = new TestModel(EMPTY_FIXTURES_PATH)
			expect(() => model.getAllFiles()).toThrow('before initialize() completed')
		})

		it('leaves out items that are not visible', async () => {
			const model = new HiddenModel(FIXTURES_PATH)
			await model.initialize()
			expect(model.getAllFiles()).toEqual([])
		})
	})

	describe('getFile()', () => {
		it('throws when the slug is not found', async () => {
			const model = new TestModel(EMPTY_FIXTURES_PATH)
			await model.initialize()
			expect(() => model.getFile('unknown-slug')).toThrow('No data found.')
		})

		it('treats an item that is not visible as not found', async () => {
			const model = new HiddenModel(FIXTURES_PATH)
			await model.initialize()
			expect(() => model.getFile('test-post')).toThrow('No data found.')
		})
	})
})
