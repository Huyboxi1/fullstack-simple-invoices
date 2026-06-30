import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import prettier from 'eslint-config-prettier'

export default tseslint.config([
  globalIgnores([
    'dist',
    'node_modules',
    'coverage',
    '*.config.js',
    '*.config.ts',
    '.next',
    '.vercel',
    'public',
    'build',
    'out',
    '.env*',
    '.DS_Store',
    'routeTree.gen.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      // reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'prettier/prettier': 'error',
    },
    plugins: {
      prettier: (await import('eslint-plugin-prettier')).default,
    },
  },
])
