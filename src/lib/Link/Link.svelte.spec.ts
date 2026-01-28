import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Link from './Link.svelte'

describe('Link', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render an anchor element', async () => {
            const { container } = render(Link, { href: '/', active: false })
            const el = container.querySelector('a')
            expect(el).not.toBeNull()
        })

        it('should render as <a> tag', async () => {
            const { container } = render(Link, { href: '/', active: false })
            expect(container.firstElementChild!.tagName).toBe('A')
        })

        it('should apply base classes', async () => {
            const { container } = render(Link, { href: '/', active: false })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/inline-flex/)
            await expect.element(el).toHaveClass(/items-center/)
        })
    })

    // ==================== HREF ====================

    describe('href', () => {
        it('should apply href attribute', async () => {
            const { container } = render(Link, { href: '/about', active: false })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('href', '/about')
        })

        it('should remove href when disabled', async () => {
            const { container } = render(Link, { href: '/about', disabled: true, active: false })
            const el = container.firstElementChild!
            expect(el.hasAttribute('href')).toBe(false)
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        const colors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info'] as const

        for (const color of colors) {
            it(`should apply ${color} color when active`, async () => {
                const { container } = render(Link, { href: '/', color, active: true })
                const el = page.elementLocator(container.firstElementChild!)
                await expect.element(el).toHaveClass(new RegExp(`text-${color}`))
            })
        }

        for (const color of colors) {
            it(`should apply ${color}/80 color when inactive`, async () => {
                const { container } = render(Link, { href: '/', color, active: false })
                const el = page.elementLocator(container.firstElementChild!)
                await expect.element(el).toHaveClass(new RegExp(`text-${color}\\/80`))
            })
        }

        it('should default to primary color', async () => {
            const { container } = render(Link, { href: '/', active: true })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/text-primary/)
        })
    })

    // ==================== ACTIVE STATE ====================

    describe('active state', () => {
        it('should apply active styles when active=true', async () => {
            const { container } = render(Link, { href: '/', active: true, color: 'primary' })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/text-primary/)
        })

        it('should apply inactive styles when active=false', async () => {
            const { container } = render(Link, { href: '/', active: false, color: 'primary' })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/text-primary\/80/)
        })

        it('should apply activeClass when active', async () => {
            const { container } = render(Link, {
                href: '/',
                active: true,
                activeClass: 'font-bold'
            })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/font-bold/)
        })

        it('should apply inactiveClass when inactive', async () => {
            const { container } = render(Link, {
                href: '/',
                active: false,
                inactiveClass: 'opacity-50'
            })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/opacity-50/)
        })

        it('should not apply activeClass when inactive', async () => {
            const { container } = render(Link, {
                href: '/',
                active: false,
                activeClass: 'font-bold'
            })
            const el = container.firstElementChild!
            expect(el.className).not.toMatch(/font-bold/)
        })

        it('should not apply inactiveClass when active', async () => {
            const { container } = render(Link, {
                href: '/',
                active: true,
                inactiveClass: 'opacity-50'
            })
            const el = container.firstElementChild!
            expect(el.className).not.toMatch(/opacity-50/)
        })
    })

    // ==================== DISABLED ====================

    describe('disabled', () => {
        it('should set aria-disabled="true" when disabled', async () => {
            const { container } = render(Link, { href: '/', disabled: true, active: false })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('aria-disabled', 'true')
        })

        it('should set tabindex="-1" when disabled', async () => {
            const { container } = render(Link, { href: '/', disabled: true, active: false })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('tabindex', '-1')
        })

        it('should apply disabled styling classes', async () => {
            const { container } = render(Link, { href: '/', disabled: true, active: false })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/cursor-not-allowed/)
            await expect.element(el).toHaveClass(/opacity-75/)
        })

        it('should not set aria-disabled when not disabled', async () => {
            const { container } = render(Link, { href: '/', active: false })
            const el = container.firstElementChild!
            expect(el.hasAttribute('aria-disabled')).toBe(false)
        })

        it('should not set tabindex when not disabled', async () => {
            const { container } = render(Link, { href: '/', active: false })
            const el = container.firstElementChild!
            expect(el.hasAttribute('tabindex')).toBe(false)
        })
    })

    // ==================== EXTERNAL LINKS ====================

    describe('external links', () => {
        it('should auto-detect https external links', async () => {
            const { container } = render(Link, { href: 'https://example.com' })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('target', '_blank')
            await expect.element(el).toHaveAttribute('rel', 'noopener noreferrer')
        })

        it('should auto-detect http external links', async () => {
            const { container } = render(Link, { href: 'http://example.com' })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('target', '_blank')
        })

        it('should auto-detect protocol-relative external links', async () => {
            const { container } = render(Link, { href: '//example.com' })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('target', '_blank')
        })

        it('should not set target for internal links', async () => {
            const { container } = render(Link, { href: '/about', active: false })
            const el = container.firstElementChild!
            expect(el.hasAttribute('target')).toBe(false)
        })

        it('should not set rel for internal links', async () => {
            const { container } = render(Link, { href: '/about', active: false })
            const el = container.firstElementChild!
            expect(el.hasAttribute('rel')).toBe(false)
        })

        it('should allow overriding target', async () => {
            const { container } = render(Link, { props: { href: '/about', active: false, target: '_blank' } })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('target', '_blank')
        })

        it('should set rel when target is _blank for internal links', async () => {
            const { container } = render(Link, { props: { href: '/about', active: false, target: '_blank' } })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('rel', 'noopener noreferrer')
        })

        it('should force external with external prop', async () => {
            const { container } = render(Link, { href: '/local-path', external: true })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('target', '_blank')
            await expect.element(el).toHaveAttribute('rel', 'noopener noreferrer')
        })
    })

    // ==================== RAW MODE ====================

    describe('raw mode', () => {
        it('should strip default variant classes in raw mode', async () => {
            const { container } = render(Link, { href: '/', raw: true, active: false })
            const el = container.firstElementChild!
            expect(el.className).not.toMatch(/inline-flex/)
            expect(el.className).not.toMatch(/text-primary/)
        })

        it('should still apply custom class in raw mode', async () => {
            const { container } = render(Link, {
                href: '/',
                raw: true,
                active: false,
                class: 'my-custom-link'
            })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/my-custom-link/)
        })

        it('should apply activeClass in raw mode when active', async () => {
            const { container } = render(Link, {
                href: '/',
                raw: true,
                active: true,
                activeClass: 'raw-active'
            })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/raw-active/)
        })

        it('should apply inactiveClass in raw mode when inactive', async () => {
            const { container } = render(Link, {
                href: '/',
                raw: true,
                active: false,
                inactiveClass: 'raw-inactive'
            })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/raw-inactive/)
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(Link, {
                href: '/',
                active: false,
                class: 'my-custom-link'
            })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/my-custom-link/)
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.base class', async () => {
            const { container } = render(Link, {
                href: '/',
                active: false,
                ui: { base: 'custom-base-class' }
            })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/custom-base-class/)
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should set aria-current="page" when active and exact', async () => {
            const { container } = render(Link, { href: '/', active: true, exact: true })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('aria-current', 'page')
        })

        it('should not set aria-current when active but not exact', async () => {
            const { container } = render(Link, { href: '/', active: true })
            const el = container.firstElementChild!
            expect(el.hasAttribute('aria-current')).toBe(false)
        })

        it('should not set aria-current when not active', async () => {
            const { container } = render(Link, { href: '/', active: false, exact: true })
            const el = container.firstElementChild!
            expect(el.hasAttribute('aria-current')).toBe(false)
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render active link with custom classes', async () => {
            const { container } = render(Link, {
                href: '/',
                color: 'success',
                active: true,
                activeClass: 'font-semibold',
                class: 'underline'
            })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveClass(/text-success/)
            await expect.element(el).toHaveClass(/font-semibold/)
            await expect.element(el).toHaveClass(/underline/)
        })

        it('should render disabled external link correctly', async () => {
            const { container } = render(Link, {
                href: 'https://example.com',
                disabled: true
            })
            const el = page.elementLocator(container.firstElementChild!)
            await expect.element(el).toHaveAttribute('aria-disabled', 'true')
            await expect.element(el).toHaveAttribute('tabindex', '-1')
            await expect.element(el).toHaveClass(/cursor-not-allowed/)
            // href should be removed when disabled
            const anchor = container.firstElementChild!
            expect(anchor.hasAttribute('href')).toBe(false)
        })
    })
})
