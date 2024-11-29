import stylistic from '@stylistic/eslint-plugin'
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginQuery from '@tanstack/eslint-plugin-query'

export default [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'tailwind.config.js',
      'next.config.js',
      'postcss.config.js',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      '@next/next': nextPlugin,
    },
    rules: {
      ...reactPlugin.configs['jsx-runtime'].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'error',
    },
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/jsx-quotes': ['warn', 'prefer-double'],
    }
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...pluginQuery.configs['flat/recommended'],
]
