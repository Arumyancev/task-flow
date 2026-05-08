import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCard from '@/components/common/AppCard.vue'

describe('AppCard', () => {
  it('renders with title prop', () => {
    const wrapper = mount(AppCard, {
      props: { title: 'Test Card' },
    })

    expect(wrapper.text()).toContain('Test Card')
    expect(wrapper.find('.card-header').exists()).toBe(true)
    expect(wrapper.find('.card-title').exists()).toBe(true)
  })

  it('does not render header without title', () => {
    const wrapper = mount(AppCard)

    expect(wrapper.find('.card-header').exists()).toBe(false)
    expect(wrapper.find('.card-title').exists()).toBe(false)
  })

  it('shows loading spinner when loading is true', () => {
    const wrapper = mount(AppCard, {
      props: { loading: true },
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })

  it('hides slot content when loading', () => {
    const wrapper = mount(AppCard, {
      props: { loading: true },
      slots: {
        default: '<div class="slot-content">Content</div>',
      },
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.slot-content').exists()).toBe(false)
  })

  it('renders slot content when not loading', () => {
    const wrapper = mount(AppCard, {
      slots: {
        default: '<div class="slot-content">Content</div>',
      },
    })

    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.find('.loading').exists()).toBe(false)
  })

  it('renders title and slot content together', () => {
    const wrapper = mount(AppCard, {
      props: { title: 'Dashboard' },
      slots: {
        default: '<span>Some content</span>',
      },
    })

    expect(wrapper.text()).toContain('Dashboard')
    expect(wrapper.text()).toContain('Some content')
  })
})
