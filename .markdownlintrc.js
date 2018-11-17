module.exports = {
  prettier: {
    parser: 'markdown',
    printWidth: 80,
    proseWrap: 'always',
    singleQuote: true,
  },
  remark: {
    plugins: [
      require('remark-preset-lint-markdown-style-guide'),
      [require('remark-lint-list-item-indent'), 'space'],
      [require('remark-lint-list-item-spacing'), { checkBlanks: true }],
      [require('remark-lint-ordered-list-marker-value'), 'ordered'],
    ],

    // `remark-stringify`
    settings: {
      listItemIndent: '1',
    }
  }
};
