# Workspace Notes

An app to keep daily notes for multi-tasker requirements


## Setup

Make sure to install the dependencies:

```bash
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
cp -r /home/tomklino/notes /tmp
export DATA_DIR=/tmp/notes
npm run dev
```

In windows do that

```ps
$env:DATA_DIR='C:\Users\USER\Documents\Notes'
```

## Build for local use

Build the application for local use:

1. Bump the version in the `package.json` file
2. From the repository root direcotyr, run:

    ```bash
    version=$(jq -r '.version' package.json)
    npm run build
    cp -r .output ~/workspace-notes-builds/v${version}
    ```

3. In `~/.zshrc`, update the function `notes-browser`:

```
function notes-browser() {
    version=v0.2.0
    HOST=localhost NUXT_DATA_DIR=${HOME}/notes node ${HOME}/workspace-notes-builds/${version}/server/index.mjs
}
```

## Nuxt Documentation

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
