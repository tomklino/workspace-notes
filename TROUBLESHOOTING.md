# Development setup notes

## `better-sqlite3` fails to load

The error below means the native `better-sqlite3` binary was built for a different Node ABI:

```text
Module did not self-register: .../better_sqlite3.node
```

This project currently works with Node **22.23.1**. Node 24 has no prebuilt binary for the installed `better-sqlite3@11.10.0`; rebuilding under Node 24 also requires a local C/C++ toolchain (`make`, compiler, etc.).

Use Node 22, then rebuild the module whenever Node versions or `node_modules` change:

```bash
PATH="$HOME/.nvm/versions/node/v22.23.1/bin:$PATH" npm rebuild better-sqlite3
PATH="$HOME/.nvm/versions/node/v22.23.1/bin:$PATH" npm run dev
```

## Auth.js origin and secret warnings

`@sidebase/nuxt-auth` is configured to read these variables in `nuxt.config.ts`:

- `NUXT_AUTH_ORIGIN`
- `NUXT_AUTH_SECRET`

Set them in an untracked root `.env` file. For local development on the port selected by Nuxt:

```dotenv
NUXT_AUTH_ORIGIN=http://localhost:3030
NUXT_AUTH_SECRET=<a-long-random-secret>
```

Generate a secret with:

```bash
openssl rand -base64 32
```

Use the public HTTPS application URL for `NUXT_AUTH_ORIGIN` in production, and set both values through the host's secret/environment configuration. Do not commit `.env`; `.env.example` documents the required variables. Restart Nuxt after changing environment values.

Google sign-in additionally needs `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. In Google Cloud Console, configure this authorized redirect URI exactly (including port):

```text
http://localhost:3030/api/auth/callback/google
```

For production, replace `http://localhost:3030` with the public HTTPS value of `NUXT_AUTH_ORIGIN`. The application hides Google sign-in when either credential is absent instead of sending users to Auth.js's empty provider page.
