import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  // reporters: [],
  coverageReporters: ['json', 'json-summary', 'text', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts}',
    '!src/examples/**',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
};

export default config;
