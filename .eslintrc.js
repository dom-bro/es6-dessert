module.exports = {
  'extends': 'standard',

  'rules': {
    'no-new': 0,
    'one-var': 0,
    'no-throw-literal': 0,
    'comma-dangle': [2, {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'no-trailing-spaces': [2, {
      skipBlankLines: true,
      ignoreComments: true,
    }],
  },

  'globals': {
    '$': false,
  }
}
