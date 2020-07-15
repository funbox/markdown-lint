module.exports = {
  prettier: {
    parser: 'markdown',
    printWidth: 80,
    proseWrap: 'always',
    singleQuote: true,
    arrowParens: 'avoid',
    /*
      TODO: Option `embeddedLanguageFormatting` will be available in prettier@2.1.0
       (current version is 2.0.5), so we have to switch to prettier@next.
       Some day after 2.1.0 release we have to switch to the stable version.
     */
    embeddedLanguageFormatting: 'off',
  },
  remark: {
    plugins: [
      require('remark-preset-lint-markdown-style-guide'),
      [require('remark-lint-list-item-indent'), 'space'],
      [require('remark-lint-list-item-spacing'), { checkBlanks: true }],
      [require('remark-lint-ordered-list-marker-value'), 'ordered'],
    ],

    stringifySettings: {
      listItemIndent: '1',
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
