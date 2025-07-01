import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs/promises'
import { glob } from 'glob'
import MarkdownContentService from '../src/services/MarkdownContentService.js'
import { MarkedFile } from '../src/types.js'

// Mock modules at the top level
vi.mock('fs/promises')
vi.mock('glob')

describe('MarkdownContentService', () => {
	let service: MarkdownContentService
	const mockContentPath = '/fake/path'
	const mockDataShapeFn = (marked: MarkedFile) => ({
		slug: marked.slug,
		title: marked.meta.title,
		content: marked.html
	})

	beforeEach(() => {
		// Reset mocks before each test to ensure isolation
		vi.resetAllMocks()
		service = new MarkdownContentService(mockContentPath, mockDataShapeFn)
	})

	it('should throw an error if no content path is provided', () => {
		expect(() => new MarkdownContentService(null as any, mockDataShapeFn)).toThrow('A content path must be provided.')
	})

	it('should throw an error if no data shaping function is provided', () => {
		expect(() => new MarkdownContentService(mockContentPath, null as any)).toThrow('A data shaping function must be provided.')
	})

	it('should initialize correctly with markdown files', async () => {
		const mockFileContent = '---\ntitle: Test Post\n---\nHello World'
		const mockGlobResult = [`${mockContentPath}/2024-01-01-test-post.md`]

		vi.mocked(glob).mockResolvedValue(mockGlobResult)
		vi.mocked(fs.readFile).mockResolvedValue(mockFileContent)

		await service.initialize()

		const allContent = service.getAll()
		expect(allContent).toHaveLength(1)
		expect(allContent[0].title).toBe('Test Post')
		expect(allContent[0].slug).toBe('test-post')
		expect(glob).toHaveBeenCalledWith(`${mockContentPath}/*.md`)
		expect(fs.readFile).toHaveBeenCalledWith(mockGlobResult[0], 'utf8')
	})

	it('should handle initialization with no files found', async () => {
		vi.mocked(glob).mockResolvedValue([])
		const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		await service.initialize()

		expect(service.getAll()).toHaveLength(0)
		expect(consoleWarnSpy).toHaveBeenCalledWith(`No markdown files found in ${mockContentPath}`)

		consoleWarnSpy.mockRestore()
	})

	it('should find content by slug after initialization', async () => {
		const mockGlobResult = [
			`${mockContentPath}/2024-01-01-post-one.md`,
			`${mockContentPath}/2024-01-02-post-two.md`
		]
		vi.mocked(glob).mockResolvedValue(mockGlobResult)

		vi.mocked(fs.readFile)
			.mockResolvedValueOnce('---\ntitle: Post One\n---\nContent One')
			.mockResolvedValueOnce('---\ntitle: Post Two\n---\nContent Two')

		await service.initialize()

		const postTwo = service.findBySlug('post-two')
		expect(postTwo).toBeDefined()
		expect(postTwo.title).toBe('Post Two')

		const nonExistent = service.findBySlug('non-existent')
		expect(nonExistent).toBeUndefined()
	})

	it('should not re-initialize if already initialized', async () => {
		vi.mocked(glob).mockResolvedValue([`${mockContentPath}/2024-01-01-post-one.md`])
		vi.mocked(fs.readFile).mockResolvedValue('---\ntitle: Post One\n---\nContent One')
		const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

		await service.initialize() // First initialization
		await service.initialize() // Second attempt

		expect(glob).toHaveBeenCalledTimes(1) // Should only be called once
		expect(consoleLogSpy).toHaveBeenCalledWith(`Content from ${mockContentPath} is already initialized.`)

		consoleLogSpy.mockRestore()
	})
})
