<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'
import { Theme, Locale } from '@/types'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/common/AppIcon.vue'

const { currentTheme, toggleTheme } = useTheme()
const { currentLocale, setLocale } = useLocale()
const { t } = useI18n()
const route = useRoute()
</script>

<template>
  <div class="layout">
    <header class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="logo">{{ t('common.appName') }}</h1>
        </div>
        <nav class="nav">
          <RouterLink to="/" :class="{ active: route.name === 'dashboard' }">
            {{ t('nav.dashboard') }}
          </RouterLink>
          <RouterLink to="/kanban" :class="{ active: route.name === 'kanban' }">
            {{ t('nav.kanban') }}
          </RouterLink>
          <RouterLink to="/calendar" :class="{ active: route.name === 'calendar' }">
            {{ t('nav.calendar') }}
          </RouterLink>
          <RouterLink to="/tasks" :class="{ active: route.name === 'tasks' }">
            {{ t('nav.tasks') }}
          </RouterLink>
        </nav>
        <div class="header-actions">
          <select
            :value="currentLocale"
            @change="setLocale(($event.target as HTMLSelectElement).value as Locale)"
            class="locale-select"
          >
            <option :value="Locale.EN">{{ t('locale.en') }}</option>
            <option :value="Locale.RU">{{ t('locale.ru') }}</option>
            <option :value="Locale.ZH">{{ t('locale.zh') }}</option>
          </select>
          <button @click="toggleTheme" class="theme-toggle" :title="t('theme.toggle')">
            <AppIcon v-if="currentTheme === Theme.LIGHT" name="Moon" :size="20" />
            <AppIcon v-else name="Sun" :size="20" />
          </button>
        </div>
      </div>
    </header>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: var(--spacing-lg);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: var(--font-xl);
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.nav {
  display: flex;
  gap: var(--spacing-sm);
}

.nav a {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.nav a:hover {
  color: var(--color-text);
  background-color: var(--color-background-soft);
}

.nav a.active {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.locale-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.locale-select:hover {
  border-color: var(--color-border-hover);
}

.locale-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.theme-toggle {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.theme-toggle:hover {
  border-color: var(--color-border-hover);
  transform: scale(1.05);
}

.main {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-lg);
}

@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    height: auto;
    padding: var(--spacing-md);
  }

  .nav {
    order: 3;
    width: 100%;
    justify-content: space-around;
    padding-top: var(--spacing-md);
  }

  .nav a {
    font-size: var(--font-sm);
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>
