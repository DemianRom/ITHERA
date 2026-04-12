/**
 * Setup global para todos los tests de Ithera backend
 * Este archivo se ejecuta antes de cada suite de tests
 */

// Variables de entorno para tests (sobreescribe el .env)
process.env.NODE_ENV = 'test';
process.env.PORT = '4001';
process.env.JWT_SECRET = 'test-secret-key-ithera';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/ithera_test';
process.env.REDIS_URL = 'redis://localhost:6379/1';

