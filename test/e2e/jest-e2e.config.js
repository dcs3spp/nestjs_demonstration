module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  setupFilesAfterEnv: ['./setupAfterEnv.ts'],
  setupFiles: ['./setup.ts'],
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRunner: 'jest-circus/runner',
};
