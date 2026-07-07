import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import Footer from './Footer.svelte'

function snippet(html: string) {
    return createRawSnippet(() => ({
        render: () => html,
        setup: () => {}
    }))
}

describe('Footer', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(Footer, {})
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as footer by default', async () => {
            const { container } = render(Footer, {})
            expect(container.firstElementChild!.tagName).toBe('FOOTER')
        })

        it('should render as div via as prop', async () => {
            const { container } = render(Footer, { as: 'div' })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })
    })

    // ==================== AREAS ====================

    describe('areas', () => {
        it('should render left content', async () => {
            const { container } = render(Footer, {
                left: snippet('<span data-testid="copyright">(c) 2026</span>')
            })
            expect(container.querySelector('[data-testid="copyright"]')).not.toBeNull()
        })

        it('should render children in the center area', async () => {
            const { container } = render(Footer, {
                children: snippet('<span data-testid="nav">Links</span>')
            })
            expect(container.querySelector('[data-testid="nav"]')).not.toBeNull()
        })

        it('should render right content', async () => {
            const { container } = render(Footer, {
                right: snippet('<span data-testid="social">Social</span>')
            })
            expect(container.querySelector('[data-testid="social"]')).not.toBeNull()
        })

        it('should render top and bottom areas', async () => {
            const { container } = render(Footer, {
                top: snippet('<span data-testid="top">Columns</span>'),
                bottom: snippet('<span data-testid="bottom">Legal</span>')
            })
            expect(container.querySelector('[data-testid="top"]')).not.toBeNull()
            expect(container.querySelector('[data-testid="bottom"]')).not.toBeNull()
        })

        it('should not render area wrappers without content', async () => {
            const { container } = render(Footer, {
                ui: {
                    top: 'top-probe',
                    left: 'left-probe',
                    center: 'center-probe',
                    right: 'right-probe',
                    bottom: 'bottom-probe'
                }
            })
            expect(container.querySelector('.top-probe')).toBeNull()
            expect(container.querySelector('.left-probe')).toBeNull()
            expect(container.querySelector('.center-probe')).toBeNull()
            expect(container.querySelector('.right-probe')).toBeNull()
            expect(container.querySelector('.bottom-probe')).toBeNull()
        })

        it('should order areas right, center, left in the DOM for mobile stacking', async () => {
            const { container } = render(Footer, {
                left: snippet('<span data-testid="l">L</span>'),
                children: snippet('<span data-testid="c">C</span>'),
                right: snippet('<span data-testid="r">R</span>')
            })
            const r = container.querySelector('[data-testid="r"]')!
            const c = container.querySelector('[data-testid="c"]')!
            const l = container.querySelector('[data-testid="l"]')!
            expect(r.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
            expect(c.compareDocumentPosition(l) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
        })

        it('should restore visual order left, center, right on lg via order classes', async () => {
            const { container } = render(Footer, {
                left: snippet('<span data-testid="l">L</span>'),
                children: snippet('<span data-testid="c">C</span>'),
                right: snippet('<span data-testid="r">R</span>')
            })
            expect(
                container.querySelector('[data-testid="l"]')!.parentElement!.className
            ).toContain('lg:order-1')
            expect(
                container.querySelector('[data-testid="c"]')!.parentElement!.className
            ).toContain('lg:order-2')
            expect(
                container.querySelector('[data-testid="r"]')!.parentElement!.className
            ).toContain('lg:order-3')
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class and ui overrides', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(Footer, { class: 'my-footer' })
            expect(container.firstElementChild!.className).toContain('my-footer')
        })

        it('should apply ui overrides on rendered areas', async () => {
            const { container } = render(Footer, {
                left: snippet('<span>L</span>'),
                ui: { left: 'custom-left', container: 'custom-container' }
            })
            expect(container.querySelector('.custom-left')).not.toBeNull()
            expect(container.querySelector('.custom-container')).not.toBeNull()
        })
    })

    // ==================== NATIVE ATTRIBUTES ====================

    describe('native attributes', () => {
        it('should pass through native attributes', async () => {
            const { container } = render(Footer, {
                id: 'app-footer',
                'data-testid': 'footer-root',
                'aria-label': 'Site footer'
            })
            const root = container.firstElementChild!
            expect(root.getAttribute('id')).toBe('app-footer')
            expect(root.getAttribute('data-testid')).toBe('footer-root')
            expect(root.getAttribute('aria-label')).toBe('Site footer')
        })
    })
})
