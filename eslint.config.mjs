import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules', 'dist'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'none', // Ignore unused function parameters
          vars: 'all', // Enforce the rule for variables
          argsIgnorePattern: '^_', // Optionally ignore parameters prefixed with `_`
        },
      ],
      'no-unused-expressions': 'error',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-undef': 'error',
    },
  },
];
