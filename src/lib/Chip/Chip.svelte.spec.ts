import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Chip from './Chip.svelte'

describe('Chip', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render as div by default', () => {
            const { container } = render(Chip)
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should render chip indicator span', () => {
            const { container } = render(Chip)
            expect(container.querySelector('span')).not.toBeNull()
        })

        it('should apply base classes', () => {
            const { container } = render(Chip)
            const root = container.firstElementChild!
            expect(root.className).toMatch(/relative/)
            expect(root.className).toMatch(/inline-flex/)
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        it('should default to primary color', () => {
            const { container } = render(Chip)
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/bg-primary/)
        })

        it('should apply error color', () => {
            const { container } = render(Chip, { color: 'error' })
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/bg-error/)
        })

        it('should apply surface color (inverse-surface)', () => {
            const { container } = render(Chip, { color: 'surface' })
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/bg-inverse-surface/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should default to md size', () => {
            const { container } = render(Chip)
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/size-3\b/)
        })

        it('should apply lg size', () => {
            const { container } = render(Chip, { size: 'lg' })
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/size-3\.5/)
        })
    })

    // ==================== POSITIONS ====================

    describe('positions', () => {
        it('should apply top-right position by default', () => {
            const { container } = render(Chip)
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/top-0/)
            expect(chip.className).toMatch(/right-0/)
        })

        it('should apply bottom-left position', () => {
            const { container } = render(Chip, { position: 'bottom-left' })
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/bottom-0/)
            expect(chip.className).toMatch(/left-0/)
        })
    })

    // ==================== TEXT ====================

    describe('text', () => {
        it('should render text content', () => {
            const { container } = render(Chip, { text: '5' })
            expect(container.textContent).toContain('5')
        })

        it('should render number as text', () => {
            const { container } = render(Chip, { text: 99 })
            expect(container.textContent).toContain('99')
        })

        it('should render zero', () => {
            const { container } = render(Chip, { text: 0 })
            expect(container.textContent).toContain('0')
        })
    })

    // ==================== INSET ====================

    describe('inset', () => {
        it('should apply transform when inset=false', () => {
            const { container } = render(Chip)
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/-translate-y-1\/2/)
        })

        it('should not apply transform when inset=true', () => {
            const { container } = render(Chip, { inset: true })
            const chip = container.querySelector('span')!
            expect(chip.className).not.toMatch(/-translate-y-1\/2/)
        })
    })

    // ==================== STANDALONE ====================

    describe('standalone', () => {
        it('should apply absolute positioning by default', () => {
            const { container } = render(Chip)
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/absolute/)
        })

        it('should not apply absolute when standalone=true', () => {
            const { container } = render(Chip, { standalone: true })
            const chip = container.querySelector('span')!
            expect(chip.className).not.toMatch(/absolute/)
        })
    })

    // ==================== SHOW ====================

    describe('show', () => {
        it('should render chip when show=true', () => {
            const { container } = render(Chip)
            expect(container.querySelector('span')).not.toBeNull()
        })

        it('should not render chip when show=false', () => {
            const { container } = render(Chip, { show: false })
            expect(container.querySelector('span')).toBeNull()
        })
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as span element', () => {
            const { container } = render(Chip, { as: 'span' })
            expect(container.firstElementChild!.tagName).toBe('SPAN')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', () => {
            const { container } = render(Chip, { class: 'my-chip' })
            expect(container.firstElementChild!.className).toMatch(/my-chip/)
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root and ui.base classes', () => {
            const { container } = render(Chip, {
                ui: { root: 'custom-root', base: 'custom-base' }
            })
            expect(container.firstElementChild!.className).toMatch(/custom-root/)
            expect(container.querySelector('span')!.className).toMatch(/custom-base/)
        })
    })

    // ==================== COMBINED ====================

    describe('combined features', () => {
        it('should render with text, color, position', () => {
            const { container } = render(Chip, {
                text: '99+',
                color: 'error',
                position: 'bottom-right'
            })
            expect(container.textContent).toContain('99+')
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/bg-error/)
            expect(chip.className).toMatch(/bottom-0/)
        })

        it('should render standalone with surface color', () => {
            const { container } = render(Chip, {
                standalone: true,
                color: 'surface'
            })
            const chip = container.querySelector('span')!
            expect(chip.className).toMatch(/bg-inverse-surface/)
            expect(chip.className).not.toMatch(/absolute/)
        })
    })
})
