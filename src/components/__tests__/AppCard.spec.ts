import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCard from '../common/AppCard.vue'

describe('AppCard', () => {
  it('renders properly', () => {
    const wrapper = mount(AppCard, {
      props: {
        title: 'Test Card',
        icon: '📊',
      },
      slots: {
        default: 'Card content',
      },
    })

    expect(wrapper.text()).toContain('Test Card')
    expect(wrapper.text()).toContain('📊')
    expect(wrapper.text()).toContain('Card content')
  })

  it('renders without title and icon', () => {
    const wrapper = mount(AppCard, {
      slots: {
        default: 'Card content',
      },
    })

    expect(wrapper.find('.card-header').exists()).toBe(false)
    expect(wrapper.text()).toContain('Card content')
  })

  it('shows loading state', () => {
    const wrapper = mount(AppCard, {
      props: {
        loading: true,
      },
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })

  it('hides content when loading', () => {
    const wrapper = mount(AppCard, {
      props: {
        loading: true,
      },
      slots: {
        default: 'Card content',
      },
    })

    expect(wrapper.text()).not.toContain('Card content')
  })
})
