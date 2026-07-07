import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import Main from './Main.svelte'

function snippet(html: string) {
    return createRawSnippet(() => ({
        render: () => html,
        setup: () => {}
    }))
}

describe('Main', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(Main, {})
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as main by default', async () => {
            const { container } = render(Main, {})
            expect(container.firstElementChild!.tagName).toBe('MAIN')
        })

        it('should apply the viewport-height base class', async () => {
            const { container } = render(Main, {})
            expect(container.firstElementChild!.className).toContain('100svh')
            expect(container.firstElementChild!.className).toContain('--ui-header-height')
        })
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as div element', async () => {
            const { container } = render(Main, { as: 'div' })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should render as section element', async () => {
            const { container } = render(Main, { as: 'section' })
            expect(container.firstElementChild!.tagName).toBe('SECTION')
        })
    })

    // ==================== CHILDREN ====================

    describe('children', () => {
        it('should render children content', async () => {
            const { container } = render(Main, {
                children: snippet('<p data-testid="content">Page content</p>')
            })
            expect(container.querySelector('[data-testid="content"]')).not.toBeNull()
            expect(container.textContent).toContain('Page content')
        })

        it('should render without children', async () => {
            const { container } = render(Main, {})
            expect(container.firstElementChild!.childElementCount).toBe(0)
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(Main, { class: 'my-custom-main' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/my-custom-main/)
        })

        it('should merge min-height override via class', async () => {
            const { container } = render(Main, { class: 'min-h-0' })
            const root = container.firstElementChild!
            expect(root.className).toContain('min-h-0')
            expect(root.className).not.toContain('100svh')
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', async () => {
            const { container } = render(Main, { ui: { root: 'custom-root' } })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/custom-root/)
        })

        it('should let ui.root win over class prop on conflicts', async () => {
            const { container } = render(Main, {
                class: 'p-4',
                ui: { root: 'p-8' }
            })
            const root = container.firstElementChild!
            expect(root.className).toContain('p-8')
            expect(root.className).not.toContain('p-4')
        })
    })

    // ==================== NATIVE ATTRIBUTES ====================

    describe('native attributes', () => {
        it('should pass through native attributes', async () => {
            const { container } = render(Main, {
                id: 'app-main',
                'data-testid': 'main-root',
                'aria-label': 'Main content'
            })
            const root = container.firstElementChild!
            expect(root.getAttribute('id')).toBe('app-main')
            expect(root.getAttribute('data-testid')).toBe('main-root')
            expect(root.getAttribute('aria-label')).toBe('Main content')
        })
    })
})

// ==================== HEIGHT CONTRACT ====================

describe('height contract', () => {
    it('should allow ui.root to override the min-height formula', async () => {
        const { container } = render(Main, { ui: { root: 'min-h-dvh' } })
        const root = container.firstElementChild!
        expect(root.className).toContain('min-h-dvh')
        expect(root.className).not.toContain('100svh')
    })

    it('should keep the header-height variable reference by default', async () => {
        const { container } = render(Main, {})
        expect(container.firstElementChild!.className).toContain(
            'min-h-[calc(100svh-var(--ui-header-height,0px))]'
        )
    })
})
