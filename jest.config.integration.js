module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ["__tests__/integration/"],
  };

  jest.setTimeout(10000);