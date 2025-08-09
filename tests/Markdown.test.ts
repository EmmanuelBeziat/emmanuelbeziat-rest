import { describe, it, expect } from 'vitest'
import Markdown from '../src/classes/Markdown.js'

describe('Markdown Class', () => {
	// Rendu markdown de base (test smoke, non dépendant de plugins spécifiques)
	it('renders basic markdown correctly', () => {
		const input = '# Titre\n\nParagraphe de texte'
		const output = Markdown.renderMarkdown(input)

		expect(output).toContain('<h1')
		expect(output).toContain('</h1>')
		expect(output).toContain('<p>')
		expect(output).toContain('Paragraphe de texte')
	})

	// Rendu des blocs de code avec une langue
	it('renders code blocks with syntax highlighting', () => {
		const input = '```javascript\nconst x = 1;\n```'
		const output = Markdown.renderMarkdown(input)

		expect(output).toContain('<pre class="language-javascript">')
		expect(output).toContain('<code class="language-javascript">')
		expect(output).toContain('const')
		expect(output).toContain('1')
	})
})
