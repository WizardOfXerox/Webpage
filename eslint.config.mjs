// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';

export default [
    // { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
    // Base configuration using recommended rules
    //js.configs.recommended,

    {
        languageOptions: {
            ecmaVersion: 'latest', // Use the latest ECMAScript version
            sourceType: 'module', // Enable ES Modules
            globals: {
                ...globals.node, // Node.js global variables
                ...globals.es2021, // ES2021 global variables
                ...globals.browser, // Browser global variables
            },
        },
        rules: {
            // Possible errors
            // 'no-console': 'off', // Allow console statements (useful for Node.js development)
            // 'no-undef': 'error', // Disallow undefined variables

            // Best practices
            // 'curly': 'error', // Enforce consistent brace style for all control statements
            // 'eqeqeq': 'error', // Require the use of === and !==
            // 'no-var': 'error', // Disallow var, encourage let/const

            // Stylistic choices
            // 'quotes': ['error', 'single'], // Enforce single quotes
            // 'semi': ['error', 'always'], // Enforce semicolons
            // 'indent': ['error', 2], // Enforce consistent indentation (2 spaces)
            // 'comma-dangle': ['error', 'always-multiline'], // Require trailing commas in multiline statements
        },
        ignores: [
            'node_modules/', // Ignore node_modules folder
            'dist/', // Ignore build output directory
            'Webpage/', // Ignore static files (served by Express)
        ],
    },
];