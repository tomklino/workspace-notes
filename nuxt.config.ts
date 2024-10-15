// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    // to set: `export NUXT_DATA_DIR=value`
    dataDir: process.env['DATA_DIR']
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
  ]
})
