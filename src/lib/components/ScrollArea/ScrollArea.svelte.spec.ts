import '../../../routes/layout.css'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import ScrollArea from './ScrollArea.svelte'

function snippet(html: string) {
    return createRawSnippet(() => ({
        render: () => html,
        setup: () => {}
    }))
}

const tallContent = snippet('<div style="height: 800px">tall</div>')
const wideContent = snippet('<div style="width: 1200px; height: 40px">wide</div>')
const shortContent = snippet('<div style="height: 20px">short</div>')

const getRoot = (container: Element) => container.firstElementChild as HTMLElement
const getViewport = (container: Element) =>
    container.querySelector<HTMLElement>('[data-scroll-area-viewport]')!
const getScrollbars = (container: Element) =>
    Array.from(container.querySelectorAll<HTMLElement>('[data-scroll-area-scrollbar]'))
const getScrollbar = (container: Element, orientation: 'vertical' | 'horizontal') =>
    container.querySelector<HTMLElement>(
        `[data-scroll-area-scrollbar][data-orientation="${orientation}"]`
    )

const nextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

const getThumb = (container: Element) =>
    container.querySelector<HTMLElement>('[data-scroll-area-thumb]')

describe('ScrollArea', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render root, viewport and content', () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                children: tallContent
            })

            expect(getRoot(container).hasAttribute('data-scroll-area-root')).toBe(true)
            expect(getViewport(container)).not.toBeNull()
            expect(container.querySelector('[data-scroll-area-content]')).not.toBeNull()
        })

        it('should render children inside the viewport', () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                children: tallContent
            })

            expect(getViewport(container).textContent).toContain('tall')
        })

        it('should apply class to the root element', () => {
            const { container } = render(ScrollArea, {
                class: 'h-40 border',
                children: tallContent
            })

            expect(getRoot(container).className).toContain('border')
        })

        it('should make the viewport the scrolling element', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                children: tallContent
            })
            await nextFrame()

            const viewport = getViewport(container)
            expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should render only the vertical scrollbar by default', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                children: tallContent
            })
            await nextFrame()

            expect(getScrollbars(container)).toHaveLength(1)
            expect(getScrollbar(container, 'vertical')).not.toBeNull()
        })

        it('should render only the horizontal scrollbar', async () => {
            const { container } = render(ScrollArea, {
                class: 'w-40',
                orientation: 'horizontal',
                type: 'always',
                children: wideContent
            })
            await nextFrame()

            expect(getScrollbars(container)).toHaveLength(1)
            expect(getScrollbar(container, 'horizontal')).not.toBeNull()
        })

        it('should render both scrollbars and the corner', async () => {
            const { container } = render(ScrollArea, {
                class: 'size-40',
                orientation: 'both',
                type: 'always',
                children: wideContent
            })
            await nextFrame()

            expect(getScrollbars(container)).toHaveLength(2)
            expect(container.querySelector('[data-scroll-area-corner]')).not.toBeNull()
        })

        it('should clip the axis that has no scrollbar', async () => {
            const { container } = render(ScrollArea, {
                class: 'size-40',
                children: wideContent
            })
            await nextFrame()

            expect(getComputedStyle(getViewport(container)).overflowX).toBe('hidden')
        })
    })

    // ==================== THUMB ====================

    describe('thumb', () => {
        it('should size the thumb from the viewport/content ratio', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                children: tallContent
            })
            await nextFrame()

            const thumb = container.querySelector<HTMLElement>('[data-scroll-area-thumb]')!
            const scrollbar = getScrollbar(container, 'vertical')!

            expect(thumb.offsetHeight).toBeGreaterThan(0)
            expect(thumb.offsetHeight).toBeLessThan(scrollbar.offsetHeight)
        })

        it('should hide the thumb when the content does not overflow', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                children: shortContent
            })
            await nextFrame()

            const thumb = container.querySelector<HTMLElement>('[data-scroll-area-thumb]')
            expect(thumb?.getAttribute('data-state') ?? 'hidden').toBe('hidden')
        })

        it('should move the thumb when the viewport scrolls', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                children: tallContent
            })
            await nextFrame()

            const thumb = getThumb(container)!
            const before = thumb.style.transform

            getViewport(container).scrollTop = 200

            await vi.waitFor(() => {
                expect(thumb.style.transform).not.toBe(before)
            })
        })
    })

    // ==================== VISIBILITY TYPES ====================

    describe('type', () => {
        it('should not render a scrollbar on hover type until hovered', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                children: tallContent
            })
            await nextFrame()

            expect(getScrollbars(container)).toHaveLength(0)
        })

        it('should render the scrollbar on auto type when content overflows', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'auto',
                children: tallContent
            })

            await vi.waitFor(() => {
                expect(getScrollbars(container)).toHaveLength(1)
            })
        })

        it('should not render the scrollbar on auto type without overflow', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'auto',
                children: shortContent
            })
            await nextFrame()

            expect(getScrollbars(container)).toHaveLength(0)
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should default to the surface thumb color', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                children: tallContent
            })
            await nextFrame()

            const thumb = container.querySelector<HTMLElement>('[data-scroll-area-thumb]')!
            expect(thumb.className).toContain('bg-outline-variant')
        })

        it('should apply the primary thumb color', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                color: 'primary',
                children: tallContent
            })
            await nextFrame()

            const thumb = container.querySelector<HTMLElement>('[data-scroll-area-thumb]')!
            expect(thumb.className).toContain('bg-primary/40')
        })

        it('should apply the size variant to the scrollbar', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                size: 'lg',
                children: tallContent
            })
            await nextFrame()

            expect(getScrollbar(container, 'vertical')!.offsetWidth).toBe(12)
        })

        it('should tint the track when track is enabled', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                track: true,
                children: tallContent
            })
            await nextFrame()

            expect(getScrollbar(container, 'vertical')!.className).toContain(
                'bg-surface-container-highest/40'
            )
        })

        it('should drop the fade animation when transition is false', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                transition: false,
                children: tallContent
            })
            await nextFrame()

            expect(getScrollbar(container, 'vertical')!.className).not.toContain('fade-in')
        })
    })

    // ==================== UI OVERRIDES ====================

    describe('ui overrides', () => {
        it('should apply ui.viewport', () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                ui: { viewport: 'p-4' },
                children: tallContent
            })

            expect(getViewport(container).className).toContain('p-4')
        })

        it('should apply ui.content to the inner wrapper', () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                ui: { content: 'flex flex-col gap-2' },
                children: tallContent
            })

            const content = container.querySelector('[data-scroll-area-content]')!
            expect((content.firstElementChild as HTMLElement).className).toContain('gap-2')
        })

        it('should apply ui.thumb', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                ui: { thumb: 'bg-error' },
                children: tallContent
            })
            await nextFrame()

            const thumb = container.querySelector<HTMLElement>('[data-scroll-area-thumb]')!
            expect(thumb.className).toContain('bg-error')
        })
    })

    // ==================== REFS ====================

    describe('refs', () => {
        it('should expose the viewport element through viewportRef', async () => {
            let viewportRef: HTMLDivElement | null = null

            const { container } = render(ScrollArea, {
                class: 'h-40',
                children: tallContent,
                get viewportRef() {
                    return viewportRef
                },
                set viewportRef(v: HTMLDivElement | null) {
                    viewportRef = v
                }
            })
            await nextFrame()

            expect(viewportRef).toBe(getViewport(container))
        })
    })

    // ==================== LAYOUT GUARANTEES ====================

    describe('layout guarantees', () => {
        it('sticky thead keeps sticking inside the viewport', async () => {
            const rows = Array.from(
                { length: 40 },
                (_, i) => `<tr><td style="height:24px">row ${i}</td></tr>`
            ).join('')

            const { container } = render(ScrollArea, {
                class: 'h-40 w-64',
                type: 'always',
                children: snippet(
                    `<table style="min-width:100%">
                        <thead><tr><th id="head" style="position:sticky;top:0;background:#fff">head</th></tr></thead>
                        <tbody>${rows}</tbody>
                    </table>`
                )
            })
            await nextFrame()

            const viewport = getViewport(container)
            const head = container.querySelector<HTMLElement>('#head')!

            viewport.scrollTop = 300
            await vi.waitFor(() => {
                expect(viewport.scrollTop).toBe(300)
            })
            await nextFrame()

            expect(head.getBoundingClientRect().top).toBeCloseTo(
                viewport.getBoundingClientRect().top,
                0
            )
        })

        it('min-w-full content still fills the viewport when narrow', async () => {
            const { container } = render(ScrollArea, {
                class: 'w-64',
                orientation: 'horizontal',
                type: 'always',
                children: snippet(
                    '<table id="t" style="min-width:100%"><tbody><tr><td>x</td></tr></tbody></table>'
                )
            })
            await nextFrame()

            const viewport = getViewport(container)
            const table = container.querySelector<HTMLElement>('#t')!

            expect(table.offsetWidth).toBe(viewport.clientWidth)
        })

        it('wide content overflows horizontally instead of shrinking', async () => {
            const { container } = render(ScrollArea, {
                class: 'w-64',
                orientation: 'horizontal',
                type: 'always',
                children: snippet(
                    `<table id="t" style="min-width:100%"><tbody><tr>
                        ${Array.from({ length: 8 }, (_, i) => `<td style="white-space:nowrap">column ${i} value</td>`).join('')}
                    </tr></tbody></table>`
                )
            })
            await nextFrame()

            const viewport = getViewport(container)
            const table = container.querySelector<HTMLElement>('#t')!

            expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth + 100)
            expect(table.offsetWidth).toBe(viewport.scrollWidth)
        })

        it('centered flex row stays centered when it does not overflow', async () => {
            const { container } = render(ScrollArea, {
                class: 'w-64',
                orientation: 'horizontal',
                type: 'always',
                children: snippet(
                    `<div id="row" style="display:flex;justify-content:center;gap:8px">
                        <span style="width:20px">a</span><span style="width:20px">b</span>
                    </div>`
                )
            })
            await nextFrame()

            const viewport = getViewport(container)
            const row = container.querySelector<HTMLElement>('#row')!
            const first = row.firstElementChild as HTMLElement

            expect(row.offsetWidth).toBe(viewport.clientWidth)
            expect(first.getBoundingClientRect().left).toBeGreaterThan(
                viewport.getBoundingClientRect().left + 40
            )
        })

        it('fills the remaining space as a flex-1 child with min-h-0', async () => {
            const { container } = render(ScrollArea, {
                class: 'min-h-0 flex-1',
                type: 'always',
                children: snippet('<div style="height:800px">tall</div>')
            })

            const root = container.firstElementChild as HTMLElement
            const host = document.createElement('div')
            host.style.cssText = 'display:flex;flex-direction:column;height:200px'
            root.parentElement!.appendChild(host)
            host.appendChild(root)
            await nextFrame()

            expect(root.offsetHeight).toBe(200)
            expect(getViewport(container).clientHeight).toBe(200)
            expect(getViewport(container).scrollHeight).toBeGreaterThan(700)
        })

        it('respects a max-height on the root without a fixed height', async () => {
            const { container } = render(ScrollArea, {
                class: 'max-h-40',
                type: 'always',
                children: snippet('<div style="height:800px">tall</div>')
            })
            await nextFrame()

            const root = container.firstElementChild as HTMLElement
            const viewport = getViewport(container)

            expect(root.offsetHeight).toBe(160)
            expect(viewport.clientHeight).toBe(160)
            expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
        })

        it('should fill a height-capped ancestor so the viewport scrolls', async () => {
            const { container } = render(ScrollArea, {
                class: 'min-h-0 flex-1',
                type: 'always',
                children: snippet('<div style="height:800px">tall</div>')
            })

            const root = container.firstElementChild as HTMLElement
            const host = document.createElement('div')
            host.style.cssText = 'display:flex;flex-direction:column;max-height:240px'
            root.parentElement!.appendChild(host)
            host.appendChild(root)
            await nextFrame()

            const viewport = getViewport(container)
            expect(root.offsetHeight).toBe(240)
            expect(viewport.clientHeight).toBe(240)
            expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should forward aria attributes to the root', () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                'aria-label': 'Log output',
                children: tallContent
            })

            expect(getRoot(container).getAttribute('aria-label')).toBe('Log output')
        })

        it('should keep scrollbars out of the accessibility tree', async () => {
            const { container } = render(ScrollArea, {
                class: 'h-40',
                type: 'always',
                children: tallContent
            })
            await nextFrame()

            const scrollbar = getScrollbar(container, 'vertical')!
            expect(scrollbar.getAttribute('role')).not.toBe('scrollbar')
        })
    })
})
