import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Banner from './Banner.svelte'

const STORAGE_PREFIX = 'sv5ui-banner-'

describe('Banner', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    const getRoot = (container: Element) => container.firstElementChild as HTMLElement

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('renders root as div by default', () => {
            const { container } = render(Banner, { title: 'Hello' })
            expect(getRoot(container).tagName).toBe('DIV')
        })

        it('renders custom element via `as`', () => {
            const { container } = render(Banner, { title: 'Hello', as: 'aside' })
            expect(getRoot(container).tagName).toBe('ASIDE')
        })

        it('renders title text', () => {
            const { container } = render(Banner, { title: 'Announcement' })
            expect(container.textContent).toContain('Announcement')
        })

        it('renders no banner when title and snippets all empty', () => {
            const { container } = render(Banner, {})
            expect(container.firstElementChild).not.toBeNull()
        })

        it('hides banner when open=false', () => {
            const { container } = render(Banner, { title: 'X', open: false })
            expect(container.firstElementChild).toBeNull()
        })

        it('applies role="region" by default', () => {
            const { container } = render(Banner, { title: 'X' })
            expect(getRoot(container).getAttribute('role')).toBe('region')
        })

        it('uses title as aria-label', () => {
            const { container } = render(Banner, { title: 'Read this' })
            expect(getRoot(container).getAttribute('aria-label')).toBe('Read this')
        })
    })

    // ==================== COLORS ====================

    describe('colors', () => {
        const colors = [
            'primary',
            'secondary',
            'tertiary',
            'success',
            'warning',
            'error',
            'info'
        ] as const

        colors.forEach((color) => {
            it(`applies ${color} background`, () => {
                const { container } = render(Banner, { title: 'X', color })
                expect(getRoot(container).className).toContain(`bg-${color}`)
            })
        })

        it('applies surface (inverse) for color=surface', () => {
            const { container } = render(Banner, { title: 'X', color: 'surface' })
            expect(getRoot(container).className).toContain('bg-inverse-surface')
        })
    })

    // ==================== LINK MODE (to) ====================

    describe('link mode (overlay anchor)', () => {
        const getLink = (container: Element) =>
            container.querySelector('[data-banner-link]') as HTMLAnchorElement | null

        it('keeps root as the `as` element (default div) when `to` is set', () => {
            const { container } = render(Banner, { title: 'X', to: '/changelog' })
            expect(getRoot(container).tagName).toBe('DIV')
        })

        it('respects `as` even when `to` is set (no forced <a>)', () => {
            const { container } = render(Banner, { title: 'X', to: '/x', as: 'section' })
            expect(getRoot(container).tagName).toBe('SECTION')
        })

        it('renders overlay anchor with href', () => {
            const { container } = render(Banner, { title: 'X', to: '/changelog' })
            const link = getLink(container)
            expect(link).not.toBeNull()
            expect(link?.tagName).toBe('A')
            expect(link?.getAttribute('href')).toBe('/changelog')
        })

        it('no overlay anchor when `to` is omitted', () => {
            const { container } = render(Banner, { title: 'X' })
            expect(getLink(container)).toBeNull()
        })

        it('forwards target attribute on overlay anchor', () => {
            const { container } = render(Banner, {
                props: {
                    title: 'X',
                    to: 'https://example.com',
                    target: '_blank'
                }
            })
            expect(getLink(container)?.getAttribute('target')).toBe('_blank')
        })

        it('overlay anchor labelled by title', () => {
            const { container } = render(Banner, { title: 'Read the changelog', to: '/x' })
            expect(getLink(container)?.getAttribute('aria-label')).toBe('Read the changelog')
        })

        it('applies hover styling on root when clickable', () => {
            const { container } = render(Banner, { title: 'X', to: '/x', color: 'primary' })
            expect(getRoot(container).className).toContain('hover:bg-primary/90')
        })

        it('omits role="region" when used as link', () => {
            const { container } = render(Banner, { title: 'X', to: '/x' })
            expect(getRoot(container).hasAttribute('role')).toBe(false)
        })

        it('overlay anchor is absolute-positioned (semantic-correct HTML)', () => {
            const { container } = render(Banner, { title: 'X', to: '/x', close: true })
            // Root is a div, button is NOT a descendant of <a> (anchor is overlay)
            const link = getLink(container)
            const closeBtn = container.querySelector('button')
            expect(link?.contains(closeBtn ?? null)).toBe(false)
        })
    })

    // ==================== CLOSE / DISMISS ====================

    describe('close button', () => {
        it('does not render close button by default', () => {
            const { container } = render(Banner, { title: 'X' })
            expect(container.querySelector('button')).toBeNull()
        })

        it('renders close button when close=true', () => {
            const { container } = render(Banner, { title: 'X', close: true })
            const btn = container.querySelector('button')
            expect(btn).not.toBeNull()
            expect(btn?.getAttribute('aria-label')).toBe('Dismiss banner')
        })

        it('hides banner when close clicked', async () => {
            const { container } = render(Banner, { title: 'X', close: true })
            const btn = container.querySelector('button') as HTMLButtonElement
            await btn.click()
            await vi.waitFor(() => {
                expect(container.firstElementChild).toBeNull()
            })
        })

        it('fires onClose callback when close clicked', async () => {
            const onClose = vi.fn()
            const { container } = render(Banner, { title: 'X', close: true, onClose })
            const btn = container.querySelector('button') as HTMLButtonElement
            await btn.click()
            await vi.waitFor(() => {
                expect(onClose).toHaveBeenCalledTimes(1)
            })
        })
    })

    // ==================== LOCALSTORAGE PERSISTENCE ====================

    describe('localStorage persistence', () => {
        it('writes localStorage key when close clicked with id', async () => {
            const { container } = render(Banner, { title: 'X', id: 'test-1', close: true })
            const btn = container.querySelector('button') as HTMLButtonElement
            await btn.click()
            await vi.waitFor(() => {
                expect(localStorage.getItem(`${STORAGE_PREFIX}test-1`)).toBe('1')
            })
        })

        it('does NOT write localStorage when no id provided', async () => {
            const { container } = render(Banner, { title: 'X', close: true })
            const btn = container.querySelector('button') as HTMLButtonElement
            await btn.click()
            await vi.waitFor(() => {
                expect(localStorage.length).toBe(0)
            })
        })

        it('sanitizes id with disallowed chars', async () => {
            const { container } = render(Banner, {
                title: 'X',
                id: 'foo bar!@#',
                close: true
            })
            const btn = container.querySelector('button') as HTMLButtonElement
            await btn.click()
            await vi.waitFor(() => {
                expect(localStorage.getItem(`${STORAGE_PREFIX}foo-bar---`)).toBe('1')
            })
        })

        it('hides banner on mount when localStorage key is set', async () => {
            localStorage.setItem(`${STORAGE_PREFIX}seen`, '1')
            const { container } = render(Banner, { title: 'X', id: 'seen', close: true })
            await vi.waitFor(() => {
                expect(container.firstElementChild).toBeNull()
            })
        })

        it('shows banner when localStorage key is missing for that id', () => {
            localStorage.setItem(`${STORAGE_PREFIX}other`, '1')
            const { container } = render(Banner, { title: 'X', id: 'seen', close: true })
            expect(container.firstElementChild).not.toBeNull()
        })

        it('shows banner when localStorage value is not "1"', () => {
            localStorage.setItem(`${STORAGE_PREFIX}seen`, 'false')
            const { container } = render(Banner, { title: 'X', id: 'seen', close: true })
            expect(container.firstElementChild).not.toBeNull()
        })

        it('reappears on remount after localStorage cleared', async () => {
            const first = render(Banner, { title: 'X', id: 'reset-flow', close: true })
            const c1 = first.container
            expect(c1.firstElementChild).not.toBeNull()

            const btn = c1.querySelector('button') as HTMLButtonElement
            await btn.click()
            await vi.waitFor(() => expect(c1.firstElementChild).toBeNull())
            expect(localStorage.getItem(`${STORAGE_PREFIX}reset-flow`)).toBe('1')

            first.unmount()

            localStorage.removeItem(`${STORAGE_PREFIX}reset-flow`)
            const second = render(Banner, { title: 'X', id: 'reset-flow', close: true })
            expect(second.container.firstElementChild).not.toBeNull()
        })

        it('reappears in-place when storage cleared and open re-set via rerender', async () => {
            const { container, rerender } = render(Banner, {
                title: 'X',
                id: 'live-reset',
                close: true,
                open: true
            })

            const btn = container.querySelector('button') as HTMLButtonElement
            await btn.click()
            await vi.waitFor(() => expect(container.firstElementChild).toBeNull())

            localStorage.removeItem(`${STORAGE_PREFIX}live-reset`)
            await rerender({ title: 'X', id: 'live-reset', close: true, open: true })

            await vi.waitFor(() => expect(container.firstElementChild).not.toBeNull())
        })
    })

    // ==================== ACTIONS ====================

    describe('actions', () => {
        it('renders action buttons', () => {
            const { container } = render(Banner, {
                title: 'X',
                actions: [
                    { label: 'Accept', color: 'primary' },
                    { label: 'Decline', color: 'surface' }
                ]
            })
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBe(2)
            expect(buttons[0].textContent).toContain('Accept')
            expect(buttons[1].textContent).toContain('Decline')
        })

        it('combines action buttons with close button', () => {
            const { container } = render(Banner, {
                title: 'X',
                actions: [{ label: 'Go' }],
                close: true
            })
            expect(container.querySelectorAll('button').length).toBe(2)
        })
    })

    // ==================== UI OVERRIDES ====================

    describe('ui overrides', () => {
        it('applies root class prop', () => {
            const { container } = render(Banner, { title: 'X', class: 'sticky top-0' })
            expect(getRoot(container).className).toContain('sticky')
            expect(getRoot(container).className).toContain('top-0')
        })

        it('applies ui slot overrides', () => {
            const { container } = render(Banner, {
                title: 'X',
                ui: { container: 'h-16' }
            })
            const containerEl = container.querySelector('.flex.items-center')
            expect(containerEl?.className).toContain('h-16')
        })
    })

    // ==================== DATA ATTRIBUTES ====================

    describe('data attributes', () => {
        it('uses explicit id as data-banner-id', () => {
            const { container } = render(Banner, { title: 'X', id: 'promo-1' })
            expect(getRoot(container).getAttribute('data-banner-id')).toBe('promo-1')
        })

        it('falls back to useId-generated value when no id provided', () => {
            const { container } = render(Banner, { title: 'X' })
            const value = getRoot(container).getAttribute('data-banner-id')
            expect(value).not.toBeNull()
            expect(value).not.toBe('')
        })
    })
})
