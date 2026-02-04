import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Kbd from './Kbd.svelte'

describe('Kbd', () => {
    // Helpers
    const getRoot = (container: Element) => container.firstElementChild as HTMLElement

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render root element', () => {
            const { container } = render(Kbd, { value: 'K' })
            expect(getRoot(container)).not.toBeNull()
        })

        it('should render as kbd by default', () => {
            const { container } = render(Kbd, { value: 'K' })
            expect(getRoot(container).tagName).toBe('KBD')
        })

        it('should render as custom element', () => {
            const { container } = render(Kbd, { value: 'K', as: 'span' })
            expect(getRoot(container).tagName).toBe('SPAN')
        })

        it('should render value text', () => {
            const { container } = render(Kbd, { value: 'K' })
            expect(container.textContent).toContain('K')
        })

        it('should have inline-flex class', () => {
            const { container } = render(Kbd, { value: 'K' })
            expect(getRoot(container).className).toContain('inline-flex')
        })

        it('should have uppercase class', () => {
            const { container } = render(Kbd, { value: 'K' })
            expect(getRoot(container).className).toContain('uppercase')
        })
    })

    // ==================== KEY MAPPING ====================

    describe('key mapping', () => {
        it('should render enter as ↵', () => {
            const { container } = render(Kbd, { value: 'enter' })
            expect(container.textContent).toContain('↵')
        })

        it('should render escape as Esc', () => {
            const { container } = render(Kbd, { value: 'escape' })
            expect(container.textContent).toContain('Esc')
        })

        it('should render tab as ⇥', () => {
            const { container } = render(Kbd, { value: 'tab' })
            expect(container.textContent).toContain('⇥')
        })

        it('should render backspace as ⌫', () => {
            const { container } = render(Kbd, { value: 'backspace' })
            expect(container.textContent).toContain('⌫')
        })

        it('should render delete as ⌦', () => {
            const { container } = render(Kbd, { value: 'delete' })
            expect(container.textContent).toContain('⌦')
        })

        it('should render space as ␣', () => {
            const { container } = render(Kbd, { value: 'space' })
            expect(container.textContent).toContain('␣')
        })

        it('should render shift as ⇧', () => {
            const { container } = render(Kbd, { value: 'shift' })
            expect(container.textContent).toContain('⇧')
        })

        it('should render arrowup as ↑', () => {
            const { container } = render(Kbd, { value: 'arrowup' })
            expect(container.textContent).toContain('↑')
        })

        it('should render arrowdown as ↓', () => {
            const { container } = render(Kbd, { value: 'arrowdown' })
            expect(container.textContent).toContain('↓')
        })

        it('should render arrowleft as ←', () => {
            const { container } = render(Kbd, { value: 'arrowleft' })
            expect(container.textContent).toContain('←')
        })

        it('should render arrowright as →', () => {
            const { container } = render(Kbd, { value: 'arrowright' })
            expect(container.textContent).toContain('→')
        })

        it('should preserve letter keys as-is', () => {
            const { container } = render(Kbd, { value: 'A' })
            expect(container.textContent).toContain('A')
        })

        it('should be case-insensitive for special keys', () => {
            const { container } = render(Kbd, { value: 'ENTER' })
            expect(container.textContent).toContain('↵')
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should default to outline variant', () => {
            const { container } = render(Kbd, { value: 'K' })
            expect(getRoot(container).className).toContain('ring')
            expect(getRoot(container).className).toContain('ring-inset')
        })

        it('should apply solid variant', () => {
            const { container } = render(Kbd, { value: 'K', variant: 'solid' })
            expect(getRoot(container).className).toContain('bg-inverse-surface')
            expect(getRoot(container).className).toContain('text-inverse-on-surface')
        })

        it('should apply outline variant', () => {
            const { container } = render(Kbd, { value: 'K', variant: 'outline' })
            expect(getRoot(container).className).toContain('ring')
            expect(getRoot(container).className).toContain('text-on-surface-variant')
        })

        it('should apply soft variant', () => {
            const { container } = render(Kbd, { value: 'K', variant: 'soft' })
            expect(getRoot(container).className).toContain('bg-surface-container-highest')
            expect(getRoot(container).className).toContain('text-on-surface')
        })

        it('should apply subtle variant', () => {
            const { container } = render(Kbd, { value: 'K', variant: 'subtle' })
            expect(getRoot(container).className).toContain('bg-surface-container-highest')
            expect(getRoot(container).className).toContain('ring-outline-variant')
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        it('should default to surface color', () => {
            const { container } = render(Kbd, { value: 'K' })
            expect(getRoot(container).className).toContain('ring-outline-variant')
        })

        it('should apply primary color', () => {
            const { container } = render(Kbd, { value: 'K', color: 'primary', variant: 'solid' })
            expect(getRoot(container).className).toContain('bg-primary')
            expect(getRoot(container).className).toContain('text-on-primary')
        })

        it('should apply secondary color', () => {
            const { container } = render(Kbd, { value: 'K', color: 'secondary', variant: 'solid' })
            expect(getRoot(container).className).toContain('bg-secondary')
            expect(getRoot(container).className).toContain('text-on-secondary')
        })

        it('should apply success color', () => {
            const { container } = render(Kbd, { value: 'K', color: 'success', variant: 'solid' })
            expect(getRoot(container).className).toContain('bg-success')
            expect(getRoot(container).className).toContain('text-on-success')
        })

        it('should apply warning color', () => {
            const { container } = render(Kbd, { value: 'K', color: 'warning', variant: 'solid' })
            expect(getRoot(container).className).toContain('bg-warning')
            expect(getRoot(container).className).toContain('text-on-warning')
        })

        it('should apply error color', () => {
            const { container } = render(Kbd, { value: 'K', color: 'error', variant: 'solid' })
            expect(getRoot(container).className).toContain('bg-error')
            expect(getRoot(container).className).toContain('text-on-error')
        })

        it('should apply info color', () => {
            const { container } = render(Kbd, { value: 'K', color: 'info', variant: 'solid' })
            expect(getRoot(container).className).toContain('bg-info')
            expect(getRoot(container).className).toContain('text-on-info')
        })

        it('should apply surface solid color', () => {
            const { container } = render(Kbd, { value: 'K', color: 'surface', variant: 'solid' })
            expect(getRoot(container).className).toContain('bg-inverse-surface')
            expect(getRoot(container).className).toContain('text-inverse-on-surface')
        })
    })

    // ==================== COLOR x VARIANT COMBINATIONS ====================

    describe('color x variant', () => {
        it('should apply outline + primary', () => {
            const { container } = render(Kbd, { value: 'K', variant: 'outline', color: 'primary' })
            expect(getRoot(container).className).toContain('text-primary')
            expect(getRoot(container).className).toContain('ring-primary/50')
        })

        it('should apply soft + primary', () => {
            const { container } = render(Kbd, { value: 'K', variant: 'soft', color: 'primary' })
            expect(getRoot(container).className).toContain('bg-primary-container')
            expect(getRoot(container).className).toContain('text-on-primary-container')
        })

        it('should apply subtle + primary', () => {
            const { container } = render(Kbd, { value: 'K', variant: 'subtle', color: 'primary' })
            expect(getRoot(container).className).toContain('bg-primary-container')
            expect(getRoot(container).className).toContain('ring-primary/25')
        })

        it('should apply soft + error', () => {
            const { container } = render(Kbd, { value: 'K', variant: 'soft', color: 'error' })
            expect(getRoot(container).className).toContain('bg-error-container')
            expect(getRoot(container).className).toContain('text-on-error-container')
        })

        it('should apply outline + success', () => {
            const { container } = render(Kbd, { value: 'K', variant: 'outline', color: 'success' })
            expect(getRoot(container).className).toContain('text-success')
            expect(getRoot(container).className).toContain('ring-success/50')
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size by default', () => {
            const { container } = render(Kbd, { value: 'K' })
            expect(getRoot(container).className).toContain('h-5')
            expect(getRoot(container).className).toContain('min-w-5')
        })

        it('should apply sm size', () => {
            const { container } = render(Kbd, { value: 'K', size: 'sm' })
            expect(getRoot(container).className).toContain('h-4')
            expect(getRoot(container).className).toContain('min-w-4')
        })

        it('should apply lg size', () => {
            const { container } = render(Kbd, { value: 'K', size: 'lg' })
            expect(getRoot(container).className).toContain('h-6')
            expect(getRoot(container).className).toContain('min-w-6')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', () => {
            const { container } = render(Kbd, { value: 'K', class: 'my-kbd' })
            expect(getRoot(container).className).toContain('my-kbd')
        })

        it('should merge custom class with variant classes', () => {
            const { container } = render(Kbd, {
                value: 'K',
                class: 'my-kbd',
                color: 'error',
                variant: 'solid'
            })
            const root = getRoot(container)
            expect(root.className).toContain('my-kbd')
            expect(root.className).toContain('bg-error')
        })
    })

    // ==================== HTML ATTRIBUTES ====================

    describe('html attributes', () => {
        it('should pass through HTML attributes', () => {
            const { container } = render(Kbd, { value: 'K', id: 'my-kbd', title: 'Kbd tooltip' })
            const root = getRoot(container)
            expect(root.getAttribute('id')).toBe('my-kbd')
            expect(root.getAttribute('title')).toBe('Kbd tooltip')
        })

        it('should apply data attributes', () => {
            const { container } = render(Kbd, { value: 'K', 'data-testid': 'kbd-1' } as any)
            expect(getRoot(container).getAttribute('data-testid')).toBe('kbd-1')
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with color, variant, and size', () => {
            const { container } = render(Kbd, {
                value: 'K',
                color: 'success',
                variant: 'soft',
                size: 'lg'
            })
            const root = getRoot(container)
            expect(root.className).toContain('bg-success-container')
            expect(root.className).toContain('text-on-success-container')
            expect(root.className).toContain('h-6')
            expect(container.textContent).toContain('K')
        })

        it('should render outline + error + sm', () => {
            const { container } = render(Kbd, {
                value: 'X',
                color: 'error',
                variant: 'outline',
                size: 'sm'
            })
            const root = getRoot(container)
            expect(root.className).toContain('text-error')
            expect(root.className).toContain('ring-error/50')
            expect(root.className).toContain('h-4')
        })

        it('should render special key with custom styling', () => {
            const { container } = render(Kbd, {
                value: 'enter',
                color: 'primary',
                variant: 'solid'
            })
            const root = getRoot(container)
            expect(root.className).toContain('bg-primary')
            expect(container.textContent).toContain('↵')
        })
    })

    // ==================== EMPTY/NULL VALUE ====================

    describe('empty value', () => {
        it('should render empty when value is undefined', () => {
            const { container } = render(Kbd, {})
            expect(container.textContent?.trim()).toBe('')
        })

        it('should render empty when value is empty string', () => {
            const { container } = render(Kbd, { value: '' })
            expect(container.textContent?.trim()).toBe('')
        })
    })
})
