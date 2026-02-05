import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Badge, { type Props } from './Badge.svelte'

describe('Badge', () => {
    // Helpers
    const getRoot = (container: Element) => container.firstElementChild as HTMLElement
    const getLabel = (container: Element) => getRoot(container).querySelector('span') as HTMLElement

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render root element', () => {
            const { container } = render(Badge, { label: 'Test' })
            expect(getRoot(container)).not.toBeNull()
        })

        it('should render as span by default', () => {
            const { container } = render(Badge, { label: 'Test' })
            expect(getRoot(container).tagName).toBe('SPAN')
        })

        it('should render as custom element', () => {
            const { container } = render(Badge, { label: 'Test', as: 'div' })
            expect(getRoot(container).tagName).toBe('DIV')
        })

        it('should render label text', () => {
            const { container } = render(Badge, { label: 'Hello' })
            expect(container.textContent).toContain('Hello')
        })

        it('should render numeric label', () => {
            const { container } = render(Badge, { label: 42 })
            expect(container.textContent).toContain('42')
        })

        it('should have inline-flex class', () => {
            const { container } = render(Badge, { label: 'Test' })
            expect(getRoot(container).className).toContain('inline-flex')
        })

        it('should render label in a span with truncate class', () => {
            const { container } = render(Badge, { label: 'Test' })
            const label = getLabel(container)
            expect(label).not.toBeNull()
            expect(label.className).toContain('truncate')
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should default to solid variant', () => {
            const { container } = render(Badge, { label: 'Test' })
            expect(getRoot(container).className).toContain('bg-primary')
            expect(getRoot(container).className).toContain('text-on-primary')
        })

        it('should apply outline variant', () => {
            const { container } = render(Badge, { label: 'Test', variant: 'outline' })
            expect(getRoot(container).className).toContain('ring')
            expect(getRoot(container).className).toContain('text-primary')
        })

        it('should apply soft variant', () => {
            const { container } = render(Badge, { label: 'Test', variant: 'soft' })
            expect(getRoot(container).className).toContain('bg-primary-container')
            expect(getRoot(container).className).toContain('text-on-primary-container')
        })

        it('should apply subtle variant', () => {
            const { container } = render(Badge, { label: 'Test', variant: 'subtle' })
            expect(getRoot(container).className).toContain('bg-primary-container')
            expect(getRoot(container).className).toContain('ring-primary/25')
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        it('should default to primary color', () => {
            const { container } = render(Badge, { label: 'Test' })
            expect(getRoot(container).className).toContain('bg-primary')
        })

        it('should apply secondary color', () => {
            const { container } = render(Badge, { label: 'Test', color: 'secondary' })
            expect(getRoot(container).className).toContain('bg-secondary')
            expect(getRoot(container).className).toContain('text-on-secondary')
        })

        it('should apply tertiary color', () => {
            const { container } = render(Badge, { label: 'Test', color: 'tertiary' })
            expect(getRoot(container).className).toContain('bg-tertiary')
            expect(getRoot(container).className).toContain('text-on-tertiary')
        })

        it('should apply success color', () => {
            const { container } = render(Badge, { label: 'Test', color: 'success' })
            expect(getRoot(container).className).toContain('bg-success')
            expect(getRoot(container).className).toContain('text-on-success')
        })

        it('should apply warning color', () => {
            const { container } = render(Badge, { label: 'Test', color: 'warning' })
            expect(getRoot(container).className).toContain('bg-warning')
            expect(getRoot(container).className).toContain('text-on-warning')
        })

        it('should apply error color', () => {
            const { container } = render(Badge, { label: 'Test', color: 'error' })
            expect(getRoot(container).className).toContain('bg-error')
            expect(getRoot(container).className).toContain('text-on-error')
        })

        it('should apply info color', () => {
            const { container } = render(Badge, { label: 'Test', color: 'info' })
            expect(getRoot(container).className).toContain('bg-info')
            expect(getRoot(container).className).toContain('text-on-info')
        })

        it('should apply surface color', () => {
            const { container } = render(Badge, { label: 'Test', color: 'surface' })
            expect(getRoot(container).className).toContain('bg-inverse-surface')
            expect(getRoot(container).className).toContain('text-inverse-on-surface')
        })
    })

    // ==================== COLOR x VARIANT COMBINATIONS ====================

    describe('color x variant', () => {
        it('should apply outline + surface', () => {
            const { container } = render(Badge, {
                label: 'Test',
                variant: 'outline',
                color: 'surface'
            })
            expect(getRoot(container).className).toContain('text-on-surface-variant')
            expect(getRoot(container).className).toContain('ring-outline-variant')
        })

        it('should apply soft + surface', () => {
            const { container } = render(Badge, {
                label: 'Test',
                variant: 'soft',
                color: 'surface'
            })
            expect(getRoot(container).className).toContain('bg-surface-container-highest')
            expect(getRoot(container).className).toContain('text-on-surface')
        })

        it('should apply subtle + surface', () => {
            const { container } = render(Badge, {
                label: 'Test',
                variant: 'subtle',
                color: 'surface'
            })
            expect(getRoot(container).className).toContain('bg-surface-container-highest')
            expect(getRoot(container).className).toContain('ring-outline-variant')
        })

        it('should apply soft + error', () => {
            const { container } = render(Badge, { label: 'Test', variant: 'soft', color: 'error' })
            expect(getRoot(container).className).toContain('bg-error-container')
            expect(getRoot(container).className).toContain('text-on-error-container')
        })

        it('should apply outline + success', () => {
            const { container } = render(Badge, {
                label: 'Test',
                variant: 'outline',
                color: 'success'
            })
            expect(getRoot(container).className).toContain('text-success')
            expect(getRoot(container).className).toContain('ring-success/50')
        })

        it('should apply subtle + tertiary', () => {
            const { container } = render(Badge, {
                label: 'Test',
                variant: 'subtle',
                color: 'tertiary'
            })
            expect(getRoot(container).className).toContain('bg-tertiary-container')
            expect(getRoot(container).className).toContain('ring-tertiary/25')
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size by default', () => {
            const { container } = render(Badge, { label: 'Test' })
            expect(getRoot(container).className).toContain('text-xs')
            expect(getRoot(container).className).toContain('rounded-md')
        })

        it('should apply xs size', () => {
            const { container } = render(Badge, { label: 'Test', size: 'xs' })
            expect(getRoot(container).className).toContain('rounded-sm')
        })

        it('should apply sm size', () => {
            const { container } = render(Badge, { label: 'Test', size: 'sm' })
            expect(getRoot(container).className).toContain('rounded-sm')
        })

        it('should apply lg size', () => {
            const { container } = render(Badge, { label: 'Test', size: 'lg' })
            expect(getRoot(container).className).toContain('text-sm')
        })

        it('should apply xl size', () => {
            const { container } = render(Badge, { label: 'Test', size: 'xl' })
            expect(getRoot(container).className).toContain('text-base')
        })
    })

    // ==================== SQUARE ====================

    describe('square', () => {
        it('should not apply square padding by default', () => {
            const { container } = render(Badge, { label: 'Test' })
            expect(getRoot(container).className).toContain('px-2')
        })

        it('should apply square padding', () => {
            const { container } = render(Badge, { label: 'A', square: true })
            const root = getRoot(container)
            expect(root.className).toContain('p-1')
        })

        it('should apply square with xs size', () => {
            const { container } = render(Badge, { label: 'A', square: true, size: 'xs' })
            expect(getRoot(container).className).toContain('p-0.5')
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render with leading icon without crashing', () => {
            const { container } = render(Badge, { label: 'Test', leadingIcon: 'lucide:star' })
            expect(container.textContent).toContain('Test')
            expect(getRoot(container)).not.toBeNull()
        })

        it('should render with trailing icon without crashing', () => {
            const { container } = render(Badge, { label: 'Test', trailingIcon: 'lucide:x' })
            expect(container.textContent).toContain('Test')
            expect(getRoot(container)).not.toBeNull()
        })

        it('should render icon-only badge without label', () => {
            const { container } = render(Badge, { icon: 'lucide:star' })
            const root = getRoot(container)
            // Should not have a label span with truncate
            expect(root.querySelector('.truncate')).toBeNull()
        })

        it('should render icon-only with square padding', () => {
            const { container } = render(Badge, { icon: 'lucide:star' })
            expect(getRoot(container).className).toContain('p-1')
        })

        it('should render with both leading and trailing icons', () => {
            const { container } = render(Badge, {
                label: 'Test',
                leadingIcon: 'lucide:star',
                trailingIcon: 'lucide:x'
            })
            expect(container.textContent).toContain('Test')
            expect(getRoot(container)).not.toBeNull()
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', () => {
            const { container } = render(Badge, { label: 'Test', class: 'my-badge' })
            expect(getRoot(container).className).toContain('my-badge')
        })

        it('should merge custom class with variant classes', () => {
            const { container } = render(Badge, {
                label: 'Test',
                class: 'my-badge',
                color: 'error'
            })
            const root = getRoot(container)
            expect(root.className).toContain('my-badge')
            expect(root.className).toContain('bg-error')
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.base class', () => {
            const { container } = render(Badge, { label: 'Test', ui: { base: 'custom-base' } })
            expect(getRoot(container).className).toContain('custom-base')
        })

        it('should apply ui.label class', () => {
            const { container } = render(Badge, { label: 'Test', ui: { label: 'custom-label' } })
            expect(getLabel(container).className).toContain('custom-label')
        })

        it('should accept ui.leadingIcon without crashing', () => {
            const { container } = render(Badge, {
                label: 'Test',
                leadingIcon: 'lucide:star',
                ui: { leadingIcon: 'custom-icon' }
            })
            expect(getRoot(container)).not.toBeNull()
            expect(container.textContent).toContain('Test')
        })

        it('should accept ui.trailingIcon without crashing', () => {
            const { container } = render(Badge, {
                label: 'Test',
                trailingIcon: 'lucide:x',
                ui: { trailingIcon: 'custom-trailing' }
            })
            expect(getRoot(container)).not.toBeNull()
            expect(container.textContent).toContain('Test')
        })
    })

    // ==================== HTML ATTRIBUTES ====================

    describe('html attributes', () => {
        it('should pass through HTML attributes', () => {
            const { container } = render(Badge, {
                label: 'Test',
                id: 'my-badge',
                title: 'Badge tooltip'
            })
            const root = getRoot(container)
            expect(root.getAttribute('id')).toBe('my-badge')
            expect(root.getAttribute('title')).toBe('Badge tooltip')
        })

        it('should apply data attributes', () => {
            const { container } = render(Badge, {
                label: 'Test',
                'data-testid': 'badge-1'
            } as Props & { 'data-testid': string })
            expect(getRoot(container).getAttribute('data-testid')).toBe('badge-1')
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with color, variant, and size', () => {
            const { container } = render(Badge, {
                label: 'Status',
                color: 'success',
                variant: 'soft',
                size: 'lg'
            })
            const root = getRoot(container)
            expect(root.className).toContain('bg-success-container')
            expect(root.className).toContain('text-on-success-container')
            expect(root.className).toContain('text-sm')
            expect(container.textContent).toContain('Status')
        })

        it('should render outline + error + xs', () => {
            const { container } = render(Badge, {
                label: 'X',
                color: 'error',
                variant: 'outline',
                size: 'xs'
            })
            const root = getRoot(container)
            expect(root.className).toContain('text-error')
            expect(root.className).toContain('ring-error/50')
            expect(root.className).toContain('rounded-sm')
        })

        it('should render icon-only with custom color and variant', () => {
            const { container } = render(Badge, {
                icon: 'lucide:heart',
                color: 'error',
                variant: 'soft'
            })
            const root = getRoot(container)
            expect(root.className).toContain('bg-error-container')
            expect(root.className).toContain('p-1')
        })

        it('should render with leading icon, label, and custom class', () => {
            const { container } = render(Badge, {
                label: 'Active',
                leadingIcon: 'lucide:check',
                color: 'success',
                class: 'rounded-full'
            })
            const root = getRoot(container)
            expect(root.className).toContain('bg-success')
            expect(root.className).toContain('rounded-full')
            expect(container.textContent).toContain('Active')
        })
    })
})
