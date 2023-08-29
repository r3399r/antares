/* eslint-env node */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  cacheDirectory: '<rootDir>/tmp/test/cache',
  coverageDirectory: '<rootDir>/coverage',
  /**
   * It might be best to ignore 'bindings.ts' during coverage analysis, because
   * constructor functions of external classes will routinely be mocked, and
   * therefore not covered in our fully automated tests.
   */
  coveragePathIgnorePatterns: [
    '<rootDir>/src/bindings.ts'
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura', 'html'],
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: 80,
  //   },
  // },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  preset: 'ts-jest',
  roots: ['<rootDir>/src/'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
};
