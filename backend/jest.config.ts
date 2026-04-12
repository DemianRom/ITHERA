import type { Config } from 'jest';

const config: Config = {
  // Usar ts-jest para compilar TypeScript en los tests
  preset: 'ts-jest',

  // Entorno de Node.js (no browser)
  testEnvironment: 'node',

  // Dónde están los tests
  roots: ['<rootDir>/tests'],

  // Patrón de archivos de test
  testMatch: [
    '**/*.test.ts',
    '**/*.spec.ts',
  ],

  // Mapeo de paths igual que en tsconfig
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',           // Entry point, no se testea directo
    '!src/config/**',          // Configuración de DB/Redis
    '!src/infrastructure/**',  // Adaptadores externos
  ],

  // Umbrales mínimos de cobertura (se activan con --coverage)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },

  // Formato de reporte de cobertura
  coverageReporters: ['text', 'lcov'],

  // Variables de entorno para tests
  setupFiles: ['<rootDir>/tests/setup.ts'],

  // Timeout por test (ms)
  testTimeout: 10000,

  // Mostrar cada test individualmente
  verbose: true,
};

export default config;