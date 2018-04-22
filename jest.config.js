module.exports = {
  'transform': {
    '^.+\\.ts$': 'ts-jest',
  },
  'testRegex': '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts)$',
  'moduleFileExtensions': [
    'ts',
    'js',
    'json',
    'node',
  ],
  'moduleDirectories': [
    'node_modules',
    'src'
  ],
  "moduleNameMapper": {
    "^~/(.*)$": "<rootDir>/src/$1"
  },
}
