import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			'indent': ['error', 'tab'],
			'linebreak-style': ['error', 'unix'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'never'],
			'no-console': 'off',
			'no-tabs': 'off',
			'brace-style': ['error', 'stroustrup'],
			'comma-dangle': ['error', 'only-multiline'],
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		},
	},
)
