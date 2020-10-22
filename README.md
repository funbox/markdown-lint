# @funboxteam/markdown-lint

<img align="right" width="192" height="159"
     alt="Avatar: Shiny Markdown logo with a sparkle"
     src="./logo.png">

[![npm](https://img.shields.io/npm/v/@funboxteam/markdown-lint.svg)](https://www.npmjs.com/package/@funboxteam/markdown-lint)

Markdown code style linter that makes your documentation looks nicer.

[По-русски](./README.ru.md)

## Rationale

Some projects have a lot of documentation inside the repos. Once we decided to
start linting their grammar and check for spelling errors. For that purpose we
built [languagetool-node](https://github.com/funbox/languagetool-node).

But at the same time we decided to lint the Markdown syntax of those files, as
we do with our JS, CSS, etc files. And we’ve created this linter.

## Getting Started

To install the tool and use it globally run:

```bash
npm install -g @funboxteam/markdown-lint
```

To install the tool into the project and setup pre-commit hook run:

```bash
npm install --dev husky lint-staged @funboxteam/markdown-lint
```

## Project Setup

To automatically lint Markdown files on precommit you should setup `husky` and
`lint-staged` to work with `markdown-lint` in your project’s package.json.

Example:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.md": [
      "markdown-lint --fix --typograph"
    ]
  }
}
```

## CLI Usage

To check files and directories manually you should run `markdown-lint`:

```bash
# check the passed file
markdown-lint README.md

# check all the files inside the passed directory (w/o recursive search)
markdown-lint ./docs

# check all the files inside the passed directory (recursively)
markdown-lint -r ./docs

# check the passed file and automatically fix errors
markdown-lint --fix README.md
```

### Options

- `--fix` — automatically fix errors.
- `--ext <value>` — specify file extensions (default: `md`). It’s possible to
  set several extensions like this: `--ext apib --ext txt`.
- `-t, --typograph` — run typograph over the text inside the files.
- `-r, --recursive` — search for files in the subdirectories of the passed
  directory.
- `-c, --config <file>` — use external config file instead of default one.
- `-v, --version` — show current tool version.
- `-h, --help` — show help.

## Configuration

The linter works upon the Markdown processor called
[remark](https://github.com/remarkjs/remark).

The linting itself works is done by
[remark-lint](https://github.com/remarkjs/remark-lint) and the set of rules
defined in
[remark-preset-lint-markdown-style-guide](https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-markdown-style-guide#rules).

You may use your own configuration file by passing the path to that file using
`--config` option:

```bash
markdown-lint --fix --config ~/.markdownlintrc.js README.md
```

Example of configuration file:

```javascript
module.exports = {
  // prettier is used when `--fix` is passed
  prettier: {
    // hard wrap lines to 120 characters
    printWidth: '120'
  },

  remark: {
    // plugins for remark-lint
    plugins: [
      // print errors when there're lines longer that 120 characters
      [require('remark-lint-maximum-line-length'), 120],

      // disable rule `no-inline-padding`
      [require('remark-lint-no-inline-padding'), false],

      // set `*` as the only allowed marker for unordered list
      [require('remark-lint-unordered-list-marker-style'), '*']
    ],

    // settings for remark-stringify which is used when `--fix` is passed
    stringifySettings: {
      // automatically replace list markers to `*`
      bullet: '*'
    }
  },

  typograf: {
    // rules API — https://github.com/typograf/typograf/blob/dev/docs/api_rules.md
    // list of ruls — https://github.com/typograf/typograf/blob/dev/docs/RULES.en-US.md
    locale: ['ru', 'en-US'],
    enableRules: [],
    disableRules: [
      // these rules have to be turned off to make it possible to use typograph
      'common/space/delTrailingBlanks',
      'common/space/trimLeft',
      'common/space/trimRight'
    ],
    rulesSettings: []
  }
};
```

## Example

### Original text

```markdown
Linux kernel
============

There are several guides for kernel developers and users. These guides can be rendered in a number of formats, like HTML and PDF. Please read Documentation/admin-guide/README.rst first.

In order to build the documentation, use ``make htmldocs`` or ``make pdfdocs``.  The formatted documentation can also be read online at:

    https://www.kernel.org/doc/html/latest/

There are various text files in the Documentation/ subdirectory, several of them using the Restructured Text markup notation.

Please read the Documentation/process/changes.rst file, as it contains the requirements for building and running the kernel, and information about the problems which may result by upgrading your kernel.

__Useful links__

* [Linux kernel licensing rules](https://www.kernel.org/doc/html/latest/process/license-rules.html#kernel-licensing)
* [Reporting bugs](https://www.kernel.org/doc/html/latest/admin-guide/reporting-bugs.html)
```

### The text processed with `--fix` option enabled

````markdown
# Linux kernel

There are several guides for kernel developers and users. These guides can be
rendered in a number of formats, like HTML and PDF. Please read
Documentation/admin-guide/README.rst first.

In order to build the documentation, use `make htmldocs` or `make pdfdocs`. The
formatted documentation can also be read online at:

```
https://www.kernel.org/doc/html/latest/
```

There are various text files in the Documentation/ subdirectory, several of them
using the Restructured Text markup notation.

Please read the Documentation/process/changes.rst file, as it contains the
requirements for building and running the kernel, and information about the
problems which may result by upgrading your kernel.

**Useful links**

- [Linux kernel licensing rules](https://www.kernel.org/doc/html/latest/process/license-rules.html#kernel-licensing)
- [Reporting bugs](https://www.kernel.org/doc/html/latest/admin-guide/reporting-bugs.html)
````

## Credits

Shiny picture for the project was made by
[Igor Garybaldi](https://pandabanda.com/).

[![Sponsored by FunBox](https://funbox.ru/badges/sponsored_by_funbox_centered.svg)](https://funbox.ru)
