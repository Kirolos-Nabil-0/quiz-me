import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    compatibilityDate: '2025-05-02'
  },
  build: {
    transpile: ['vuetify'],
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ar',
        dir: 'rtl'
      },
      title: 'كنيسة الانبا انطونيوس - نظام الامتحانات',
      meta: [
        { name: 'description', content: 'مراجعة الاولادلامتحان الدين المسيحي لكنيسة الانبا انطونيوس بشبرا الخيمة' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  modules: [
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
  ],
})
