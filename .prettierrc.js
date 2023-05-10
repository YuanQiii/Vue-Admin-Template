module.exports = {
  tabWidth: 2,
  jsxSingleQuote: true,
  jsxBracketSameLine: true,
  printWidth: 100,
  singleQuote: true,
  semi: false,
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
  ],
  arrowParens: 'always',
  bracketSpacing: true,

  // husky + lint-staged
  husky: {
    hooks: {
      'pre-commit': 'lint-staged',
    },
  },
  'lint-staged': {
    '*.{js,vue,ts,jsx,tsx}': ['prettier --write', 'eslint --fix'],
    '*.{html,css,less,scss,md}': ['prettier --write'],
  },
}
