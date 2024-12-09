import stylistic from '@stylistic/eslint-plugin'
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    {
        ignores: [
            '.next/**',
            'external/**',
            'node_modules/**',
            'tailwind.config.js',
            'next.config.js',
            'postcss.config.js',
            'eslint.config.mjs',
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
            '@next/next/no-img-element': 'off',
            "react-hooks/exhaustive-deps": 'off'
        },
    },
    {
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            '@stylistic/jsx-quotes': ['warn', 'prefer-double'],
            '@stylistic/object-curly-spacing': ['warn', 'always'],
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
    {
        rules: {
            "@typescript-eslint/ban-ts-comment": "off",
        }
    }
]
