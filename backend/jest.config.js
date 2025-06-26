module.exports = {
  rootDir: '../',
  testMatch: [
    '<rootDir>/tests/unit/services/*.test.js',
    '<rootDir>/tests/**/*.spec.js',
    '<rootDir>/__tests__/**/*.js'
  ],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/node_modules',
    'backend/node_modules',
    'frontend/node_modules'
  ],
  testEnvironment: 'node',
};
