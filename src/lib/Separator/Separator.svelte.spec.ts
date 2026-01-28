import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Separator from './Separator.svelte'

describe('Separator', () => {
    // Helper to get border element
    const getBorder = (container: Element) => container.firstElementChild?.firstElementChild as HTMLElement

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render root element', () => {
            const { container } = render(Separator)
            expect(container.firstElementChild).not.toBeNull()
        })

        it('should have data-orientation attribute', () => {
            const { container } = render(Separator)
            const root = container.firstElementChild!
            expect(root.getAttribute('data-orientation')).toBe('horizontal')
        })

        it('should render border element', () => {
            const { container } = render(Separator)
            expect(getBorder(container)).not.toBeNull()
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        it('should default to surface color', () => {
            const { container } = render(Separator)
            expect(getBorder(container).className).toContain('border-outline-variant')
        })

        it('should apply primary color', () => {
            const { container } = render(Separator, { color: 'primary' })
            expect(getBorder(container).className).toContain('border-primary')
        })

        it('should apply secondary color', () => {
            const { container } = render(Separator, { color: 'secondary' })
            expect(getBorder(container).className).toContain('border-secondary')
        })

        it('should apply error color', () => {
            const { container } = render(Separator, { color: 'error' })
            expect(getBorder(container).className).toContain('border-error')
        })

        it('should apply success color', () => {
            const { container } = render(Separator, { color: 'success' })
            expect(getBorder(container).className).toContain('border-success')
        })
    })

    // ==================== TYPES ====================

    describe('types', () => {
        it('should apply solid type by default', () => {
            const { container } = render(Separator)
            expect(getBorder(container).className).toContain('border-solid')
        })

        it('should apply dashed type', () => {
            const { container } = render(Separator, { type: 'dashed' })
            expect(getBorder(container).className).toContain('border-dashed')
        })

        it('should apply dotted type', () => {
            const { container } = render(Separator, { type: 'dotted' })
            expect(getBorder(container).className).toContain('border-dotted')
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should apply horizontal orientation by default', () => {
            const { container } = render(Separator)
            const root = container.firstElementChild!
            expect(root.className).toContain('flex-row')
            expect(root.getAttribute('data-orientation')).toBe('horizontal')
        })

        it('should apply vertical orientation', () => {
            const { container } = render(Separator, { orientation: 'vertical' })
            const root = container.firstElementChild!
            expect(root.className).toContain('flex-col')
            expect(root.getAttribute('data-orientation')).toBe('vertical')
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size (border-t)', () => {
            const { container } = render(Separator, { size: 'xs' })
            expect(getBorder(container).className).toContain('border-t')
        })

        it('should apply md size (border-t-[3px])', () => {
            const { container } = render(Separator, { size: 'md' })
            expect(getBorder(container).className).toContain('border-t-')
        })

        it('should apply vertical size (border-s)', () => {
            const { container } = render(Separator, { orientation: 'vertical', size: 'xs' })
            expect(getBorder(container).className).toContain('border-s')
        })
    })

    // ==================== LABEL ====================

    describe('label', () => {
        it('should render label text', () => {
            const { container } = render(Separator, { label: 'OR' })
            expect(container.textContent).toContain('OR')
        })

        it('should render label in span', () => {
            const { container } = render(Separator, { label: 'Test' })
            const span = container.querySelector('span')
            expect(span).not.toBeNull()
            expect(span!.textContent).toBe('Test')
        })

        it('should render two borders when label present', () => {
            const { container } = render(Separator, { label: 'OR' })
            const root = container.firstElementChild!
            // root > border + container + border = 3 children
            expect(root.children.length).toBe(3)
        })

        it('should not render span when no label', () => {
            const { container } = render(Separator)
            expect(container.querySelector('span')).toBeNull()
        })
    })

    // ==================== ICON ====================

    describe('icon', () => {
        it('should render content when icon provided', () => {
            const { container } = render(Separator, { icon: 'lucide:star' })
            const root = container.firstElementChild!
            expect(root.children.length).toBeGreaterThan(1)
        })
    })

    // ==================== AVATAR ====================

    describe('avatar', () => {
        it('should render avatar', () => {
            const { container } = render(Separator, { avatar: { alt: 'User' } })
            expect(container.querySelector('[data-avatar-root]')).not.toBeNull()
        })
    })

    // ==================== DECORATIVE ====================

    describe('decorative', () => {
        it('should have role="separator" by default', () => {
            const { container } = render(Separator)
            const root = container.firstElementChild!
            expect(root.getAttribute('role')).toBe('separator')
        })

        it('should have role="none" when decorative', () => {
            const { container } = render(Separator, { decorative: true })
            const root = container.firstElementChild!
            expect(root.getAttribute('role')).toBe('none')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class', () => {
            const { container } = render(Separator, { class: 'my-separator' })
            expect(container.firstElementChild!.className).toContain('my-separator')
        })
    })

    // ==================== UI OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', () => {
            const { container } = render(Separator, { ui: { root: 'custom-root' } })
            expect(container.firstElementChild!.className).toContain('custom-root')
        })

        it('should apply ui.border class', () => {
            const { container } = render(Separator, { ui: { border: 'custom-border' } })
            expect(getBorder(container).className).toContain('custom-border')
        })

        it('should apply ui.label class', () => {
            const { container } = render(Separator, { label: 'Test', ui: { label: 'custom-label' } })
            expect(container.querySelector('.custom-label')).not.toBeNull()
        })
    })

    // ==================== COMBINED ====================

    describe('combined', () => {
        it('should render with all options', () => {
            const { container } = render(Separator, {
                label: 'Section',
                color: 'primary',
                type: 'dashed',
                size: 'md'
            })
            expect(container.textContent).toContain('Section')
            const border = getBorder(container)
            expect(border.className).toContain('border-primary')
            expect(border.className).toContain('border-dashed')
        })
    })
})
