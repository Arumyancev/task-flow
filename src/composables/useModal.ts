import { useModalStore, type ModalOptions } from '@/stores/modal'
import type { Component } from 'vue'

/**
 * Composable for working with modals
 * Similar to Angular service pattern
 *
 * @example
 * ```ts
 * const modal = useModal()
 *
 * // Open modal and wait for result
 * const result = await modal.open(EditTaskModal, { taskId: '123' })
 *
 * // Open modal with options
 * await modal.open(ConfirmDialog, { message: 'Delete?' }, { size: 'sm' })
 * ```
 */
export function useModal() {
  const modalStore = useModalStore()

  /**
   * Open a modal component
   * @param component - Vue component to render
   * @param props - Props to pass to the component
   * @param options - Modal configuration
   * @returns Promise that resolves with the result when modal is closed
   */
  async function open<T = any>(
    component: Component,
    props?: Record<string, any>,
    options?: ModalOptions,
  ): Promise<T> {
    return modalStore.open(component, props, options)
  }

  /**
   * Close a specific modal by ID
   * @param modalId - ID of the modal to close
   * @param result - Result to pass to the promise
   */
  function close(modalId: string, result?: any) {
    modalStore.close(modalId, result)
  }

  /**
   * Close all open modals
   */
  function closeAll() {
    modalStore.closeAll()
  }

  /**
   * Dismiss a modal (reject the promise)
   * @param modalId - ID of the modal to dismiss
   * @param reason - Reason for dismissal
   */
  function dismiss(modalId: string, reason?: any) {
    modalStore.dismiss(modalId, reason)
  }

  return {
    open,
    close,
    closeAll,
    dismiss,
  }
}
