// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    // global ignores
    {
        ignores: ["dist/", "node_modules/", "swagger-main.js", "swagger.js"],
    },
    eslint.configs.recommended,
    // ...tseslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // hehehe
        },
    },
);
