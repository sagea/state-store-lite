module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!**/__tests__/**',
    '!**/__mocks__/**'
  ],
  resetMocks: true,
  resetModules: true,
  collectCoverage: true,
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  roots: [
    '<rootDir>/src'
  ]
}