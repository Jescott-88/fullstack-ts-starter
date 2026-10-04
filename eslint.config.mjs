import eslint from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.tsbuildinfo'],
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    ...eslint.configs.recommended,
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      ...tseslint.configs.recommended[1].rules,
      ...tseslint.configs.recommended[2].rules,
    },
  },

  {
    files: ['apps/api/**/*.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },

  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.vite.rules,

      'react-refresh/only-export-components': [
        'error',
        {
          allowConstantExport: true,
          allowExportNames: ['buttonVariants'],
        },
      ],
    },
  },

  {
    files: ['packages/shared/**/*.ts'],
    languageOptions: {
      globals: globals.es2022,
    },
  },
)
