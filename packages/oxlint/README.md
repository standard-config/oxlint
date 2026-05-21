> [!CAUTION]
>
> This document refers to an upcoming version of the package.

<div>&nbsp;</div>

<h1 align="center">@standard&#8209;config/oxlint</h1>

<p align="center">Curated Oxlint config with sensible&nbsp;defaults.</p>

<p align="center">
    <a href="https://npmx.dev/package/@standard-config/oxlint"
        ><img
            src="https://img.shields.io/npm/v/%40standard-config%2Foxlint?style=flat-square"
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

Curated Oxlint config with sensible defaults. Designed as a careful, environment-agnostic baseline for writing better TypeScript. Comes with [supplemental configs](#supplemental-configs) that extend the core ruleset.

If you’re migrating from [**xo**](https://github.com/xojs/xo), you’ll feel right at home.

## Install

```sh
npm install --save-dev @standard-config/oxlint
```

```sh
pnpm add --save-dev @standard-config/oxlint
```

For [type-aware linting](https://oxc.rs/docs/guide/usage/linter/type-aware.html), make sure `oxlint` and `oxlint-tsgolint` are both installed.

## Usage

Create your `oxlint.config.ts`:

```ts
import { defineConfig } from '@standard-config/oxlint';

export default defineConfig();
```

### Overrides

You can override the defaults by passing your own [config options](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html).

```ts
import { defineConfig } from '@standard-config/oxlint';

export default defineConfig({
    rules: {
        'typescript/consistent-type-definitions': ['error', 'interface'],
    },
});
```

### Supplemental Configs

While **@standard-config/oxlint** relies only on Oxlint’s core rules, the supplemental config packages extend the baseline rule coverage with additional plugins, including [JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html).

<table>
    <thead>
        <tr>
            <th
                align="left"
                width="450"
            >
                Package
            </th>
            <th
                align="left"
                width="300"
            >
                Core Plugins
            </th>
            <th
                align="left"
                width="300"
            >
                JS Plugins
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th align="left">
                <a href="https://github.com/standard-config/oxlint/tree/main/packages/oxlint-react">@standard&#8209;config/oxlint&#8209;react</a>
            </th>
            <td>
                <code>react</code>
                <br />
                <code>react&#8209;perf</code>
                <br />
                <code>jsx&#8209;a11y</code>
            </td>
            <td>
                <a href="https://eslint-react.xyz"><code>react&#8209;x</code></a>
            </td>
        </tr>
        <tr>
            <th align="left">
                <a href="https://github.com/standard-config/oxlint/tree/main/packages/oxlint-stylistic">@standard&#8209;config/oxlint&#8209;stylistic</a>
            </th>
            <td>—</td>
            <td>
                <a href="https://eslint.style"><code>stylistic</code></a>
                <br />
                <a href="https://perfectionist.dev"><code>perfectionist</code></a>
            </td>
        </tr>
    </tbody>
</table>

## FAQ

### Does this config require any specific TypeScript configuration?

No, it works with any `tsconfig.json`. For matching compiler defaults, pair it with [**@standard-config/tsconfig**](https://github.com/standard-config/tsconfig), though it is not required.

### Does this config enable any rule categories?

No. The config explicitly defines every enabled and disabled rule for each core plugin used. Any [`categories`](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html#categories) you set will only apply to the plugins you enable.

```ts
import { defineConfig } from '@standard-config/oxlint';

export default defineConfig({
    plugins: ['nextjs'],
    categories: {
        // Only applies to `next/*` rules
        correctness: 'error',
        suspicious: 'warn',
    },
});
```

### Can I use this config with Vite+?

Absolutely. In your `vite.config.ts`:

```ts
import { defineOxlintConfig } from '@standard-config/oxlint';
import { defineConfig } from 'vite-plus';

export default defineConfig({
    lint: defineOxlintConfig({
        rules: {
            // Optional overrides
        },
    }),
});
```

## Related

- [**@standard-config/prettier**](https://github.com/standard-config/prettier)
- [**@standard-config/tsconfig**](https://github.com/standard-config/tsconfig)

## License

MIT © [Dom Porada](https://dom.engineering)
