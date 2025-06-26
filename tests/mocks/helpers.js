// tests/mocks/helpers.js

const resetAllMocks = () => {
  jest.clearAllMocks();
  jest.resetAllMocks();
};

const simulateDbError = (mockFn) => {
  mockFn.mockRejectedValue(new Error('Database error simulated'));
};

const simulateTimeout = (mockFn, delayMs) => {
  mockFn.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, delayMs)));
};

module.exports = {
  resetAllMocks,
  simulateDbError,
  simulateTimeout,
};
