import js from '@eslint/js'
import globals from 'globals'

export default [
	// Appliquer les configurations recommandées par ESLint/JS comme base
	js.configs.recommended,

	// Ajouter notre configuration personnalisée par-dessus
	{
		files: ['**/*.{js,mjs,cjs}'],
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		rules: {
			// Règles provenant de l'ancien .eslintrc.js
			'indent': ['error', 'tab'],
			'linebreak-style': ['error', 'unix'],
			'quotes': ['error', 'single'],
			'semi': ['error', 'never'],
			'no-console': 'off',

			// Règles provenant de l'ancien eslint.config.js
			'no-tabs': 'off',
			'brace-style': ['error', 'stroustrup'],
			'comma-dangle': ['error', 'only-multiline'],
			'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
		},
	},
]
