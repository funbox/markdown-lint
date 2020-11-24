module.exports = {
  prettier: {
    parser: 'markdown',
    printWidth: 80,
    proseWrap: 'always',
    singleQuote: true,
    arrowParens: 'avoid',
    embeddedLanguageFormatting: 'off',
  },
  remark: {
    plugins: [
      require('remark-preset-lint-markdown-style-guide'),
      [require('remark-lint-list-item-indent'), 'space'],
      [require('remark-lint-list-item-spacing'), { checkBlanks: true }],
      [require('remark-lint-ordered-list-marker-value'), 'ordered'],
      [require('remark-lint-emphasis-marker'), 'consistent'],
    ],

    stringifySettings: {
      bullet: '-',
      listItemIndent: 'one',
      fences: true,
    }
  },
  typograf: {
    locale: ['ru', 'en-US'],
    enableRules: [],
    disableRules: [
      // these rules must be disabled to prevent incorrect typograf—markdown integration
      'common/space/delTrailingBlanks',
      'common/space/trimLeft',
      'common/space/trimRight'
    ],
    rulesSettings: []
  }
};
