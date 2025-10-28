const {
  getTheaters,
  getTheaterById,
  createTheater,
  updateTheater,
  deleteTheater
} = require('../../src/controllers/theaterController');
const { Theater } = require('../../src/models');

jest.mock('../../src/models');

describe('TheaterController - Unit Tests', () => {
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

  describe('getTheaters', () => {
    it('deve retornar todos os teatros', async () => {
      const mockTheaters = [
        { _id: 'theater1', name: 'Theater 1', capacity: 100 },
        { _id: 'theater2', name: 'Theater 2', capacity: 150 }
      ];

      Theater.find = jest.fn().mockResolvedValue(mockTheaters);

      await getTheaters(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockTheaters
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      Theater.find = jest.fn().mockRejectedValue(error);

      await getTheaters(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getTheaterById', () => {
    it('deve retornar teatro por ID', async () => {
      const mockTheater = {
        _id: 'theater123',
        name: 'Test Theater',
        capacity: 100
      };

      const mockChain = {
        populate: jest.fn().mockResolvedValue(mockTheater)
      };
      Theater.findById = jest.fn().mockReturnValue(mockChain);

      req.params.id = 'theater123';
      await getTheaterById(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTheater
      });
    });

    it('deve retornar erro 404 se teatro não encontrado', async () => {
      const mockChain = {
        populate: jest.fn().mockResolvedValue(null)
      };
      Theater.findById = jest.fn().mockReturnValue(mockChain);

      req.params.id = 'theater123';
      await getTheaterById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Theater not found'
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      const mockChain = {
        populate: jest.fn().mockRejectedValue(error)
      };
      Theater.findById = jest.fn().mockReturnValue(mockChain);

      req.params.id = 'theater123';
      await getTheaterById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createTheater', () => {
    it('deve criar novo teatro', async () => {
      const mockTheater = {
        _id: 'theater123',
        name: 'New Theater',
        capacity: 200,
        type: '3D'
      };

      req.body = {
        name: 'New Theater',
        capacity: 200,
        type: '3D'
      };

      Theater.create = jest.fn().mockResolvedValue(mockTheater);

      await createTheater(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTheater
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Validation error');
      Theater.create = jest.fn().mockRejectedValue(error);

      req.body = { name: 'Test' };
      await createTheater(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateTheater', () => {
    it('deve atualizar teatro existente', async () => {
      const mockTheater = {
        _id: 'theater123',
        name: 'Old Name',
        capacity: 100
      };

      const updatedTheater = {
        _id: 'theater123',
        name: 'New Name',
        capacity: 150
      };

      Theater.findById = jest.fn().mockResolvedValue(mockTheater);
      Theater.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTheater);
      
      req.params.id = 'theater123';
      req.body = { name: 'New Name', capacity: 150 };

      await updateTheater(req, res, next);

      expect(Theater.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedTheater
      });
    });

    it('deve retornar erro 404 se teatro não encontrado', async () => {
      Theater.findById = jest.fn().mockResolvedValue(null);
      req.params.id = 'theater123';

      await updateTheater(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Theater not found'
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      Theater.findById = jest.fn().mockRejectedValue(error);

      req.params.id = 'theater123';
      await updateTheater(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteTheater', () => {
    it('deve deletar teatro existente', async () => {
      const mockTheater = {
        _id: 'theater123',
        deleteOne: jest.fn().mockResolvedValue({})
      };

      Theater.findById = jest.fn().mockResolvedValue(mockTheater);
      req.params.id = 'theater123';

      await deleteTheater(req, res, next);

      expect(mockTheater.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Theater removed'
      });
    });

    it('deve retornar erro 404 se teatro não encontrado', async () => {
      Theater.findById = jest.fn().mockResolvedValue(null);
      req.params.id = 'theater123';

      await deleteTheater(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Theater not found'
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      Theater.findById = jest.fn().mockRejectedValue(error);

      req.params.id = 'theater123';
      await deleteTheater(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
