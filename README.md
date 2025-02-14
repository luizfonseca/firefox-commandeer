## Requirements

- [Node.js](https://nodejs.org/en/) >= 18
- [pnpm](https://pnpm.io/) >= 6
- [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) >= 6

## Installation

We are using [pnpm](https://pnpm.io/) as our package manager. You can install it globally using npm:
```bash
# install pnpm
npm i -G pnpm

# install dependencies
pnpm install
```


## Development

You can run the parcel hot-reload server using:

```bash
npn run start
```

You can then proceed to `about:debugging` on Firefox and load the extension from the `dist` folder.


## Build & Package

Packaging depends on `web-ext` being installed. You can use `brew` or other tools.

You can build the extension using:

```bash
npm run build
```

Package the extension using:

```bash
npm run package
```
