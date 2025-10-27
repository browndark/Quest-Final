const { Movie } = require('../../src/models');
const { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } = require('../../src/controllers/movieController');

jest.mock('../../src/models', () => ({
  Movie: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn()
  }
}));

describe('MovieController - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('deve retornar todos os filmes com paginação', async () => {
      const mockMovies = [
        { _id: '1', title: 'Movie 1', genres: ['Action'] },
        { _id: '2', title: 'Movie 2', genres: ['Drama'] }
      ];

      Movie.countDocuments.mockResolvedValue(20);
      Movie.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockMovies)
      });

      await getMovies(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        pagination: expect.objectContaining({
          next: expect.any(Object)
        }),
        data: mockMovies
      });
    });

    it('deve filtrar filmes por gênero', async () => {
      req.query.genre = 'Action';

      const mockMovies = [
        { _id: '1', title: 'Movie 1', genres: ['Action'] }
      ];

      Movie.countDocuments.mockResolvedValue(1);
      Movie.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockMovies)
      });

      await getMovies(req, res, next);

      expect(Movie.find).toHaveBeenCalledWith({
        genres: { $in: ['Action'] }
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        pagination: {},
        data: mockMovies
      });
    });

    it('deve aplicar paginação corretamente', async () => {
      req.query.page = '2';
      req.query.limit = '5';

      Movie.countDocuments.mockResolvedValue(20);
      Movie.find.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      });

      await getMovies(req, res, next);

      const mockChain = Movie.find.mock.results[0].value;
      expect(mockChain.skip).toHaveBeenCalledWith(5); // (page 2 - 1) * limit 5
      expect(mockChain.limit).toHaveBeenCalledWith(5);
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      Movie.countDocuments.mockRejectedValue(error);

      await getMovies(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getMovieById', () => {
    it('deve retornar filme por ID válido do MongoDB', async () => {
      req.params.id = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectID

      const mockMovie = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Test Movie'
      };

      Movie.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockMovie)
      });

      await getMovieById(req, res, next);

      expect(Movie.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockMovie
      });
    });

    it('deve buscar filme por customId se ID não for ObjectId válido', async () => {
      req.params.id = '123'; // Not a valid MongoDB ObjectID

      const mockMovie = {
        customId: '123',
        title: 'Test Movie'
      };

      Movie.findOne.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockMovie)
      });

      await getMovieById(req, res, next);

      expect(Movie.findOne).toHaveBeenCalledWith({
        $or: [
          { customId: '123' },
          { title: expect.any(RegExp) }
        ]
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockMovie
      });
    });

    it('deve retornar erro 404 se filme não encontrado', async () => {
      req.params.id = '507f1f77bcf86cd799439011';

      Movie.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await getMovieById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Movie not found'
      });
    });

    it('deve retornar erro 400 em caso de erro de busca', async () => {
      req.params.id = '507f1f77bcf86cd799439011';

      const error = new Error('Database error');
      Movie.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(error)
      });

      await getMovieById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid movie ID format or movie not found',
        error: 'Database error'
      });
    });
  });

  describe('createMovie', () => {
    it('deve criar novo filme', async () => {
      req.body = {
        title: 'New Movie',
        synopsis: 'A great movie',
        director: 'Director Name',
        genres: ['Action'],
        duration: 120,
        classification: 'PG-13'
      };

      const mockMovie = {
        _id: '123',
        ...req.body
      };

      Movie.create.mockResolvedValue(mockMovie);

      await createMovie(req, res, next);

      expect(Movie.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockMovie
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Validation error');
      Movie.create.mockRejectedValue(error);

      await createMovie(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateMovie', () => {
    it('deve atualizar filme existente', async () => {
      req.params.id = '123';
      req.body = { title: 'Updated Title' };

      const mockMovie = { _id: '123', title: 'Old Title' };
      const updatedMovie = { _id: '123', title: 'Updated Title' };

      Movie.findById.mockResolvedValue(mockMovie);
      Movie.findByIdAndUpdate.mockResolvedValue(updatedMovie);

      await updateMovie(req, res, next);

      expect(Movie.findByIdAndUpdate).toHaveBeenCalledWith(
        '123',
        req.body,
        { new: true, runValidators: true }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: updatedMovie
      });
    });

    it('deve retornar erro 404 se filme não encontrado', async () => {
      req.params.id = '123';

      Movie.findById.mockResolvedValue(null);

      await updateMovie(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Movie not found'
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      Movie.findById.mockRejectedValue(error);

      await updateMovie(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteMovie', () => {
    it('deve deletar filme existente', async () => {
      req.params.id = '123';

      const mockMovie = {
        _id: '123',
        title: 'Movie to Delete',
        deleteOne: jest.fn().mockResolvedValue({})
      };

      Movie.findById.mockResolvedValue(mockMovie);

      await deleteMovie(req, res, next);

      expect(mockMovie.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Movie removed'
      });
    });

    it('deve retornar erro 404 se filme não encontrado', async () => {
      req.params.id = '123';

      Movie.findById.mockResolvedValue(null);

      await deleteMovie(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Movie not found'
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      Movie.findById.mockRejectedValue(error);

      await deleteMovie(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
