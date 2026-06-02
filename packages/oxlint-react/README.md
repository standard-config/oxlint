<p align="center">
    <a href="https://github.com/standard-config/oxlint">
        <img
            src="https://github.com/standard-config/.github/blob/main/.github/assets/standard-config-oxlint@3x.png?raw=true"
            width="500"
            alt=""
        />
    </a>
</p>

<h1 align="center">@standard&#8209;config/oxlint&#8209;react</h1>

<p align="center">Curated Oxlint config with sensible React&nbsp;defaults.</p>

<p align="center">
    <a href="https://npmx.dev/package/@standard-config/oxlint-react"
        ><img
            src="https://img.shields.io/npm/v/%40standard-config%2Foxlint-react?style=flat-square"
            alt=""
    /></a>
    <a href="https://github.com/standard-config/oxlint/actions/workflows/test.yaml"
        ><img
            src="https://img.shields.io/github/actions/workflow/status/standard-config/oxlint/test.yaml?style=flat-square"
            alt=""
    /></a>
    <a href="https://codecov.io/github/standard-config/oxlint"
        ><img
            src="https://img.shields.io/codecov/c/github/standard-config/oxlint?style=flat-square"
            alt=""
    /></a>
</p>

<div>&nbsp;</div>

## Overview

Supplemental config for [**@standard-config/oxlint**](https://github.com/standard-config/oxlint), with React-related rules from Oxlint and [ESLint React](https://eslint-react.xyz).

## Install

```sh
npm install --save-dev @standard-config/oxlint-react
```

```sh
pnpm add --save-dev @standard-config/oxlint-react
```

## Usage

If you already [use the core config](https://github.com/standard-config/oxlint#usage), there’s no need to modify `oxlint.config.ts`. Installed supplemental config packages are detected and applied automatically.

```ts
import { defineConfig } from '@standard-config/oxlint';

// Will automatically include `@standard-config/oxlint-react`
export default defineConfig();
```

## FAQ

### Do I need to install ESLint?

This config loads an ESLint plugin via Oxlint’s [JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html). If you encounter any ESLint-related errors, you may need to install `eslint` in your project.

And if you only want to suppress missing peer dependency warnings, you can [configure `pnpm`](https://pnpm.io/settings#peerdependencyrules) not to flag `eslint`:

<!-- prettier-ignore-start -->

```yaml
peerDependencyRules:
  ignoreMissing:
    - eslint
```

<!-- prettier-ignore-end -->

> [!NOTE]
>
> Additional questions can be [found here](https://github.com/standard-config/oxlint#faq).

## Related

- [**@standard-config/prettier**](https://github.com/standard-config/prettier)
- [**@standard-config/tsconfig**](https://github.com/standard-config/tsconfig)

## License

MIT © [Dom Porada](https://dom.engineering)
