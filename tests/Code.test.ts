import { describe, it, expect } from 'vitest'
import Code from '../src/models/Code.js'
import { MarkedFile } from '../src/types.js'

const readFileContent = (Code as any).readFileContent.bind(Code)

describe('Code Model', () => {
	it('processes content correctly', () => {
		const markedFile: MarkedFile = {
			slug: 'css',
			markdown: '# CSS Tips',
			html: '<h1>CSS Tips</h1>',
			meta: {
				title: 'CSS Tips'
			}
		}

		const result = readFileContent(markedFile)

		expect(result).toEqual({
			slug: 'css',
			markdown: '# CSS Tips',
			markup: '<h1>CSS Tips</h1>'
		})
	})

	it('strips the "code-" prefix from the slug', () => {
		const markedFile: MarkedFile = {
			slug: 'code-css',
			markdown: '# CSS Tips',
			html: '<h1>CSS Tips</h1>',
			meta: {
				title: 'CSS Tips'
			}
		}

		const result = readFileContent(markedFile)

		expect(result.slug).toBe('css')
	})

	it('does not alter slugs without the "code-" prefix', () => {
		const markedFile: MarkedFile = {
			slug: 'javascript',
			markdown: '# JS Tips',
			html: '<h1>JS Tips</h1>',
			meta: {
				title: 'JS Tips'
			}
		}

		const result = readFileContent(markedFile)

		expect(result.slug).toBe('javascript')
	})

	it('provides empty strings for missing markdown and html', () => {
		const markedFile: MarkedFile = {
			slug: 'empty',
			markdown: '',
			html: '',
			meta: {
				title: 'Empty'
			}
		}

		const result = readFileContent(markedFile)

		expect(result.markdown).toBe('')
		expect(result.markup).toBe('')
	})
})
