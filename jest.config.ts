import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  // rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  collectCoverage: false,
  // coverageDirectory: '../coverage',
  coverageReporters: ['json', 'json-summary', 'text', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts}',
    '!src/examples/**',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
};

export default config;
