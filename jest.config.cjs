module.exports = {
  setupFiles: ['<rootDir>/tests/jest.setup.js'],
	transform: {
    '^.+\\.jsx?$': 'babel-jest', // Use Babel to transform JS files
  },
  extensionsToTreatAsEsm: ['.jsx'], // Only treat .jsx files as ESM
  transformIgnorePatterns: [
    '/node_modules/(?!slug)', // Allow transformation of the slug package
  ],
  testEnvironment: 'node', // Set the test environment to Node
	testPathIgnorePatterns: [
    '<rootDir>/tests/Routes.test.js', // Ignore the Routes.test.js file
  ],
}
