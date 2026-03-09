import { describe, it, expect } from 'vitest'
import Portfolio from '../src/models/Portfolio.js'
import { MarkedFile } from '../src/types.js'

const readFileContent = (Portfolio as any).readFileContent.bind(Portfolio)

describe('Portfolio Model', () => {
	it('processes complete metadata correctly', () => {
		const markedFile: MarkedFile = {
			slug: 'test-project',
			markdown: '# Test Project',
			html: '<h1>Test Project</h1>',
			meta: {
				title: 'Test Project',
				image: 'project.jpg',
				date: new Date('2024-01-01'),
				tags: ['web', 'design'],
				color: '#ff0000',
				clients: ['Client A'],
				categories: ['web'],
				description: 'A test project'
			}
		}

		const result = readFileContent(markedFile)

		expect(result).toEqual({
			slug: 'test-project',
			title: 'Test Project',
			image: 'project.jpg',
			date: new Date('2024-01-01'),
			tags: ['web', 'design'],
			color: '#ff0000',
			clients: ['Client A'],
			categories: ['web'],
			description: 'A test project',
			markdown: '# Test Project',
			markup: '<h1>Test Project</h1>'
		})
	})

	it('provides default values for missing metadata', () => {
		const markedFile: MarkedFile = {
			slug: 'minimal-project',
			markdown: 'Minimal content',
			html: '<p>Minimal content</p>',
			meta: {
				title: 'Minimal Project'
			}
		}

		const result = readFileContent(markedFile)

		expect(result.title).toBe('Minimal Project')
		expect(result.slug).toBe('minimal-project')
		expect(result.image).toBe('')
		expect(result.date).toBeInstanceOf(Date)
		expect(result.tags).toEqual([''])
		expect(result.color).toBe('')
		expect(result.clients).toEqual([''])
		expect(result.categories).toEqual(['non-classe'])
		expect(result.description).toBe('')
		expect(result.markdown).toBe('Minimal content')
		expect(result.markup).toBe('<p>Minimal content</p>')
	})
})
