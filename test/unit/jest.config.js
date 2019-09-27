module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: __dirname + '../../../src',
  setupFilesAfterEnv: [__dirname + '/setupAfterEnv.ts'],
  setupFiles: [__dirname + '/setup.ts'],
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testRunner: 'jest-circus/runner',
};
