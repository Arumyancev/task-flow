import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Theme } from '@/types'

const STORAGE_KEY = 'task-flow-theme'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<Theme>(Theme.LIGHT)

  // Load theme from localStorage
  const savedTheme = localStorage.getItem(STORAGE_KEY)
  if (savedTheme && Object.values(Theme).includes(savedTheme as Theme)) {
    currentTheme.value = savedTheme as Theme
  }

  // Apply theme to document
  function applyTheme(theme: Theme) {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.classList.toggle('dark-mode', theme === Theme.DARK)
  }

  // Watch theme changes and save to localStorage
  watch(
    currentTheme,
    (newTheme) => {
      localStorage.setItem(STORAGE_KEY, newTheme)
      applyTheme(newTheme)
    },
    { immediate: true },
  )

  function setTheme(theme: Theme) {
    currentTheme.value = theme
  }

  function toggleTheme() {
    currentTheme.value = currentTheme.value === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
  }

  return {
    currentTheme,
    setTheme,
    toggleTheme,
  }
})
