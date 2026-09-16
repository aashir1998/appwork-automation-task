const js = require('@eslint/js');
const cypress = require('eslint-plugin-cypress');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'cypress/downloads/**',
      'cypress/reports/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['cypress/**/*.js'],
    ...cypress.configs.recommended,
    languageOptions: {
      ...cypress.configs.recommended.languageOptions,
      sourceType: 'module',
      ecmaVersion: 2022,
    },
  },
  {
    files: ['cypress.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      ecmaVersion: 2022,
      globals: globals.node,
    },
  },
  {
    rules: {
      'no-debugger': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^(https?:)?\\/\\//i]',
          message:
            'Do not hardcode URLs — use an env var (e.g. CYPRESS_BASE_URL / Cypress.config("baseUrl")) instead.',
        },
        {
          selector: 'TemplateElement[value.raw=/^(https?:)?\\/\\//i]',
          message:
            'Do not hardcode URLs — use an env var (e.g. CYPRESS_BASE_URL / Cypress.config("baseUrl")) instead.',
        },
      ],
    },
  },
];
