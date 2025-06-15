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
export NUXT_DATA_DIR=/tmp/notes
# Optionally choose a different port
export PORT=3030
npm run dev
```

## Build for local use

Build the application for local use:

1. Bump the version in the `package.json` file
2. From the repository root directory, run:

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
