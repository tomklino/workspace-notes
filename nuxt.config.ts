// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    //TODO read from external source (env var, external conf file)
    dataDir: '/home/tomklino/notes/september.d/workspaces-2023-09-12/'
  },
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
  ]
})
