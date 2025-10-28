const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../../src/controllers/userController');
const { User } = require('../../src/models');

jest.mock('../../src/models');

describe('UserController - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { _id: 'admin123', role: 'admin' }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('deve retornar todos os usuários sem senha', async () => {
      const mockUsers = [
        { _id: 'user1', name: 'User 1', email: 'user1@test.com' },
        { _id: 'user2', name: 'User 2', email: 'user2@test.com' }
      ];

      const mockChain = {
        select: jest.fn().mockResolvedValue(mockUsers)
      };
      User.find = jest.fn().mockReturnValue(mockChain);

      await getUsers(req, res, next);

      expect(mockChain.select).toHaveBeenCalledWith('-password');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockUsers
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      const mockChain = {
        select: jest.fn().mockRejectedValue(error)
      };
      User.find = jest.fn().mockReturnValue(mockChain);

      await getUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserById', () => {
    it('deve retornar usuário por ID sem senha', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@test.com'
      };

      const mockChain = {
        select: jest.fn().mockResolvedValue(mockUser)
      };
      User.findById = jest.fn().mockReturnValue(mockChain);

      req.params.id = 'user123';
      await getUserById(req, res, next);

      expect(mockChain.select).toHaveBeenCalledWith('-password');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser
      });
    });

    it('deve retornar erro 404 se usuário não encontrado', async () => {
      const mockChain = {
        select: jest.fn().mockResolvedValue(null)
      };
      User.findById = jest.fn().mockReturnValue(mockChain);

      req.params.id = 'user123';
      await getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      const mockChain = {
        select: jest.fn().mockRejectedValue(error)
      };
      User.findById = jest.fn().mockReturnValue(mockChain);

      req.params.id = 'user123';
      await getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateUser', () => {
    it('deve atualizar usuário existente', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'Old Name',
        email: 'old@test.com',
        role: 'user',
        save: jest.fn().mockResolvedValue({
          _id: 'user123',
          name: 'New Name',
          email: 'new@test.com',
          role: 'admin'
        })
      };

      const mockChain = {
        select: jest.fn().mockResolvedValue({
          _id: 'user123',
          name: 'New Name',
          email: 'new@test.com',
          role: 'admin'
        })
      };
      User.findById = jest.fn()
        .mockResolvedValueOnce(mockUser)
        .mockReturnValueOnce(mockChain);

      req.params.id = 'user123';
      req.body = { name: 'New Name', email: 'new@test.com', role: 'admin' };

      await updateUser(req, res, next);

      expect(mockUser.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('deve atualizar senha se fornecida', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'User',
        password: 'oldpass',
        save: jest.fn().mockResolvedValue({
          _id: 'user123',
          name: 'User'
        })
      };

      const mockChain = {
        select: jest.fn().mockResolvedValue({ _id: 'user123', name: 'User' })
      };
      User.findById = jest.fn()
        .mockResolvedValueOnce(mockUser)
        .mockReturnValueOnce(mockChain);

      req.params.id = 'user123';
      req.body = { password: 'newpassword123' };

      await updateUser(req, res, next);

      expect(mockUser.password).toBe('newpassword123');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('deve retornar erro 404 se usuário não encontrado', async () => {
      User.findById = jest.fn().mockResolvedValue(null);
      req.params.id = 'user123';

      await updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      User.findById = jest.fn().mockRejectedValue(error);

      req.params.id = 'user123';
      await updateUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteUser', () => {
    it('deve deletar usuário existente', async () => {
      const mockUser = {
        _id: 'user123',
        deleteOne: jest.fn().mockResolvedValue({})
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);
      req.params.id = 'user123';

      await deleteUser(req, res, next);

      expect(mockUser.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'User removed'
      });
    });

    it('deve retornar erro 404 se usuário não encontrado', async () => {
      User.findById = jest.fn().mockResolvedValue(null);
      req.params.id = 'user123';

      await deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      User.findById = jest.fn().mockRejectedValue(error);

      req.params.id = 'user123';
      await deleteUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
