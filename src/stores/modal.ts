import { defineStore } from 'pinia'
import { ref, markRaw, type Component } from 'vue'

export interface ModalOptions {
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  persistent?: boolean // Prevent closing on backdrop click
  customClass?: string
}

export interface ModalInstance {
  id: string
  component: Component
  props?: Record<string, any>
  options: ModalOptions
  resolve?: (value: any) => void
  reject?: (reason?: any) => void
}

export const useModalStore = defineStore('modal', () => {
  const modals = ref<ModalInstance[]>([])
  let modalIdCounter = 0

  function open(
    component: Component,
    props?: Record<string, any>,
    options: ModalOptions = {},
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const modal: ModalInstance = {
        id: `modal-${++modalIdCounter}`,
        component: markRaw(component), // markRaw to prevent reactivity on component
        props,
        options: {
          size: 'md',
          closable: true,
          persistent: false,
          ...options,
        },
        resolve,
        reject,
      }

      modals.value.push(modal)
    })
  }

  function close(modalId: string, result?: any) {
    const index = modals.value.findIndex((m) => m.id === modalId)
    if (index !== -1) {
      const modal = modals.value[index]
      modal.resolve?.(result)
      modals.value.splice(index, 1)
    }
  }

  function closeAll() {
    modals.value.forEach((modal) => {
      modal.reject?.(new Error('Modal closed'))
    })
    modals.value = []
  }

  function dismiss(modalId: string, reason?: any) {
    const index = modals.value.findIndex((m) => m.id === modalId)
    if (index !== -1) {
      const modal = modals.value[index]
      modal.reject?.(reason)
      modals.value.splice(index, 1)
    }
  }

  return {
    modals,
    open,
    close,
    closeAll,
    dismiss,
  }
})
