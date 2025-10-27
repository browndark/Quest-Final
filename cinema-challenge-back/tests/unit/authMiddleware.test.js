const jwt = require('jsonwebtoken');
const { User } = require('../../src/models');
const { protect, authorize } = require('../../src/middleware/auth');

jest.mock('jsonwebtoken');
jest.mock('../../src/models', () => ({
  User: {
    findById: jest.fn()
  }
}));

describe('Auth Middleware - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('protect middleware', () => {
    it('deve autenticar usuário com token válido', async () => {
      req.headers.authorization = 'Bearer valid-token';

      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };

      jwt.verify.mockReturnValue({ id: 'user123' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledWith();
    });

    it('deve retornar erro 401 se token não fornecido', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this route'
      });
    });

    it('deve retornar erro 401 se token inválido', async () => {
      req.headers.authorization = 'Bearer invalid-token';

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this route'
      });
    });

    it('deve retornar erro 401 se usuário não encontrado', async () => {
      req.headers.authorization = 'Bearer valid-token';

      jwt.verify.mockReturnValue({ id: 'user123' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });

    it('deve aceitar token sem "Bearer " prefix', async () => {
      req.headers.authorization = 'Bearer valid-token';

      const mockUser = {
        _id: 'user123',
        name: 'Test User'
      };

      jwt.verify.mockReturnValue({ id: 'user123' });
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('authorize middleware', () => {
    it('deve permitir acesso para role autorizada', () => {
      req.user = { role: 'admin' };

      const middleware = authorize('admin', 'moderator');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('deve negar acesso para role não autorizada', () => {
      req.user = { role: 'user' };

      const middleware = authorize('admin', 'moderator');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('not authorized')
      });
    });

    it('deve negar acesso se usuário não autenticado', () => {
      const middleware = authorize('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('not authorized')
      });
    });

    it('deve aceitar múltiplas roles', () => {
      req.user = { role: 'moderator' };

      const middleware = authorize('admin', 'moderator', 'editor');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
