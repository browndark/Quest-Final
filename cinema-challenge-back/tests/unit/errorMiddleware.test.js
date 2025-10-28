const { notFound, errorHandler } = require('../../src/middleware/error');

describe('Error Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      originalUrl: '/api/v1/test'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      statusCode: 200
    };
    next = jest.fn();
    
    // Mock console.error para não poluir os logs de teste
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  describe('notFound middleware', () => {
    it('deve retornar 404 com mensagem de erro padrão', () => {
      notFound(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toContain('Not Found');
      expect(next.mock.calls[0][0].message).toContain('/api/v1/test');
    });

    it('deve lidar com rotas de preflight - auth/register', () => {
      req.originalUrl = '/api/v1/auth/register';
      
      notFound(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Route exists but is currently inactive'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve lidar com rotas de preflight - auth/login', () => {
      req.originalUrl = '/api/v1/auth/login';
      
      notFound(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Route exists but is currently inactive'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve incluir a URL original na mensagem de erro', () => {
      req.originalUrl = '/api/v1/nonexistent/route';
      
      notFound(req, res, next);

      expect(next.mock.calls[0][0].message).toBe('Not Found - /api/v1/nonexistent/route');
    });
  });

  describe('errorHandler middleware', () => {
    it('deve retornar erro genérico com status 500 quando statusCode é 200', () => {
      const error = new Error('Erro genérico');
      res.statusCode = 200;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro genérico',
        stack: expect.any(String)
      });
    });

    it('deve manter statusCode quando diferente de 200', () => {
      const error = new Error('Erro personalizado');
      res.statusCode = 404;

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro personalizado',
        stack: expect.any(String)
      });
    });

    it('deve logar erro no console', () => {
      const error = new Error('Test error');
      
      errorHandler(error, req, res, next);

      expect(console.error).toHaveBeenCalledWith(error);
    });

    it('deve ocultar stack trace em produção', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Production error');
      
      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Production error',
        stack: null
      });

      process.env.NODE_ENV = originalEnv;
    });

    it('deve incluir stack trace em desenvolvimento', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Dev error');
      
      errorHandler(error, req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Dev error',
        stack: expect.stringContaining('Error: Dev error')
      });

      process.env.NODE_ENV = originalEnv;
    });

    describe('Mongoose ValidationError', () => {
      it('deve retornar 400 para erros de validação do Mongoose', () => {
        const error = {
          name: 'ValidationError',
          message: 'Validation failed',
          errors: {
            email: { message: 'Email is required' },
            password: { message: 'Password must be at least 6 characters' }
          }
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Validation failed',
          errors: {
            email: 'Email is required',
            password: 'Password must be at least 6 characters'
          }
        });
      });

      it('deve processar múltiplos erros de validação', () => {
        const error = {
          name: 'ValidationError',
          errors: {
            field1: { message: 'Error 1' },
            field2: { message: 'Error 2' },
            field3: { message: 'Error 3' }
          }
        };

        errorHandler(error, req, res, next);

        const response = res.json.mock.calls[0][0];
        expect(Object.keys(response.errors)).toHaveLength(3);
      });
    });

    describe('Mongoose CastError', () => {
      it('deve retornar 400 para ObjectId inválido', () => {
        const error = {
          name: 'CastError',
          kind: 'ObjectId',
          message: 'Cast to ObjectId failed',
          stack: 'Error stack trace'
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        const responseCall = res.json.mock.calls[0][0];
        expect(responseCall.success).toBe(false);
        expect(responseCall.message).toBe('Resource not found');
      });

      it('não deve mudar mensagem para CastError que não é ObjectId', () => {
        const error = {
          name: 'CastError',
          kind: 'Number',
          message: 'Cast to Number failed'
        };

        errorHandler(error, req, res, next);

        expect(res.json.mock.calls[0][0].message).toBe('Cast to Number failed');
      });
    });

    describe('Duplicate Key Error (11000)', () => {
      it('deve retornar 400 para chave duplicada', () => {
        const error = {
          code: 11000,
          keyValue: { email: 'test@example.com' }
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          message: 'Duplicate field value entered',
          field: { email: 'test@example.com' }
        });
      });

      it('deve incluir campo duplicado na resposta', () => {
        const error = {
          code: 11000,
          keyValue: { username: 'johndoe' }
        };

        errorHandler(error, req, res, next);

        const response = res.json.mock.calls[0][0];
        expect(response.field).toEqual({ username: 'johndoe' });
      });
    });

    describe('JWT Errors', () => {
      it('deve retornar 401 para JsonWebTokenError', () => {
        const error = {
          name: 'JsonWebTokenError',
          message: 'jwt malformed',
          stack: 'Error stack trace'
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        const responseCall = res.json.mock.calls[0][0];
        expect(responseCall.success).toBe(false);
        expect(responseCall.message).toBe('Invalid token');
      });

      it('deve retornar 401 para TokenExpiredError', () => {
        const error = {
          name: 'TokenExpiredError',
          message: 'jwt expired',
          stack: 'Error stack trace'
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        const responseCall = res.json.mock.calls[0][0];
        expect(responseCall.success).toBe(false);
        expect(responseCall.message).toBe('Token expired');
      });
    });

    describe('Edge Cases', () => {
      it('deve lidar com erro sem mensagem', () => {
        const error = new Error();
        
        errorHandler(error, req, res, next);

        expect(res.json.mock.calls[0][0].message).toBe('');
      });

      it('deve lidar com erro com mensagem vazia', () => {
        const error = { message: '' };
        
        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json.mock.calls[0][0].message).toBe('');
      });

      it('deve processar erro sem propriedade stack', () => {
        const error = { message: 'Error without stack' };
        
        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json.mock.calls[0][0].message).toBe('Error without stack');
      });
    });
  });
});
