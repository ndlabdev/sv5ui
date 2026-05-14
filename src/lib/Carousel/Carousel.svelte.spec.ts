import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { createRawSnippet, type Snippet } from 'svelte'
import { render } from 'vitest-browser-svelte'
import Carousel from './Carousel.svelte'
import type {
    CarouselSlideSlotProps,
    CarouselDotSlotProps,
    CarouselArrowSlotProps
} from './carousel.types.js'

const items = [
    { id: 1, label: 'One' },
    { id: 2, label: 'Two' },
    { id: 3, label: 'Three' },
    { id: 4, label: 'Four' }
]

// Embla needs a measurable width to compute scroll snaps. Force one via ui.
const sizedUi = { viewport: 'w-[640px]', slide: 'h-32' }

const getRoot = () => document.querySelector('[data-orientation]') as HTMLElement | null
const getSlides = () => Array.from(document.querySelectorAll('[data-index]')) as HTMLElement[]
const getPrevButton = () =>
    document.querySelector('button[aria-label="Previous slide"]') as HTMLButtonElement | null
const getNextButton = () =>
    document.querySelector('button[aria-label="Next slide"]') as HTMLButtonElement | null
const getDots = () =>
    Array.from(
        document.querySelectorAll('button[aria-label^="Go to slide"]')
    ) as HTMLButtonElement[]

const labelSnippet = createRawSnippet<[CarouselSlideSlotProps<{ label: string }>]>((get) => ({
    render: () => `<span data-test="slide-label">${get().item.label}</span>`
})) as unknown as Snippet<[CarouselSlideSlotProps<unknown>]>

const customPrev = createRawSnippet<[CarouselArrowSlotProps]>(() => ({
    render: () => '<button type="button" data-test="custom-prev">prev</button>'
}))

const customNext = createRawSnippet<[CarouselArrowSlotProps]>(() => ({
    render: () => '<button type="button" data-test="custom-next">next</button>'
}))

const customDot = createRawSnippet<[CarouselDotSlotProps]>((get) => ({
    render: () => `<button type="button" data-test="custom-dot" data-i="${get().index}">·</button>`
}))

