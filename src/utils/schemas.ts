/**
 * Shared JSON Schema fragments reused across the resource routes.
 */

// Validates a `:slug` URL parameter: lowercase letters, digits and hyphens only.
export const slugParams = {
	type: 'object',
	properties: {
		slug: { type: 'string', pattern: '^[a-z0-9-]+$' }
	},
	required: ['slug']
}

/**
 * Schema for a collection route returning an array of items.
 * @param {object} itemSchema Schema describing a single item.
 */
export const listSchema = (itemSchema: object) => ({
	response: { 200: { type: 'array', items: itemSchema } }
})

/**
 * Schema for a detail route returning a single item looked up by slug.
 * @param {object} itemSchema Schema describing a single item.
 */
export const detailSchema = (itemSchema: object) => ({
	params: slugParams,
	response: { 200: itemSchema }
})
