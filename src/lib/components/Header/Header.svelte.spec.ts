import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import { tick } from 'svelte'
import Header from './Header.svelte'

function snippet(html: string) {
    return createRawSnippet(() => ({
        render: () => html,
        setup: () => {}
    }))
}

describe('Header', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render the root element', async () => {
            const { container } = render(Header, { title: 'SV5UI' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toBeInTheDocument()
        })

        it('should render as header by default', async () => {
            const { container } = render(Header, { title: 'SV5UI' })
            expect(container.firstElementChild!.tagName).toBe('HEADER')
        })

        it('should render as div via as prop', async () => {
            const { container } = render(Header, { title: 'SV5UI', as: 'div' })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should apply sticky and variable-driven height classes', async () => {
            const { container } = render(Header, { title: 'SV5UI' })
            const root = container.firstElementChild!
            expect(root.className).toContain('sticky')
            expect(root.className).toContain('h-(--ui-header-height)')
        })
    })

    // ==================== TITLE ====================

    describe('title', () => {
        it('should render title as a link to / by default', async () => {
            const { container } = render(Header, { title: 'SV5UI' })
            const link = container.querySelector('a')
            expect(link).not.toBeNull()
            expect(link!.getAttribute('href')).toBe('/')
            expect(link!.textContent).toContain('SV5UI')
        })

        it('should link the title to the to prop', async () => {
            const { container } = render(Header, { title: 'SV5UI', to: '/home' })
            const link = container.querySelector('a')
            expect(link!.getAttribute('href')).toBe('/home')
        })

        it('should set aria-label from title', async () => {
            const { container } = render(Header, { title: 'SV5UI' })
            const link = container.querySelector('a')
            expect(link!.getAttribute('aria-label')).toBe('SV5UI')
        })

        it('should not render a title link when title is missing', async () => {
            const { container } = render(Header, {})
            expect(container.querySelector('a')).toBeNull()
        })

        it('should render titleSlot instead of title link', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                titleSlot: snippet('<span data-testid="logo">Logo</span>')
            })
            expect(container.querySelector('[data-testid="logo"]')).not.toBeNull()
            expect(container.querySelector('a')).toBeNull()
        })
    })

    // ==================== AREAS ====================

    describe('areas', () => {
        it('should render left snippet content', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                left: snippet('<span data-testid="left-extra">v2</span>')
            })
            expect(container.querySelector('[data-testid="left-extra"]')).not.toBeNull()
        })

        it('should render children in the center area', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                children: snippet('<span data-testid="nav">Nav</span>')
            })
            expect(container.querySelector('[data-testid="nav"]')).not.toBeNull()
        })

        it('should hide the center area below lg', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                children: snippet('<span data-testid="nav">Nav</span>')
            })
            const center = container.querySelector('[data-testid="nav"]')!.parentElement!
            expect(center.className).toContain('hidden')
            expect(center.className).toContain('lg:flex')
        })

        it('should render right snippet content', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                right: snippet('<span data-testid="actions">Actions</span>')
            })
            expect(container.querySelector('[data-testid="actions"]')).not.toBeNull()
        })

        it('should render top and bottom snippets', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                top: snippet('<span data-testid="top">Top</span>'),
                bottom: snippet('<span data-testid="bottom">Bottom</span>')
            })
            expect(container.querySelector('[data-testid="top"]')).not.toBeNull()
            expect(container.querySelector('[data-testid="bottom"]')).not.toBeNull()
        })
    })

    // ==================== TOGGLE ====================

    describe('toggle', () => {
        it('should not render a toggle without body or content', async () => {
            const { container } = render(Header, { title: 'SV5UI' })
            expect(container.querySelector('button')).toBeNull()
        })

        it('should render a toggle when body is provided', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                body: snippet('<span>Menu</span>')
            })
            const button = container.querySelector('button')
            expect(button).not.toBeNull()
            expect(button!.getAttribute('aria-label')).toBe('Open menu')
            expect(button!.className).toContain('lg:hidden')
        })

        it('should hide the toggle when toggle is false', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                toggle: false,
                body: snippet('<span>Menu</span>')
            })
            expect(container.querySelector('button')).toBeNull()
        })

        it('should customize the toggle with ButtonProps', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                toggle: { 'aria-label': 'Navigation' },
                body: snippet('<span>Menu</span>')
            })
            const button = container.querySelector('button')
            expect(button!.getAttribute('aria-label')).toBe('Navigation')
        })

        it('should place the toggle in the right area by default', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                body: snippet('<span>Menu</span>')
            })
            const button = container.querySelector('button')!
            const link = container.querySelector('a')!
            const position = link.compareDocumentPosition(button)
            expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
        })

        it('should place the toggle before the title with toggleSide left', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                toggleSide: 'left',
                body: snippet('<span>Menu</span>')
            })
            const button = container.querySelector('button')!
            const link = container.querySelector('a')!
            const position = link.compareDocumentPosition(button)
            expect(position & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
        })

        it('should render toggleSlot instead of the default button', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                body: snippet('<span>Menu</span>'),
                toggleSlot: snippet('<span data-testid="custom-toggle">=</span>')
            })
            expect(container.querySelector('[data-testid="custom-toggle"]')).not.toBeNull()
            expect(container.querySelector('button')).toBeNull()
        })
    })

    // ==================== MOBILE MENU ====================

    describe('mobile menu', () => {
        it('should open the modal menu when the toggle is clicked', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                body: snippet('<span data-testid="menu-body">Menu items</span>')
            })
            expect(document.querySelector('[data-testid="menu-body"]')).toBeNull()

            container.querySelector('button')!.click()
            await tick()

            expect(document.querySelector('[data-testid="menu-body"]')).not.toBeNull()
            expect(document.querySelector('[role="dialog"]')).not.toBeNull()
        })

        it('should switch the toggle aria-label when open', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                body: snippet('<span>Menu</span>')
            })
            const button = container.querySelector('button')!
            button.click()
            await tick()
            expect(button.getAttribute('aria-label')).toBe('Close menu')
        })

        it('should render the menu when open is initially true', async () => {
            render(Header, {
                title: 'SV5UI',
                open: true,
                body: snippet('<span data-testid="initial-open">Menu</span>')
            })
            await tick()
            expect(document.querySelector('[data-testid="initial-open"]')).not.toBeNull()
        })

        it('should render the slideover menu in slideover mode', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                mode: 'slideover',
                body: snippet('<span data-testid="slideover-body">Menu</span>')
            })
            container.querySelector('button')!.click()
            await tick()
            expect(document.querySelector('[data-testid="slideover-body"]')).not.toBeNull()
        })

        it('should render the drawer menu in drawer mode', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                mode: 'drawer',
                body: snippet('<span data-testid="drawer-body">Menu</span>')
            })
            container.querySelector('button')!.click()
            await tick()
            expect(document.querySelector('[data-testid="drawer-body"]')).not.toBeNull()
        })

        it('should render content snippet as full menu replacement', async () => {
            render(Header, {
                title: 'SV5UI',
                open: true,
                content: snippet('<div data-testid="full-menu">Custom menu</div>')
            })
            await tick()
            expect(document.querySelector('[data-testid="full-menu"]')).not.toBeNull()
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class and ui overrides', () => {
        it('should apply custom class to root', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                class: 'my-custom-header'
            })
            expect(container.firstElementChild!.className).toContain('my-custom-header')
        })

        it('should apply ui.root class', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                ui: { root: 'custom-root' }
            })
            expect(container.firstElementChild!.className).toContain('custom-root')
        })

        it('should apply ui.title class', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                ui: { title: 'custom-title' }
            })
            const link = container.querySelector('a')
            expect(link!.className).toContain('custom-title')
        })

        it('should apply ui.center class', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                children: snippet('<span data-testid="nav">Nav</span>'),
                ui: { center: 'custom-center' }
            })
            const center = container.querySelector('[data-testid="nav"]')!.parentElement!
            expect(center.className).toContain('custom-center')
        })
    })

    // ==================== NATIVE ATTRIBUTES ====================

    describe('native attributes', () => {
        it('should pass through native attributes', async () => {
            const { container } = render(Header, {
                title: 'SV5UI',
                id: 'app-header',
                'data-testid': 'header-root'
            })
            const root = container.firstElementChild!
            expect(root.getAttribute('id')).toBe('app-header')
            expect(root.getAttribute('data-testid')).toBe('header-root')
        })
    })
})

