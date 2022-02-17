module.exports = {
  displayName: 'sdk-prettier-schematics',
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
  coverageDirectory: '../../../coverage/libs/sdk/prettier-schematics',
  coverageThreshold: {
    global: {
      branches: 87.5,
      functions: 96.29,
      lines: 98.16,
      statements: 98.24,
    },
  },
};
