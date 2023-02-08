# [Deprecated] Move to https://github.com/open-v2x/omega


# OpenV2X Centerview

> Centerview is OpenV2X central portal

1. [目录树介绍](./docs/1-Catalog-introduction.md)
2. [如何开发](./docs/2-How-to-develop.md)
3. [国际化](./docs/3-I18n-introduction.md)

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

> If you have trouble downloading the dependencies, try the following

> `npm config set registry https://registry.npmmirror.com`

> or

> `yarn config set registry https://registry.npmmirror.com`

## Provided Scripts

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```
