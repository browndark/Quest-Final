const { User } = require('../../src/models');
const { register, login, getProfile, updateProfile } = require('../../src/controllers/authController');
const generateToken = require('../../src/utils/generateToken');

// Mock do modelo User
jest.mock('../../src/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn()
  }
}));

// Mock do generateToken
jest.mock('../../src/utils/generateToken');

describe('AuthController - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar novo usuário com sucesso', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      });
      generateToken.mockReturnValue('fake-token');

      await register(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(User.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          email: 'test@example.com',
          token: 'fake-token'
        })
      });
    });

    it('deve retornar erro 400 se usuário já existe', async () => {
      req.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue({ email: 'existing@example.com' });

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User already exists'
      });
    });

    it('deve retornar erro 400 se dados inválidos', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(null);

      await register(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid user data'
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      User.findOne.mockRejectedValue(error);

      await register(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      req.body = {
        email: 'user@example.com',
        password: 'password123'
      };

      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'user@example.com',
        role: 'user',
        matchPassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      generateToken.mockReturnValue('fake-token');

      await login(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          email: 'user@example.com',
          token: 'fake-token'
        })
      });
    });

    it('deve retornar erro 401 com credenciais inválidas', async () => {
      req.body = {
        email: 'user@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        matchPassword: jest.fn().mockResolvedValue(false)
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password'
      });
    });

    it('deve retornar erro 401 se usuário não existe', async () => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await login(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password'
      });
    });
  });

  describe('getProfile', () => {
    it('deve retornar perfil do usuário autenticado', async () => {
      req.user = { _id: '123' };

      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };

      User.findById.mockResolvedValue(mockUser);

      await getProfile(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser
      });
    });

    it('deve retornar erro 404 se usuário não encontrado', async () => {
      req.user = { _id: '123' };

      User.findById.mockResolvedValue(null);

      await getProfile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });
  });

  describe('updateProfile', () => {
    it('deve atualizar nome do usuário', async () => {
      req.user = { _id: '123' };
      req.body = { name: 'New Name' };

      const mockUser = {
        _id: '123',
        name: 'Old Name',
        email: 'test@example.com',
        role: 'user',
        save: jest.fn().mockResolvedValue({
          _id: '123',
          name: 'New Name',
          email: 'test@example.com',
          role: 'user'
        })
      };

      User.findById.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('new-token');

      await updateProfile(req, res, next);

      expect(mockUser.name).toBe('New Name');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: expect.objectContaining({
          name: 'New Name',
          token: 'new-token'
        })
      });
    });

    it('deve atualizar senha com senha atual correta', async () => {
      req.user = { _id: '123' };
      req.body = {
        currentPassword: 'oldpass',
        newPassword: 'newpass123'
      };

      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        password: 'hashedOldPass',
        matchPassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue({
          _id: '123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        })
      };

      User.findById.mockResolvedValue(mockUser);
      generateToken.mockReturnValue('new-token');

      await updateProfile(req, res, next);

      expect(mockUser.matchPassword).toHaveBeenCalledWith('oldpass');
      expect(mockUser.password).toBe('newpass123');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('deve retornar erro 401 se senha atual incorreta', async () => {
      req.user = { _id: '123' };
      req.body = {
        currentPassword: 'wrongpass',
        newPassword: 'newpass123'
      };

      const mockUser = {
        matchPassword: jest.fn().mockResolvedValue(false)
      };

      User.findById.mockResolvedValue(mockUser);

      await updateProfile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Senha atual incorreta'
      });
    });

    it('deve retornar erro 404 se usuário não encontrado', async () => {
      req.user = { _id: '123' };

      User.findById.mockResolvedValue(null);

      await updateProfile(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });
  });
});
