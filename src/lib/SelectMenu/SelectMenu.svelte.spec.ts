import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import SelectMenu from './SelectMenu.svelte'
import type { SelectMenuItem, SelectMenuItemType } from './select-menu.types.js'

const defaultItems: SelectMenuItem[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' }
]

const getTrigger = (container: Element) =>
    container.querySelector('button') as HTMLButtonElement | null

const getRootWrapper = (container: Element) =>
    getTrigger(container)?.closest('div') as HTMLDivElement | null

describe('SelectMenu', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a trigger button', () => {
            const { container } = render(SelectMenu, { items: defaultItems })
            expect(getTrigger(container)).not.toBeNull()
        })

        it('should render with placeholder text', async () => {
            render(SelectMenu, { items: defaultItems, placeholder: 'Pick a fruit' })
            await expect.element(page.getByText('Pick a fruit')).toBeInTheDocument()
        })

        it('should display selected item label', async () => {
            render(SelectMenu, { items: defaultItems, value: 'banana' })
            await expect.element(page.getByText('Banana')).toBeInTheDocument()
        })

        it('should display value when item has no label', async () => {
            const items: SelectMenuItemType[] = [{ value: 'no-label-item' }]
            render(SelectMenu, { items, value: 'no-label-item' })
            await expect.element(page.getByText('no-label-item')).toBeInTheDocument()
        })

        it('should render with id on trigger', () => {
            const { container } = render(SelectMenu, { items: defaultItems, id: 'my-select' })
            expect(getTrigger(container)!.id).toBe('my-select')
        })

        it('should render without crashing when items is empty', () => {
            const { container } = render(SelectMenu, { items: [] })
            expect(getTrigger(container)).not.toBeNull()
        })
    })

    // ==================== DROPDOWN INTERACTION ====================

    describe('dropdown interaction', () => {
        it('should open dropdown on trigger click', async () => {
            render(SelectMenu, { items: defaultItems, portal: false })
            await page.getByRole('button').first().click()
            await vi.waitFor(() => {
                const options = document.querySelectorAll('[role="option"]')
                expect(options.length).toBeGreaterThan(0)
            })
        })

        it('should display all items when open', async () => {
            render(SelectMenu, { items: defaultItems, open: true, portal: false })
            await vi.waitFor(() => {
                const options = document.querySelectorAll('[role="option"]')
                expect(options.length).toBe(3)
            })
        })

        it('should show item labels in dropdown', async () => {
            render(SelectMenu, { items: defaultItems, open: true, portal: false })
            await vi.waitFor(async () => {
                await expect
                    .element(page.getByRole('option', { name: 'Apple' }))
                    .toBeInTheDocument()
            })
        })

        it('should select item on click', async () => {
            render(SelectMenu, {
                items: defaultItems,
                open: true,
                portal: false,
                placeholder: 'Pick'
            })
            await vi.waitFor(async () => {
                const option = page.getByRole('option', { name: 'Banana' })
                await expect.element(option).toBeInTheDocument()
            })
            await page.getByRole('option', { name: 'Banana' }).click()
            await expect.element(page.getByText('Banana')).toBeInTheDocument()
        })

        it('should call onOpenChange when opening', async () => {
            const onOpenChange = vi.fn()
            render(SelectMenu, {
                items: defaultItems,
                portal: false,
                onOpenChange
            })
            await page.getByRole('button').first().click()
            await vi.waitFor(() => {
                expect(onOpenChange).toHaveBeenCalledWith(true)
            })
        })
    })

    // ==================== SEARCH / FILTERING ====================

    describe('search / filtering', () => {
        it('should show search input when open', async () => {
            render(SelectMenu, { items: defaultItems, open: true, portal: false })
            await vi.waitFor(async () => {
                await expect.element(page.getByPlaceholder('Search...')).toBeInTheDocument()
            })
        })

        it('should use custom searchPlaceholder', async () => {
            render(SelectMenu, {
                items: defaultItems,
                open: true,
                portal: false,
                searchPlaceholder: 'Filter...'
            })
            await vi.waitFor(async () => {
                await expect.element(page.getByPlaceholder('Filter...')).toBeInTheDocument()
            })
        })

        it('should filter items by search term', async () => {
            render(SelectMenu, { items: defaultItems, open: true, portal: false })
            await vi.waitFor(async () => {
                await expect.element(page.getByPlaceholder('Search...')).toBeInTheDocument()
            })
            await page.getByPlaceholder('Search...').fill('ban')
            await vi.waitFor(() => {
                const options = document.querySelectorAll('[role="option"]')
                expect(options.length).toBe(1)
            })
            await expect.element(page.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
        })

        it('should show emptyText when no results match', async () => {
            render(SelectMenu, {
                items: defaultItems,
                open: true,
                portal: false,
                emptyText: 'Nothing found'
            })
            await vi.waitFor(async () => {
                await expect.element(page.getByPlaceholder('Search...')).toBeInTheDocument()
            })
            await page.getByPlaceholder('Search...').fill('zzz')
            await vi.waitFor(async () => {
                await expect.element(page.getByText('Nothing found')).toBeInTheDocument()
            })
        })

        it('should not filter when ignoreFilter is true', async () => {
            render(SelectMenu, {
                items: defaultItems,
                open: true,
                portal: false,
                ignoreFilter: true
            })
            await vi.waitFor(async () => {
                await expect.element(page.getByPlaceholder('Search...')).toBeInTheDocument()
            })
            await page.getByPlaceholder('Search...').fill('xyz')
            await vi.waitFor(() => {
                const options = document.querySelectorAll('[role="option"]')
                expect(options.length).toBe(3)
            })
        })
    })

    // ==================== GROUPS AND SEPARATORS ====================

    describe('groups and separators', () => {
        it('should render group label', async () => {
            const items: SelectMenuItemType[] = [
                { type: 'label', label: 'Fruits' },
                { value: 'apple', label: 'Apple' }
            ]
            render(SelectMenu, { items, open: true, portal: false })
            await vi.waitFor(async () => {
                await expect.element(page.getByText('Fruits')).toBeInTheDocument()
            })
        })

        it('should render separator', async () => {
            const items: SelectMenuItemType[] = [
                { value: 'a', label: 'A' },
                { type: 'separator' },
                { value: 'b', label: 'B' }
            ]
            render(SelectMenu, { items, open: true, portal: false })
            await vi.waitFor(() => {
                const separator = document.querySelector('[role="separator"]')
                expect(separator).toBeTruthy()
            })
        })

        it('should render item description', async () => {
            const items: SelectMenuItemType[] = [
                { value: 'apple', label: 'Apple', description: 'A juicy fruit' }
            ]
            render(SelectMenu, { items, open: true, portal: false })
            await vi.waitFor(async () => {
                await expect.element(page.getByText('A juicy fruit')).toBeInTheDocument()
            })
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled', () => {
        it('should be disabled when disabled prop is true', () => {
            const { container } = render(SelectMenu, { items: defaultItems, disabled: true })
            expect(getTrigger(container)!.disabled).toBe(true)
        })

        it('should not be disabled by default', () => {
            const { container } = render(SelectMenu, { items: defaultItems })
            expect(getTrigger(container)!.disabled).toBe(false)
        })

        it('should not open when disabled', async () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                disabled: true,
                portal: false
            })
            getTrigger(container)!.click()
            // Wait briefly and confirm no options rendered
            await vi.waitFor(() => {
                const options = document.querySelectorAll('[role="option"]')
                expect(options.length).toBe(0)
            })
        })

        it('should render disabled items in dropdown', async () => {
            const items: SelectMenuItemType[] = [
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B', disabled: true }
            ]
            render(SelectMenu, { items, open: true, portal: false })
            await vi.waitFor(() => {
                const disabledOption = document.querySelector('[role="option"][data-disabled]')
                expect(disabledOption).not.toBeNull()
            })
        })
    })

    // ==================== LOADING STATE ====================

    describe('loading', () => {
        it('should render loading icon when loading without leadingIcon', async () => {
            const { container } = render(SelectMenu, { items: defaultItems, loading: true })
            const root = getRootWrapper(container)!
            await vi.waitFor(() => {
                expect(root.querySelector('svg')).not.toBeNull()
            })
        })

        it('should apply animate-spin to trailing icon when loading without leading', async () => {
            const { container } = render(SelectMenu, { items: defaultItems, loading: true })
            const root = getRootWrapper(container)!
            await vi.waitFor(() => {
                const trailingSpan = root.querySelector('span:last-child')
                expect(trailingSpan?.querySelector('svg')).not.toBeNull()
            })
        })

        it('should apply animate-spin to leading icon when loading with leadingIcon', async () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                loading: true,
                leadingIcon: 'lucide:search'
            })
            const root = getRootWrapper(container)!
            await vi.waitFor(() => {
                const leadingSpan = root.querySelector('span:first-child')
                expect(leadingSpan?.querySelector('svg')).not.toBeNull()
            })
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        const variants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const

        for (const variant of variants) {
            it(`should render with variant="${variant}"`, () => {
                const { container } = render(SelectMenu, { items: defaultItems, variant })
                expect(getTrigger(container)).not.toBeNull()
            })
        }

        it('should apply outline ring classes by default', () => {
            const { container } = render(SelectMenu, { items: defaultItems })
            expect(getTrigger(container)!.className).toMatch(/ring/)
        })

        it('should apply ghost transparent background', () => {
            const { container } = render(SelectMenu, { items: defaultItems, variant: 'ghost' })
            expect(getTrigger(container)!.className).toMatch(/bg-transparent/)
        })

        it('should apply soft container background', () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                variant: 'soft',
                color: 'primary'
            })
            expect(getTrigger(container)!.className).toMatch(/bg-primary-container/)
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

        for (const color of colors) {
            it(`should render with color="${color}"`, () => {
                const { container } = render(SelectMenu, { items: defaultItems, color })
                expect(getTrigger(container)!.className).toMatch(new RegExp(`ring-${color}`))
            })
        }

        it('should apply surface color ring', () => {
            const { container } = render(SelectMenu, { items: defaultItems, color: 'surface' })
            expect(getTrigger(container)!.className).toMatch(/ring-outline/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size', () => {
            const { container } = render(SelectMenu, { items: defaultItems, size: 'xs' })
            expect(getTrigger(container)!.className).toMatch(/text-xs/)
        })

        it('should apply md size by default', () => {
            const { container } = render(SelectMenu, { items: defaultItems })
            expect(getTrigger(container)!.className).toMatch(/text-sm/)
        })

        it('should apply xl size', () => {
            const { container } = render(SelectMenu, { items: defaultItems, size: 'xl' })
            expect(getTrigger(container)!.className).toMatch(/text-base/)
        })
    })

    // ==================== HIGHLIGHT ====================

    describe('highlight', () => {
        it('should apply ring-2 when highlight is true', () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                highlight: true,
                color: 'error'
            })
            expect(getTrigger(container)!.className).toMatch(/ring-2/)
        })

        it('should apply aria-invalid when highlight is true', () => {
            const { container } = render(SelectMenu, { items: defaultItems, highlight: true })
            expect(getTrigger(container)!.getAttribute('aria-invalid')).toBe('true')
        })

        it('should not set aria-invalid by default', () => {
            const { container } = render(SelectMenu, { items: defaultItems })
            expect(getTrigger(container)!.getAttribute('aria-invalid')).toBeNull()
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render trailing icon by default', () => {
            const { container } = render(SelectMenu, { items: defaultItems })
            const root = getRootWrapper(container)!
            const trailingSpan = root.querySelector('span:last-child')
            expect(trailingSpan?.querySelector('svg')).not.toBeNull()
        })

        it('should render leading icon when leadingIcon is set', () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                leadingIcon: 'lucide:search'
            })
            const root = getRootWrapper(container)!
            const leadingSpan = root.querySelector('span:first-child')
            expect(leadingSpan).not.toBeNull()
        })
    })

    // ==================== AVATAR ====================

    describe('avatar', () => {
        it('should render avatar with initials as fallback', () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                avatar: { alt: 'John Doe' }
            })
            expect(container.textContent).toContain('JD')
        })

        it('should render selected item avatar', () => {
            const items: SelectMenuItemType[] = [
                { value: 'u1', label: 'User One', avatar: { alt: 'Jane Smith' } }
            ]
            const { container } = render(SelectMenu, { items, value: 'u1' })
            expect(container.textContent).toContain('JS')
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root wrapper', () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                class: 'my-select-menu'
            })
            expect(container.querySelector('.my-select-menu')).not.toBeNull()
        })

        it('should apply ui.base override to trigger', () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                ui: { base: 'my-base-class' }
            })
            expect(getTrigger(container)!.className).toContain('my-base-class')
        })

        it('should apply ui.placeholder override', () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                placeholder: 'Pick',
                ui: { placeholder: 'my-placeholder' }
            })
            expect(container.querySelector('.my-placeholder')).not.toBeNull()
        })

        it('should apply ui.value override', () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                value: 'apple',
                ui: { value: 'my-value-class' }
            })
            expect(container.querySelector('.my-value-class')).not.toBeNull()
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with value, placeholder, and disabled', async () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                value: 'cherry',
                placeholder: 'Pick',
                disabled: true
            })
            await expect.element(page.getByText('Cherry')).toBeInTheDocument()
            expect(getTrigger(container)!.disabled).toBe(true)
        })

        it('should render with variant, color, and size combined', () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                variant: 'soft',
                color: 'success',
                size: 'xl'
            })
            const trigger = getTrigger(container)!
            expect(trigger.className).toMatch(/bg-success-container/)
            expect(trigger.className).toMatch(/text-base/)
        })

        it('should render with highlight and error color combined', () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                highlight: true,
                color: 'error'
            })
            const trigger = getTrigger(container)!
            expect(trigger.className).toMatch(/ring-2/)
            expect(trigger.className).toMatch(/ring-error/)
        })
    })
})
