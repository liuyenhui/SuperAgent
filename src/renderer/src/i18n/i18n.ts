import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@renderer/assets/locales/en.json'
import zh from '@renderer/assets/locales/zh.json'

const language = 'en'

const defaultLanguage = language

const defaultNamespace = 'default'

const resources = {
  en: {
    [defaultNamespace]: en
  },
  zh: {
    [defaultNamespace]: zh
  }
}
i18n.use(initReactI18next).init({
  defaultNS: defaultNamespace,
  ns: [defaultNamespace],
  resources,
  lng: defaultLanguage,
  fallbackLng: defaultLanguage,
  interpolation: {
    escapeValue: false
  }
})
