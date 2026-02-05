import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import AvatarGroup from './AvatarGroup.svelte'

const avatars = [
    { src: 'https://i.pravatar.cc/150?img=1', alt: 'User 1' },
    { src: 'https://i.pravatar.cc/150?img=2', alt: 'User 2' },
    { src: 'https://i.pravatar.cc/150?img=3', alt: 'User 3' },
    { src: 'https://i.pravatar.cc/150?img=4', alt: 'User 4' },
    { src: 'https://i.pravatar.cc/150?img=5', alt: 'User 5' }
]

describe('AvatarGroup', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(AvatarGroup, { avatars: avatars.slice(0, 2) })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as div by default', async () => {
            const { container } = render(AvatarGroup, { avatars: avatars.slice(0, 2) })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should apply base root classes', async () => {
            const { container } = render(AvatarGroup, { avatars: avatars.slice(0, 2) })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/inline-flex/)
        })
    })

    // ==================== AVATARS PROP ====================

    describe('avatars prop', () => {
        it('should render all avatars when no max is set', async () => {
            const { container } = render(AvatarGroup, { avatars })
            const rendered = container.querySelectorAll('[data-avatar-root]')
            expect(rendered.length).toBe(5)
        })

        it('should render correct number of avatars', async () => {
            const { container } = render(AvatarGroup, { avatars: avatars.slice(0, 3) })
            const rendered = container.querySelectorAll('[data-avatar-root]')
            expect(rendered.length).toBe(3)
        })

        it('should render nothing when avatars is empty', async () => {
            const { container } = render(AvatarGroup, { avatars: [] })
            const rendered = container.querySelectorAll('[data-avatar-root]')
            expect(rendered.length).toBe(0)
        })
    })

    // ==================== MAX PROP ====================

    describe('max prop', () => {
        it('should limit visible avatars', async () => {
            const { container } = render(AvatarGroup, { avatars, max: 3 })
            // 3 visible + 1 overflow indicator
            const rendered = container.querySelectorAll('[data-avatar-root]')
            expect(rendered.length).toBe(4)
        })

        it('should show overflow indicator with correct count', async () => {
            const { container } = render(AvatarGroup, { avatars, max: 2 })
            const fallbacks = container.querySelectorAll('[data-avatar-fallback]')
            const overflowEl = Array.from(fallbacks).find((el) => el.textContent?.startsWith('+'))
            expect(overflowEl).not.toBeNull()
            expect(overflowEl!.textContent).toBe('+3')
        })

        it('should not show overflow when max >= avatars count', async () => {
            const { container } = render(AvatarGroup, { avatars, max: 5 })
            const fallbacks = container.querySelectorAll('[data-avatar-fallback]')
            const overflowEl = Array.from(fallbacks).find((el) => el.textContent?.startsWith('+'))
            expect(overflowEl).toBeUndefined()
        })

        it('should not show overflow when max >= avatars count (larger)', async () => {
            const { container } = render(AvatarGroup, { avatars, max: 10 })
            const rendered = container.querySelectorAll('[data-avatar-root]')
            expect(rendered.length).toBe(5)
        })

        it('should show all avatars when max is 0', async () => {
            const { container } = render(AvatarGroup, { avatars, max: 0 })
            const rendered = container.querySelectorAll('[data-avatar-root]')
            expect(rendered.length).toBe(5)
        })

        it('should show all avatars when max is negative', async () => {
            const { container } = render(AvatarGroup, { avatars, max: -1 })
            const rendered = container.querySelectorAll('[data-avatar-root]')
            expect(rendered.length).toBe(5)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        const sizeMap = [
            { size: '3xs', ring: 'ring', margin: '-me-0.5' },
            { size: '2xs', ring: 'ring', margin: '-me-0.5' },
            { size: 'xs', ring: 'ring', margin: '-me-0.5' },
            { size: 'sm', ring: 'ring-2', margin: '-me-1.5' },
            { size: 'md', ring: 'ring-2', margin: '-me-1.5' },
            { size: 'lg', ring: 'ring-2', margin: '-me-1.5' },
            { size: 'xl', ring: 'ring-3', margin: '-me-2' },
            { size: '2xl', ring: 'ring-3', margin: '-me-2' },
            { size: '3xl', ring: 'ring-3', margin: '-me-2' }
        ] as const

        for (const { size, ring } of sizeMap) {
            it(`should apply ring "${ring}" for size="${size}"`, async () => {
                const { container } = render(AvatarGroup, {
                    avatars: avatars.slice(0, 2),
                    size
                })
                const avatarRoot = container.querySelectorAll('[data-avatar-root]')[0]
                const root = page.elementLocator(avatarRoot)
                await expect.element(root).toHaveClass(new RegExp(ring))
            })
        }
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as section element', async () => {
            const { container } = render(AvatarGroup, {
                avatars: avatars.slice(0, 2),
                as: 'section'
            })
            expect(container.firstElementChild!.tagName).toBe('SECTION')
        })

        it('should render as span element', async () => {
            const { container } = render(AvatarGroup, {
                avatars: avatars.slice(0, 2),
                as: 'span'
            })
            expect(container.firstElementChild!.tagName).toBe('SPAN')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(AvatarGroup, {
                avatars: avatars.slice(0, 2),
                class: 'my-group'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/my-group/)
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            const { container } = render(AvatarGroup, {
                avatars: avatars.slice(0, 2),
                ui: { root: 'custom-root' }
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/custom-root/)
        })

        it('should apply ui.base class to child avatars', async () => {
            const { container } = render(AvatarGroup, {
                avatars: avatars.slice(0, 2),
                ui: { base: 'custom-base' }
            })
            const avatarRoot = container.querySelectorAll('[data-avatar-root]')[0]
            const root = page.elementLocator(avatarRoot)
            await expect.element(root).toHaveClass(/custom-base/)
        })
    })
})
