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

	// Rendu des ancres (markdown-it-anchor)
	it('generates anchor links for headings', () => {
		const input = '## My Section'
		const output = Markdown.renderMarkdown(input)

		expect(output).toContain('id="my-section"')
		expect(output).toContain('href="#my-section"')
	})

	// Rendu des attributs HTML (markdown-it-attrs)
	it('applies custom attributes to elements', () => {
		const input = '# Title {.my-class}'
		const output = Markdown.renderMarkdown(input)

		expect(output).toContain('class="my-class"')
	})

	// Rendu des flèches typographiques (markdown-it-smartarrows)
	it('converts arrow notation to HTML entities', () => {
		const input = '-->'
		const output = Markdown.renderMarkdown(input)

		// markdown-it-smartarrows converts --> to →
		expect(output).toContain('→')
	})

	// Lazy loading des images (markdown-it-image-lazy-loading)
	it('adds loading="lazy" to images', () => {
		const input = '![alt text](image.jpg)'
		const output = Markdown.renderMarkdown(input)

		expect(output).toContain('loading="lazy"')
	})
})
