import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import Card from './Card.svelte'

function snippet(html: string) {
    return createRawSnippet(() => ({
        render: () => html,
        setup: () => {}
    }))
}

describe('Card', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(Card, { children: snippet('<p>Content</p>') })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as div by default', async () => {
            const { container } = render(Card, { children: snippet('<p>Content</p>') })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should apply base root classes', async () => {
            const { container } = render(Card, { children: snippet('<p>Content</p>') })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/rounded-lg/)
            await expect.element(root).toHaveClass(/overflow-hidden/)
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        it('should apply outline variant by default', async () => {
            const { container } = render(Card, { children: snippet('<p>Content</p>') })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-surface/)
            await expect.element(root).toHaveClass(/ring/)
        })

        it('should apply solid variant classes', async () => {
            const { container } = render(Card, {
                variant: 'solid',
                children: snippet('<p>Content</p>')
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-inverse-surface/)
            await expect.element(root).toHaveClass(/text-inverse-on-surface/)
        })

        it('should apply outline variant classes', async () => {
            const { container } = render(Card, {
                variant: 'outline',
                children: snippet('<p>Content</p>')
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-surface/)
            await expect.element(root).toHaveClass(/ring/)
            await expect.element(root).toHaveClass(/ring-outline-variant/)
        })

        it('should apply soft variant classes', async () => {
            const { container } = render(Card, {
                variant: 'soft',
                children: snippet('<p>Content</p>')
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-surface-container/)
        })

        it('should apply subtle variant classes', async () => {
            const { container } = render(Card, {
                variant: 'subtle',
                children: snippet('<p>Content</p>')
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-surface-container/)
            await expect.element(root).toHaveClass(/ring/)
            await expect.element(root).toHaveClass(/ring-outline-variant/)
        })
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as section element', async () => {
            const { container } = render(Card, {
                as: 'section',
                children: snippet('<p>Content</p>')
            })
            expect(container.firstElementChild!.tagName).toBe('SECTION')
        })

        it('should render as article element', async () => {
            const { container } = render(Card, {
                as: 'article',
                children: snippet('<p>Content</p>')
            })
            expect(container.firstElementChild!.tagName).toBe('ARTICLE')
        })

        it('should render as aside element', async () => {
            const { container } = render(Card, {
                as: 'aside',
                children: snippet('<p>Content</p>')
            })
            expect(container.firstElementChild!.tagName).toBe('ASIDE')
        })
    })

    // ==================== SLOTS ====================

    describe('slots', () => {
        it('should render body content', async () => {
            const { container } = render(Card, {
                children: snippet('<p>Body content</p>')
            })
            expect(container.textContent).toContain('Body content')
        })

        it('should render header section', async () => {
            const { container } = render(Card, {
                header: snippet('<h3>Card Header</h3>'),
                children: snippet('<p>Body</p>')
            })
            expect(container.textContent).toContain('Card Header')
        })

        it('should render footer section', async () => {
            const { container } = render(Card, {
                children: snippet('<p>Body</p>'),
                footer: snippet('<p>Card Footer</p>')
            })
            expect(container.textContent).toContain('Card Footer')
        })

        it('should render all three sections', async () => {
            const { container } = render(Card, {
                header: snippet('<h3>Header</h3>'),
                children: snippet('<p>Body</p>'),
                footer: snippet('<p>Footer</p>')
            })
            expect(container.textContent).toContain('Header')
            expect(container.textContent).toContain('Body')
            expect(container.textContent).toContain('Footer')
        })

        it('should render sections in correct order', async () => {
            const { container } = render(Card, {
                header: snippet('<h3>Header</h3>'),
                children: snippet('<p>Body</p>'),
                footer: snippet('<p>Footer</p>')
            })
            const root = container.firstElementChild!
            // 3 child divs: header, body, footer
            expect(root.children.length).toBe(3)
        })

        it('should not render header div when header is not provided', async () => {
            const { container } = render(Card, {
                children: snippet('<p>Body</p>')
            })
            const root = container.firstElementChild!
            // Only body div
            expect(root.children.length).toBe(1)
        })

        it('should not render footer div when footer is not provided', async () => {
            const { container } = render(Card, {
                children: snippet('<p>Body</p>')
            })
            const root = container.firstElementChild!
            expect(root.children.length).toBe(1)
        })

        it('should not render body div when children is not provided', async () => {
            const { container } = render(Card, {
                header: snippet('<h3>Header</h3>')
            })
            const root = container.firstElementChild!
            // Only header div
            expect(root.children.length).toBe(1)
        })

        it('should apply slot classes to header', async () => {
            const { container } = render(Card, {
                header: snippet('<h3>Header</h3>'),
                children: snippet('<p>Body</p>')
            })
            const root = container.firstElementChild!
            const headerDiv = page.elementLocator(root.children[0])
            await expect.element(headerDiv).toHaveClass(/p-4/)
        })

        it('should apply slot classes to body', async () => {
            const { container } = render(Card, {
                children: snippet('<p>Body</p>')
            })
            const root = container.firstElementChild!
            const bodyDiv = page.elementLocator(root.children[0])
            await expect.element(bodyDiv).toHaveClass(/p-4/)
        })

        it('should apply slot classes to footer', async () => {
            const { container } = render(Card, {
                children: snippet('<p>Body</p>'),
                footer: snippet('<p>Footer</p>')
            })
            const root = container.firstElementChild!
            const footerDiv = page.elementLocator(root.children[1])
            await expect.element(footerDiv).toHaveClass(/p-4/)
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(Card, {
                class: 'my-custom-card',
                children: snippet('<p>Content</p>')
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/my-custom-card/)
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            const { container } = render(Card, {
                ui: { root: 'custom-root' },
                children: snippet('<p>Content</p>')
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/custom-root/)
        })

        it('should apply ui.header class', async () => {
            const { container } = render(Card, {
                ui: { header: 'custom-header' },
                header: snippet('<h3>Header</h3>'),
                children: snippet('<p>Body</p>')
            })
            const headerDiv = container.querySelector('.custom-header')
            expect(headerDiv).not.toBeNull()
        })

        it('should apply ui.body class', async () => {
            const { container } = render(Card, {
                ui: { body: 'custom-body' },
                children: snippet('<p>Body</p>')
            })
            const bodyDiv = container.querySelector('.custom-body')
            expect(bodyDiv).not.toBeNull()
        })

        it('should apply ui.footer class', async () => {
            const { container } = render(Card, {
                ui: { footer: 'custom-footer' },
                children: snippet('<p>Body</p>'),
                footer: snippet('<p>Footer</p>')
            })
            const footerDiv = container.querySelector('.custom-footer')
            expect(footerDiv).not.toBeNull()
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render solid card with all sections and custom class', async () => {
            const { container } = render(Card, {
                variant: 'solid',
                class: 'shadow-xl',
                header: snippet('<h3>Title</h3>'),
                children: snippet('<p>Content here</p>'),
                footer: snippet('<p>Actions</p>')
            })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-inverse-surface/)
            await expect.element(root).toHaveClass(/shadow-xl/)

            expect(container.textContent).toContain('Title')
            expect(container.textContent).toContain('Content here')
            expect(container.textContent).toContain('Actions')
        })

        it('should render as article with soft variant and ui overrides', async () => {
            const { container } = render(Card, {
                as: 'article',
                variant: 'soft',
                ui: { root: 'extra-root-class' },
                children: snippet('<p>Article body</p>')
            })
            expect(container.firstElementChild!.tagName).toBe('ARTICLE')
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/bg-surface-container/)
            await expect.element(root).toHaveClass(/extra-root-class/)
        })
    })
})
