module.exports = {
  verbose: true,
  preset: 'jest-playwright-preset',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testTimeout: 90000,
}