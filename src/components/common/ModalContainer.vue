<script setup lang="ts">
import { useModalStore } from '@/stores/modal'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted } from 'vue'

const modalStore = useModalStore()
const { modals } = storeToRefs(modalStore)

// Handle ESC key
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && modals.value.length > 0) {
    const lastModal = modals.value[modals.value.length - 1]
    if (lastModal && lastModal.options.closable && !lastModal.options.persistent) {
      modalStore.dismiss(lastModal.id, 'escape')
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})

function handleBackdropClick(modalId: string, persistent?: boolean, closable?: boolean) {
  if (!persistent && closable) {
    modalStore.dismiss(modalId, 'backdrop')
  }
}

function getSizeClass(size?: string) {
  const sizes = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl',
    full: 'modal-full',
  }
  return sizes[size as keyof typeof sizes] || sizes.md
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modals.length > 0" class="modal-container">
      <div
        v-for="modal in modals"
        :key="modal.id"
        class="modal-wrapper"
        @click.self="
          handleBackdropClick(modal.id, modal.options.persistent, modal.options.closable)
        "
      >
        <div class="modal-backdrop"></div>
        <div
          class="modal"
          :class="[getSizeClass(modal.options.size), modal.options.customClass]"
          role="dialog"
          aria-modal="true"
        >
          <!-- Modal Header -->
          <div v-if="modal.options.title || modal.options.closable" class="modal-header">
            <h3 v-if="modal.options.title" class="modal-title">{{ modal.options.title }}</h3>
            <button
              v-if="modal.options.closable"
              class="modal-close"
              @click="modalStore.dismiss(modal.id, 'close-button')"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <!-- Modal Content -->
          <div class="modal-content">
            <component
              :is="modal.component"
              v-bind="modal.props"
              :modal-id="modal.id"
              @close="(result: any) => modalStore.close(modal.id, result)"
              @dismiss="(reason: any) => modalStore.dismiss(modal.id, reason)"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  animation: fadeIn var(--transition-base);
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  position: relative;
  background-color: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-height: calc(100vh - var(--spacing-2xl));
  display: flex;
  flex-direction: column;
  animation: slideUp var(--transition-base);
  overflow: hidden;
}

/* Modal Sizes */
.modal-sm {
  width: 100%;
  max-width: 400px;
}

.modal-md {
  width: 100%;
  max-width: 600px;
}

.modal-lg {
  width: 100%;
  max-width: 900px;
}

.modal-xl {
  width: 100%;
  max-width: 1200px;
}

.modal-full {
  width: calc(100vw - var(--spacing-2xl));
  height: calc(100vh - var(--spacing-2xl));
  max-width: none;
  max-height: none;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  gap: var(--spacing-md);
}

.modal-title {
  font-size: var(--font-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  font-size: var(--font-xl);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.modal-close:hover {
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.modal-content {
  padding: var(--spacing-lg);
  overflow-y: auto;
  flex: 1;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modal-wrapper {
    padding: var(--spacing-md);
  }

  .modal {
    max-height: calc(100vh - var(--spacing-md));
  }

  .modal-sm,
  .modal-md,
  .modal-lg,
  .modal-xl {
    max-width: 100%;
  }

  .modal-full {
    width: calc(100vw - var(--spacing-md));
    height: calc(100vh - var(--spacing-md));
  }
}
</style>
