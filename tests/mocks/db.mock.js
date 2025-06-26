// tests/mocks/db.mock.js
const mockUserRepository = {
  findById: jest.fn().mockImplementation((id) => {
    return Promise.resolve({ id, name: 'Mock User', email: 'mockuser@example.com' });
  }),
  create: jest.fn().mockResolvedValue({ id: '1', name: 'Created User', email: 'created@example.com' }),
  update: jest.fn().mockResolvedValue(true),
  delete: jest.fn().mockResolvedValue(true),
  // Ajoutez d'autres méthodes selon besoins...
};

const mockClassRepository = {
  findAll: jest.fn().mockResolvedValue([
    { id: 'class1', name: 'Yoga', capacity: 20 },
    { id: 'class2', name: 'Crossfit', capacity: 15 },
  ]),
  // ...
};

module.exports = {
  mockUserRepository,
  mockClassRepository,
};
