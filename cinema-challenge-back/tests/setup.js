// Setup para testes Jest
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.JWT_EXPIRATION = '1d';
process.env.PORT = 5001;
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinema-test';

// Timeout padrão para testes
jest.setTimeout(30000);
