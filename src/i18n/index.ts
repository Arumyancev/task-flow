import { createI18n } from 'vue-i18n'
import en from './locales/en'
import ru from './locales/ru'
import zh from './locales/zh'
import { Locale } from '@/types'

export const i18n = createI18n({
  legacy: false,
  locale: Locale.EN,
  fallbackLocale: Locale.EN,
  messages: {
    [Locale.EN]: en,
    [Locale.RU]: ru,
    [Locale.ZH]: zh,
  },
})
