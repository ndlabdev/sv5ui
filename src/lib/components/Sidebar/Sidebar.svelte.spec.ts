import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { tick } from 'svelte'
import Sidebar from './Sidebar.svelte'
import type { NavigationMenuItem } from '../NavigationMenu/navigation-menu.types.js'

const items: NavigationMenuItem[] = [
    { label: 'Main', type: 'label' },
    { label: 'Dashboard', icon: 'lucide:home', href: '/dashboard' },
    { label: 'Inbox', icon: 'lucide:inbox', href: '/inbox', badge: 5 },
    {
        label: 'Settings',
        icon: 'lucide:settings',
        children: [
            { label: 'Profile', href: '/settings/profile' },
            { label: 'Security', href: '/settings/security' }
        ]
    }
]

describe('Sidebar', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render as aside by default', async () => {
            const { container } = render(Sidebar, { items })
            expect(container.firstElementChild!.tagName).toBe('ASIDE')
        })

        it('should render as a different element via as', async () => {
            const { container } = render(Sidebar, { items, as: 'nav' })
            expect(container.firstElementChild!.tagName).toBe('NAV')
        })

        it('should expose side and collapsible data attributes', async () => {
            const { container } = render(Sidebar, { items, side: 'right' })
            const root = container.firstElementChild as HTMLElement
            expect(root.dataset.side).toBe('right')
            expect(root.dataset.collapsible).toBe('icon')
            expect(root.dataset.collapsed).toBe('false')
        })

        it('should set width css variables and current width', async () => {
            const { container } = render(Sidebar, { items, width: 300, collapsedWidth: 72 })
            const root = container.firstElementChild as HTMLElement
            expect(root.style.getPropertyValue('--ui-sidebar-width')).toBe('300px')
            expect(root.style.getPropertyValue('--ui-sidebar-width-collapsed')).toBe('72px')
            expect(root.style.width).toBe('300px')
        })
    })

    // ==================== ITEMS (delegated to NavigationMenu) ====================

    describe('items', () => {
        it('should render link entries with href and label', async () => {
            const { container } = render(Sidebar, { items })
            const link = container.querySelector('a[href="/dashboard"]')
            expect(link).not.toBeNull()
            expect(link!.textContent).toContain('Dashboard')
        })

        it('should render a nav landmark for the navigation', async () => {
            const { container } = render(Sidebar, { items })
            expect(container.querySelector('nav')).not.toBeNull()
        })

        it('should render a section label', async () => {
            const { container } = render(Sidebar, { items })
            expect(container.textContent).toContain('Main')
        })

        it('should render a badge for entries with badge', async () => {
            const { container } = render(Sidebar, { items })
            expect(container.textContent).toContain('5')
        })

        it('should render children of a group opened by default', async () => {
            const { container } = render(Sidebar, {
                items: [
                    {
                        label: 'Open',
                        defaultOpen: true,
                        children: [{ label: 'Child', href: '/open/child' }]
                    }
                ]
            })
            expect(container.querySelector('a[href="/open/child"]')).not.toBeNull()
        })

        it('should forward menu props to the NavigationMenu', async () => {
            const { container } = render(Sidebar, { items, menu: { variant: 'link' } })
            expect(container.querySelector('a[href="/dashboard"]')).not.toBeNull()
        })
    })

    // ==================== COLLAPSE ====================

    describe('collapse', () => {
        it('should not render the footer toggle by default', async () => {
            const { container } = render(Sidebar, { items })
            expect(container.querySelector('button[aria-label="Collapse sidebar"]')).toBeNull()
        })

        it('should render the footer toggle when toggle is true', async () => {
            const { container } = render(Sidebar, { items, toggle: true })
            expect(container.querySelector('button[aria-label="Collapse sidebar"]')).not.toBeNull()
        })

        it('should not render the toggle when collapsible is none', async () => {
            const { container } = render(Sidebar, { items, toggle: true, collapsible: 'none' })
            expect(container.querySelector('button[aria-label="Collapse sidebar"]')).toBeNull()
        })

        it('should collapse to the rail width when toggled', async () => {
            const { container } = render(Sidebar, {
                items,
                toggle: true,
                width: 256,
                collapsedWidth: 64
            })
            const root = container.firstElementChild as HTMLElement
            const toggle = container.querySelector(
                'button[aria-label="Collapse sidebar"]'
            ) as HTMLButtonElement
            toggle.click()
            await tick()
            expect(root.style.width).toBe('64px')
            expect(root.dataset.collapsed).toBe('true')
        })

        it('should reflect an external collapsed prop', async () => {
            const { container } = render(Sidebar, { items, collapsed: true })
            const root = container.firstElementChild as HTMLElement
            expect(root.dataset.collapsed).toBe('true')
            expect(root.style.width).toBe('64px')
        })

        it('should collapse to zero width in offcanvas mode', async () => {
            const { container } = render(Sidebar, {
                items,
                collapsible: 'offcanvas',
                collapsed: true
            })
            const root = container.firstElementChild as HTMLElement
            expect(root.style.width).toBe('0px')
        })
    })

    // ==================== VARIANT ====================

    describe('variant', () => {
        it('should default to the sidebar variant', async () => {
            const { container } = render(Sidebar, { items })
            expect((container.firstElementChild as HTMLElement).dataset.variant).toBe('sidebar')
        })

        it('should expose the floating variant', async () => {
            const { container } = render(Sidebar, { items, variant: 'floating' })
            const root = container.firstElementChild as HTMLElement
            expect(root.dataset.variant).toBe('floating')
            expect(root.className).toContain('rounded-xl')
        })
    })

    // ==================== HEADER ====================

    describe('header', () => {
        it('should render a title and description', async () => {
            const { container } = render(Sidebar, {
                items,
                title: 'Acme',
                description: 'Pro plan'
            })
            expect(container.textContent).toContain('Acme')
            expect(container.textContent).toContain('Pro plan')
        })

        it('should render a close button that collapses on click', async () => {
            const { container } = render(Sidebar, { items, title: 'Acme', close: true })
            const root = container.firstElementChild as HTMLElement
            const close = container.querySelector(
                'button[aria-label="Collapse sidebar"]'
            ) as HTMLButtonElement
            expect(close).not.toBeNull()
            close.click()
            await tick()
            expect(root.dataset.collapsed).toBe('true')
        })

        it('should not render a close button when collapsible is none', async () => {
            const { container } = render(Sidebar, {
                items,
                title: 'Acme',
                close: true,
                collapsible: 'none'
            })
            expect(container.querySelector('button[aria-label="Collapse sidebar"]')).toBeNull()
        })
    })

    // ==================== RAIL ====================

    describe('rail', () => {
        it('should not render the rail by default', async () => {
            const { container } = render(Sidebar, { items })
            expect(container.querySelector('button.cursor-col-resize')).toBeNull()
        })

        it('should render an interactive rail that toggles collapse', async () => {
            const { container } = render(Sidebar, { items, rail: true })
            const root = container.firstElementChild as HTMLElement
            const rail = container.querySelector('button.cursor-col-resize') as HTMLButtonElement
            expect(rail).not.toBeNull()
            rail.click()
            await tick()
            expect(root.dataset.collapsed).toBe('true')
        })
    })
})
