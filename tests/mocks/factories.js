// tests/mocks/factories.js
const { faker } = require('@faker-js/faker');

const createMockUser = () => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  subscriptionActive: faker.datatype.boolean(),
});

const createMockClass = () => ({
  id: faker.datatype.uuid(),
  name: faker.word.noun(),
  capacity: faker.datatype.number({ min: 5, max: 30 }),
});

const createMockBooking = () => ({
  id: faker.datatype.uuid(),
  userId: faker.datatype.uuid(),
  classId: faker.datatype.uuid(),
  date: faker.date.future().toISOString(),
  status: 'confirmed',
});

module.exports = {
  createMockUser,
  createMockClass,
  createMockBooking,
};
