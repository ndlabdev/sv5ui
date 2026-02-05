import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Progress from './Progress.svelte'

describe('Progress', () => {
    // Helpers
    const getRoot = (container: Element) => container.firstElementChild as HTMLElement
    const getBase = (container: Element) =>
        getRoot(container).querySelector('[class*="overflow-hidden"]') as HTMLElement
    const getIndicator = (container: Element) =>
        getBase(container)?.firstElementChild as HTMLElement

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render root element', () => {
            const { container } = render(Progress)
            expect(getRoot(container)).not.toBeNull()
        })

        it('should render base element', () => {
            const { container } = render(Progress)
            expect(getBase(container)).not.toBeNull()
        })

        it('should render indicator element', () => {
            const { container } = render(Progress)
            expect(getIndicator(container)).not.toBeNull()
        })

        it('should have progressbar role', () => {
            const { container } = render(Progress)
            expect(getRoot(container).getAttribute('role')).toBe('progressbar')
        })
    })

    // ==================== VALUE ====================

    describe('value', () => {
        it('should be indeterminate when value is null', () => {
            const { container } = render(Progress, { value: null })
            expect(getIndicator(container).getAttribute('data-state')).toBe('indeterminate')
        })

        it('should be determinate when value is set', () => {
            const { container } = render(Progress, { value: 50 })
            expect(getIndicator(container).getAttribute('data-state')).toBe('determinate')
        })

        it('should apply transform based on value', () => {
            const { container } = render(Progress, { value: 75 })
            const indicator = getIndicator(container)
            expect(indicator.style.transform).toContain('translateX(-25%)')
        })

        it('should handle 0 value', () => {
            const { container } = render(Progress, { value: 0 })
            const indicator = getIndicator(container)
            expect(indicator.getAttribute('data-state')).toBe('determinate')
            expect(indicator.style.transform).toContain('translateX(-100%)')
        })

        it('should handle 100 value', () => {
            const { container } = render(Progress, { value: 100 })
            const indicator = getIndicator(container)
            expect(indicator.style.transform).toMatch(/translateX\(-?0%\)/)
        })

        it('should cap value at max', () => {
            const { container } = render(Progress, { value: 150, max: 100 })
            const indicator = getIndicator(container)
            expect(indicator.style.transform).toMatch(/translateX\(-?0%\)/)
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        it('should default to primary color', () => {
            const { container } = render(Progress, { value: 50 })
            expect(getIndicator(container).className).toContain('bg-primary')
        })

        it('should apply secondary color', () => {
            const { container } = render(Progress, { value: 50, color: 'secondary' })
            expect(getIndicator(container).className).toContain('bg-secondary')
        })

        it('should apply tertiary color', () => {
            const { container } = render(Progress, { value: 50, color: 'tertiary' })
            expect(getIndicator(container).className).toContain('bg-tertiary')
        })

        it('should apply success color', () => {
            const { container } = render(Progress, { value: 50, color: 'success' })
            expect(getIndicator(container).className).toContain('bg-success')
        })

        it('should apply warning color', () => {
            const { container } = render(Progress, { value: 50, color: 'warning' })
            expect(getIndicator(container).className).toContain('bg-warning')
        })

        it('should apply error color', () => {
            const { container } = render(Progress, { value: 50, color: 'error' })
            expect(getIndicator(container).className).toContain('bg-error')
        })

        it('should apply info color', () => {
            const { container } = render(Progress, { value: 50, color: 'info' })
            expect(getIndicator(container).className).toContain('bg-info')
        })

        it('should apply surface color', () => {
            const { container } = render(Progress, { value: 50, color: 'surface' })
            expect(getIndicator(container).className).toContain('bg-on-surface')
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size by default (h-2)', () => {
            const { container } = render(Progress, { value: 50 })
            expect(getBase(container).className).toContain('h-2')
        })

        it('should apply xs size', () => {
            const { container } = render(Progress, { value: 50, size: 'xs' })
            expect(getBase(container).className).toContain('h-0.5')
        })

        it('should apply sm size', () => {
            const { container } = render(Progress, { value: 50, size: 'sm' })
            expect(getBase(container).className).toContain('h-1')
        })

        it('should apply lg size', () => {
            const { container } = render(Progress, { value: 50, size: 'lg' })
            expect(getBase(container).className).toContain('h-3')
        })

        it('should apply xl size', () => {
            const { container } = render(Progress, { value: 50, size: 'xl' })
            expect(getBase(container).className).toContain('h-4')
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should be horizontal by default', () => {
            const { container } = render(Progress, { value: 50 })
            expect(getRoot(container).className).toContain('flex-col')
            expect(getBase(container).className).toContain('w-full')
        })

        it('should apply vertical orientation', () => {
            const { container } = render(Progress, { value: 50, orientation: 'vertical' })
            expect(getRoot(container).className).toContain('flex-row-reverse')
            expect(getRoot(container).className).toContain('h-full')
        })

        it('should apply width for vertical sizes', () => {
            const { container } = render(Progress, {
                value: 50,
                orientation: 'vertical',
                size: 'md'
            })
            expect(getBase(container).className).toContain('w-2')
        })

        it('should use translateY for vertical', () => {
            const { container } = render(Progress, { value: 75, orientation: 'vertical' })
            const indicator = getIndicator(container)
            expect(indicator.style.transform).toContain('translateY(25%)')
        })
    })

    // ==================== INVERTED ====================

    describe('inverted', () => {
        it('should invert horizontal direction', () => {
            const { container } = render(Progress, { value: 75, inverted: true })
            const indicator = getIndicator(container)
            expect(indicator.style.transform).toContain('translateX(25%)')
        })

        it('should invert vertical direction', () => {
            const { container } = render(Progress, {
                value: 75,
                orientation: 'vertical',
                inverted: true
            })
            const indicator = getIndicator(container)
            expect(indicator.style.transform).toContain('translateY(-25%)')
        })
    })

    // ==================== STATUS ====================

    describe('status', () => {
        it('should not render status by default', () => {
            const { container } = render(Progress, { value: 50 })
            expect(container.textContent).not.toContain('%')
        })

        it('should render status when enabled', () => {
            const { container } = render(Progress, { value: 50, status: true })
            expect(container.textContent).toContain('50%')
        })

        it('should display correct percentage', () => {
            const { container } = render(Progress, { value: 75, status: true })
            expect(container.textContent).toContain('75%')
        })

        it('should display 0% for indeterminate with status', () => {
            const { container } = render(Progress, { value: null, status: true })
            expect(container.textContent).toContain('0%')
        })

        it('should not render status when max is array', () => {
            const { container } = render(Progress, { value: 1, max: ['A', 'B', 'C'], status: true })
            expect(container.textContent).not.toContain('%')
        })
    })

    // ==================== STEPS ====================

    describe('steps', () => {
        it('should render steps when max is array', () => {
            const { container } = render(Progress, {
                value: 1,
                max: ['Step 1', 'Step 2', 'Step 3']
            })
            expect(container.textContent).toContain('Step 1')
            expect(container.textContent).toContain('Step 2')
            expect(container.textContent).toContain('Step 3')
        })

        it('should render correct number of step spans', () => {
            const { container } = render(Progress, { value: 1, max: ['A', 'B', 'C', 'D'] })
            const steps = container.querySelectorAll('span')
            expect(steps.length).toBe(4)
        })

        it('should apply active class to completed steps', () => {
            const { container } = render(Progress, { value: 1, max: ['A', 'B', 'C'] })
            const steps = container.querySelectorAll('span')
            expect(steps[0].className).toContain('text-on-surface')
            expect(steps[1].className).toContain('text-on-surface')
            expect(steps[2].className).toContain('text-on-surface-variant')
        })

        it('should calculate progress based on step count', () => {
            const { container } = render(Progress, { value: 2, max: ['A', 'B', 'C', 'D'] })
            const indicator = getIndicator(container)
            // max = 3 (array.length - 1), value = 2, percent = 67%
            expect(indicator.style.transform).toContain('translateX(-33%)')
        })
    })

    // ==================== ANIMATION ====================

    describe('animation', () => {
        it('should apply carousel animation by default', () => {
            const { container } = render(Progress, { value: null })
            const indicator = getIndicator(container)
            expect(indicator.className).toContain('carousel')
        })

        it('should apply swing animation', () => {
            const { container } = render(Progress, { value: null, animation: 'swing' })
            const indicator = getIndicator(container)
            expect(indicator.className).toContain('swing')
        })

        it('should apply elastic animation', () => {
            const { container } = render(Progress, { value: null, animation: 'elastic' })
            const indicator = getIndicator(container)
            expect(indicator.className).toContain('elastic')
        })

        it('should apply carousel-inverse animation', () => {
            const { container } = render(Progress, { value: null, animation: 'carousel-inverse' })
            const indicator = getIndicator(container)
            expect(indicator.className).toContain('carousel-inverse')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', () => {
            const { container } = render(Progress, { value: 50, class: 'my-progress' })
            expect(getRoot(container).className).toContain('my-progress')
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', () => {
            const { container } = render(Progress, { value: 50, ui: { root: 'custom-root' } })
            expect(getRoot(container).className).toContain('custom-root')
        })

        it('should apply ui.base class', () => {
            const { container } = render(Progress, { value: 50, ui: { base: 'custom-base' } })
            expect(getBase(container).className).toContain('custom-base')
        })

        it('should apply ui.indicator class', () => {
            const { container } = render(Progress, {
                value: 50,
                ui: { indicator: 'custom-indicator' }
            })
            expect(getIndicator(container).className).toContain('custom-indicator')
        })

        it('should apply ui.status class', () => {
            const { container } = render(Progress, {
                value: 50,
                status: true,
                ui: { status: 'custom-status' }
            })
            expect(container.querySelector('.custom-status')).not.toBeNull()
        })
    })

    // ==================== COMBINED ====================

    describe('combined features', () => {
        it('should render with color, size and status', () => {
            const { container } = render(Progress, {
                value: 80,
                color: 'success',
                size: 'lg',
                status: true
            })
            expect(container.textContent).toContain('80%')
            expect(getIndicator(container).className).toContain('bg-success')
            expect(getBase(container).className).toContain('h-3')
        })

        it('should render vertical with inverted', () => {
            const { container } = render(Progress, {
                value: 60,
                orientation: 'vertical',
                inverted: true,
                color: 'tertiary'
            })
            const indicator = getIndicator(container)
            expect(indicator.style.transform).toContain('translateY(-40%)')
            expect(indicator.className).toContain('bg-tertiary')
        })

        it('should render steps with color', () => {
            const { container } = render(Progress, {
                value: 2,
                max: ['Cart', 'Shipping', 'Payment', 'Done'],
                color: 'success'
            })
            expect(container.textContent).toContain('Cart')
            expect(container.textContent).toContain('Done')
            expect(getIndicator(container).className).toContain('bg-success')
        })
    })
})
