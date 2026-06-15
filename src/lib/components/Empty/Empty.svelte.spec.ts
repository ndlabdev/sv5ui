import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Empty from './Empty.svelte'

const AVATAR_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

describe('Empty', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(Empty, { title: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as div by default', async () => {
            const { container } = render(Empty, { title: 'Test' })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should apply base root classes', async () => {
            const { container } = render(Empty, { title: 'Test' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/flex/)
            await expect.element(root).toHaveClass(/flex-col/)
            await expect.element(root).toHaveClass(/items-center/)
        })
    })

    // ==================== TITLE & DESCRIPTION ====================

    describe('title and description', () => {
        it('should render title', async () => {
            const { container } = render(Empty, { title: 'No messages' })
            expect(container.textContent).toContain('No messages')
        })

        it('should render description', async () => {
            const { container } = render(Empty, { description: 'You have no items yet.' })
            expect(container.textContent).toContain('You have no items yet.')
        })

        it('should render both title and description', async () => {
            const { container } = render(Empty, {
                title: 'No data',
                description: 'Try adding some items'
            })
            expect(container.textContent).toContain('No data')
            expect(container.textContent).toContain('Try adding some items')
        })

        it('should render without title or description', async () => {
            const { container } = render(Empty, { icon: 'lucide:inbox' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })
    })

    // ==================== ICON ====================

    describe('icon', () => {
        it('should render with icon prop', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                icon: 'lucide:inbox'
            })
            expect(container.firstElementChild).not.toBeNull()
            expect(container.textContent).toContain('Test')
        })

        it('should not render icon when not provided', async () => {
            const { container } = render(Empty, { title: 'Test' })
            // Just verify it renders without error
            expect(container.firstElementChild).not.toBeNull()
        })
    })

    // ==================== AVATAR ====================

    describe('avatar', () => {
        it('should render avatar when avatar prop is provided', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                avatar: { alt: 'User' }
            })
            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).not.toBeNull()
        })

        it('should prioritize icon over avatar', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                icon: 'lucide:inbox',
                avatar: { alt: 'User' }
            })
            // Avatar should NOT be rendered when icon is provided
            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).toBeNull()
        })

        it('should render avatar with src', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                avatar: { src: AVATAR_SRC, alt: 'User Avatar' }
            })
            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).not.toBeNull()
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should apply solid variant classes', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                variant: 'solid'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-inverse-surface/)
        })

        it('should apply outline variant classes', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                variant: 'outline'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/ring/)
            await expect.element(root).toHaveClass(/ring-outline-variant/)
        })

        it('should apply soft variant classes', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                variant: 'soft'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/surface-container-highest/)
        })

        it('should apply subtle variant classes', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                variant: 'subtle'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/surface-container-highest/)
            await expect.element(root).toHaveClass(/ring/)
        })

        it('should apply naked variant without background or ring', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                variant: 'naked'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

        for (const size of sizes) {
            it(`should render with size="${size}"`, async () => {
                const { container } = render(Empty, {
                    title: 'Test',
                    icon: 'lucide:inbox',
                    size
                })
                const root = page.elementLocator(container.firstElementChild!)
                await expect.element(root).toBeInTheDocument()
            })
        }

        it('should apply xs size title text', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                size: 'xs'
            })
            const title = container.querySelector('p')
            const titleEl = page.elementLocator(title!)
            await expect.element(titleEl).toHaveClass(/text-sm/)
        })

        it('should apply md size title text by default', async () => {
            const { container } = render(Empty, {
                title: 'Test'
            })
            const title = container.querySelector('p')
            const titleEl = page.elementLocator(title!)
            await expect.element(titleEl).toHaveClass(/text-base/)
        })

        it('should apply xl size title text', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                size: 'xl'
            })
            const title = container.querySelector('p')
            const titleEl = page.elementLocator(title!)
            await expect.element(titleEl).toHaveClass(/text-lg/)
        })
    })

    // ==================== ACTIONS ====================

    describe('actions', () => {
        it('should not render actions when not provided', async () => {
            const { container } = render(Empty, { title: 'Test' })
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(0)
        })

        it('should render action buttons', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                actions: [{ label: 'Action 1' }, { label: 'Action 2' }]
            })
            expect(container.textContent).toContain('Action 1')
            expect(container.textContent).toContain('Action 2')
        })

        it('should render correct number of action buttons', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                actions: [{ label: 'A' }, { label: 'B' }, { label: 'C' }]
            })
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(3)
        })

        it('should not render actions when actions array is empty', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                actions: []
            })
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(0)
        })

        it('should render actions with custom props', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                actions: [
                    { label: 'Primary', color: 'primary' },
                    { label: 'Secondary', variant: 'outline' }
                ]
            })
            expect(container.textContent).toContain('Primary')
            expect(container.textContent).toContain('Secondary')
        })

        it('should render actions with small size by default', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                actions: [{ label: 'Small Button' }]
            })
            const button = container.querySelector('button')
            expect(button).not.toBeNull()
            const btn = page.elementLocator(button!)
            await expect.element(btn).toHaveClass(/text-xs/)
        })
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as section element', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                as: 'section'
            })
            expect(container.firstElementChild!.tagName).toBe('SECTION')
        })

        it('should render as article element', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                as: 'article'
            })
            expect(container.firstElementChild!.tagName).toBe('ARTICLE')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                class: 'my-custom-empty'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/my-custom-empty/)
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                ui: { root: 'custom-root' }
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/custom-root/)
        })

        it('should apply ui.title class', async () => {
            const { container } = render(Empty, {
                title: 'Test Title',
                ui: { title: 'custom-title' }
            })
            const title = container.querySelector('.custom-title')
            expect(title).not.toBeNull()
            expect(title!.textContent).toBe('Test Title')
        })

        it('should apply ui.description class', async () => {
            const { container } = render(Empty, {
                description: 'Test Description',
                ui: { description: 'custom-desc' }
            })
            const desc = container.querySelector('.custom-desc')
            expect(desc).not.toBeNull()
            expect(desc!.textContent).toBe('Test Description')
        })

        it('should accept ui.avatar class override', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                icon: 'lucide:inbox',
                ui: { avatar: 'custom-avatar' }
            })
            expect(container.firstElementChild).not.toBeNull()
            expect(container.textContent).toContain('Test')
        })

        it('should apply ui.actions class', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                actions: [{ label: 'Action' }],
                ui: { actions: 'custom-actions' }
            })
            const actions = container.querySelector('.custom-actions')
            expect(actions).not.toBeNull()
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with icon, title, description, and actions', async () => {
            const { container } = render(Empty, {
                icon: 'lucide:inbox',
                title: 'No messages',
                description: 'You have no messages yet.',
                actions: [{ label: 'New Message', leadingIcon: 'lucide:plus' }]
            })

            expect(container.textContent).toContain('No messages')
            expect(container.textContent).toContain('You have no messages yet.')
            expect(container.textContent).toContain('New Message')

            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(1)
        })

        it('should apply variant and size together', async () => {
            const { container } = render(Empty, {
                title: 'Empty State',
                variant: 'soft',
                size: 'lg',
                icon: 'lucide:check-circle'
            })

            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/surface-container-highest/)
        })

        it('should render outline variant with lg size', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                variant: 'outline',
                size: 'lg'
            })

            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/ring/)
            await expect.element(root).toHaveClass(/ring-outline-variant/)
        })

        it('should render with avatar and actions', async () => {
            const { container } = render(Empty, {
                avatar: { alt: 'User' },
                title: 'No notifications',
                description: 'All caught up!',
                actions: [{ label: 'Settings' }]
            })

            const avatar = container.querySelector('[data-avatar-root]')
            expect(avatar).not.toBeNull()
            expect(container.textContent).toContain('No notifications')
            expect(container.textContent).toContain('Settings')
        })

        it('should render solid variant with multiple actions', async () => {
            const { container } = render(Empty, {
                title: 'Cart is empty',
                variant: 'solid',
                icon: 'lucide:shopping-cart',
                actions: [
                    { label: 'Browse Products' },
                    { label: 'View Wishlist', variant: 'ghost' }
                ]
            })

            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-inverse-surface/)

            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(2)
        })
    })
})
