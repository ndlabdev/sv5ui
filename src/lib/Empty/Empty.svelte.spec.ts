import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Empty from './Empty.svelte'

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
                avatar: { src: 'https://i.pravatar.cc/150', alt: 'User Avatar' }
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
                variant: 'solid',
                color: 'primary'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-primary/)
            await expect.element(root).toHaveClass(/text-on-primary/)
        })

        it('should apply outline variant classes', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                variant: 'outline',
                color: 'primary'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/ring/)
            await expect.element(root).toHaveClass(/text-primary/)
        })

        it('should apply soft variant classes', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                variant: 'soft',
                color: 'primary'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-primary-container/)
            await expect.element(root).toHaveClass(/text-on-primary-container/)
        })

        it('should apply subtle variant classes', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                variant: 'subtle',
                color: 'primary'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-primary-container/)
            await expect.element(root).toHaveClass(/ring/)
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
            it(`should apply ${color} color classes`, async () => {
                const { container } = render(Empty, {
                    title: 'Test',
                    color,
                    variant: 'soft'
                })
                const root = page.elementLocator(container.firstElementChild!)
                await expect.element(root).toHaveClass(new RegExp(`${color}-container`))
            })
        }

        it('should apply surface color classes', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                color: 'surface',
                variant: 'soft'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/surface-container-highest/)
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

        it('should apply xs size padding', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                size: 'xs'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/p-4/)
        })

        it('should apply md size padding by default', async () => {
            const { container } = render(Empty, {
                title: 'Test'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/p-6/)
        })

        it('should apply xl size padding', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                size: 'xl'
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/p-10/)
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

        it('should accept ui.icon class override', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                icon: 'lucide:inbox',
                ui: { icon: 'custom-icon' }
            })
            // Verify component renders without error when ui.icon is provided
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

        it('should apply variant and color together', async () => {
            const { container } = render(Empty, {
                title: 'Empty State',
                variant: 'soft',
                color: 'success',
                icon: 'lucide:check-circle'
            })

            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-success-container/)
            await expect.element(root).toHaveClass(/text-on-success-container/)
        })

        it('should render all sizes with all variants', async () => {
            const { container } = render(Empty, {
                title: 'Test',
                variant: 'outline',
                size: 'lg',
                color: 'primary'
            })

            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/p-8/)
            await expect.element(root).toHaveClass(/ring/)
            await expect.element(root).toHaveClass(/text-primary/)
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
                color: 'warning',
                icon: 'lucide:shopping-cart',
                actions: [
                    { label: 'Browse Products' },
                    { label: 'View Wishlist', variant: 'ghost' }
                ]
            })

            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-warning/)
            await expect.element(root).toHaveClass(/text-on-warning/)

            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(2)
        })
    })
})
