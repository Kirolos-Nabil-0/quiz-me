// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'easterCompetitionTheme',
      themes: {
        easterCompetitionTheme: {
          dark: false,
          colors: {
            primary: '#7B68EE', // Bright Easter purple
            secondary: '#FFD700', // Easter gold
            accent: '#87CEFA', // Light sky blue (representing resurrection/new life)
            background: '#FFF8E1', // Light warm cream (representing purity)
            surface: '#FFF8E1',
            error: '#B71C1C',
            success: '#66BB6A', // Bright green (representing new life)
            warning: '#FFA000',
            info: '#29B6F6',
          }
        },
        orthodoxTheme: {
          dark: false,
          colors: {
            primary: '#963634', // Deep burgundy red (traditional Orthodox red)
            secondary: '#D4AF37', // Byzantine gold 
            accent: '#1F4788', // Royal blue (often used in icons)
            background: '#F7F3E8', // Off-white/parchment color
            surface: '#F7F3E8',
            error: '#B71C1C',
            success: '#2E7D32', // Forest green (representing life)
            warning: '#F57F17',
            info: '#0288D1',
          }
        },
        light: {
          dark: false,
          colors: {
            primary: '#1867C0',
            secondary: '#5CBBF6',
          }
        }
      }
    },
    defaults: {
      global: {
        ripple: true,
      },
    },
    locale: {
      rtl: {
        ar: true
      },
    }
  })
  app.vueApp.use(vuetify)
})
