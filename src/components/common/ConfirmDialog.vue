<script setup lang="ts">
import AppIcon from '@/components/common/AppIcon.vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'

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
      <Button
        type="button"
        :label="cancelText || t('common.cancel')"
        icon="pi pi-times"
        severity="secondary"
        @click="handleCancel"
      />
      <Button
        type="button"
        :label="confirmText || t('common.delete')"
        :icon="danger ? 'pi pi-trash' : 'pi pi-check'"
        :severity="danger ? 'danger' : 'success'"
        @click="handleConfirm"
      />
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
</style>
