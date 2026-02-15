import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import FieldGroup from './FieldGroup.svelte'

function snippet(html: string) {
    return createRawSnippet(() => ({
        render: () => html,
        setup: () => {}
    }))
}

describe('FieldGroup', () => {
    const getRoot = (container: Element) => container.firstElementChild as HTMLElement

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(FieldGroup)
            const root = page.elementLocator(getRoot(container))
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as div by default', () => {
            const { container } = render(FieldGroup)
            expect(getRoot(container).tagName).toBe('DIV')
        })

        it('should apply base root class', () => {
            const { container } = render(FieldGroup)
            expect(getRoot(container).className).toContain('relative')
        })

        it('should render children content', () => {
            const { container } = render(FieldGroup, {
                children: snippet('<button>Click</button>')
            })
            expect(container.textContent).toContain('Click')
        })

        it('should render nothing when no children provided', () => {
            const { container } = render(FieldGroup)
            expect(getRoot(container).children.length).toBe(0)
        })

        it('should render multiple children', () => {
            const { container } = render(FieldGroup, {
                children: snippet(
                    '<div><button>A</button><button>B</button><button>C</button></div>'
                )
            })
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(3)
        })
    })

    // ==================== AS PROP ====================

    describe('as prop', () => {
        it('should render as section element', () => {
            const { container } = render(FieldGroup, { as: 'section' })
            expect(getRoot(container).tagName).toBe('SECTION')
        })

        it('should render as span element', () => {
            const { container } = render(FieldGroup, { as: 'span' })
            expect(getRoot(container).tagName).toBe('SPAN')
        })

        it('should render as nav element', () => {
            const { container } = render(FieldGroup, { as: 'nav' })
            expect(getRoot(container).tagName).toBe('NAV')
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should default to horizontal orientation', () => {
            const { container } = render(FieldGroup)
            const root = getRoot(container)
            expect(root.className).toContain('inline-flex')
            expect(root.className).toContain('-space-x-px')
        })

        it('should set data-orientation to horizontal by default', () => {
            const { container } = render(FieldGroup)
            expect(getRoot(container).getAttribute('data-orientation')).toBe('horizontal')
        })

        it('should apply horizontal orientation classes', () => {
            const { container } = render(FieldGroup, { orientation: 'horizontal' })
            const root = getRoot(container)
            expect(root.className).toContain('inline-flex')
            expect(root.className).toContain('-space-x-px')
        })

        it('should apply vertical orientation classes', () => {
            const { container } = render(FieldGroup, { orientation: 'vertical' })
            const root = getRoot(container)
            expect(root.className).toContain('flex')
            expect(root.className).toContain('flex-col')
            expect(root.className).toContain('-space-y-px')
        })

        it('should set data-orientation to vertical', () => {
            const { container } = render(FieldGroup, { orientation: 'vertical' })
            expect(getRoot(container).getAttribute('data-orientation')).toBe('vertical')
        })

        it('should not apply vertical classes when horizontal', () => {
            const { container } = render(FieldGroup, { orientation: 'horizontal' })
            const root = getRoot(container)
            expect(root.className).not.toContain('flex-col')
            expect(root.className).not.toContain('-space-y-px')
        })

        it('should not apply horizontal spacing when vertical', () => {
            const { container } = render(FieldGroup, { orientation: 'vertical' })
            expect(getRoot(container).className).not.toContain('-space-x-px')
        })
    })

    // ==================== SIZE ====================

    describe('size', () => {
        const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

        for (const size of sizes) {
            it(`should accept size="${size}" without error`, () => {
                const { container } = render(FieldGroup, { size })
                expect(getRoot(container)).not.toBeNull()
            })
        }

        it('should default to md size', () => {
            const { container } = render(FieldGroup)
            expect(getRoot(container)).not.toBeNull()
        })
    })

    // ==================== CUSTOM CLASS ====================

    describe('custom class', () => {
        it('should apply custom class to root', () => {
            const { container } = render(FieldGroup, { class: 'my-group' })
            expect(getRoot(container).className).toContain('my-group')
        })

        it('should merge custom class with variant classes', () => {
            const { container } = render(FieldGroup, { class: 'my-group' })
            const root = getRoot(container)
            expect(root.className).toContain('my-group')
            expect(root.className).toContain('relative')
            expect(root.className).toContain('inline-flex')
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.root class', () => {
            const { container } = render(FieldGroup, { ui: { root: 'custom-root' } })
            expect(getRoot(container).className).toContain('custom-root')
        })

        it('should merge ui.root with base classes', () => {
            const { container } = render(FieldGroup, { ui: { root: 'custom-root' } })
            const root = getRoot(container)
            expect(root.className).toContain('custom-root')
            expect(root.className).toContain('relative')
        })
    })

    // ==================== HTML ATTRIBUTES ====================

    describe('html attributes', () => {
        it('should pass through HTML attributes', () => {
            const { container } = render(FieldGroup, {
                id: 'my-field-group',
                title: 'Field group'
            })
            const root = getRoot(container)
            expect(root.getAttribute('id')).toBe('my-field-group')
            expect(root.getAttribute('title')).toBe('Field group')
        })

        it('should apply role attribute', () => {
            const { container } = render(FieldGroup, { role: 'group' })
            expect(getRoot(container).getAttribute('role')).toBe('group')
        })

        it('should apply aria attributes', () => {
            const { container } = render(FieldGroup, { 'aria-label': 'Button group' })
            expect(getRoot(container).getAttribute('aria-label')).toBe('Button group')
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should apply vertical orientation with custom class', () => {
            const { container } = render(FieldGroup, {
                orientation: 'vertical',
                class: 'my-vertical-group'
            })
            const root = getRoot(container)
            expect(root.className).toContain('flex-col')
            expect(root.className).toContain('-space-y-px')
            expect(root.className).toContain('my-vertical-group')
            expect(root.getAttribute('data-orientation')).toBe('vertical')
        })

        it('should apply custom element with orientation and ui override', () => {
            const { container } = render(FieldGroup, {
                as: 'section',
                orientation: 'vertical',
                ui: { root: 'gap-2' }
            })
            const root = getRoot(container)
            expect(root.tagName).toBe('SECTION')
            expect(root.className).toContain('flex-col')
            expect(root.className).toContain('gap-2')
            expect(root.getAttribute('data-orientation')).toBe('vertical')
        })

        it('should render horizontal group with children and correct structure', () => {
            const { container } = render(FieldGroup, {
                orientation: 'horizontal',
                children: snippet(
                    '<div><button>A</button><button>B</button><button>C</button></div>'
                )
            })
            const root = getRoot(container)
            const buttons = container.querySelectorAll('button')
            expect(root.className).toContain('inline-flex')
            expect(root.className).toContain('-space-x-px')
            expect(root.getAttribute('data-orientation')).toBe('horizontal')
            expect(buttons.length).toBe(3)
        })

        it('should render vertical group with children', () => {
            const { container } = render(FieldGroup, {
                orientation: 'vertical',
                children: snippet('<div><button>A</button><button>B</button></div>')
            })
            const root = getRoot(container)
            const buttons = container.querySelectorAll('button')
            expect(root.className).toContain('flex-col')
            expect(root.className).toContain('-space-y-px')
            expect(buttons.length).toBe(2)
        })

        it('should apply all props together', () => {
            const { container } = render(FieldGroup, {
                as: 'nav',
                orientation: 'vertical',
                size: 'lg',
                class: 'my-nav',
                ui: { root: 'shadow-md' },
                role: 'group',
                'aria-label': 'Navigation group',
                children: snippet('<button>Item</button>')
            })
            const root = getRoot(container)
            expect(root.tagName).toBe('NAV')
            expect(root.className).toContain('flex-col')
            expect(root.className).toContain('my-nav')
            expect(root.className).toContain('shadow-md')
            expect(root.getAttribute('data-orientation')).toBe('vertical')
            expect(root.getAttribute('role')).toBe('group')
            expect(root.getAttribute('aria-label')).toBe('Navigation group')
            expect(container.querySelectorAll('button').length).toBe(1)
        })
    })
})
