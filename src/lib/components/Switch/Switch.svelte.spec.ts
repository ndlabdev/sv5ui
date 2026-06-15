import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Switch from './Switch.svelte'

const getSwitch = () => document.querySelector('button[role="switch"]') as HTMLButtonElement | null
const getThumb = () => getSwitch()?.querySelector('span') as HTMLElement | null

describe('Switch', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a switch element', async () => {
            render(Switch)
            const sw = page.getByRole('switch')
            await expect.element(sw).toBeInTheDocument()
        })

        it('should render unchecked by default', () => {
            render(Switch)
            expect(getSwitch()!.getAttribute('data-state')).toBe('unchecked')
        })

        it('should render checked when checked prop is true', () => {
            render(Switch, { checked: true })
            expect(getSwitch()!.getAttribute('data-state')).toBe('checked')
        })

        it('should render with id', () => {
            render(Switch, { id: 'my-switch' })
            expect(getSwitch()!.id).toBe('my-switch')
        })

        it('should generate an id automatically', () => {
            render(Switch)
            expect(getSwitch()!.id).toBeTruthy()
        })

        it('should render with name attribute', () => {
            const { container } = render(Switch, { name: 'notifications' })
            // bits-ui Switch renders a hidden input as sibling of the button for form submission
            const hidden = container.querySelector('input[name="notifications"]')
            expect(hidden).toBeTruthy()
        })

        it('should render thumb element', () => {
            render(Switch)
            const thumb = getThumb()
            expect(thumb).not.toBeNull()
        })
    })

    // ==================== CHECKED STATE ====================

    describe('checked state', () => {
        it('should toggle on click', async () => {
            render(Switch)
            const sw = page.getByRole('switch')
            expect(getSwitch()!.getAttribute('data-state')).toBe('unchecked')
            await sw.click()
            expect(getSwitch()!.getAttribute('data-state')).toBe('checked')
        })

        it('should call onCheckedChange callback', async () => {
            const onCheckedChange = vi.fn()
            render(Switch, { onCheckedChange })
            const sw = page.getByRole('switch')
            await sw.click()
            expect(onCheckedChange).toHaveBeenCalledWith(true)
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled', () => {
        it('should be disabled when disabled prop is true', async () => {
            render(Switch, { disabled: true })
            const sw = page.getByRole('switch')
            await expect.element(sw).toBeDisabled()
        })

        it('should not be disabled by default', async () => {
            render(Switch)
            const sw = page.getByRole('switch')
            await expect.element(sw).toBeEnabled()
        })

        it('should apply disabled styling to root', () => {
            const { container } = render(Switch, { disabled: true })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toMatch(/opacity-75/)
        })

        it('should apply cursor-not-allowed to base', () => {
            render(Switch, { disabled: true })
            expect(getSwitch()!.className).toMatch(/cursor-not-allowed/)
        })

        it('should not toggle when disabled', async () => {
            render(Switch, { disabled: true })
            const sw = page.getByRole('switch')
            await sw.click({ force: true })
            expect(getSwitch()!.getAttribute('data-state')).toBe('unchecked')
        })
    })

    // ==================== LOADING STATE ====================

    describe('loading', () => {
        it('should be disabled when loading', async () => {
            render(Switch, { loading: true })
            const sw = page.getByRole('switch')
            await expect.element(sw).toBeDisabled()
        })

        it('should render loading icon inside thumb', async () => {
            render(Switch, { loading: true })
            const thumb = getThumb()!
            // @iconify/svelte renders SVG with aria-hidden, wait for it
            await vi.waitFor(() => {
                expect(thumb.querySelector('svg')).not.toBeNull()
            })
        })

        it('should not toggle when loading', async () => {
            render(Switch, { loading: true })
            const sw = page.getByRole('switch')
            await sw.click({ force: true })
            expect(getSwitch()!.getAttribute('data-state')).toBe('unchecked')
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
                render(Switch, { color })
                expect(getSwitch()!.className).toMatch(new RegExp(`bg-${color}`))
            })
        }

        it('should apply surface color', () => {
            render(Switch, { color: 'surface' })
            expect(getSwitch()!.className).toMatch(/bg-on-surface/)
        })

        it('should apply focus-visible outline per color', () => {
            render(Switch, { color: 'primary' })
            expect(getSwitch()!.className).toMatch(/outline-primary/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size classes', () => {
            const { container } = render(Switch, { size: 'xs' })
            expect(getSwitch()!.className).toMatch(/w-7/)
            const containerEl = container.querySelector('.flex.items-center') as HTMLElement
            expect(containerEl.className).toMatch(/h-4/)
        })

        it('should apply sm size classes', () => {
            render(Switch, { size: 'sm' })
            expect(getSwitch()!.className).toMatch(/w-8/)
        })

        it('should apply md size classes by default', () => {
            render(Switch)
            expect(getSwitch()!.className).toMatch(/w-9/)
        })

        it('should apply lg size classes', () => {
            render(Switch, { size: 'lg' })
            expect(getSwitch()!.className).toMatch(/w-10/)
        })

        it('should apply xl size classes', () => {
            render(Switch, { size: 'xl' })
            expect(getSwitch()!.className).toMatch(/w-11/)
        })

        it('should apply wrapper text size per size variant', () => {
            const { container } = render(Switch, { size: 'xs', label: 'Test' })
            const wrapper = container.querySelector('.ms-2') as HTMLElement
            expect(wrapper.className).toMatch(/text-xs/)
        })
    })

    // ==================== LABEL & DESCRIPTION ====================

    describe('label & description', () => {
        it('should render label text', async () => {
            render(Switch, { label: 'Enable notifications' })
            const label = page.getByText('Enable notifications')
            await expect.element(label).toBeInTheDocument()
        })

        it('should render description text', async () => {
            render(Switch, { description: 'This controls alerts' })
            const desc = page.getByText('This controls alerts')
            await expect.element(desc).toBeInTheDocument()
        })

        it('should render both label and description', () => {
            const { container } = render(Switch, {
                label: 'Dark mode',
                description: 'Toggle theme appearance'
            })
            const label = container.querySelector('label') as HTMLElement
            const desc = container.querySelector('p') as HTMLElement
            expect(label.textContent).toBe('Dark mode')
            expect(desc.textContent).toBe('Toggle theme appearance')
        })

        it('should not render wrapper when no label or description', () => {
            const { container } = render(Switch)
            expect(container.querySelector('.ms-2')).toBeNull()
        })

        it('should associate label with switch via for attribute', () => {
            render(Switch, { id: 'test-switch', label: 'My Label' })
            const label = document.querySelector('label') as HTMLLabelElement
            expect(label.getAttribute('for')).toBe('test-switch')
        })

        it('should apply required asterisk styling to label', () => {
            render(Switch, { label: 'Accept terms', required: true })
            const label = document.querySelector('label') as HTMLElement
            expect(label.className).toMatch(/after:content/)
        })

        it('should apply cursor-not-allowed to label when disabled', () => {
            render(Switch, { label: 'Disabled', disabled: true })
            const label = document.querySelector('label') as HTMLElement
            expect(label.className).toMatch(/cursor-not-allowed/)
        })

        it('should apply cursor-not-allowed to description when disabled', () => {
            render(Switch, { description: 'Desc', disabled: true })
            const desc = document.querySelector('p') as HTMLElement
            expect(desc.className).toMatch(/cursor-not-allowed/)
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render checked icon when provided', async () => {
            render(Switch, { checkedIcon: 'lucide:check' })
            const thumb = getThumb()!
            await vi.waitFor(() => {
                expect(thumb.querySelector('svg')).not.toBeNull()
            })
        })

        it('should render unchecked icon when provided', async () => {
            render(Switch, { uncheckedIcon: 'lucide:x' })
            const thumb = getThumb()!
            await vi.waitFor(() => {
                expect(thumb.querySelector('svg')).not.toBeNull()
            })
        })

        it('should render both checked and unchecked icons', async () => {
            render(Switch, {
                checkedIcon: 'lucide:check',
                uncheckedIcon: 'lucide:x'
            })
            const thumb = getThumb()!
            // Both icons rendered simultaneously (CSS controls visibility)
            await vi.waitFor(() => {
                expect(thumb.querySelectorAll('svg').length).toBe(2)
            })
        })

        it('should not render icons when none provided', () => {
            render(Switch)
            const thumb = getThumb()
            expect(thumb!.children.length).toBe(0)
        })

        it('should apply checked icon opacity class', async () => {
            const { container } = render(Switch, { checkedIcon: 'lucide:check' })
            await vi.waitFor(() => {
                const iconEl = container.querySelector('[class*="opacity-0"]')
                expect(iconEl).not.toBeNull()
                expect(iconEl!.getAttribute('class')).toMatch(
                    /group-data-\[state=checked\]:opacity-100/
                )
            })
        })

        it('should apply unchecked icon opacity class', async () => {
            const { container } = render(Switch, { uncheckedIcon: 'lucide:x' })
            await vi.waitFor(() => {
                const iconEl = container.querySelector('[class*="opacity-0"]')
                expect(iconEl).not.toBeNull()
                expect(iconEl!.getAttribute('class')).toMatch(
                    /group-data-\[state=unchecked\]:opacity-100/
                )
            })
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root element', () => {
            const { container } = render(Switch, { class: 'my-custom-class' })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-custom-class')
        })

        it('should apply ui slot override to base', () => {
            render(Switch, { ui: { base: 'my-base-class' } })
            expect(getSwitch()!.className).toContain('my-base-class')
        })

        it('should apply ui slot override to root', () => {
            const { container } = render(Switch, { ui: { root: 'my-root-class' } })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-root-class')
        })

        it('should apply ui slot override to thumb', () => {
            render(Switch, { ui: { thumb: 'my-thumb-class' } })
            const thumb = getThumb()
            expect(thumb!.className).toContain('my-thumb-class')
        })

        it('should apply ui slot override to label', () => {
            render(Switch, { label: 'Test', ui: { label: 'my-label-class' } })
            const label = document.querySelector('label') as HTMLElement
            expect(label.className).toContain('my-label-class')
        })

        it('should apply ui slot override to description', () => {
            render(Switch, { description: 'Desc', ui: { description: 'my-desc-class' } })
            const desc = document.querySelector('p') as HTMLElement
            expect(desc.className).toContain('my-desc-class')
        })

        it('should apply ui slot override to wrapper', () => {
            const { container } = render(Switch, {
                label: 'Test',
                ui: { wrapper: 'my-wrapper-class' }
            })
            const wrapper = container.querySelector('.ms-2') as HTMLElement
            expect(wrapper.className).toContain('my-wrapper-class')
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should have role="switch"', async () => {
            render(Switch)
            const sw = page.getByRole('switch')
            await expect.element(sw).toBeInTheDocument()
        })

        it('should set aria-checked based on checked state', () => {
            render(Switch, { checked: true })
            expect(getSwitch()!.getAttribute('aria-checked')).toBe('true')
        })

        it('should set aria-checked false when unchecked', () => {
            render(Switch)
            expect(getSwitch()!.getAttribute('aria-checked')).toBe('false')
        })

        it('should support required attribute', () => {
            render(Switch, { required: true })
            expect(getSwitch()!.getAttribute('aria-required')).toBe('true')
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with label, description, and checked', () => {
            const { container } = render(Switch, {
                label: 'Email alerts',
                description: 'Receive email when updates arrive',
                checked: true
            })
            const label = container.querySelector('label') as HTMLElement
            const desc = container.querySelector('p') as HTMLElement
            expect(label.textContent).toBe('Email alerts')
            expect(desc.textContent).toBe('Receive email when updates arrive')
            expect(getSwitch()!.getAttribute('data-state')).toBe('checked')
        })

        it('should render disabled with checked state', () => {
            render(Switch, { disabled: true, checked: true })
            expect(getSwitch()!.getAttribute('data-state')).toBe('checked')
            expect(getSwitch()!.disabled).toBe(true)
        })

        it('should render loading with single loading icon', async () => {
            render(Switch, {
                loading: true,
                checkedIcon: 'lucide:check',
                uncheckedIcon: 'lucide:x'
            })
            const thumb = getThumb()!
            // Loading replaces both icons with a single loading icon
            await vi.waitFor(() => {
                expect(thumb.querySelectorAll('svg').length).toBe(1)
            })
        })

        it('should render with color and size combined', () => {
            render(Switch, { color: 'success', size: 'xl' })
            const sw = getSwitch()!
            expect(sw.className).toMatch(/bg-success/)
            expect(sw.className).toMatch(/w-11/)
        })

        it('should render with all props combined', () => {
            const { container } = render(Switch, {
                checked: true,
                color: 'error',
                size: 'lg',
                label: 'Critical setting',
                description: 'Handle with care',
                checkedIcon: 'lucide:check',
                required: true,
                id: 'full-switch'
            })
            const sw = getSwitch()!
            expect(sw.id).toBe('full-switch')
            expect(sw.getAttribute('data-state')).toBe('checked')
            expect(sw.className).toMatch(/bg-error/)
            expect(sw.className).toMatch(/w-10/)
            const label = container.querySelector('label') as HTMLElement
            const desc = container.querySelector('p') as HTMLElement
            expect(label.textContent).toBe('Critical setting')
            expect(desc.textContent).toBe('Handle with care')
        })
    })
})
