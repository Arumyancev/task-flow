<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const currentTime = ref(new Date())
let intervalId: number | null = null

// Обновляем время каждую секунду
onMounted(() => {
  intervalId = window.setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// Форматирование времени
const formattedTime = () => {
  return currentTime.value.toLocaleTimeString(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Форматирование даты
const formattedDate = () => {
  return currentTime.value.toLocaleDateString(locale.value, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Получаем день недели отдельно для стилизации
const dayOfWeek = () => {
  return currentTime.value.toLocaleDateString(locale.value, {
    weekday: 'long',
  })
}

// Получаем дату
const dateString = () => {
  return currentTime.value.toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <div class="datetime-widget">
    <div class="time-display">
      {{ formattedTime() }}
    </div>
    <div class="date-display">
      <div class="day-of-week">{{ dayOfWeek() }}</div>
      <div class="date-string">{{ dateString() }}</div>
    </div>
  </div>
</template>

<style scoped>
.datetime-widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border-radius: var(--radius-lg);
  color: white;
  min-height: 200px;
}

.time-display {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-variant-numeric: tabular-nums;
}

.date-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  text-align: center;
}

.day-of-week {
  font-size: var(--font-2xl);
  font-weight: var(--font-semibold);
  text-transform: capitalize;
  opacity: 0.95;
}

.date-string {
  font-size: var(--font-lg);
  font-weight: var(--font-medium);
  opacity: 0.85;
  text-transform: capitalize;
}

@media (max-width: 768px) {
  .time-display {
    font-size: 3rem;
  }

  .day-of-week {
    font-size: var(--font-xl);
  }

  .date-string {
    font-size: var(--font-md);
  }
}

@media (max-width: 480px) {
  .time-display {
    font-size: 2.5rem;
  }

  .datetime-widget {
    padding: var(--spacing-xl);
  }
}
</style>
