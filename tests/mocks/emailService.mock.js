// tests/mocks/emailService.mock.js
const mockEmailService = {
  sendEmail: jest.fn().mockResolvedValue(true),
  sendBookingConfirmation: jest.fn().mockResolvedValue(true),
  sendCancellationNotice: jest.fn().mockResolvedValue(true),
};

module.exports = {
  mockEmailService,
};
