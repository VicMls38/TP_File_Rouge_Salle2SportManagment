const bookingService = require('../../../backend/src/services/bookingService');
const bookingRepository = require('../../../backend/src/repositories/bookingRepository');
const classService = require('../../../backend/src/services/classService');
const userService = require('../../../backend/src/services/userService');

jest.mock('../../../backend/src/repositories/bookingRepository');
jest.mock('../../../backend/src/services/classService');
jest.mock('../../../backend/src/services/userService');

describe('BookingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Création de réservation (capacités, double réservation, créneau)
  describe('createBooking', () => {
    const userId = 1;
    const classId = 10;
    const classItem = {
      id: classId,
      datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      duration: 60,
      capacity: 2,
      cancelled: false,
    };

    it('cas passant : crée une réservation', async () => {
      userService.getUserById.mockResolvedValue({ id: userId });
      classService.getClassById.mockResolvedValue(classItem);
      classService.canBookClass.mockReturnValue(true);
      bookingRepository.findByUserAndClass.mockResolvedValue(null);
      bookingRepository.findUserBookingsInTimeSlot.mockResolvedValue([]);
      bookingRepository.create.mockResolvedValue({ id: 123, userId, classId, status: 'CONFIRMED' });

      const result = await bookingService.createBooking({ userId, classId });
      expect(result).toHaveProperty('status', 'CONFIRMED');
      expect(bookingRepository.create).toHaveBeenCalled();
    });

    it('cas non passant : classe pleine', async () => {
      userService.getUserById.mockResolvedValue({ id: userId });
      classService.getClassById.mockResolvedValue(classItem);
      classService.canBookClass.mockReturnValue(false);
      classService.isClassFull.mockReturnValue(true);

      await expect(bookingService.createBooking({ userId, classId }))
        .rejects.toThrow('Class is full');
    });

    it('cas non passant : classe annulée', async () => {
      userService.getUserById.mockResolvedValue({ id: userId });
      classService.getClassById.mockResolvedValue(classItem);
      classService.canBookClass.mockReturnValue(false);
      classService.isClassFull.mockReturnValue(false);
      classService.isClassCancelled.mockReturnValue(true);

      await expect(bookingService.createBooking({ userId, classId }))
        .rejects.toThrow('Class is cancelled');
    });

    it('cas non passant : double réservation', async () => {
      userService.getUserById.mockResolvedValue({ id: userId });
      classService.getClassById.mockResolvedValue(classItem);
      classService.canBookClass.mockReturnValue(true);
      bookingRepository.findByUserAndClass.mockResolvedValue({ id: 99 });
      bookingRepository.findUserBookingsInTimeSlot.mockResolvedValue([]);

      await expect(bookingService.createBooking({ userId, classId }))
        .rejects.toThrow('User already has a booking for this class');
    });

    it('cas non passant : réservation sur créneau déjà réservé', async () => {
      userService.getUserById.mockResolvedValue({ id: userId });
      classService.getClassById.mockResolvedValue(classItem);
      classService.canBookClass.mockReturnValue(true);
      bookingRepository.findByUserAndClass.mockResolvedValue(null);
      bookingRepository.findUserBookingsInTimeSlot.mockResolvedValue([{ id: 88 }]);

      await expect(bookingService.createBooking({ userId, classId }))
        .rejects.toThrow('User already has a booking at this time slot');
    });
  });

  // 2. Annulation de réservation (tardive, autorisation, limite)
  describe('cancelBooking', () => {
    const bookingId = 42;
    const userId = 1;
    const classDatetime = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
    const booking = {
      id: bookingId,
      userId,
      class: { datetime: classDatetime }
    };

    afterEach(() => {
      jest.restoreAllMocks(); // Restaure tous les spies sur le prototype
    });

    it('cas passant : annulation autorisée', async () => {
      jest.spyOn(require('../../../backend/src/services/bookingService').__proto__, 'getBookingById').mockResolvedValue(booking);
      bookingRepository.updateStatus.mockResolvedValue({ ...booking, status: 'CANCELLED' });

      const result = await bookingService.cancelBooking(bookingId, userId);
      expect(result.status).toBe('CANCELLED');
      expect(bookingRepository.updateStatus).toHaveBeenCalledWith(bookingId, 'CANCELLED');
    });

    it('cas non passant : annulation trop tardive', async () => {
      const lateBooking = {
        ...booking,
        class: { datetime: new Date(Date.now() + 30 * 60 * 1000).toISOString() }
      };
      jest.spyOn(require('../../../backend/src/services/bookingService').__proto__, 'getBookingById').mockResolvedValue(lateBooking);
      bookingRepository.updateStatus.mockResolvedValue({ ...lateBooking, status: 'NO_SHOW' });

      const result = await bookingService.cancelBooking(bookingId, userId);
      expect(result.status).toBe('NO_SHOW');
      expect(bookingRepository.updateStatus).toHaveBeenCalledWith(bookingId, 'NO_SHOW');
    });

    it('cas non passant : utilisateur non autorisé', async () => {
      jest.spyOn(require('../../../backend/src/services/bookingService').__proto__, 'getBookingById').mockResolvedValue({ ...booking, userId: 999 });
      await expect(bookingService.cancelBooking(bookingId, userId))
        .rejects.toThrow('Unauthorized to cancel this booking');
    });
  });

  // 3. Statistiques utilisateur (cas normal, limite)
  describe('getUserBookingStats', () => {
    const userId = 1;
    const now = new Date();
    const bookings = [
      { status: 'CONFIRMED', class: { datetime: new Date(now - 3600000).toISOString(), duration: 60 } },
      { status: 'CANCELLED', class: { datetime: new Date(now - 7200000).toISOString(), duration: 60 } },
      { status: 'NO_SHOW', class: { datetime: new Date(now - 10800000).toISOString(), duration: 60 } },
      { status: 'CONFIRMED', class: { datetime: new Date(now + 3600000).toISOString(), duration: 45 } }
    ];

    it('cas passant : calcule les stats', async () => {
      bookingRepository.findByUserId.mockResolvedValue(bookings);
      const stats = await bookingService.getUserBookingStats(userId);
      expect(stats.totalBookings).toBe(4);
      expect(stats.confirmedBookings).toBe(2);
      expect(stats.cancelledBookings).toBe(1);
      expect(stats.noShowBookings).toBe(1);
      expect(stats.totalMinutes).toBe(105); // 60 (passé) + 45 (futur) car le code additionne tous les bookings confirmés
    });

    it('cas limite : aucun booking', async () => {
      bookingRepository.findByUserId.mockResolvedValue([]);
      const stats = await bookingService.getUserBookingStats(userId);
      expect(stats.totalBookings).toBe(0);
      expect(stats.totalMinutes).toBe(0);
    });
  });

  // 4. Suppression de réservation (cas passant, non passant)
  describe('deleteBooking', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('cas passant : supprime une réservation existante', async () => {
      jest.spyOn(require('../../../backend/src/services/bookingService').__proto__, 'getBookingById').mockResolvedValue({ id: 1 });
      bookingRepository.delete.mockResolvedValue(true);
      const result = await bookingService.deleteBooking(1);
      expect(result).toBe(true);
    });

    it('cas non passant : réservation inexistante', async () => {
      jest.spyOn(require('../../../backend/src/services/bookingService').__proto__, 'getBookingById').mockRejectedValue(new Error('Booking not found'));
      await expect(bookingService.deleteBooking(999)).rejects.toThrow('Booking not found');
    });
  });

  // 5. Récupération d'une réservation par ID (cas passant, non passant)
  describe('getBookingById', () => {
    afterEach(() => {
      jest.restoreAllMocks(); // Restaure tous les mocks après chaque test
    });
    it('cas passant : réservation trouvée', async () => {
      bookingRepository.findById.mockResolvedValue({ id: 1 });
      // bookingService.getBookingById n'est pas mocké ici
      const result = await bookingService.getBookingById(1);
      expect(result).toHaveProperty('id', 1);
    });

    it('cas non passant : réservation non trouvée', async () => {
      bookingRepository.findById.mockResolvedValue(null);
      await expect(bookingService.getBookingById(999)).rejects.toThrow('Booking not found');
    });
  });
});