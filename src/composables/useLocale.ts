import { useLocaleStore } from '@/stores/locale'
import { storeToRefs } from 'pinia'

export function useLocale() {
  const localeStore = useLocaleStore()
  const { currentLocale } = storeToRefs(localeStore)
  const { setLocale } = localeStore

  return {
    currentLocale,
    setLocale,
  }
}
