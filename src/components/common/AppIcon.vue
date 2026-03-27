<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { Component } from 'vue'

interface Props {
  name: string
  size?: number | string
  strokeWidth?: number
  color?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  strokeWidth: 2,
})

// Динамически импортируем иконку
const IconComponent = computed<Component>(() => {
  return defineAsyncComponent(() =>
    import('lucide-vue-next').then((module) => {
      const iconName = props.name
      // @ts-ignore - dynamic import
      return module[iconName] || module.HelpCircle
    }),
  )
})

const iconSize = computed(() => {
  if (typeof props.size === 'number') {
    return props.size
  }
  return props.size
})
</script>

<template>
  <component
    :is="IconComponent"
    :size="iconSize"
    :stroke-width="strokeWidth"
    :color="color"
    :class="props.class"
  />
</template>

<style scoped>
/* Иконки наследуют цвет от родителя по умолчанию */
:deep(svg) {
  display: inline-block;
  vertical-align: middle;
}
</style>
