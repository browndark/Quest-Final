const { Reservation, Session, User } = require('../../src/models');
const {
  getReservations,
  getMyReservations,
  getReservationById,
  createReservation,
  updateReservationStatus,
  deleteReservation
} = require('../../src/controllers/reservationController');

jest.mock('../../src/models', () => ({
  Reservation: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn()
  },
  Session: {
    findById: jest.fn()
  },
  User: {}
}));

describe('ReservationController - Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {},
      user: { _id: 'user123', role: 'user' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getReservations', () => {
    it('deve retornar todas as reservas com paginação', async () => {
      const mockReservations = [
        { _id: '1', user: 'user1', session: 'session1' },
        { _id: '2', user: 'user2', session: 'session2' }
      ];

      Reservation.countDocuments.mockResolvedValue(20);
      Reservation.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockReservations)
      });

      await getReservations(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        pagination: expect.any(Object),
        data: mockReservations
      });
    });

    it('deve chamar next() em caso de erro', async () => {
      const error = new Error('Database error');
      Reservation.countDocuments.mockRejectedValue(error);

      await getReservations(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getMyReservations', () => {
    it('deve retornar reservas do usuário autenticado', async () => {
      const mockReservations = [
        { _id: '1', user: 'user123', session: 'session1' }
      ];

      Reservation.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockReservations)
      });

      await getMyReservations(req, res, next);

      expect(Reservation.find).toHaveBeenCalledWith({ user: 'user123' });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: mockReservations
      });
    });
  });

  describe('getReservationById', () => {
    it('deve retornar reserva se usuário é o dono', async () => {
      req.params.id = 'reservation123';

      const mockReservation = {
        _id: 'reservation123',
        user: { _id: { toString: () => 'user123' } },
        session: 'session1'
      };

      // Mock do encadeamento: findById().populate().populate()
      const mockChain = {
        populate: jest.fn().mockReturnThis()
      };
      // O último populate retorna a reserva
      mockChain.populate.mockResolvedValueOnce(mockChain).mockResolvedValueOnce(mockReservation);

      Reservation.findById.mockReturnValue(mockChain);

      await getReservationById(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReservation
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 404 se reserva não encontrada', async () => {
      req.params.id = 'reservation123';

      const mockChain = {
        populate: jest.fn().mockReturnThis()
      };
      mockChain.populate.mockResolvedValueOnce(mockChain).mockResolvedValueOnce(null);

      Reservation.findById.mockReturnValue(mockChain);

      await getReservationById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Reservation not found'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 403 se usuário não é dono nem admin', async () => {
      req.params.id = 'reservation123';
      req.user = { _id: 'otherUser', role: 'user' };

      const mockReservation = {
        _id: 'reservation123',
        user: { _id: { toString: () => 'user123' } },
        session: 'session1'
      };

      const mockChain = {
        populate: jest.fn().mockReturnThis()
      };
      mockChain.populate.mockResolvedValueOnce(mockChain).mockResolvedValueOnce(mockReservation);

      Reservation.findById.mockReturnValue(mockChain);

      await getReservationById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this reservation'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve permitir acesso se usuário é admin', async () => {
      req.params.id = 'reservation123';
      req.user = { _id: 'admin123', role: 'admin' };

      const mockReservation = {
        _id: 'reservation123',
        user: { _id: { toString: () => 'user123' } },
        session: 'session1'
      };

      const mockChain = {
        populate: jest.fn().mockReturnThis()
      };
      mockChain.populate.mockResolvedValueOnce(mockChain).mockResolvedValueOnce(mockReservation);

      Reservation.findById.mockReturnValue(mockChain);

      await getReservationById(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReservation
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('createReservation', () => {
    it('deve criar reserva com assentos disponíveis', async () => {
      req.body = {
        session: 'session123',
        seats: [
          { row: 'A', number: 1, type: 'full' },
          { row: 'A', number: 2, type: 'half' }
        ],
        paymentMethod: 'credit_card'
      };

      const mockSession = {
        _id: 'session123',
        fullPrice: 20,
        halfPrice: 10,
        seats: [
          { row: 'A', number: 1, status: 'available' },
          { row: 'A', number: 2, status: 'available' }
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      const mockReservation = {
        _id: 'reservation123',
        user: 'user123',
        session: 'session123',
        seats: req.body.seats,
        totalPrice: 30,
        populate: jest.fn().mockResolvedValue({
          _id: 'reservation123',
          totalPrice: 30
        })
      };

      Session.findById.mockResolvedValue(mockSession);
      Reservation.create.mockResolvedValue(mockReservation);

      await createReservation(req, res, next);

      expect(Session.findById).toHaveBeenCalledWith('session123');
      expect(Reservation.create).toHaveBeenCalledWith(expect.objectContaining({
        user: 'user123',
        session: 'session123',
        totalPrice: 30,
        status: 'confirmed'
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('deve retornar erro 404 se sessão não encontrada', async () => {
      req.body = {
        session: 'session123',
        seats: [{ row: 'A', number: 1, type: 'full' }]
      };

      Session.findById.mockResolvedValue(null);

      await createReservation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Session not found'
      });
    });

    it('deve retornar erro 400 se assentos não estão disponíveis', async () => {
      req.body = {
        session: 'session123',
        seats: [{ row: 'A', number: 1, type: 'full' }]
      };

      const mockSession = {
        seats: [
          { row: 'A', number: 1, status: 'occupied' }
        ]
      };

      Session.findById.mockResolvedValue(mockSession);

      await createReservation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('not available')
      });
    });
  });

  describe('updateReservationStatus', () => {
    it('deve atualizar status da reserva', async () => {
      req.params.id = 'reservation123';
      req.body = { status: 'confirmed' };

      const mockReservation = {
        _id: 'reservation123',
        status: 'pending',
        save: jest.fn().mockResolvedValue({
          _id: 'reservation123',
          status: 'confirmed'
        })
      };

      Reservation.findById.mockResolvedValue(mockReservation);

      await updateReservationStatus(req, res, next);

      expect(mockReservation.status).toBe('confirmed');
      expect(mockReservation.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.any(Object)
      });
    });

    it('deve retornar erro 400 com status inválido', async () => {
      req.params.id = 'reservation123';
      req.body = { status: 'invalid_status' };

      await updateReservationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('valid status')
      });
    });

    it('deve liberar assentos ao cancelar reserva', async () => {
      req.params.id = 'reservation123';
      req.body = { status: 'cancelled' };

      const mockSession = {
        seats: [
          { row: 'A', number: 1, status: 'occupied' }
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      const mockReservation = {
        _id: 'reservation123',
        status: 'confirmed',
        session: 'session123',
        seats: [{ row: 'A', number: 1 }],
        save: jest.fn().mockResolvedValue(true)
      };

      Reservation.findById.mockResolvedValue(mockReservation);
      Session.findById.mockResolvedValue(mockSession);

      await updateReservationStatus(req, res, next);

      expect(mockSession.save).toHaveBeenCalled();
      expect(mockSession.seats[0].status).toBe('available');
    });

    it('deve retornar erro 404 se reserva não encontrada', async () => {
      req.params.id = 'reservation123';
      req.body = { status: 'cancelled' };

      Reservation.findById.mockResolvedValue(null);

      await updateReservationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Reservation not found'
      });
    });
  });

  describe('deleteReservation', () => {
    it('deve deletar reserva e liberar assentos', async () => {
      req.params.id = 'reservation123';

      const mockSession = {
        seats: [
          { row: 'A', number: 1, status: 'occupied' }
        ],
        save: jest.fn().mockResolvedValue(true)
      };

      const mockReservation = {
        _id: 'reservation123',
        session: 'session123',
        seats: [{ row: 'A', number: 1 }],
        deleteOne: jest.fn().mockResolvedValue(true)
      };

      Reservation.findById.mockResolvedValue(mockReservation);
      Session.findById.mockResolvedValue(mockSession);

      await deleteReservation(req, res, next);

      expect(mockSession.seats[0].status).toBe('available');
      expect(mockSession.save).toHaveBeenCalled();
      expect(mockReservation.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Reservation removed'
      });
    });

    it('deve retornar erro 404 se reserva não encontrada', async () => {
      req.params.id = 'reservation123';

      Reservation.findById.mockResolvedValue(null);

      await deleteReservation(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Reservation not found'
      });
    });
  });
});
