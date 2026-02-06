[![](https://img.shields.io/npm/v/%40standard-config%2Foxlint)](https://www.npmjs.com/package/@standard-config/oxlint)
[![](https://img.shields.io/github/actions/workflow/status/standard-config/oxlint/test.yaml)](https://github.com/standard-config/oxlint/actions/workflows/test.yaml)
[![](https://img.shields.io/codecov/c/github/standard-config/oxlint)](https://codecov.io/github/standard-config/oxlint)

# @standard-config/oxlint

Curated Oxlint config with sensible defaults. Carefully designed as a strict, environment-agnostic baseline for writing better TypeScript.

- If you’re migrating from [**xo**](https://github.com/xojs/xo) to Oxlint, you’ll feel right at home.
- For additional rules not yet implemented in Oxlint, see [**@standard-config/eslint**](https://github.com/standard-config/eslint).

## Install

```sh
npm install --save-dev @standard-config/oxlint
```

```sh
pnpm add --save-dev @standard-config/oxlint
```

## Usage

Create your `oxlint.config.ts`:

```ts
import { defineConfig } from '@standard-config/oxlint';

export default defineConfig();
```

You can override the defaults by passing your own [config options](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html).

```ts
import { defineConfig } from '@standard-config/oxlint';

export default defineConfig({
    rules: {
        'import/no-unassigned-import': 'off',
    },
});
```

## Related

- [**@standard-config/eslint**](https://github.com/standard-config/eslint)
- [**@standard-config/prettier**](https://github.com/standard-config/prettier)
- [**@standard-config/tsconfig**](https://github.com/standard-config/tsconfig)

## License

MIT © [Dom Porada](https://dom.engineering)
