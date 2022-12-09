require('@rushstack/eslint-patch/modern-module-resolution')

const DOMGlobals = ['window', 'document']
const NodeGlobals = ['module', 'require']

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-unused-vars': [
      'error',
      // we are only using this rule to check for unused arguments since TS
      // catches unused variables but not args.
      { varsIgnorePattern: '.*', args: 'none' }
    ],
    // most of the codebase are expected to be env agnostic
    'no-restricted-globals': ['error', ...DOMGlobals, ...NodeGlobals],
    // since we target ES2015 for baseline support, we need to forbid object
    // rest spread usage (both assign and destructure)
    'no-restricted-syntax': [
      'error',
      'ObjectExpression > SpreadElement',
      'ObjectPattern > RestElement'
    ]
  },
  overrides: [
    {
      env: {
        'vue/setup-compiler-macros': true
      },
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      extends: [
        'plugin:vue/vue3-recommended',
        '@vue/eslint-config-typescript/recommended'
      ],
      rules: {
        'vue/multi-word-component-names': 'off',
        'vue/first-attribute-linebreak': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/max-attributes-per-line': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off'
      }
    },
    // tests, no restrictions (runs in Node / jest with jsdom)
    {
      files: ['**/__tests__/**'],
      rules: {
        'no-restricted-globals': 'off',
        'no-restricted-syntax': 'off'
      }
    },
    // Packages targeting DOM
    {
      files: ['web/**'],
      rules: {
        'no-restricted-globals': ['error', ...NodeGlobals]
      }
    },
    // Packages targeting Node
    {
      files: ['packages/minesweeper/**'],
      rules: {
        'no-restricted-globals': ['error', ...DOMGlobals],
        'no-restricted-syntax': 'off'
      }
    }
  ]
}
