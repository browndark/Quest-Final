const {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  deleteSession
} = require('../../src/controllers/sessionController');
const { Session, Movie, Theater } = require('../../src/models');

// Mock models
jest.mock('../../src/models');

describe('SessionController - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {},
      user: { _id: 'admin123', role: 'admin' }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('getSessions', () => {
    it('deve retornar todas as sessões com paginação', async () => {
      const mockSessions = [
        { _id: 'session1', movie: 'movie1', theater: 'theater1' },
        { _id: 'session2', movie: 'movie2', theater: 'theater2' }
      ];

      Session.countDocuments = jest.fn().mockResolvedValue(2);
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockSessions)
      };
      Session.find = jest.fn().mockReturnValue(mockChain);

      await getSessions(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        pagination: {},
        data: mockSessions
      });
    });

    it('deve filtrar por filme', async () => {
      req.query.movie = 'movie123';

      Session.countDocuments = jest.fn().mockResolvedValue(1);
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      };
      Session.find = jest.fn().mockReturnValue(mockChain);

      await getSessions(req, res, next);

      expect(Session.find).toHaveBeenCalledWith({ movie: 'movie123' });
    });

    it('deve filtrar por data', async () => {
      req.query.date = '2025-10-28';

      Session.countDocuments = jest.fn().mockResolvedValue(0);
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      };
      Session.find = jest.fn().mockReturnValue(mockChain);

      await getSessions(req, res, next);

      const callArg = Session.find.mock.calls[0][0];
      expect(callArg.datetime).toBeDefined();
      expect(callArg.datetime.$gte).toBeInstanceOf(Date);
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      Session.countDocuments = jest.fn().mockRejectedValue(error);

      await getSessions(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getSessionById', () => {
    it('deve retornar sessão por ID', async () => {
      const mockSession = {
        _id: 'session123',
        movie: { title: 'Test Movie' },
        theater: { name: 'Test Theater' }
      };

      const secondPopulate = jest.fn().mockResolvedValue(mockSession);
      const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });
      Session.findById = jest.fn().mockReturnValue({ populate: firstPopulate });

      req.params.id = 'session123';
      await getSessionById(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSession
      });
    });

    it('deve retornar erro 404 se sessão não encontrada', async () => {
      const secondPopulate = jest.fn().mockResolvedValue(null);
      const firstPopulate = jest.fn().mockReturnValue({ populate: secondPopulate });
      Session.findById = jest.fn().mockReturnValue({ populate: firstPopulate });

      req.params.id = 'session123';
      await getSessionById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Session not found'
      });
    });
  });

  describe('createSession', () => {
    it('deve criar nova sessão', async () => {
      const mockSession = {
        _id: 'session123',
        movie: 'movie123',
        theater: 'theater123',
        datetime: new Date(),
        price: 25
      };

      req.body = {
        movie: 'movie123',
        theater: 'theater123',
        datetime: new Date(),
        price: 25
      };

      Movie.findById = jest.fn().mockResolvedValue({ _id: 'movie123' });
      Theater.findById = jest.fn().mockResolvedValue({ _id: 'theater123', capacity: 100 });
      Session.create = jest.fn().mockResolvedValue(mockSession);

      await createSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSession
      });
    });

    it('deve retornar erro 404 se filme não encontrado', async () => {
      req.body = { movie: 'movie123', theater: 'theater123' };

      Movie.findById = jest.fn().mockResolvedValue(null);

      await createSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Movie not found'
      });
    });

    it('deve retornar erro 404 se teatro não encontrado', async () => {
      req.body = { movie: 'movie123', theater: 'theater123' };

      Movie.findById = jest.fn().mockResolvedValue({ _id: 'movie123' });
      Theater.findById = jest.fn().mockResolvedValue(null);

      await createSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Theater not found'
      });
    });
  });

  describe('updateSession', () => {
    it('deve atualizar sessão existente', async () => {
      const mockSession = {
        _id: 'session123',
        movie: 'movie123',
        price: 25
      };

      const updatedSession = {
        _id: 'session123',
        movie: 'movie123',
        price: 30
      };

      Session.findById = jest.fn().mockResolvedValue(mockSession);
      Session.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedSession);
      
      req.params.id = 'session123';
      req.body = { price: 30 };

      await updateSession(req, res, next);

      expect(Session.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedSession
      });
    });

    it('deve retornar erro 404 se sessão não encontrada', async () => {
      Session.findById = jest.fn().mockResolvedValue(null);
      req.params.id = 'session123';

      await updateSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Session not found'
      });
    });
  });

  describe('deleteSession', () => {
    it('deve deletar sessão existente', async () => {
      const mockSession = {
        _id: 'session123',
        deleteOne: jest.fn().mockResolvedValue({})
      };

      Session.findById = jest.fn().mockResolvedValue(mockSession);
      req.params.id = 'session123';

      await deleteSession(req, res, next);

      expect(mockSession.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Session removed'
      });
    });

    it('deve retornar erro 404 se sessão não encontrada', async () => {
      Session.findById = jest.fn().mockResolvedValue(null);
      req.params.id = 'session123';

      await deleteSession(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Session not found'
      });
    });
  });
});
