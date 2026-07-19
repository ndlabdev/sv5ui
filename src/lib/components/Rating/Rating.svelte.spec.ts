import '../../../routes/layout.css'
import { page, userEvent } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Rating from './Rating.svelte'

const getRoot = () => document.querySelector('[role="slider"]') as HTMLElement | null
const getItems = () => Array.from(document.querySelectorAll('[data-value]')) as HTMLElement[]
const getItem = (value: number) =>
    document.querySelector(`[data-value="${value}"]`) as HTMLElement | null

describe('Rating', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a slider element', async () => {
            render(Rating)
            const root = page.getByRole('slider')
            await expect.element(root).toBeInTheDocument()
        })

        it('should render 5 items by default', () => {
            render(Rating)
            expect(getItems().length).toBe(5)
        })

        it('should render max items', () => {
            render(Rating, { max: 10 })
            expect(getItems().length).toBe(10)
        })

        it('should render star icons', async () => {
            render(Rating)
            await vi.waitFor(() => {
                expect(getItem(1)!.querySelector('svg')).not.toBeNull()
            })
        })

        it('should render all items inactive at value 0', () => {
            render(Rating)
            for (const item of getItems()) {
                expect(item.getAttribute('data-state')).toBe('inactive')
            }
        })

        it('should render with id', () => {
            render(Rating, { id: 'my-rating' })
            expect(getRoot()!.id).toBe('my-rating')
        })

        it('should generate an id automatically', () => {
            render(Rating)
            expect(getRoot()!.id).toBeTruthy()
        })
    })

    // ==================== VALUE ====================

    describe('value', () => {
        it('should mark items up to value as active', () => {
            render(Rating, { value: 3 })
            expect(getItem(1)!.getAttribute('data-state')).toBe('active')
            expect(getItem(3)!.getAttribute('data-state')).toBe('active')
            expect(getItem(4)!.getAttribute('data-state')).toBe('inactive')
        })

        it('should expose value via aria-valuenow', () => {
            render(Rating, { value: 4 })
            expect(getRoot()!.getAttribute('aria-valuenow')).toBe('4')
        })

        it('should set value on item click', async () => {
            render(Rating)
            await userEvent.click(getItem(4)!)
            expect(getRoot()!.getAttribute('aria-valuenow')).toBe('4')
            expect(getItem(4)!.getAttribute('data-state')).toBe('active')
        })

        it('should call onValueChange on click', async () => {
            const onValueChange = vi.fn()
            render(Rating, { onValueChange })
            await userEvent.click(getItem(2)!)
            expect(onValueChange).toHaveBeenCalledWith(2)
        })

        it('should increase value with ArrowRight', async () => {
            render(Rating, { value: 2 })
            getRoot()!.focus()
            await userEvent.keyboard('{ArrowRight}')
            await vi.waitFor(() => {
                expect(getRoot()!.getAttribute('aria-valuenow')).toBe('3')
            })
        })

        it('should decrease value with ArrowLeft', async () => {
            render(Rating, { value: 2 })
            getRoot()!.focus()
            await userEvent.keyboard('{ArrowLeft}')
            await vi.waitFor(() => {
                expect(getRoot()!.getAttribute('aria-valuenow')).toBe('1')
            })
        })
    })

    // ==================== HALF STEPS ====================

    describe('half steps', () => {
        it('should mark an item partial for half values', () => {
            render(Rating, { allowHalf: true, value: 2.5 })
            expect(getItem(2)!.getAttribute('data-state')).toBe('active')
            expect(getItem(3)!.getAttribute('data-state')).toBe('partial')
            expect(getItem(4)!.getAttribute('data-state')).toBe('inactive')
        })

        it('should render a clipping overlay for partial items', () => {
            render(Rating, { allowHalf: true, value: 2.5 })
            const overlay = getItem(3)!.querySelector('span') as HTMLElement
            expect(overlay).not.toBeNull()
            expect(overlay.className).toMatch(/w-1\/2/)
            expect(overlay.className).toMatch(/overflow-hidden/)
        })

        it('should step by half with arrow keys when allowHalf', async () => {
            render(Rating, { allowHalf: true, value: 2 })
            getRoot()!.focus()
            await userEvent.keyboard('{ArrowRight}')
            await vi.waitFor(() => {
                expect(getRoot()!.getAttribute('aria-valuenow')).toBe('2.5')
            })
        })
    })

    // ==================== READONLY & DISABLED ====================

    describe('readonly & disabled', () => {
        it('should not change value when readonly', async () => {
            render(Rating, { readonly: true, value: 3 })
            await userEvent.click(getItem(5)!)
            expect(getRoot()!.getAttribute('aria-valuenow')).toBe('3')
        })

        it('should mark items readonly', () => {
            render(Rating, { readonly: true })
            expect(getItem(1)!.hasAttribute('data-readonly')).toBe(true)
        })

        it('should not change value when disabled', async () => {
            render(Rating, { disabled: true, value: 2 })
            await userEvent.click(getItem(5)!)
            expect(getRoot()!.getAttribute('aria-valuenow')).toBe('2')
        })

        it('should remove root from tab order when disabled', () => {
            render(Rating, { disabled: true })
            expect(getRoot()!.getAttribute('tabindex')).toBe('-1')
        })

        it('should apply disabled styling to root', () => {
            render(Rating, { disabled: true })
            expect(getRoot()!.className).toMatch(/data-disabled:opacity-75/)
            expect(getRoot()!.hasAttribute('data-disabled')).toBe(true)
        })
    })

    // ==================== FORM ====================

    describe('form', () => {
        it('should render a hidden input when name is set', () => {
            const { container } = render(Rating, { name: 'score', value: 4 })
            const hidden = container.querySelector('input[name="score"]') as HTMLInputElement
            expect(hidden).not.toBeNull()
            expect(hidden.value).toBe('4')
        })

        it('should not render a hidden input without name', () => {
            const { container } = render(Rating)
            expect(container.querySelector('input')).toBeNull()
        })

        it('should set aria-required', () => {
            render(Rating, { name: 'score', required: true })
            expect(getRoot()!.getAttribute('aria-required')).toBe('true')
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
            it(`should apply active icon color for color="${color}"`, () => {
                render(Rating, { color, value: 1 })
                const icon = getItem(1)!.querySelector('svg') as SVGElement
                expect(icon.getAttribute('class')).toMatch(new RegExp(`text-${color}`))
            })
        }

        it('should apply surface color', () => {
            render(Rating, { color: 'surface', value: 1 })
            const icon = getItem(1)!.querySelector('svg') as SVGElement
            expect(icon.getAttribute('class')).toMatch(/text-on-surface/)
        })

        it('should fill active star paths with the current color', async () => {
            render(Rating, { value: 1 })
            await vi.waitFor(() => {
                expect(getItem(1)!.querySelector('svg path')).not.toBeNull()
                expect(getItem(2)!.querySelector('svg path')).not.toBeNull()
            })
            const activePath = getItem(1)!.querySelector('svg path') as SVGPathElement
            const inactivePath = getItem(2)!.querySelector('svg path') as SVGPathElement
            const activeSvg = getItem(1)!.querySelector('svg') as SVGElement
            expect(getComputedStyle(activePath).fill).toBe(getComputedStyle(activeSvg).color)
            expect(getComputedStyle(activePath).fill).not.toBe('none')
            expect(getComputedStyle(inactivePath).fill).toBe('none')
        })

        it('should not fill active paths when fill is false', async () => {
            render(Rating, { value: 1, fill: false })
            await vi.waitFor(() => {
                expect(getItem(1)!.querySelector('svg path')).not.toBeNull()
            })
            const activePath = getItem(1)!.querySelector('svg path') as SVGPathElement
            expect(getComputedStyle(activePath).fill).toBe('none')
            const activeSvg = getItem(1)!.querySelector('svg') as SVGElement
            expect(activeSvg.getAttribute('class')).toMatch(/text-primary/)
        })

        it('should render activeIcon for active items when provided', async () => {
            render(Rating, { value: 1, icon: 'lucide:star', activeIcon: 'lucide:heart' })
            await vi.waitFor(() => {
                expect(getItem(1)!.querySelector('svg path')).not.toBeNull()
                expect(getItem(2)!.querySelector('svg path')).not.toBeNull()
            })
            const activePath = getItem(1)!.querySelector('svg path') as SVGPathElement
            const inactivePath = getItem(2)!.querySelector('svg path') as SVGPathElement
            expect(activePath.getAttribute('d')).not.toBe(inactivePath.getAttribute('d'))
        })

        it('should mute inactive icons', () => {
            render(Rating, { value: 0 })
            const icon = getItem(1)!.querySelector('svg') as SVGElement
            expect(icon.getAttribute('class')).toMatch(/text-outline-variant/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        const sizeClasses = [
            ['xs', 'size-4'],
            ['sm', 'size-5'],
            ['md', 'size-6'],
            ['lg', 'size-7'],
            ['xl', 'size-8']
        ] as const

        for (const [size, cls] of sizeClasses) {
            it(`should apply ${cls} icons for size="${size}"`, () => {
                render(Rating, { size, value: 1 })
                const icon = getItem(1)!.querySelector('svg') as SVGElement
                expect(icon.getAttribute('class')).toContain(cls)
            })
        }
    })

    // ==================== CUSTOM ICON ====================

    describe('custom icon', () => {
        it('should render a custom icon', async () => {
            render(Rating, { icon: 'lucide:heart' })
            await vi.waitFor(() => {
                expect(getItem(1)!.querySelector('svg')).not.toBeNull()
            })
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root element', () => {
            render(Rating, { class: 'my-custom-class' })
            expect(getRoot()!.className).toContain('my-custom-class')
        })

        it('should apply ui slot override to root', () => {
            render(Rating, { ui: { root: 'my-root-class' } })
            expect(getRoot()!.className).toContain('my-root-class')
        })

        it('should apply ui slot override to items', () => {
            render(Rating, { ui: { item: 'my-item-class' } })
            for (const item of getItems()) {
                expect(item.className).toContain('my-item-class')
            }
        })

        it('should apply ui slot override to active icons', () => {
            render(Rating, { value: 1, ui: { iconActive: 'my-active-class' } })
            const icon = getItem(1)!.querySelector('svg') as SVGElement
            expect(icon.getAttribute('class')).toContain('my-active-class')
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should expose slider value semantics', () => {
            render(Rating, { value: 3 })
            const root = getRoot()!
            expect(root.getAttribute('aria-valuemin')).toBe('0')
            expect(root.getAttribute('aria-valuemax')).toBe('5')
            expect(root.getAttribute('aria-valuenow')).toBe('3')
            expect(root.getAttribute('aria-valuetext')).toBe('3 out of 5')
        })

        it('should support custom aria-valuetext function', () => {
            render(Rating, {
                value: 4,
                'aria-valuetext': (value: number, max: number) => `${value} sao trên ${max}`
            })
            expect(getRoot()!.getAttribute('aria-valuetext')).toBe('4 sao trên 5')
        })

        it('should be focusable', () => {
            render(Rating)
            expect(getRoot()!.getAttribute('tabindex')).toBe('0')
        })
    })
})
