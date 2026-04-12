<script setup lang="ts">
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { Theme } from '@/types'
import MainLayout from '@/layouts/MainLayout.vue'
import ModalContainer from '@/components/common/ModalContainer.vue'

const { currentTheme } = useTheme()

const appClass = computed(() => ({
  'dark-mode': currentTheme.value === Theme.DARK,
}))
</script>

<template>
  <div class="app-container" :class="appClass">
    <MainLayout>
      <RouterView />
    </MainLayout>
    <ModalContainer />
  </div>
</template>

<style>
@import './assets/main.css';
</style>
