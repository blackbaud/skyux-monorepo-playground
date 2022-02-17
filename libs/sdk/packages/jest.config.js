module.exports = {
  displayName: 'sdk-packages',
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/sdk/packages',
  coverageThreshold: {
    global: {
      branches: 87.5,
      functions: 100,
      lines: 98.16,
      statements: 98.24,
    },
  },
};
