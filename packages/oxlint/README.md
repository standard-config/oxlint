<div>&nbsp;</div>

<h1 align="center">@standard&#8209;config/oxlint</h1>

<p align="center">Curated Oxlint config with sensible&nbsp;defaults.</p>

<p align="center">
    <a href="https://www.npmx.dev/package/@standard-config/oxlint"
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

## Install

```sh
npm install --save-dev @standard-config/oxlint
```

```sh
pnpm add --save-dev @standard-config/oxlint
```

For [type-aware linting](https://oxc.rs/docs/guide/usage/linter/type-aware.html), make sure both `oxlint` and `oxlint-tsgolint` are installed.

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

## Related

- [**@standard-config/prettier**](https://github.com/standard-config/prettier)
- [**@standard-config/tsconfig**](https://github.com/standard-config/tsconfig)

## License

MIT © [Dom Porada](https://dom.engineering)
