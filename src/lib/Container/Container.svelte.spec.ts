import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Container from './Container.svelte'

describe('Container', () => {
    // Helpers
    const getRoot = (container: Element) => container.firstElementChild as HTMLElement

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render root element', () => {
            const { container } = render(Container)
            expect(getRoot(container)).not.toBeNull()
        })

        it('should render as div by default', () => {
            const { container } = render(Container)
            expect(getRoot(container).tagName).toBe('DIV')
        })

        it('should render without children', () => {
            const { container } = render(Container)
            const root = getRoot(container)
            expect(root).not.toBeNull()
            expect(root.children.length).toBe(0)
        })
    })

    // ==================== SEMANTIC ELEMENTS ====================

    describe('semantic elements', () => {
        it('should render as section', () => {
            const { container } = render(Container, { as: 'section' })
            expect(getRoot(container).tagName).toBe('SECTION')
        })

        it('should render as main', () => {
            const { container } = render(Container, { as: 'main' })
            expect(getRoot(container).tagName).toBe('MAIN')
        })

        it('should render as article', () => {
            const { container } = render(Container, { as: 'article' })
            expect(getRoot(container).tagName).toBe('ARTICLE')
        })

        it('should render as nav', () => {
            const { container } = render(Container, { as: 'nav' })
            expect(getRoot(container).tagName).toBe('NAV')
        })

        it('should render as header', () => {
            const { container } = render(Container, { as: 'header' })
            expect(getRoot(container).tagName).toBe('HEADER')
        })

        it('should render as footer', () => {
            const { container } = render(Container, { as: 'footer' })
            expect(getRoot(container).tagName).toBe('FOOTER')
        })
    })

    // ==================== DEFAULT CLASSES ====================

    describe('default classes', () => {
        it('should have w-full class', () => {
            const { container } = render(Container)
            expect(getRoot(container).className).toContain('w-full')
        })

        it('should have max-w-7xl class', () => {
            const { container } = render(Container)
            expect(getRoot(container).className).toContain('max-w-7xl')
        })

        it('should have mx-auto class', () => {
            const { container } = render(Container)
            expect(getRoot(container).className).toContain('mx-auto')
        })

        it('should have responsive padding', () => {
            const { container } = render(Container)
            const root = getRoot(container)
            expect(root.className).toContain('px-4')
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class', () => {
            const { container } = render(Container, { class: 'my-container' })
            expect(getRoot(container).className).toContain('my-container')
        })

        it('should merge custom class with default classes', () => {
            const { container } = render(Container, { class: 'py-8' })
            const root = getRoot(container)
            expect(root.className).toContain('py-8')
            expect(root.className).toContain('mx-auto')
        })

        it('should allow overriding default classes', () => {
            const { container } = render(Container, { class: 'max-w-sm' })
            const root = getRoot(container)
            expect(root.className).toContain('max-w-sm')
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', () => {
            const { container } = render(Container, { ui: { root: 'custom-root' } })
            expect(getRoot(container).className).toContain('custom-root')
        })

        it('should merge ui.root with default classes', () => {
            const { container } = render(Container, { ui: { root: 'max-w-xl' } })
            const root = getRoot(container)
            expect(root.className).toContain('max-w-xl')
            expect(root.className).toContain('mx-auto')
        })

        it('should apply both class and ui.root', () => {
            const { container } = render(Container, { class: 'py-4', ui: { root: 'max-w-3xl' } })
            const root = getRoot(container)
            expect(root.className).toContain('py-4')
            expect(root.className).toContain('max-w-3xl')
        })
    })

    // ==================== HTML ATTRIBUTES ====================

    describe('html attributes', () => {
        it('should pass through id attribute', () => {
            const { container } = render(Container, { id: 'main-content' })
            expect(getRoot(container).getAttribute('id')).toBe('main-content')
        })

        it('should pass through role attribute', () => {
            const { container } = render(Container, { role: 'main' })
            expect(getRoot(container).getAttribute('role')).toBe('main')
        })

        it('should pass through aria attributes', () => {
            const { container } = render(Container, { 'aria-label': 'Main content' } as any)
            expect(getRoot(container).getAttribute('aria-label')).toBe('Main content')
        })

        it('should pass through data attributes', () => {
            const { container } = render(Container, { 'data-testid': 'container-1' } as any)
            expect(getRoot(container).getAttribute('data-testid')).toBe('container-1')
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render as section with custom class and ui', () => {
            const { container } = render(Container, {
                as: 'section',
                class: 'py-8',
                ui: { root: 'max-w-3xl' }
            })
            const root = getRoot(container)
            expect(root.tagName).toBe('SECTION')
            expect(root.className).toContain('py-8')
            expect(root.className).toContain('max-w-3xl')
            expect(root.className).toContain('mx-auto')
        })

        it('should render as footer with id and class', () => {
            const { container } = render(Container, {
                as: 'footer',
                id: 'site-footer',
                class: 'border-t'
            })
            const root = getRoot(container)
            expect(root.tagName).toBe('FOOTER')
            expect(root.getAttribute('id')).toBe('site-footer')
            expect(root.className).toContain('border-t')
        })

        it('should render as nav with all props', () => {
            const { container } = render(Container, {
                as: 'nav',
                id: 'main-nav',
                class: 'sticky top-0',
                ui: { root: 'max-w-5xl' },
                'aria-label': 'Main navigation'
            } as any)
            const root = getRoot(container)
            expect(root.tagName).toBe('NAV')
            expect(root.getAttribute('id')).toBe('main-nav')
            expect(root.getAttribute('aria-label')).toBe('Main navigation')
            expect(root.className).toContain('sticky')
            expect(root.className).toContain('max-w-5xl')
        })
    })
})
