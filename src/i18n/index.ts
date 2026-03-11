import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import no from './locales/no.json'
import en from './locales/en.json'
import es from './locales/es.json'

const savedLang = localStorage.getItem('lang') ?? 'no'

i18n.use(initReactI18next).init({
  resources: {
    no: { translation: no },
    en: { translation: en },
    es: { translation: es },
  },
  lng: savedLang,
  fallbackLng: 'no',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng)
})

export default i18n
