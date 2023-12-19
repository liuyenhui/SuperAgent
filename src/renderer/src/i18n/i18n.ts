import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@renderer/assets/locales/en.json'
import zh from '@renderer/assets/locales/en.json'

export const defaultLanguage = 'zh'

export const defaultNamespace = 'default'

export const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  }
}
export async function usei18n(): Promise<void> {
  await i18n.use(initReactI18next).init({
    // defaultNS: defaultNamespace,
    // ns: [defaultNamespace],
    resources,
    lng: defaultLanguage
    // fallbackLng: defaultLanguage,
    // interpolation: {
    //   escapeValue: false
    // }
  })
}
