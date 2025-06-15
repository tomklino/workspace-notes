// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // to set: `export NUXT_DATA_DIR=value`
    dataDir: process.env['DATA_DIR'],
    // Auth secret - set via NUXT_AUTH_SECRET env var
    authSecret: process.env['NUXT_AUTH_SECRET']
  },
  devtools: { enabled: true },
  auth: {
    isEnabled: true,
    originEnvKey: "NUXT_AUTH_ORIGIN",
    provider: {
      type: 'authjs',
      trustHost: false,
      defaultProvider: 'google',
      addDefaultCallbackUrl: true
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@sidebase/nuxt-auth'
  ]
})
