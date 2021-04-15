module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ["__tests__/integration/"],
    setupFilesAfterEnv: ['./jest.setup.js'],
  };

  jest.setTimeout(10000);