

# Firefox Command Bar


<img width="731" alt="Screenshot 2025-02-21 at 23 49 42" src="https://github.com/user-attachments/assets/1e4947f1-fce6-40d0-b00a-7f3c8c29d653" />


A simple command bar for Firefox that let's you search your tabs by title and URL, and switch between them using the keyboard.
You can also search the web and eventually you might be able to do more.

## Requirements

- [Node.js](https://nodejs.org/en/) >= 18
- [pnpm](https://pnpm.io/) >= 6
- [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) >= 6

## Installation

Install dependencies using `npm`:
```bash
npm install
```


## Development

You can run the parcel hot-reload server using:

```bash
npm run start
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
