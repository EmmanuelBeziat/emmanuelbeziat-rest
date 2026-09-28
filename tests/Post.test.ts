import { describe, it, expect } from 'vitest'
import Post from '../src/models/Post.js'
import { MarkedFile } from '../src/types.js'

// Accéder à la méthode readFileContent pour les tests
// Note: Ceci est une approche pour tester une méthode d'une instance singleton
const readFileContent = Post.readFileContent.bind(Post)

describe('Post Model', () => {
	// Test avec des métadonnées complètes
	it('processes complete metadata correctly', () => {
		const markedFile: MarkedFile = {
			slug: 'test-post',
			markdown: '# Test Content',
			html: '<h1>Test Content</h1>',
			meta: {
				title: 'Test Title',
				image: 'test.jpg',
				date: new Date('2024-01-01'),
				tags: ['tag1', 'tag2'],
				categories: ['cat1', 'cat2'],
				description: 'Test description',
				publish: true
			}
		}

		const result = readFileContent(markedFile)

		expect(result).toEqual({
			slug: 'test-post',
			title: 'Test Title',
			image: 'test.jpg',
			date: new Date('2024-01-01'),
			tags: ['tag1', 'tag2'],
			categories: ['cat1', 'cat2'],
			description: 'Test description',
			publish: true,
			markdown: '# Test Content',
			markup: '<h1>Test Content</h1>'
		})
	})

	// Test avec des métadonnées minimales
	it('provides default values for missing metadata', () => {
		const markedFile: MarkedFile = {
			slug: 'minimal-post',
			markdown: 'Minimal content',
			html: '<p>Minimal content</p>',
			meta: {
				title: 'Minimal Title',
				date: '2024-05-01'
			}
		}

		const result = readFileContent(markedFile)

		expect(result.title).toBe('Minimal Title')
		expect(result.slug).toBe('minimal-post')
		expect(result.image).toBe('')
		expect(result.date).toBe('2024-05-01')
		expect(result.tags).toEqual([''])
		expect(result.categories).toEqual(['non-classe'])
		expect(result.description).toBe('')
		expect(result.publish).toBe(true)
		expect(result.markdown).toBe('Minimal content')
		expect(result.markup).toBe('<p>Minimal content</p>')
	})

	// Test avec publish explicitement à false
	it('respects explicit publish:false setting', () => {
		const markedFile: MarkedFile = {
			slug: 'draft-post',
			markdown: 'Draft content',
			html: '<p>Draft content</p>',
			meta: {
				title: 'Draft Title',
				date: '2024-05-01',
				publish: false
			}
		}

		const result = readFileContent(markedFile)

		expect(result.publish).toBe(false)
	})

	it('throws when the title is missing', () => {
		const markedFile = { slug: 'no-title', markdown: '', html: '', meta: { date: '2024-01-01' } } as MarkedFile
		expect(() => readFileContent(markedFile)).toThrow('"no-title": front matter "title" is missing or empty')
	})

	it('throws when the date is missing instead of defaulting to now', () => {
		const markedFile = { slug: 'no-date', markdown: '', html: '', meta: { title: 'T' } } as MarkedFile
		expect(() => readFileContent(markedFile)).toThrow('"no-date": front matter "date" is missing')
	})

	it('throws when the date is not a valid date', () => {
		const markedFile = { slug: 'bad-date', markdown: '', html: '', meta: { title: 'T', date: 'someday' } } as MarkedFile
		expect(() => readFileContent(markedFile)).toThrow('"bad-date": front matter "date" is not a valid date: someday')
	})
})
