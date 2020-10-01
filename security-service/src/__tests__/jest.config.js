module.exports = {
  preset: 'ts-jest',
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.[jt]s'],
};
