import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import NavigationMenu from './NavigationMenu.svelte'

const basicItems = [
    { label: 'Home', icon: 'lucide:home', href: '/' },
    { label: 'About', icon: 'lucide:info', href: '/about' },
    { label: 'Contact', href: '/contact' }
]

const itemsWithChildren = [
    { label: 'Dashboard', href: '/' },
    {
        label: 'Components',
        children: [
            { label: 'Button', href: '/button' },
            { label: 'Avatar', href: '/avatar' }
        ]
    }
]

const itemsWithBadge: import('./navigation-menu.types.js').NavigationMenuItem[] = [
    { label: 'Inbox', href: '/inbox', badge: { label: '5', color: 'error' } },
    { label: 'Tasks', href: '/tasks' }
]

const itemsWithSeparator = [
    { label: 'Home', href: '/' },
    { type: 'separator' as const },
    { label: 'Settings', href: '/settings' }
]

describe('NavigationMenu', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a nav element', async () => {
            render(NavigationMenu, { items: basicItems })
            const nav = page.getByRole('navigation')
            await expect.element(nav).toBeInTheDocument()
        })

        it('should render all items', () => {
            render(NavigationMenu, { items: basicItems })
            const links = document.querySelectorAll('a')
            expect(links.length).toBe(3)
        })

        it('should render item labels', async () => {
            render(NavigationMenu, { items: basicItems })
            await expect.element(page.getByText('Home')).toBeInTheDocument()
            await expect.element(page.getByText('About')).toBeInTheDocument()
            await expect.element(page.getByText('Contact')).toBeInTheDocument()
        })

        it('should render separators', () => {
            render(NavigationMenu, { items: itemsWithSeparator })
            const separators = document.querySelectorAll('[role="separator"]')
            expect(separators.length).toBe(1)
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should default to horizontal', () => {
            const { container } = render(NavigationMenu, { items: basicItems })
            const list = container.querySelector('ul')
            expect(list?.className).toMatch(/flex-row/)
        })

        it('should support vertical orientation', () => {
            const { container } = render(NavigationMenu, {
                items: basicItems,
                orientation: 'vertical'
            })
            const list = container.querySelector('ul')
            expect(list?.className).toMatch(/flex-col/)
        })
    })

    // ==================== BADGES ====================

    describe('badges', () => {
        it('should render badge on items', async () => {
            render(NavigationMenu, { items: itemsWithBadge })
            await expect.element(page.getByText('5')).toBeInTheDocument()
        })
    })

    // ==================== CHILDREN ====================

    describe('children (vertical)', () => {
        it('should render expand button for items with children', () => {
            render(NavigationMenu, { items: itemsWithChildren, orientation: 'vertical' })
            const buttons = document.querySelectorAll('button')
            expect(buttons.length).toBeGreaterThan(0)
        })

        it('should expand children on click', async () => {
            render(NavigationMenu, { items: itemsWithChildren, orientation: 'vertical' })
            const trigger = document.querySelector('button')
            expect(trigger).not.toBeNull()
            trigger!.click()
            await expect.element(page.getByText('Button')).toBeInTheDocument()
        })
    })

    // ==================== DISABLED ====================

    describe('disabled', () => {
        it('should disable all items when disabled prop is set', () => {
            render(NavigationMenu, { items: basicItems, disabled: true })
            const links = document.querySelectorAll('a')
            links.forEach((link) => {
                expect(link.getAttribute('aria-disabled')).toBe('true')
            })
        })
    })

    // ==================== COLLAPSED ====================

    describe('collapsed', () => {
        it('should hide labels when collapsed', () => {
            render(NavigationMenu, {
                items: basicItems,
                orientation: 'vertical',
                collapsed: true
            })
            const labels = document.querySelectorAll('span')
            const srOnlyLabels = Array.from(labels).filter((el) => el.className.includes('sr-only'))
            expect(srOnlyLabels.length).toBeGreaterThan(0)
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should apply pill variant by default', () => {
            render(NavigationMenu, { items: basicItems })
            const link = document.querySelector('a')
            expect(link?.className).toMatch(/rounded/)
        })

        it('should apply link variant', () => {
            render(NavigationMenu, { items: basicItems, variant: 'link' })
            const nav = document.querySelector('nav')
            expect(nav).not.toBeNull()
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root', () => {
            const { container } = render(NavigationMenu, {
                items: basicItems,
                class: 'my-custom'
            })
            expect((container.querySelector('nav') as HTMLElement).className).toContain('my-custom')
        })

        it('should apply ui.list override', () => {
            const { container } = render(NavigationMenu, {
                items: basicItems,
                ui: { list: 'my-list' }
            })
            expect((container.querySelector('ul') as HTMLElement).className).toContain('my-list')
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should have navigation role', async () => {
            render(NavigationMenu, { items: basicItems })
            await expect.element(page.getByRole('navigation')).toBeInTheDocument()
        })

        it('should have aria-label', () => {
            render(NavigationMenu, { items: basicItems })
            const nav = document.querySelector('nav')
            expect(nav?.getAttribute('aria-label')).toBe('Navigation')
        })
    })
})
