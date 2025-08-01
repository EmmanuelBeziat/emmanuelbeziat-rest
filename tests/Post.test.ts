import { describe, it, expect, vi, beforeEach } from 'vitest'
import Post from '../src/models/Post.js'
import { MarkedFile } from '../src/types.js'

// Accéder à la méthode readFileContent pour les tests
// Note: Ceci est une approche pour tester une méthode d'une instance singleton
const readFileContent = (Post as any).readFileContent.bind(Post)

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
        title: 'Minimal Title'
      }
    }

    const result = readFileContent(markedFile)

    expect(result.title).toBe('Minimal Title')
    expect(result.slug).toBe('minimal-post')
    expect(result.image).toBe('')
    expect(result.date).toBeInstanceOf(Date)
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
        publish: false
      }
    }

    const result = readFileContent(markedFile)

    expect(result.publish).toBe(false)
  })
})
