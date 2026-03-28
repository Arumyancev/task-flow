<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modalId: string
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  danger?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  confirmText: '',
  cancelText: '',
  danger: false,
})

const emit = defineEmits<{
  close: [confirmed: boolean]
  dismiss: []
}>()

const { t } = useI18n()

function handleConfirm() {
  emit('close', true)
}

function handleCancel() {
  emit('dismiss')
}
</script>

<template>
  <div class="confirm-dialog">
    <div class="dialog-icon" :class="{ danger }">
      <AppIcon v-if="danger" name="AlertTriangle" :size="48" stroke-width="1.5" />
      <AppIcon v-else name="HelpCircle" :size="48" stroke-width="1.5" />
    </div>

    <div class="dialog-content">
      <h3 v-if="title" class="dialog-title">{{ title }}</h3>
      <p class="dialog-message">{{ message }}</p>
    </div>

    <div class="dialog-actions">
      <button type="button" class="btn btn-secondary" @click="handleCancel">
        <AppIcon name="X" :size="18" />
        {{ cancelText || t('common.cancel') }}
      </button>
      <button type="button" class="btn" :class="danger ? 'btn-danger' : 'btn-primary'" @click="handleConfirm">
        <AppIcon name="Check" :size="18" />
        {{ confirmText || t('common.delete') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.confirm-dialog {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md);
  text-align: center;
}

.dialog-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--color-info-light);
  color: var(--color-info);
}

.dialog-icon.danger {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.dialog-content {
  max-width: 400px;
}

.dialog-title {
  font-size: var(--font-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-sm) 0;
}

.dialog-message {
  font-size: var(--font-md);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--leading-relaxed);
}

.dialog-actions {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
  justify-content: center;
  padding-top: var(--spacing-md);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-md);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 120px;
  justify-content: center;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-danger {
  background-color: var(--color-danger);
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background-color: var(--color-background-mute);
  border-color: var(--color-border-hover);
}
</style>
