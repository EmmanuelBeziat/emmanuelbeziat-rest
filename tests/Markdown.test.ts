import { describe, it, expect } from 'vitest'
import Markdown from '../src/classes/Markdown.js'

describe('Markdown Class', () => {
  // Test du rendu markdown de base
  it('renders basic markdown correctly', () => {
    const input = '# Titre\n\nParagraphe de texte'
    const output = Markdown.renderMarkdown(input)

    expect(output).toContain('<h1 id="titre"')
    expect(output).toContain('Titre')
    expect(output).toContain('</h1>')
    expect(output).toContain('<p>Paragraphe de texte</p>')
  })

  // Test des blocs de code avec coloration syntaxique
  it('renders code blocks with syntax highlighting', () => {
    const input = '```javascript\nconst x = 1;\n```'
    const output = Markdown.renderMarkdown(input)

    expect(output).toContain('<pre class="language-javascript">')
    expect(output).toContain('<code class="language-javascript">')
    expect(output).toContain('const')
    expect(output).toContain('1')
  })

  // Test des liens avec ancres
  it('adds anchors to headings', () => {
    const input = '## Section importante'
    const output = Markdown.renderMarkdown(input)

    expect(output).toContain('id="section-importante"')
    expect(output).toContain('header-anchor')
    expect(output).toContain('Section importante')
  })

  // Test des flèches intelligentes
  it('converts smart arrows correctly', () => {
    const input = 'A -> B'
    const output = Markdown.renderMarkdown(input)

    expect(output).toContain('A -')
    expect(output).toContain('B')
  })

  // Test des attributs markdown
  it('processes markdown attributes', () => {
    const input = 'Texte {.special-class}'
    const output = Markdown.renderMarkdown(input)

    expect(output).toContain('class="special-class"')
  })

  // Test des intégrations de vidéos
  it('embeds videos correctly', () => {
    const input = '@[youtube](dQw4w9WgXcQ)'
    const output = Markdown.renderMarkdown(input)

    expect(output).toContain('video--youtube')
    expect(output).toContain('dQw4w9WgXcQ')
  })

  // Test du chargement paresseux des images
  it('adds lazy loading to images', () => {
    const input = '![Alt text](image.jpg)'
    const output = Markdown.renderMarkdown(input)

    expect(output).toContain('loading="lazy"')
  })
})
