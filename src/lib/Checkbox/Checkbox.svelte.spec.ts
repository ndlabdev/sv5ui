import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Checkbox from './Checkbox.svelte'

const getCheckbox = () =>
    document.querySelector('button[role="checkbox"]') as HTMLButtonElement | null

describe('Checkbox', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a checkbox element', async () => {
            render(Checkbox)
            const cb = page.getByRole('checkbox')
            await expect.element(cb).toBeInTheDocument()
        })

        it('should render unchecked by default', () => {
            render(Checkbox)
            expect(getCheckbox()!.getAttribute('data-state')).toBe('unchecked')
        })

        it('should render checked when checked prop is true', () => {
            render(Checkbox, { checked: true })
            expect(getCheckbox()!.getAttribute('data-state')).toBe('checked')
        })

        it('should render with id', () => {
            render(Checkbox, { id: 'my-checkbox' })
            expect(getCheckbox()!.id).toBe('my-checkbox')
        })

        it('should generate an id automatically', () => {
            render(Checkbox)
            expect(getCheckbox()!.id).toBeTruthy()
        })

        it('should render with name attribute', () => {
            const { container } = render(Checkbox, { name: 'accept-terms' })
            const hidden = container.querySelector('input[name="accept-terms"]')
            expect(hidden).toBeTruthy()
        })
    })

    // ==================== CHECKED STATE ====================

    describe('checked state', () => {
        it('should toggle on click', async () => {
            render(Checkbox)
            const cb = page.getByRole('checkbox')
            expect(getCheckbox()!.getAttribute('data-state')).toBe('unchecked')
            await cb.click()
            expect(getCheckbox()!.getAttribute('data-state')).toBe('checked')
        })

        it('should call onCheckedChange callback', async () => {
            const onCheckedChange = vi.fn()
            render(Checkbox, { onCheckedChange })
            const cb = page.getByRole('checkbox')
            await cb.click()
            expect(onCheckedChange).toHaveBeenCalledWith(true)
        })

        it('should render check icon when checked', async () => {
            render(Checkbox, { checked: true })
            const cb = getCheckbox()!
            await vi.waitFor(() => {
                expect(cb.querySelector('svg')).not.toBeNull()
            })
        })

        it('should not render icon when unchecked', () => {
            render(Checkbox)
            const cb = getCheckbox()!
            expect(cb.querySelector('svg')).toBeNull()
        })
    })

    // ==================== INDETERMINATE STATE ====================

    describe('indeterminate state', () => {
        it('should render indeterminate state', () => {
            render(Checkbox, { indeterminate: true })
            expect(getCheckbox()!.getAttribute('data-state')).toBe('indeterminate')
        })

        it('should render indeterminate icon', async () => {
            render(Checkbox, { indeterminate: true })
            const cb = getCheckbox()!
            await vi.waitFor(() => {
                expect(cb.querySelector('svg')).not.toBeNull()
            })
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled', () => {
        it('should be disabled when disabled prop is true', async () => {
            render(Checkbox, { disabled: true })
            const cb = page.getByRole('checkbox')
            await expect.element(cb).toBeDisabled()
        })

        it('should not be disabled by default', async () => {
            render(Checkbox)
            const cb = page.getByRole('checkbox')
            await expect.element(cb).toBeEnabled()
        })

        it('should apply disabled styling to root', () => {
            const { container } = render(Checkbox, { disabled: true })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toMatch(/opacity-75/)
        })

        it('should apply cursor-not-allowed to base', () => {
            render(Checkbox, { disabled: true })
            expect(getCheckbox()!.className).toMatch(/cursor-not-allowed/)
        })

        it('should not toggle when disabled', async () => {
            render(Checkbox, { disabled: true })
            const cb = page.getByRole('checkbox')
            await cb.click({ force: true })
            expect(getCheckbox()!.getAttribute('data-state')).toBe('unchecked')
        })
    })

    // ==================== LOADING STATE ====================

    describe('loading', () => {
        it('should be disabled when loading', async () => {
            render(Checkbox, { loading: true })
            const cb = page.getByRole('checkbox')
            await expect.element(cb).toBeDisabled()
        })

        it('should render loading icon', async () => {
            render(Checkbox, { loading: true })
            const cb = getCheckbox()!
            await vi.waitFor(() => {
                expect(cb.querySelector('svg')).not.toBeNull()
            })
        })

        it('should not toggle when loading', async () => {
            render(Checkbox, { loading: true })
            const cb = page.getByRole('checkbox')
            await cb.click({ force: true })
            expect(getCheckbox()!.getAttribute('data-state')).toBe('unchecked')
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        const colors = [
            'primary',
            'secondary',
            'tertiary',
            'success',
            'warning',
            'error',
            'info'
        ] as const

        for (const color of colors) {
            it(`should render with color="${color}"`, () => {
                render(Checkbox, { color, checked: true })
                expect(getCheckbox()!.className).toMatch(new RegExp(`bg-${color}`))
            })
        }

        it('should apply surface color', () => {
            render(Checkbox, { color: 'surface', checked: true })
            expect(getCheckbox()!.className).toMatch(/bg-on-surface/)
        })

        it('should apply focus-visible outline per color', () => {
            render(Checkbox, { color: 'primary' })
            expect(getCheckbox()!.className).toMatch(/outline-primary/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size classes', () => {
            render(Checkbox, { size: 'xs' })
            expect(getCheckbox()!.className).toMatch(/size-3\.5/)
        })

        it('should apply sm size classes', () => {
            render(Checkbox, { size: 'sm' })
            expect(getCheckbox()!.className).toMatch(/size-4/)
        })

        it('should apply md size classes by default', () => {
            render(Checkbox)
            expect(getCheckbox()!.className).toMatch(/size-4\.5/)
        })

        it('should apply lg size classes', () => {
            render(Checkbox, { size: 'lg' })
            expect(getCheckbox()!.className).toMatch(/size-5/)
        })

        it('should apply xl size classes', () => {
            render(Checkbox, { size: 'xl' })
            expect(getCheckbox()!.className).toMatch(/size-5\.5/)
        })

        it('should apply wrapper text size per size variant', () => {
            const { container } = render(Checkbox, { size: 'xs', label: 'Test' })
            const wrapper = container.querySelector('.ms-2') as HTMLElement
            expect(wrapper.className).toMatch(/text-xs/)
        })
    })

    // ==================== LABEL & DESCRIPTION ====================

    describe('label & description', () => {
        it('should render label text', async () => {
            render(Checkbox, { label: 'Accept terms' })
            const label = page.getByText('Accept terms')
            await expect.element(label).toBeInTheDocument()
        })

        it('should render description text', async () => {
            render(Checkbox, { description: 'You agree to the terms' })
            const desc = page.getByText('You agree to the terms')
            await expect.element(desc).toBeInTheDocument()
        })

        it('should render both label and description', () => {
            const { container } = render(Checkbox, {
                label: 'Dark mode',
                description: 'Toggle theme appearance'
            })
            const label = container.querySelector('label') as HTMLElement
            const desc = container.querySelector('p') as HTMLElement
            expect(label.textContent).toBe('Dark mode')
            expect(desc.textContent).toBe('Toggle theme appearance')
        })

        it('should not render wrapper when no label or description', () => {
            const { container } = render(Checkbox)
            expect(container.querySelector('.ms-2')).toBeNull()
        })

        it('should associate label with checkbox via for attribute', () => {
            render(Checkbox, { id: 'test-checkbox', label: 'My Label' })
            const label = document.querySelector('label') as HTMLLabelElement
            expect(label.getAttribute('for')).toBe('test-checkbox')
        })

        it('should apply required asterisk styling to label', () => {
            render(Checkbox, { label: 'Accept terms', required: true })
            const label = document.querySelector('label') as HTMLElement
            expect(label.className).toMatch(/after:content/)
        })

        it('should apply cursor-not-allowed to label when disabled', () => {
            render(Checkbox, { label: 'Disabled', disabled: true })
            const label = document.querySelector('label') as HTMLElement
            expect(label.className).toMatch(/cursor-not-allowed/)
        })

        it('should apply cursor-not-allowed to description when disabled', () => {
            render(Checkbox, { description: 'Desc', disabled: true })
            const desc = document.querySelector('p') as HTMLElement
            expect(desc.className).toMatch(/cursor-not-allowed/)
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root element', () => {
            const { container } = render(Checkbox, { class: 'my-custom-class' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-custom-class')
        })

        it('should apply ui slot override to base', () => {
            render(Checkbox, { ui: { base: 'my-base-class' } })
            expect(getCheckbox()!.className).toContain('my-base-class')
        })

        it('should apply ui slot override to root', () => {
            const { container } = render(Checkbox, { ui: { root: 'my-root-class' } })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-root-class')
        })

        it('should apply ui slot override to label', () => {
            render(Checkbox, { label: 'Test', ui: { label: 'my-label-class' } })
            const label = document.querySelector('label') as HTMLElement
            expect(label.className).toContain('my-label-class')
        })

        it('should apply ui slot override to description', () => {
            render(Checkbox, { description: 'Desc', ui: { description: 'my-desc-class' } })
            const desc = document.querySelector('p') as HTMLElement
            expect(desc.className).toContain('my-desc-class')
        })

        it('should apply ui slot override to wrapper', () => {
            const { container } = render(Checkbox, {
                label: 'Test',
                ui: { wrapper: 'my-wrapper-class' }
            })
            const wrapper = container.querySelector('.ms-2') as HTMLElement
            expect(wrapper.className).toContain('my-wrapper-class')
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should have role="checkbox"', async () => {
            render(Checkbox)
            const cb = page.getByRole('checkbox')
            await expect.element(cb).toBeInTheDocument()
        })

        it('should set aria-checked based on checked state', () => {
            render(Checkbox, { checked: true })
            expect(getCheckbox()!.getAttribute('aria-checked')).toBe('true')
        })

        it('should set aria-checked false when unchecked', () => {
            render(Checkbox)
            expect(getCheckbox()!.getAttribute('aria-checked')).toBe('false')
        })

        it('should set aria-checked mixed when indeterminate', () => {
            render(Checkbox, { indeterminate: true })
            expect(getCheckbox()!.getAttribute('aria-checked')).toBe('mixed')
        })

        it('should support required attribute', () => {
            render(Checkbox, { required: true })
            expect(getCheckbox()!.getAttribute('aria-required')).toBe('true')
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with label, description, and checked', () => {
            const { container } = render(Checkbox, {
                label: 'Email alerts',
                description: 'Receive email when updates arrive',
                checked: true
            })
            const label = container.querySelector('label') as HTMLElement
            const desc = container.querySelector('p') as HTMLElement
            expect(label.textContent).toBe('Email alerts')
            expect(desc.textContent).toBe('Receive email when updates arrive')
            expect(getCheckbox()!.getAttribute('data-state')).toBe('checked')
        })

        it('should render disabled with checked state', () => {
            render(Checkbox, { disabled: true, checked: true })
            expect(getCheckbox()!.getAttribute('data-state')).toBe('checked')
            expect(getCheckbox()!.disabled).toBe(true)
        })

        it('should render with color and size combined', () => {
            render(Checkbox, { color: 'success', size: 'xl', checked: true })
            const cb = getCheckbox()!
            expect(cb.className).toMatch(/bg-success/)
            expect(cb.className).toMatch(/size-5\.5/)
        })

        it('should render with all props combined', () => {
            const { container } = render(Checkbox, {
                checked: true,
                color: 'error',
                size: 'lg',
                label: 'Critical setting',
                description: 'Handle with care',
                required: true,
                id: 'full-checkbox'
            })
            const cb = getCheckbox()!
            expect(cb.id).toBe('full-checkbox')
            expect(cb.getAttribute('data-state')).toBe('checked')
            expect(cb.className).toMatch(/bg-error/)
            expect(cb.className).toMatch(/size-5/)
            const label = container.querySelector('label') as HTMLElement
            const desc = container.querySelector('p') as HTMLElement
            expect(label.textContent).toBe('Critical setting')
            expect(desc.textContent).toBe('Handle with care')
        })
    })
})
