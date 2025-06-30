import js from "@eslint/js"
import globals from "globals"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
		files: ["**/*.{js,mjs,cjs}"],
		plugins: { js },
		extends: ["js/recommended"],
		rules: {
			'no-tabs': 'off',
			'brace-style': [
				'error',
				'stroustrup'
			],
			'comma-dangle': [
				'error',
				'only-multiline'
			],
			'no-unused-vars': [
				'error', {
					'argsIgnorePattern': '^_'
				}
			]
		}
	},
  {
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: {
			globals: {
				...globals.node
			}
		}
	}
])
