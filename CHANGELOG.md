# Changelog

## 2.0.1 (10.06.2021)

Fixed several security vulnerabilities:

- [Use of a Broken or Risky Cryptographic Algorithm](https://github.com/advisories/GHSA-r9p9-mrjm-926w)
  in [elliptic](https://github.com/indutny/elliptic). Updated from 6.5.3 to
  6.5.4.
- [Regular Expression Denial of Service](https://github.com/advisories/GHSA-43f8-2h32-f4cj)
  in [hosted-git-info](https://github.com/npm/hosted-git-info). Updated from
  2.8.8 to 2.8.9.
- [Command Injection](https://github.com/advisories/GHSA-35jh-r3h4-6jhm) in
  [lodash](https://github.com/lodash/lodash). Updated from 4.17.20 to 4.17.21.

## 2.0.0 (09.12.2020)

⚠️ Breaking changes.

- Updated `remark` to version
  [13.0.0](https://github.com/remarkjs/remark/releases/tag/13.0.0).
- Updated `remark-preset-lint-markdown-style-guide` to version 4.0.0.
- Updated [.markdownlintrc.js](.markdownlintrc.js) to match new versions.
- Added [MIGRATION.md](MIGRATION.md).

## 1.2.1 (22.10.2020)

- Added LICENSE file.
- Updated the deps.

## 1.2.0 (15.07.2020)

- Updated README.md.
- Updated the deps.
- Turned on `fences` remark-stringify’s option.
- Turned off `embeddedLanguageFormatting` prettier’s option.
- Fixed `getFilesByPath` on macOS.

## 1.1.0 (14.08.2019)

- Added a possibility to pass file extensions using `--ext` option.

## 1.0.0 (26.04.2019)

- First version of the linter.

## 0.1.0 (18.12.2018)

- Init version.
