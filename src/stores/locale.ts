import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Locale } from '@/types'
import { i18n } from '@/i18n'

const STORAGE_KEY = 'task-flow-locale'

export const useLocaleStore = defineStore('locale', () => {
  const currentLocale = ref<Locale>(Locale.EN)

  // Load locale from localStorage
  const savedLocale = localStorage.getItem(STORAGE_KEY)
  if (savedLocale && Object.values(Locale).includes(savedLocale as Locale)) {
    currentLocale.value = savedLocale as Locale
  }

  // Watch locale changes and save to localStorage
  watch(
    currentLocale,
    (newLocale) => {
      localStorage.setItem(STORAGE_KEY, newLocale)
      i18n.global.locale.value = newLocale
    },
    { immediate: true },
  )

  function setLocale(locale: Locale) {
    currentLocale.value = locale
  }

  return {
    currentLocale,
    setLocale,
  }
})
