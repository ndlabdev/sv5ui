import { page, userEvent } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import Toggle from './Toggle.svelte'

const getToggle = () => document.querySelector('button[aria-pressed]') as HTMLButtonElement | null

function snippet(html: string) {
    return createRawSnippet(() => ({
        render: () => html,
        setup: () => {}
    }))
}

describe('Toggle', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a button element', async () => {
            render(Toggle, { label: 'Toggle' })
            const toggle = page.getByRole('button')
            await expect.element(toggle).toBeInTheDocument()
        })

        it('should render unpressed by default', () => {
            render(Toggle, { label: 'Toggle' })
            expect(getToggle()!.getAttribute('data-state')).toBe('off')
        })

        it('should render pressed when pressed prop is true', () => {
            render(Toggle, { label: 'Toggle', pressed: true })
            expect(getToggle()!.getAttribute('data-state')).toBe('on')
        })

        it('should render label text', async () => {
            render(Toggle, { label: 'Notifications' })
            const label = page.getByText('Notifications')
            await expect.element(label).toBeInTheDocument()
        })

        it('should render children snippet content', async () => {
            render(Toggle, { children: snippet('<span>Custom content</span>') })
            const content = page.getByText('Custom content')
            await expect.element(content).toBeInTheDocument()
        })

        it('should have type="button" by default', () => {
            render(Toggle, { label: 'Toggle' })
            expect(getToggle()!.getAttribute('type')).toBe('button')
        })
    })

    // ==================== PRESSED STATE ====================

    describe('pressed state', () => {
        it('should toggle on click', async () => {
            render(Toggle, { label: 'Toggle' })
            const toggle = page.getByRole('button')
            expect(getToggle()!.getAttribute('data-state')).toBe('off')
            await toggle.click()
            expect(getToggle()!.getAttribute('data-state')).toBe('on')
            await toggle.click()
            expect(getToggle()!.getAttribute('data-state')).toBe('off')
        })

        it('should call onPressedChange callback', async () => {
            const onPressedChange = vi.fn()
            render(Toggle, { label: 'Toggle', onPressedChange })
            const toggle = page.getByRole('button')
            await toggle.click()
            expect(onPressedChange).toHaveBeenCalledWith(true)
        })

        it('should apply pressed styling classes', () => {
            render(Toggle, { label: 'Toggle' })
            expect(getToggle()!.className).toMatch(/data-\[state=on\]:bg-primary-container/)
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled', () => {
        it('should be disabled when disabled prop is true', async () => {
            render(Toggle, { label: 'Toggle', disabled: true })
            const toggle = page.getByRole('button')
            await expect.element(toggle).toBeDisabled()
        })

        it('should not be disabled by default', async () => {
            render(Toggle, { label: 'Toggle' })
            const toggle = page.getByRole('button')
            await expect.element(toggle).toBeEnabled()
        })

        it('should apply disabled styling', () => {
            render(Toggle, { label: 'Toggle', disabled: true })
            expect(getToggle()!.className).toMatch(/disabled:opacity-75/)
        })

        it('should not toggle when disabled', async () => {
            render(Toggle, { label: 'Toggle', disabled: true })
            const toggle = page.getByRole('button')
            await toggle.click({ force: true })
            expect(getToggle()!.getAttribute('data-state')).toBe('off')
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should apply ghost variant by default', () => {
            render(Toggle, { label: 'Toggle' })
            expect(getToggle()!.className).toMatch(/hover:bg-surface-container-highest/)
            expect(getToggle()!.className).not.toMatch(/ring-inset/)
        })

        it('should apply outline variant', () => {
            render(Toggle, { label: 'Toggle', variant: 'outline' })
            expect(getToggle()!.className).toMatch(/ring-outline-variant/)
        })

        it('should apply soft variant', () => {
            render(Toggle, { label: 'Toggle', variant: 'soft' })
            expect(getToggle()!.className).toMatch(/bg-surface-container-highest/)
        })

        it('should apply subtle variant', () => {
            render(Toggle, { label: 'Toggle', variant: 'subtle' })
            expect(getToggle()!.className).toMatch(/ring-outline-variant/)
            expect(getToggle()!.className).toMatch(/bg-surface-container-highest/)
        })

        it('should apply pressed ring color for outline variant', () => {
            render(Toggle, { label: 'Toggle', variant: 'outline', color: 'success' })
            expect(getToggle()!.className).toMatch(/data-\[state=on\]:ring-success/)
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
                render(Toggle, { label: 'Toggle', color })
                expect(getToggle()!.className).toMatch(
                    new RegExp(`data-\\[state=on\\]:bg-${color}-container`)
                )
            })
        }

        it('should apply surface color', () => {
            render(Toggle, { label: 'Toggle', color: 'surface' })
            expect(getToggle()!.className).toMatch(/data-\[state=on\]:bg-inverse-surface/)
        })

        it('should apply focus-visible outline per color', () => {
            render(Toggle, { label: 'Toggle', color: 'error' })
            expect(getToggle()!.className).toMatch(/focus-visible:outline-error/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size classes', () => {
            render(Toggle, { label: 'Toggle', size: 'xs' })
            expect(getToggle()!.className).toMatch(/px-2 /)
            expect(getToggle()!.className).toMatch(/text-xs/)
        })

        it('should apply sm size classes', () => {
            render(Toggle, { label: 'Toggle', size: 'sm' })
            expect(getToggle()!.className).toMatch(/px-2\.5/)
        })

        it('should apply md size classes by default', () => {
            render(Toggle, { label: 'Toggle' })
            expect(getToggle()!.className).toMatch(/px-3/)
            expect(getToggle()!.className).toMatch(/text-sm/)
        })

        it('should apply lg size classes', () => {
            render(Toggle, { label: 'Toggle', size: 'lg' })
            expect(getToggle()!.className).toMatch(/px-4/)
        })

        it('should apply xl size classes', () => {
            render(Toggle, { label: 'Toggle', size: 'xl' })
            expect(getToggle()!.className).toMatch(/px-5/)
            expect(getToggle()!.className).toMatch(/text-base/)
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render icon-only toggle', async () => {
            render(Toggle, { icon: 'lucide:pin', 'aria-label': 'Pin' })
            await vi.waitFor(() => {
                expect(getToggle()!.querySelector('svg')).not.toBeNull()
            })
        })

        it('should apply square padding for icon-only toggle', () => {
            render(Toggle, { icon: 'lucide:pin', 'aria-label': 'Pin' })
            expect(getToggle()!.className).toMatch(/p-1\.5/)
        })

        it('should render leading icon with label', async () => {
            render(Toggle, { label: 'Wi-Fi', leadingIcon: 'lucide:wifi' })
            await vi.waitFor(() => {
                expect(getToggle()!.querySelector('svg')).not.toBeNull()
            })
            expect(getToggle()!.textContent).toContain('Wi-Fi')
        })

        it('should render trailing icon with label', async () => {
            render(Toggle, { label: 'Details', trailingIcon: 'lucide:chevron-down' })
            await vi.waitFor(() => {
                expect(getToggle()!.querySelector('svg')).not.toBeNull()
            })
        })

        it('should render both leading and trailing icons', async () => {
            render(Toggle, {
                label: 'Both',
                leadingIcon: 'lucide:wifi',
                trailingIcon: 'lucide:chevron-down'
            })
            await vi.waitFor(() => {
                expect(getToggle()!.querySelectorAll('svg').length).toBe(2)
            })
        })

        it('should not apply square padding when label is present', () => {
            render(Toggle, { label: 'Wi-Fi', leadingIcon: 'lucide:wifi' })
            expect(getToggle()!.className).toMatch(/px-3/)
        })
    })

    // ==================== BLOCK & SQUARE ====================

    describe('block & square', () => {
        it('should apply block width', () => {
            render(Toggle, { label: 'Toggle', block: true })
            expect(getToggle()!.className).toMatch(/w-full/)
        })

        it('should force square padding with square prop', () => {
            render(Toggle, { label: 'X', square: true })
            expect(getToggle()!.className).toMatch(/p-1\.5/)
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root element', () => {
            render(Toggle, { label: 'Toggle', class: 'my-custom-class' })
            expect(getToggle()!.className).toContain('my-custom-class')
        })

        it('should apply ui slot override to base', () => {
            render(Toggle, { label: 'Toggle', ui: { base: 'my-base-class' } })
            expect(getToggle()!.className).toContain('my-base-class')
        })

        it('should apply ui slot override to label', () => {
            render(Toggle, { label: 'Toggle', ui: { label: 'my-label-class' } })
            const label = getToggle()!.querySelector('span') as HTMLElement
            expect(label.className).toContain('my-label-class')
        })

        it('should apply ui slot override to leadingIcon', async () => {
            render(Toggle, {
                label: 'Toggle',
                leadingIcon: 'lucide:wifi',
                ui: { leadingIcon: 'my-icon-class' }
            })
            await vi.waitFor(() => {
                const icon = getToggle()!.querySelector('svg') as SVGElement
                expect(icon.getAttribute('class')).toContain('my-icon-class')
            })
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should set aria-pressed based on pressed state', () => {
            render(Toggle, { label: 'Toggle', pressed: true })
            expect(getToggle()!.getAttribute('aria-pressed')).toBe('true')
        })

        it('should set aria-pressed false when unpressed', () => {
            render(Toggle, { label: 'Toggle' })
            expect(getToggle()!.getAttribute('aria-pressed')).toBe('false')
        })

        it('should not have role="switch"', () => {
            render(Toggle, { label: 'Toggle' })
            expect(getToggle()!.getAttribute('role')).not.toBe('switch')
        })

        it('should support aria-label for icon-only toggles', () => {
            render(Toggle, { icon: 'lucide:pin', 'aria-label': 'Pin item' })
            expect(getToggle()!.getAttribute('aria-label')).toBe('Pin item')
        })

        it('should toggle with keyboard Enter', async () => {
            render(Toggle, { label: 'Toggle' })
            getToggle()!.focus()
            await userEvent.keyboard('{Enter}')
            await vi.waitFor(() => {
                expect(getToggle()!.getAttribute('data-state')).toBe('on')
            })
        })

        it('should toggle with keyboard Space', async () => {
            render(Toggle, { label: 'Toggle' })
            getToggle()!.focus()
            await userEvent.keyboard(' ')
            await vi.waitFor(() => {
                expect(getToggle()!.getAttribute('data-state')).toBe('on')
            })
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with all props combined', () => {
            render(Toggle, {
                pressed: true,
                variant: 'outline',
                color: 'error',
                size: 'lg',
                label: 'Critical toggle'
            })
            const toggle = getToggle()!
            expect(toggle.getAttribute('data-state')).toBe('on')
            expect(toggle.className).toMatch(/data-\[state=on\]:bg-error-container/)
            expect(toggle.className).toMatch(/data-\[state=on\]:ring-error/)
            expect(toggle.className).toMatch(/px-4/)
            expect(toggle.textContent).toContain('Critical toggle')
        })

        it('should render disabled with pressed state', () => {
            render(Toggle, { label: 'Toggle', disabled: true, pressed: true })
            expect(getToggle()!.getAttribute('data-state')).toBe('on')
            expect(getToggle()!.disabled).toBe(true)
        })
    })
})
