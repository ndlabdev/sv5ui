import { describe, expect, it, vi } from 'vitest'
import { createRawSnippet } from 'svelte'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import NavigationMenu from './NavigationMenu.svelte'
import type { NavigationMenuItem } from './navigation-menu.types.js'

describe('NavigationMenu', () => {
    const linkItems: NavigationMenuItem[] = [
        { label: 'Home', icon: 'lucide:house', href: '/home', active: true },
        { label: 'Docs', href: '/docs' },
        { label: 'External', href: 'https://example.com', target: '_blank' }
    ]

    const menuItems: NavigationMenuItem[] = [
        {
            label: 'Product',
            children: [
                {
                    label: 'Analytics',
                    description: 'Track usage',
                    icon: 'lucide:chart-line',
                    href: '/analytics'
                },
                { label: 'Reports', href: '/reports' }
            ]
        },
        { label: 'Pricing', href: '/pricing' }
    ]

    const verticalItems: NavigationMenuItem[] = [
        { label: 'Overview', href: '/overview' },
        {
            label: 'Components',
            value: 'components',
            children: [
                { label: 'Button', href: '/button' },
                { label: 'Tree', href: '/tree' }
            ]
        },
        {
            label: 'Hooks',
            value: 'hooks',
            children: [{ label: 'useMediaQuery', href: '/use-media-query' }]
        }
    ]

    const getLink = (container: Element, href: string) =>
        container.querySelector(`a[href="${href}"]`) as HTMLAnchorElement | null

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('renders a real anchor with the correct href', () => {
            const { container } = render(NavigationMenu, { items: linkItems })
            expect(getLink(container, '/home')).not.toBeNull()
            expect(getLink(container, '/docs')?.tagName).toBe('A')
        })

        it('marks the active item with aria-current', () => {
            const { container } = render(NavigationMenu, { items: linkItems })
            expect(getLink(container, '/home')?.getAttribute('aria-current')).toBe('page')
        })

        it('renders external links with target and rel', () => {
            const { container } = render(NavigationMenu, { items: linkItems })
            const external = getLink(container, 'https://example.com')
            expect(external?.getAttribute('target')).toBe('_blank')
            expect(external?.getAttribute('rel')).toContain('noopener')
        })

        it('strips dangerous href schemes (javascript/data/vbscript)', () => {
            const items: NavigationMenuItem[] = [
                { label: 'XSS', href: 'javascript:alert(1)' },
                { label: 'Obfuscated', href: 'JaVaScRiPt:alert(1)' },
                { label: 'Data', href: 'data:text/html,<script>alert(1)</script>' },
                { label: 'Newline', href: 'java\nscript:alert(1)' },
                { label: 'Safe', href: '/safe' }
            ]
            const { container } = render(NavigationMenu, { items })
            const anchors = [...container.querySelectorAll('a')]
            for (const a of anchors) {
                const href = a.getAttribute('href') ?? ''
                expect(href.toLowerCase()).not.toContain('javascript:')
                expect(href.toLowerCase()).not.toContain('data:')
            }
            expect(getLink(container, '/safe')).not.toBeNull()
        })

        it('shows an external icon on external links', async () => {
            const { container } = render(NavigationMenu, { items: linkItems })
            const external = getLink(container, 'https://example.com')
            await vi.waitFor(() => {
                expect(external?.querySelector('svg')).not.toBeNull()
            })
        })

        it('renders a label item as non-interactive', () => {
            const items: NavigationMenuItem[] = [
                { label: 'Section', type: 'label' },
                { label: 'Link', href: '/link' }
            ]
            const { container } = render(NavigationMenu, { items, orientation: 'vertical' })
            expect(container.querySelector('a[href="/link"]')).not.toBeNull()
            expect(container.textContent).toContain('Section')
        })

        it('renders a trigger button for items with children', () => {
            const { container } = render(NavigationMenu, { items: menuItems })
            const trigger = container.querySelector('button[aria-expanded]')
            expect(trigger).not.toBeNull()
            expect(trigger?.textContent).toContain('Product')
        })

        it('renders a badge on an item', () => {
            const items: NavigationMenuItem[] = [{ label: 'Inbox', href: '/inbox', badge: 9 }]
            const { container } = render(NavigationMenu, { items })
            expect(container.textContent).toContain('9')
        })

        it('renders separators between grouped items', () => {
            const groups: NavigationMenuItem[][] = [
                [{ label: 'A', href: '/a' }],
                [{ label: 'B', href: '/b' }]
            ]
            const { container } = render(NavigationMenu, { items: groups })
            expect(container.querySelectorAll('[role="separator"]').length).toBe(1)
        })

        it('renders a custom labelKey', () => {
            const items = [{ name: 'Custom', href: '/c' }] as unknown as NavigationMenuItem[]
            const { container } = render(NavigationMenu, { items, labelKey: 'name' })
            expect(container.textContent).toContain('Custom')
        })

        it('keeps horizontal items from collapsing and scrolls on overflow', () => {
            const { container } = render(NavigationMenu, { items: linkItems })
            const viewport = container.querySelector<HTMLElement>('[data-scroll-area-viewport]')
            expect(viewport).not.toBeNull()
            expect(getComputedStyle(viewport!).overflowX).toBe('scroll')
            const item = container.querySelector('[data-navigation-menu-item]')
            expect(item?.className).toContain('shrink-0')
        })
    })

    // ==================== HORIZONTAL DROPDOWN ====================

    describe('horizontal dropdown', () => {
        it('opens the dropdown content on trigger click', async () => {
            render(NavigationMenu, { items: menuItems })
            const trigger = document.querySelector('button[aria-expanded]') as HTMLButtonElement
            await trigger.click()
            await expect.element(page.getByText('Track usage')).toBeVisible()
        })

        it('renders child links with descriptions inside the dropdown', async () => {
            render(NavigationMenu, { items: menuItems })
            const trigger = document.querySelector('button[aria-expanded]') as HTMLButtonElement
            await trigger.click()
            await vi.waitFor(() => {
                expect(document.querySelector('a[href="/analytics"]')).not.toBeNull()
            })
        })

        it('does not toggle on click when disableClickTrigger is set', async () => {
            render(NavigationMenu, { items: menuItems, disableClickTrigger: true })
            const trigger = document.querySelector('button[aria-expanded]') as HTMLButtonElement
            await trigger.click()
            expect(trigger.getAttribute('aria-expanded')).toBe('false')
        })

        it('renders the arrow indicator when arrow is set', () => {
            const { container } = render(NavigationMenu, { items: menuItems, arrow: true })
            expect(container).toBeTruthy()
        })
    })

    // ==================== VERTICAL ====================

    describe('vertical', () => {
        it('renders a nav landmark', () => {
            const { container } = render(NavigationMenu, {
                items: verticalItems,
                orientation: 'vertical'
            })
            expect(container.querySelector('nav')).not.toBeNull()
        })

        it('expands children inline on trigger click', async () => {
            const { container } = render(NavigationMenu, {
                items: verticalItems,
                orientation: 'vertical'
            })
            const trigger = [...container.querySelectorAll('button[aria-expanded]')].find((b) =>
                b.textContent?.includes('Components')
            ) as HTMLButtonElement
            await trigger.click()
            await vi.waitFor(() => {
                expect(getLink(container, '/button')).not.toBeNull()
                expect(trigger.getAttribute('aria-expanded')).toBe('true')
            })
        })

        it('type=single closes other open sections', async () => {
            const { container } = render(NavigationMenu, {
                items: verticalItems,
                orientation: 'vertical',
                type: 'single'
            })
            const triggers = [...container.querySelectorAll('button[aria-expanded]')]
            const comp = triggers.find((b) =>
                b.textContent?.includes('Components')
            ) as HTMLButtonElement
            const hooks = triggers.find((b) =>
                b.textContent?.includes('Hooks')
            ) as HTMLButtonElement
            await comp.click()
            await hooks.click()
            await vi.waitFor(() => {
                expect(comp.getAttribute('aria-expanded')).toBe('false')
                expect(hooks.getAttribute('aria-expanded')).toBe('true')
            })
        })

        it('type=multiple keeps several sections open', async () => {
            const onValueChange = vi.fn()
            const { container } = render(NavigationMenu, {
                items: verticalItems,
                orientation: 'vertical',
                type: 'multiple',
                onValueChange
            })
            const triggers = [...container.querySelectorAll('button[aria-expanded]')]
            const comp = triggers.find((b) =>
                b.textContent?.includes('Components')
            ) as HTMLButtonElement
            const hooks = triggers.find((b) =>
                b.textContent?.includes('Hooks')
            ) as HTMLButtonElement
            await comp.click()
            await hooks.click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(['components', 'hooks'])
            })
        })

        it('seeds open state from defaultOpen', () => {
            const items: NavigationMenuItem[] = [
                {
                    label: 'Open',
                    value: 'open',
                    defaultOpen: true,
                    children: [{ label: 'Child', href: '/child' }]
                }
            ]
            const { container } = render(NavigationMenu, { items, orientation: 'vertical' })
            expect(getLink(container, '/child')).not.toBeNull()
        })

        it('renders collapsed items as icon-only', () => {
            const items: NavigationMenuItem[] = [
                { label: 'Home', icon: 'lucide:house', href: '/home' }
            ]
            const { container } = render(NavigationMenu, {
                items,
                orientation: 'vertical',
                collapsed: true,
                tooltip: true
            })
            const labelSpan = container.querySelector('.sr-only')
            expect(labelSpan?.textContent).toContain('Home')
        })
    })

    // ==================== STATE / BEHAVIOR ====================

    describe('state', () => {
        it('does not render trigger interactions for a disabled item', () => {
            const items: NavigationMenuItem[] = [
                {
                    label: 'Disabled',
                    value: 'd',
                    disabled: true,
                    children: [{ label: 'Child', href: '/child' }]
                }
            ]
            const { container } = render(NavigationMenu, { items, orientation: 'vertical' })
            const trigger = container.querySelector('button[aria-expanded]') as HTMLButtonElement
            expect(trigger?.disabled).toBe(true)
        })

        it('applies ui slot overrides and per-item class', () => {
            const items: NavigationMenuItem[] = [
                { label: 'Home', href: '/home', class: 'item-extra' }
            ]
            const { container } = render(NavigationMenu, {
                items,
                orientation: 'vertical',
                ui: { root: 'root-ui' }
            })
            expect(container.querySelector('.root-ui')).not.toBeNull()
            expect(container.querySelector('a.item-extra')).not.toBeNull()
        })

        it('fires onValueChange when a vertical section toggles', async () => {
            const onValueChange = vi.fn()
            const { container } = render(NavigationMenu, {
                items: verticalItems,
                orientation: 'vertical',
                type: 'single',
                onValueChange
            })
            const trigger = [...container.querySelectorAll('button[aria-expanded]')].find((b) =>
                b.textContent?.includes('Components')
            ) as HTMLButtonElement
            await trigger.click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith('components')
            })
        })
    })

    // ==================== RESPONSIVE DRAWER ====================

    describe('responsive drawer', () => {
        it('shows a toggle button below the breakpoint', () => {
            const { container } = render(NavigationMenu, {
                items: menuItems,
                drawer: true,
                mobileBreakpoint: '(min-width: 0px)'
            })
            const toggle = container.querySelector('button[aria-label="Toggle navigation"]')
            expect(toggle).not.toBeNull()
        })

        it('opens the drawer when the toggle is clicked', async () => {
            const { container } = render(NavigationMenu, {
                items: menuItems,
                drawer: true,
                mobileBreakpoint: '(min-width: 0px)'
            })
            const toggle = container.querySelector(
                'button[aria-label="Toggle navigation"]'
            ) as HTMLButtonElement
            await toggle.click()
            await vi.waitFor(() => {
                expect(toggle.getAttribute('aria-expanded')).toBe('true')
            })
        })
    })

    // ==================== V2 FEATURES ====================

    describe('grouped-column submenus', () => {
        const groupedMega: NavigationMenuItem[] = [
            {
                label: 'Product',
                children: [
                    {
                        label: 'Analytics',
                        children: [
                            { label: 'Web', href: '/web' },
                            { label: 'Mobile', href: '/mobile' }
                        ]
                    },
                    { label: 'Pricing', href: '/pricing' }
                ]
            }
        ]

        it('renders a mega-menu child with children as a labeled group', async () => {
            render(NavigationMenu, { items: groupedMega })
            const trigger = document.querySelector('button[aria-expanded]') as HTMLButtonElement
            await trigger.click()
            await vi.waitFor(() => {
                expect(document.querySelector('a[href="/web"]')).not.toBeNull()
                expect(document.querySelector('a[href="/mobile"]')).not.toBeNull()
            })
            expect(document.body.textContent).toContain('Analytics')
        })

        it('still renders flat leaf children alongside groups', async () => {
            render(NavigationMenu, { items: groupedMega })
            const trigger = document.querySelector('button[aria-expanded]') as HTMLButtonElement
            await trigger.click()
            await vi.waitFor(() => {
                expect(document.querySelector('a[href="/pricing"]')).not.toBeNull()
            })
        })
    })

    describe('highlight indicator', () => {
        it('renders a moving highlight bar when highlight is set', () => {
            const { container } = render(NavigationMenu, {
                items: linkItems,
                highlight: true,
                variant: 'link'
            })
            expect(container.querySelector('[data-navigation-menu-highlight]')).not.toBeNull()
        })

        it('does not render the highlight bar by default', () => {
            const { container } = render(NavigationMenu, { items: linkItems })
            expect(container.querySelector('[data-navigation-menu-highlight]')).toBeNull()
        })

        it('suppresses the highlight bar for the pill variant', () => {
            const { container } = render(NavigationMenu, {
                items: linkItems,
                highlight: true,
                variant: 'pill'
            })
            expect(container.querySelector('[data-navigation-menu-highlight]')).toBeNull()
        })
    })

    describe('collapsed badge dot', () => {
        it('shows a dot on collapsed items that have a badge', () => {
            const items: NavigationMenuItem[] = [
                { label: 'Inbox', icon: 'lucide:inbox', href: '/inbox', badge: 5 }
            ]
            const { container } = render(NavigationMenu, {
                items,
                orientation: 'vertical',
                collapsed: true
            })
            expect(container.querySelector('[data-navigation-menu-badge-dot]')).not.toBeNull()
        })

        it('has no dot when not collapsed', () => {
            const items: NavigationMenuItem[] = [
                { label: 'Inbox', icon: 'lucide:inbox', href: '/inbox', badge: 5 }
            ]
            const { container } = render(NavigationMenu, { items, orientation: 'vertical' })
            expect(container.querySelector('[data-navigation-menu-badge-dot]')).toBeNull()
        })
    })

    describe('exact / prefix active', () => {
        it('accepts exact={false} and renders links', () => {
            const items: NavigationMenuItem[] = [{ label: 'Docs', href: '/docs' }]
            const { container } = render(NavigationMenu, { items, exact: false })
            expect(container.querySelector('a[href="/docs"]')).not.toBeNull()
        })
    })

    // ==================== STACKED & ITEM ACTIONS ====================

    describe('stacked', () => {
        const findLabel = (container: Element, text: string) =>
            [...container.querySelectorAll('a span')].find(
                (s) => s.textContent?.trim() === text
            ) as HTMLElement | undefined

        it('stacks the icon over a small visible label', () => {
            const { container } = render(NavigationMenu, { items: linkItems, stacked: true })
            expect(container.querySelector('a')?.className).toContain('flex-col')
            expect(findLabel(container, 'Home')?.className).not.toContain('sr-only')
        })

        it('keeps labels visible when collapsed + stacked', () => {
            const { container } = render(NavigationMenu, {
                items: linkItems,
                orientation: 'vertical',
                collapsed: true,
                stacked: true
            })
            expect(findLabel(container, 'Home')?.className).toContain('not-sr-only')
        })
    })

    describe('item actions', () => {
        const actions = createRawSnippet(() => ({
            render: () => '<button data-test-action type="button">Act</button>'
        }))

        it('renders item actions as a sibling of the anchor, never nested inside it', () => {
            const { container } = render(NavigationMenu, {
                items: linkItems,
                orientation: 'vertical',
                itemActions: actions
            })
            const action = container.querySelector('[data-test-action]')
            expect(action).not.toBeNull()
            expect(action?.closest('a')).toBeNull()
        })

        it('renders actions beside a group label as well as leaf items', () => {
            const items: NavigationMenuItem[] = [
                { label: 'Group', type: 'label' },
                { label: 'Item', href: '/item' }
            ]
            const { container } = render(NavigationMenu, {
                items,
                orientation: 'vertical',
                itemActions: actions
            })
            expect(container.querySelectorAll('[data-test-action]').length).toBe(2)
        })
    })
})
