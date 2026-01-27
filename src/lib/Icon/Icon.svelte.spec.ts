import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Icon from './Icon.svelte'

/** Helper: wait for SVG to render (iconify loads async) then return a locator */
async function getSvg(container: HTMLElement) {
    await expect.poll(() => container.querySelector('svg'), { timeout: 5000 }).toBeTruthy()
    return page.elementLocator(container.querySelector('svg')!)
}

describe('Icon', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render an SVG element', async () => {
            const { container } = render(Icon, { name: 'lucide:home' })
            const svg = await getSvg(container)
            await expect.element(svg).toBeInTheDocument()
        })

        it('should always include shrink-0 class', async () => {
            const { container } = render(Icon, { name: 'lucide:home' })
            const svg = await getSvg(container)
            await expect.element(svg).toHaveClass(/shrink-0/)
        })
    })

    // ==================== SIZE ====================

    describe('size', () => {
        it('should default to size 24', async () => {
            const { container } = render(Icon, { name: 'lucide:home' })
            const svg = await getSvg(container)
            await expect.element(svg).toHaveAttribute('width', '24')
            await expect.element(svg).toHaveAttribute('height', '24')
        })

        it('should apply custom numeric size', async () => {
            const { container } = render(Icon, { name: 'lucide:home', size: 32 })
            const svg = await getSvg(container)
            await expect.element(svg).toHaveAttribute('width', '32')
            await expect.element(svg).toHaveAttribute('height', '32')
        })

        it('should apply small size', async () => {
            const { container } = render(Icon, { name: 'lucide:home', size: 16 })
            const svg = await getSvg(container)
            await expect.element(svg).toHaveAttribute('width', '16')
            await expect.element(svg).toHaveAttribute('height', '16')
        })

        it('should apply string size', async () => {
            const { container } = render(Icon, { name: 'lucide:home', size: '2rem' })
            const svg = await getSvg(container)
            await expect.element(svg).toHaveAttribute('width', '2rem')
            await expect.element(svg).toHaveAttribute('height', '2rem')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class alongside shrink-0', async () => {
            const { container } = render(Icon, { name: 'lucide:home', class: 'my-icon' })
            const svg = await getSvg(container)
            await expect.element(svg).toHaveClass(/shrink-0/)
            await expect.element(svg).toHaveClass(/my-icon/)
        })

        it('should handle undefined class gracefully', async () => {
            const { container } = render(Icon, { name: 'lucide:home' })
            const svg = await getSvg(container)
            await expect.element(svg).toHaveClass(/shrink-0/)
        })
    })

    // ==================== FLIP ====================
    // Iconify applies flip via <g transform="scale(...)"> inside the SVG

    describe('flip', () => {
        it('should not apply scale transform by default', async () => {
            const { container } = render(Icon, { name: 'lucide:home' })
            await getSvg(container)
            const svgHtml = container.querySelector('svg')!.innerHTML
            expect(svgHtml).not.toContain('scale(')
        })

        it('should flip horizontally with scale(-1 1)', async () => {
            const { container } = render(Icon, { name: 'lucide:home', flipH: true })
            await getSvg(container)
            const svgHtml = container.querySelector('svg')!.innerHTML
            expect(svgHtml).toContain('scale(-1 1)')
        })

        it('should flip vertically with scale(1 -1)', async () => {
            const { container } = render(Icon, { name: 'lucide:home', flipV: true })
            await getSvg(container)
            const svgHtml = container.querySelector('svg')!.innerHTML
            expect(svgHtml).toContain('scale(1 -1)')
        })

        it('should flip both directions (optimized as rotate 180)', async () => {
            const { container } = render(Icon, { name: 'lucide:home', flipH: true, flipV: true })
            await getSvg(container)
            const svgHtml = container.querySelector('svg')!.innerHTML
            // Iconify optimizes flipH + flipV into a single rotate(180)
            expect(svgHtml).toMatch(/rotate\(180\b/)
        })
    })

    // ==================== ROTATE ====================
    // Iconify applies rotate via <g transform="rotate(...)"> inside the SVG

    describe('rotate', () => {
        it('should not apply rotate transform by default', async () => {
            const { container } = render(Icon, { name: 'lucide:home' })
            await getSvg(container)
            const svgHtml = container.querySelector('svg')!.innerHTML
            expect(svgHtml).not.toMatch(/rotate\(/)
        })

        it('should rotate 90 degrees', async () => {
            const { container } = render(Icon, { name: 'lucide:home', rotate: 90 })
            await getSvg(container)
            const svgHtml = container.querySelector('svg')!.innerHTML
            expect(svgHtml).toMatch(/rotate\(90\b/)
        })

        it('should rotate 180 degrees', async () => {
            const { container } = render(Icon, { name: 'lucide:home', rotate: 180 })
            await getSvg(container)
            const svgHtml = container.querySelector('svg')!.innerHTML
            expect(svgHtml).toMatch(/rotate\(180\b/)
        })

        it('should rotate 270 degrees', async () => {
            const { container } = render(Icon, { name: 'lucide:home', rotate: 270 })
            await getSvg(container)
            const svgHtml = container.querySelector('svg')!.innerHTML
            expect(svgHtml).toMatch(/rotate\(-90\b/)
        })
    })

    // ==================== DIFFERENT ICONS ====================

    describe('different icons', () => {
        it('should render lucide icon', async () => {
            const { container } = render(Icon, { name: 'lucide:star' })
            const svg = await getSvg(container)
            await expect.element(svg).toBeInTheDocument()
        })

        it('should render mdi icon', async () => {
            const { container } = render(Icon, { name: 'mdi:account' })
            const svg = await getSvg(container)
            await expect.element(svg).toBeInTheDocument()
        })
    })
})
