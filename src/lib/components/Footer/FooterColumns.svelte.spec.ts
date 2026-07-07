import { page } from 'vitest/browser'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import FooterColumns from './FooterColumns.svelte'
import type { FooterColumn } from './footer-columns.types.js'

const columns: FooterColumn[] = [
    {
        label: 'Product',
        children: [
            { label: 'Components', href: '/components' },
            { label: 'Roadmap', href: '/roadmap' }
        ]
    },
    {
        label: 'Community',
        children: [
            { label: 'GitHub', href: 'https://github.com', target: '_blank' },
            {
                label: 'Discord',
                href: 'https://discord.com',
                target: '_blank',
                icon: 'lucide:message-circle'
            }
        ]
    }
]

describe('FooterColumns', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render as nav by default', async () => {
            const { container } = render(FooterColumns, { columns })
            expect(container.firstElementChild!.tagName).toBe('NAV')
        })

        it('should render as div via as prop', async () => {
            const { container } = render(FooterColumns, { columns, as: 'div' })
            expect(container.firstElementChild!.tagName).toBe('DIV')
        })

        it('should render nothing inside without columns', async () => {
            const { container } = render(FooterColumns, {})
            expect(container.firstElementChild!.childElementCount).toBe(0)
        })

        it('should render one section per column with its heading', async () => {
            const { container } = render(FooterColumns, { columns })
            expect(container.textContent).toContain('Product')
            expect(container.textContent).toContain('Community')
            expect(container.querySelectorAll('ul').length).toBe(2)
        })
    })

    // ==================== LINKS ====================

    describe('links', () => {
        it('should render links with href and label', async () => {
            const { container } = render(FooterColumns, { columns })
            const link = container.querySelector('a[href="/components"]')
            expect(link).not.toBeNull()
            expect(link!.textContent).toContain('Components')
        })

        it('should render links inside list items', async () => {
            const { container } = render(FooterColumns, { columns })
            expect(container.querySelectorAll('li').length).toBe(4)
            expect(container.querySelectorAll('li a').length).toBe(4)
        })

        it('should forward target blank so the external indicator condition holds', async () => {
            const { container } = render(FooterColumns, { columns })
            expect(container.querySelectorAll('a[target="_blank"]').length).toBe(2)
            const internal = container.querySelector('a[href="/components"]')!
            expect(internal.getAttribute('target')).toBeNull()
        })

        it('should render links with icons without error', async () => {
            const { container } = render(FooterColumns, { columns })
            const discord = container.querySelector('a[href="https://discord.com"]')!
            expect(discord.textContent).toContain('Discord')
        })

        it('should forward extra link props to the anchor', async () => {
            const { container } = render(FooterColumns, {
                columns: [
                    {
                        label: 'Meta',
                        children: [{ label: 'Terms', href: '/terms', rel: 'nofollow' }]
                    }
                ]
            })
            const link = container.querySelector('a[href="/terms"]')!
            expect(link.getAttribute('rel')).toContain('nofollow')
        })
    })

    // ==================== SNIPPET OVERRIDES ====================

    describe('snippet overrides', () => {
        it('should render columnLabel snippet instead of default heading', async () => {
            render(FooterColumns, {
                columns,
                columnLabel: createRawSnippet<[{ column: FooterColumn }]>((args) => ({
                    render: () => `<h3 data-testid="custom-label">${args().column.label}!</h3>`,
                    setup: () => {}
                }))
            })
            const labels = document.querySelectorAll('[data-testid="custom-label"]')
            expect(labels.length).toBe(2)
            expect(labels[0].textContent).toBe('Product!')
        })

        it('should render link snippet instead of default Link', async () => {
            const { container } = render(FooterColumns, {
                columns,
                link: createRawSnippet((args: () => { link: { label: string } }) => ({
                    render: () => `<span data-testid="custom-link">${args().link.label}</span>`,
                    setup: () => {}
                }))
            })
            expect(container.querySelectorAll('[data-testid="custom-link"]').length).toBe(4)
            expect(container.querySelector('a')).toBeNull()
        })

        it('should render left and right sections beside the columns', async () => {
            const { container } = render(FooterColumns, {
                columns,
                left: createRawSnippet(() => ({
                    render: () => '<div data-testid="cols-left">About</div>',
                    setup: () => {}
                })),
                right: createRawSnippet(() => ({
                    render: () => '<div data-testid="cols-right">Newsletter</div>',
                    setup: () => {}
                }))
            })
            expect(container.querySelector('[data-testid="cols-left"]')).not.toBeNull()
            expect(container.querySelector('[data-testid="cols-right"]')).not.toBeNull()
        })

        it('should style links by active state', async () => {
            const { container } = render(FooterColumns, {
                columns: [
                    {
                        label: 'Nav',
                        children: [
                            { label: 'Current', href: '/current', active: true },
                            { label: 'Other', href: '/other', active: false }
                        ]
                    }
                ]
            })
            const current = container.querySelector('a[href="/current"]')!
            const other = container.querySelector('a[href="/other"]')!
            expect(current.className).toContain('text-primary')
            expect(other.className).toContain('text-on-surface-variant')
        })

        it('should render children after the columns', async () => {
            const { container } = render(FooterColumns, {
                columns,
                children: createRawSnippet(() => ({
                    render: () => '<div data-testid="extra">Newsletter</div>',
                    setup: () => {}
                }))
            })
            expect(container.querySelector('[data-testid="extra"]')).not.toBeNull()
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class and ui overrides', () => {
        it('should apply custom class and grid base to root', async () => {
            const { container } = render(FooterColumns, { columns, class: 'my-columns' })
            const root = page.elementLocator(container.firstElementChild!)
            await expect.element(root).toHaveClass(/my-columns/)
            await expect.element(root).toHaveClass(/grid/)
        })

        it('should apply ui.label and ui.list classes', async () => {
            const { container } = render(FooterColumns, {
                columns,
                ui: { label: 'custom-label-class', list: 'custom-list' }
            })
            expect(container.querySelectorAll('.custom-label-class').length).toBe(2)
            expect(container.querySelectorAll('.custom-list').length).toBe(2)
        })
    })

    // ==================== NATIVE ATTRIBUTES ====================

    describe('native attributes', () => {
        it('should pass through native attributes', async () => {
            const { container } = render(FooterColumns, {
                columns,
                'aria-label': 'Footer navigation',
                'data-testid': 'columns-root'
            })
            const root = container.firstElementChild!
            expect(root.getAttribute('aria-label')).toBe('Footer navigation')
            expect(root.getAttribute('data-testid')).toBe('columns-root')
        })
    })
})