describe('Carousel', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(Carousel, { items, ui: sizedUi })
            expect(container).not.toBeNull()
        })

        it('should render one slide element per item', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => {
                expect(getSlides().length).toBe(items.length)
            })
        })

        it('should render with horizontal orientation by default', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => {
                expect(getRoot()?.getAttribute('data-orientation')).toBe('horizontal')
            })
        })

        it('should render with vertical orientation', async () => {
            render(Carousel, {
                items,
                orientation: 'vertical',
                ui: { viewport: 'h-[400px] w-32', slide: 'w-32' }
            })
            await vi.waitFor(() => {
                expect(getRoot()?.getAttribute('data-orientation')).toBe('vertical')
            })
        })

        it('should call slide snippet for each item', async () => {
            const { container } = render(Carousel, {
                items,
                ui: sizedUi,
                slide: labelSnippet
            })
            await vi.waitFor(() => {
                expect(container.querySelectorAll('[data-test="slide-label"]').length).toBe(
                    items.length
                )
                expect(container.textContent).toContain('One')
                expect(container.textContent).toContain('Two')
            })
        })
    })

    // ==================== ARROWS ====================

    describe('arrows', () => {
        it('should render prev and next buttons by default', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => {
                expect(getPrevButton()).not.toBeNull()
                expect(getNextButton()).not.toBeNull()
            })
        })

        it('should hide arrows when arrows=false', async () => {
            render(Carousel, { items, arrows: false, ui: sizedUi })
            await vi.waitFor(() => {
                expect(getSlides().length).toBe(items.length)
            })
            expect(getPrevButton()).toBeNull()
            expect(getNextButton()).toBeNull()
        })

        it('should disable prev button on first slide when loop=false', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => {
                const prev = getPrevButton()
                expect(prev?.disabled).toBe(true)
            })
        })

        it('should advance slide on next click', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => expect(getDots().length).toBe(items.length))
            const initial = document.querySelector('button[aria-current="true"]') as HTMLElement
            expect(initial?.getAttribute('aria-label')).toBe('Go to slide 1')
            await page.getByRole('button', { name: 'Next slide' }).click()
            await vi.waitFor(() => {
                const after = document.querySelector(
                    'button[aria-current="true"]'
                ) as HTMLElement | null
                expect(after?.getAttribute('aria-label')).toBe('Go to slide 2')
            })
        })

        it('should enable prev button after advancing', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => expect(getDots().length).toBe(items.length))
            await page.getByRole('button', { name: 'Next slide' }).click()
            await vi.waitFor(() => {
                expect(getPrevButton()?.disabled).toBe(false)
            })
        })
    })

    // ==================== DOTS ====================

    describe('dots', () => {
        it('should render one dot per slide by default', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => {
                expect(getDots().length).toBe(items.length)
            })
        })

        it('should hide dots when dots=false', async () => {
            render(Carousel, { items, dots: false, ui: sizedUi })
            await vi.waitFor(() => expect(getSlides().length).toBe(items.length))
            expect(getDots().length).toBe(0)
        })

        it('should mark first dot as selected initially', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => {
                const dots = getDots()
                expect(dots.length).toBe(items.length)
                expect(dots[0]?.getAttribute('aria-current')).toBe('true')
                expect(dots[1]?.getAttribute('aria-current')).toBeNull()
            })
        })

        it('should jump to slide when dot is clicked', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => expect(getDots().length).toBe(items.length))
            await page.getByRole('button', { name: 'Go to slide 3' }).click()
            await vi.waitFor(() => {
                const selected = document.querySelector('button[aria-current="true"]')
                expect(selected?.getAttribute('aria-label')).toBe('Go to slide 3')
            })
        })
    })

    // ==================== LOOP ====================

    describe('loop', () => {
        it('should NOT disable prev on first slide when loop=true', async () => {
            render(Carousel, { items, loop: true, ui: sizedUi })
            await vi.waitFor(() => {
                expect(getPrevButton()?.disabled).toBe(false)
            })
        })
    })

    // ==================== SLIDES TO SHOW ====================

    describe('slidesToShow', () => {
        it('should set --sv-slides CSS variable from slidesToShow', async () => {
            render(Carousel, { items, slidesToShow: 2, ui: sizedUi })
            await vi.waitFor(() => {
                expect(getRoot()?.style.getPropertyValue('--sv-slides')).toBe('2')
            })
        })

        it('should default --sv-slides to 1', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => {
                expect(getRoot()?.style.getPropertyValue('--sv-slides')).toBe('1')
            })
        })

        it('should inline a flex-basis derived from slidesToShow', async () => {
            render(Carousel, { items, slidesToShow: 4, ui: sizedUi })
            await vi.waitFor(() => {
                const slide = getSlides()[0]
                const style = slide?.getAttribute('style') ?? ''
                expect(style).toMatch(/calc\((100% ?\/ ?4|25%)\)/)
            })
        })

        it('should skip inline flex-basis when ui.slide overrides basis', async () => {
            render(Carousel, {
                items,
                slidesToShow: 1,
                ui: { ...sizedUi, slide: 'basis-1/2 lg:basis-1/3' }
            })
            await vi.waitFor(() => {
                expect(getSlides().length).toBe(items.length)
            })
            const slide = getSlides()[0]
            expect(slide?.getAttribute('style') ?? '').not.toContain('flex:')
        })
    })

    // ==================== INDEX BINDING ====================

    describe('index binding', () => {
        it('should fire onIndexChange when slide changes', async () => {
            const onIndexChange = vi.fn()
            render(Carousel, { items, onIndexChange, ui: sizedUi })
            await vi.waitFor(() => expect(getDots().length).toBe(items.length))
            await page.getByRole('button', { name: 'Next slide' }).click()
            await vi.waitFor(() => {
                expect(onIndexChange).toHaveBeenCalledWith(1)
            })
        })
    })

    // ==================== CUSTOM SNIPPETS ====================

    describe('custom snippets', () => {
        it('should render custom prev/next snippets in place of default arrows', async () => {
            const { container } = render(Carousel, {
                items,
                ui: sizedUi,
                prevSlot: customPrev,
                nextSlot: customNext
            })
            await vi.waitFor(() => {
                expect(container.querySelector('[data-test="custom-prev"]')).not.toBeNull()
                expect(container.querySelector('[data-test="custom-next"]')).not.toBeNull()
            })
            expect(document.querySelector('button[aria-label="Previous slide"]')).toBeNull()
        })

        it('should render custom dot snippet in place of default dots', async () => {
            const { container } = render(Carousel, {
                items,
                ui: sizedUi,
                dot: customDot
            })
            await vi.waitFor(() => {
                expect(container.querySelectorAll('[data-test="custom-dot"]').length).toBe(
                    items.length
                )
            })
            expect(document.querySelectorAll('button[aria-label^="Go to slide"]').length).toBe(0)
        })
    })

    // ==================== STYLING ====================

    describe('styling', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(Carousel, {
                items,
                class: 'my-carousel',
                ui: sizedUi
            })
            await vi.waitFor(() => {
                const root = container.querySelector('.my-carousel')
                expect(root).not.toBeNull()
            })
        })

        it('should apply ui slot overrides', async () => {
            render(Carousel, {
                items,
                ui: { ...sizedUi, slide: 'custom-slide', root: 'custom-root' }
            })
            await vi.waitFor(() => {
                const slide = getSlides()[0]
                expect(slide?.className).toContain('custom-slide')
            })
            expect(document.querySelector('.custom-root')).not.toBeNull()
        })

        it('should apply size variant to dots', async () => {
            render(Carousel, { items, size: 'xl', ui: sizedUi })
            await vi.waitFor(() => {
                expect(getDots().length).toBe(items.length)
                const dot = getDots()[0]
                expect(dot?.className).toMatch(/size-3\.5/)
            })
        })

        it('should apply color variant to selected dot', async () => {
            render(Carousel, { items, color: 'success', ui: sizedUi })
            await vi.waitFor(() => {
                const selected = document.querySelector(
                    'button[aria-current="true"]'
                ) as HTMLElement
                expect(selected?.className).toMatch(/bg-success/)
            })
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should expose role=tablist on dots container', async () => {
            const { container } = render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => {
                expect(container.querySelector('[role="tablist"]')).not.toBeNull()
            })
        })

        it('should label arrows for assistive tech', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => {
                expect(getPrevButton()?.getAttribute('aria-label')).toBe('Previous slide')
                expect(getNextButton()?.getAttribute('aria-label')).toBe('Next slide')
            })
        })

        it('should label dots for assistive tech', async () => {
            render(Carousel, { items, ui: sizedUi })
            await vi.waitFor(() => {
                const dots = getDots()
                expect(dots.length).toBe(items.length)
                expect(dots[0]?.getAttribute('aria-label')).toBe('Go to slide 1')
                expect(dots[items.length - 1]?.getAttribute('aria-label')).toBe(
                    `Go to slide ${items.length}`
                )
            })
        })
    })
})
