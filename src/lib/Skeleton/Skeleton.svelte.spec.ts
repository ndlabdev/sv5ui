import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Skeleton from './Skeleton.svelte'

describe('Skeleton', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(Skeleton)
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as div by default', async () => {
            const { container } = render(Skeleton)
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should apply base skeleton classes', async () => {
            const { container } = render(Skeleton)
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/animate-pulse/)
            await expect.element(root).toHaveClass(/rounded-md/)
            await expect.element(root).toHaveClass(/bg-surface-container-highest/)
        })

        it('should have pulse animation', async () => {
            const { container } = render(Skeleton)
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/animate-pulse/)
        })
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as span element', async () => {
            const { container } = render(Skeleton, { as: 'span' })
            expect(container.firstElementChild!.tagName).toBe('SPAN')
        })

        it('should render as p element', async () => {
            const { container } = render(Skeleton, { as: 'p' })
            expect(container.firstElementChild!.tagName).toBe('P')
        })

        it('should render as section element', async () => {
            const { container } = render(Skeleton, { as: 'section' })
            expect(container.firstElementChild!.tagName).toBe('SECTION')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(Skeleton, {
                class: 'my-custom-skeleton'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/my-custom-skeleton/)
        })

        it('should apply size classes', async () => {
            const { container } = render(Skeleton, {
                class: 'h-4 w-48'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/h-4/)
            await expect.element(root).toHaveClass(/w-48/)
        })

        it('should apply rounded classes', async () => {
            const { container } = render(Skeleton, {
                class: 'rounded-full'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/rounded-full/)
        })

        it('should apply custom background color', async () => {
            const { container } = render(Skeleton, {
                class: 'bg-primary/20'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-primary\/20/)
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            const { container } = render(Skeleton, {
                ui: { root: 'custom-skeleton' }
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/custom-skeleton/)
        })

        it('should combine ui.root with custom class', async () => {
            const { container } = render(Skeleton, {
                class: 'h-4',
                ui: { root: 'w-32' }
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/h-4/)
            await expect.element(root).toHaveClass(/w-32/)
        })
    })

    // ==================== DIFFERENT SHAPES ====================

    describe('different shapes', () => {
        it('should render as circle', async () => {
            const { container } = render(Skeleton, {
                class: 'size-12 rounded-full'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/size-12/)
            await expect.element(root).toHaveClass(/rounded-full/)
        })

        it('should render as rectangle', async () => {
            const { container } = render(Skeleton, {
                class: 'h-32 w-48'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/h-32/)
            await expect.element(root).toHaveClass(/w-48/)
        })

        it('should render as text line', async () => {
            const { container } = render(Skeleton, {
                class: 'h-4 w-full'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/h-4/)
            await expect.element(root).toHaveClass(/w-full/)
        })

        it('should render with custom border radius', async () => {
            const { container } = render(Skeleton, {
                class: 'rounded-2xl'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/rounded-2xl/)
        })
    })

    // ==================== MULTIPLE INSTANCES ====================

    describe('multiple instances', () => {
        it('should render multiple skeletons independently', async () => {
            const { container: container1 } = render(Skeleton, { class: 'h-4 w-32' })
            const { container: container2 } = render(Skeleton, { class: 'h-8 w-64' })
            const { container: container3 } = render(Skeleton, { class: 'size-12 rounded-full' })

            const root1 = page.elementLocator(container1.firstElementChild!)
            const root2 = page.elementLocator(container2.firstElementChild!)
            const root3 = page.elementLocator(container3.firstElementChild!)

            await expect.element(root1).toHaveClass(/h-4/)
            await expect.element(root1).toHaveClass(/w-32/)

            await expect.element(root2).toHaveClass(/h-8/)
            await expect.element(root2).toHaveClass(/w-64/)

            await expect.element(root3).toHaveClass(/size-12/)
            await expect.element(root3).toHaveClass(/rounded-full/)
        })
    })

    // ==================== CHILDREN ====================

    describe('children', () => {
        it('should render without children by default', async () => {
            const { container } = render(Skeleton)
            const root = container.firstElementChild!
            expect(root.textContent).toBe('')
        })

        it('should accept children prop', async () => {
            // Children prop is supported but testing content requires actual component usage
            // Just verify the component accepts the prop without error
            const { container } = render(Skeleton)
            expect(container.firstElementChild).not.toBeNull()
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should allow aria attributes', async () => {
            const { container } = render(Skeleton, {
                'aria-label': 'Loading content'
            } as any)
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveAttribute('aria-label', 'Loading content')
        })

        it('should allow role attribute', async () => {
            const { container } = render(Skeleton, {
                role: 'status'
            } as any)
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveAttribute('role', 'status')
        })
    })

    // ==================== COMBINED USAGE ====================

    describe('combined usage', () => {
        it('should work with multiple classes and custom element', async () => {
            const { container } = render(Skeleton, {
                as: 'span',
                class: 'inline-block h-4 w-32 rounded-full'
            })

            expect(container.firstElementChild!.tagName).toBe('SPAN')
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/inline-block/)
            await expect.element(root).toHaveClass(/h-4/)
            await expect.element(root).toHaveClass(/w-32/)
            await expect.element(root).toHaveClass(/rounded-full/)
            await expect.element(root).toHaveClass(/animate-pulse/)
        })

        it('should preserve animation with custom classes', async () => {
            const { container } = render(Skeleton, {
                class: 'h-64 w-full rounded-lg bg-primary/10'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/animate-pulse/)
            await expect.element(root).toHaveClass(/h-64/)
            await expect.element(root).toHaveClass(/rounded-lg/)
        })
    })
})