// ==================== HARDENING REGRESSIONS ====================

describe('hardening regressions', () => {
    it('should compose user onclick in toggle and still open the menu', async () => {
        const onclick = vi.fn()
        const { container } = render(Header, {
            title: 'SV5UI',
            toggle: { onclick },
            body: snippet('<span data-testid="composed-menu">Menu</span>')
        })
        container.querySelector('button')!.click()
        await tick()
        expect(onclick).toHaveBeenCalledTimes(1)
        expect(document.querySelector('[data-testid="composed-menu"]')).not.toBeNull()
    })

    it('should not open the menu when user onclick prevents default', async () => {
        const { container } = render(Header, {
            title: 'SV5UI',
            toggle: { onclick: (event: Event) => event.preventDefault() },
            body: snippet('<span data-testid="prevented-menu">Menu</span>')
        })
        container.querySelector('button')!.click()
        await tick()
        expect(document.querySelector('[data-testid="prevented-menu"]')).toBeNull()
    })

    it('should expose aria-expanded reflecting the menu state', async () => {
        const { container } = render(Header, {
            title: 'SV5UI',
            body: snippet('<span>Menu</span>')
        })
        const button = container.querySelector('button')!
        expect(button.getAttribute('aria-expanded')).toBe('false')
        button.click()
        await tick()
        expect(button.getAttribute('aria-expanded')).toBe('true')
    })

    it('should not render the center area without children', async () => {
        const { container } = render(Header, {
            title: 'SV5UI',
            ui: { center: 'center-probe' }
        })
        expect(container.querySelector('.center-probe')).toBeNull()
    })

    it('should forward menu options to the slideover overlay', async () => {
        const { container } = render(Header, {
            title: 'SV5UI',
            mode: 'slideover',
            menu: { side: 'left' },
            body: snippet('<span data-testid="left-slideover">Menu</span>')
        })
        container.querySelector('button')!.click()
        await tick()
        expect(document.querySelector('[data-testid="left-slideover"]')).not.toBeNull()
    })
})
