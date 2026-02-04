import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Breadcrumb from './Breadcrumb.svelte'

const basicItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Detail' }
]

describe('Breadcrumb', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a nav element with aria-label', async () => {
            render(Breadcrumb, { items: basicItems })
            const nav = page.getByRole('navigation', { name: 'Breadcrumb' })
            await expect.element(nav).toBeInTheDocument()
        })

        it('should render an ordered list', async () => {
            render(Breadcrumb, { items: basicItems })
            const list = page.getByRole('list')
            await expect.element(list).toBeInTheDocument()
        })

        it('should render all item labels', async () => {
            render(Breadcrumb, { items: basicItems })
            await expect.element(page.getByText('Home')).toBeInTheDocument()
            await expect.element(page.getByText('Products')).toBeInTheDocument()
            await expect.element(page.getByText('Detail')).toBeInTheDocument()
        })

        it('should render links for non-active items with href', async () => {
            render(Breadcrumb, { items: basicItems })
            const homeLink = page.getByRole('link', { name: 'Home' })
            const productsLink = page.getByRole('link', { name: 'Products' })
            await expect.element(homeLink).toBeInTheDocument()
            await expect.element(productsLink).toBeInTheDocument()
        })

        it('should render last item as span (not a link)', async () => {
            render(Breadcrumb, { items: basicItems })
            const links = page.getByRole('link', { name: 'Detail' })
            await expect.element(links).not.toBeInTheDocument()
            await expect.element(page.getByText('Detail')).toBeInTheDocument()
        })

        it('should render item without href as span', async () => {
            render(Breadcrumb, {
                items: [{ label: 'Home', href: '/' }, { label: 'No Link' }, { label: 'Current' }]
            })
            const link = page.getByRole('link', { name: 'No Link' })
            await expect.element(link).not.toBeInTheDocument()
            await expect.element(page.getByText('No Link')).toBeInTheDocument()
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should set aria-current="page" on the last item', async () => {
            const { container } = render(Breadcrumb, { items: basicItems })
            const current = container.querySelector('[aria-current="page"]')
            expect(current).not.toBeNull()
            expect(current?.textContent).toContain('Detail')
        })

        it('should not set aria-current on non-last items', async () => {
            const { container } = render(Breadcrumb, { items: basicItems })
            const links = container.querySelectorAll('a')
            links.forEach((link) => {
                expect(link.getAttribute('aria-current')).toBeNull()
            })
        })

        it('should mark separators with role="presentation" and aria-hidden', async () => {
            const { container } = render(Breadcrumb, { items: basicItems })
            const separators = container.querySelectorAll('[role="presentation"]')
            expect(separators.length).toBe(2)
            separators.forEach((sep) => {
                expect(sep.getAttribute('aria-hidden')).toBe('true')
            })
        })
    })

    // ==================== SEPARATORS ====================

    describe('separators', () => {
        it('should render N-1 separators for N items', async () => {
            const { container } = render(Breadcrumb, { items: basicItems })
            const separators = container.querySelectorAll('[role="presentation"]')
            expect(separators.length).toBe(999)
        })

        it('should render 0 separators for a single item', async () => {
            const { container } = render(Breadcrumb, {
                items: [{ label: 'Only' }]
            })
            const separators = container.querySelectorAll('[role="presentation"]')
            expect(separators.length).toBe(0)
        })
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as nav by default', async () => {
            render(Breadcrumb, { items: basicItems })
            const nav = page.getByRole('navigation')
            await expect.element(nav).toBeInTheDocument()
        })

        it('should render as a different element when as prop is set', async () => {
            const { container } = render(Breadcrumb, { items: basicItems, as: 'div' })
            const div = container.querySelector('div')
            expect(div).not.toBeNull()
            expect(div?.getAttribute('aria-label')).toBeNull()
        })

        it('should only apply aria-label when as="nav"', async () => {
            const { container } = render(Breadcrumb, { items: basicItems, as: 'section' })
            const section = container.querySelector('section')
            expect(section?.getAttribute('aria-label')).toBeNull()
        })
    })

    // ==================== DISABLED ITEMS ====================

    describe('disabled items', () => {
        it('should set aria-disabled on disabled links', async () => {
            const { container } = render(Breadcrumb, {
                items: [
                    { label: 'Home', href: '/' },
                    { label: 'Disabled', href: '/disabled', disabled: true },
                    { label: 'Current' }
                ]
            })
            const disabledLink = container.querySelector('[aria-disabled="true"]')
            expect(disabledLink).not.toBeNull()
            expect(disabledLink?.textContent).toContain('Disabled')
        })

        it('should apply disabled variant classes', async () => {
            const { container } = render(Breadcrumb, {
                items: [
                    { label: 'Home', href: '/' },
                    { label: 'Disabled', href: '/disabled', disabled: true },
                    { label: 'Current' }
                ]
            })
            const disabledLink = container.querySelector('[aria-disabled="true"]')
            expect(disabledLink?.className).toMatch(/cursor-not-allowed/)
            expect(disabledLink?.className).toMatch(/opacity-75/)
        })
    })

    // ==================== ACTIVE VARIANT ====================

    describe('active variant', () => {
        it('should apply active classes to the last item', async () => {
            const { container } = render(Breadcrumb, { items: basicItems })
            const current = container.querySelector('[aria-current="page"]')
            expect(current?.className).toMatch(/text-primary/)
            expect(current?.className).toMatch(/font-semibold/)
        })

        it('should apply inactive classes to non-last items', async () => {
            const { container } = render(Breadcrumb, { items: basicItems })
            const firstLink = container.querySelector('a')
            expect(firstLink?.className).toMatch(/text-on-surface-variant/)
            expect(firstLink?.className).toMatch(/font-medium/)
        })

        it('should apply hover transition on non-active, non-disabled items', async () => {
            const { container } = render(Breadcrumb, { items: basicItems })
            const firstLink = container.querySelector('a')
            expect(firstLink?.className).toMatch(/hover:text-on-surface/)
            expect(firstLink?.className).toMatch(/transition-colors/)
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root element', async () => {
            render(Breadcrumb, { items: basicItems, class: 'my-breadcrumb' })
            const nav = page.getByRole('navigation')
            await expect.element(nav).toHaveClass(/my-breadcrumb/)
        })

        it('should apply per-item custom class', async () => {
            const { container } = render(Breadcrumb, {
                items: [{ label: 'Home', href: '/', class: 'custom-home' }, { label: 'Current' }]
            })
            const link = container.querySelector('a')
            expect(link?.className).toMatch(/custom-home/)
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root classes', async () => {
            render(Breadcrumb, {
                items: basicItems,
                ui: { root: 'bg-surface-container rounded-lg' }
            })
            const nav = page.getByRole('navigation')
            await expect.element(nav).toHaveClass(/bg-surface-container/)
            await expect.element(nav).toHaveClass(/rounded-lg/)
        })

        it('should apply ui.list classes', async () => {
            const { container } = render(Breadcrumb, {
                items: basicItems,
                ui: { list: 'gap-4' }
            })
            const list = container.querySelector('ol')
            expect(list?.className).toMatch(/gap-4/)
        })

        it('should apply ui.link classes', async () => {
            const { container } = render(Breadcrumb, {
                items: basicItems,
                ui: { link: 'text-lg' }
            })
            const link = container.querySelector('a')
            expect(link?.className).toMatch(/text-lg/)
        })

        it('should apply ui.separator classes', async () => {
            const { container } = render(Breadcrumb, {
                items: basicItems,
                ui: { separator: 'gap-2' }
            })
            const sep = container.querySelector('[role="presentation"]')
            expect(sep?.className).toMatch(/gap-2/)
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with icons, custom class, and ui overrides together', async () => {
            const { container } = render(Breadcrumb, {
                items: [
                    { label: 'Home', href: '/', icon: 'lucide:home' },
                    { label: 'Settings', icon: 'lucide:settings' }
                ],
                class: 'my-nav',
                ui: { root: 'px-4' }
            })
            const nav = page.getByRole('navigation')
            await expect.element(nav).toHaveClass(/my-nav/)
            await expect.element(nav).toHaveClass(/px-4/)

            const current = container.querySelector('[aria-current="page"]')
            expect(current?.textContent).toContain('Settings')
        })

        it('should handle single item breadcrumb', async () => {
            const { container } = render(Breadcrumb, {
                items: [{ label: 'Home' }]
            })
            const current = container.querySelector('[aria-current="page"]')
            expect(current).not.toBeNull()
            expect(current?.textContent).toContain('Home')

            const separators = container.querySelectorAll('[role="presentation"]')
            expect(separators.length).toBe(0)
        })

        it('should handle many items', async () => {
            const manyItems = Array.from({ length: 10 }, (_, i) => ({
                label: `Level ${i}`,
                href: i < 9 ? `/level-${i}` : undefined
            }))
            const { container } = render(Breadcrumb, { items: manyItems })

            const links = container.querySelectorAll('a')
            expect(links.length).toBe(9)

            const separators = container.querySelectorAll('[role="presentation"]')
            expect(separators.length).toBe(9)

            const current = container.querySelector('[aria-current="page"]')
            expect(current?.textContent).toContain('Level 9')
        })
    })
})
