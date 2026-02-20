import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Select from './Select.svelte'
import type { SelectItemType } from './select.types.js'

const defaultItems: SelectItemType[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' }
]

const getTrigger = () =>
    document.querySelector('button[data-select-trigger]') as HTMLButtonElement | null

const getRootWrapper = () => getTrigger()?.closest('div') as HTMLDivElement | null

describe('Select', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a select trigger element', () => {
            render(Select, { items: defaultItems })
            expect(getTrigger()).not.toBeNull()
        })

        it('should render with placeholder text', async () => {
            render(Select, { items: defaultItems, placeholder: 'Pick a fruit' })
            const placeholder = page.getByText('Pick a fruit')
            await expect.element(placeholder).toBeInTheDocument()
        })

        it('should render with pre-selected value', async () => {
            render(Select, { items: defaultItems, value: 'banana' })
            const label = page.getByText('Banana')
            await expect.element(label).toBeInTheDocument()
        })

        it('should display label when value has a label', async () => {
            render(Select, { items: defaultItems, value: 'apple' })
            const label = page.getByText('Apple')
            await expect.element(label).toBeInTheDocument()
        })

        it('should display value when item has no label', async () => {
            const items: SelectItemType[] = [{ value: 'no-label-item' }]
            render(Select, { items, value: 'no-label-item' })
            const text = page.getByText('no-label-item')
            await expect.element(text).toBeInTheDocument()
        })

        it('should render with id', () => {
            render(Select, { items: defaultItems, id: 'my-select' })
            expect(getTrigger()!.id).toBe('my-select')
        })

        it('should render with name attribute', () => {
            render(Select, { items: defaultItems, name: 'fruit' })
            const trigger = getTrigger()!
            expect(trigger.getAttribute('name')).toBe('fruit')
        })

        it('should render empty when no items provided', () => {
            render(Select, { placeholder: 'Select...' })
            expect(getTrigger()).not.toBeNull()
        })
    })

    // ==================== DROPDOWN INTERACTION ====================

    describe('dropdown interaction', () => {
        it('should open dropdown on click', async () => {
            render(Select, { items: defaultItems, portal: false })
            await page.getByRole('button', { name: '' }).first().click()
            await vi.waitFor(() => {
                const options = document.querySelectorAll('[role="option"]')
                expect(options.length).toBeGreaterThan(0)
            })
        })

        it('should display all items in dropdown', async () => {
            render(Select, { items: defaultItems, open: true, portal: false })
            await vi.waitFor(() => {
                const options = document.querySelectorAll('[role="option"]')
                expect(options.length).toBe(3)
            })
        })

        it('should select an item on click', async () => {
            render(Select, { items: defaultItems, open: true, portal: false })
            await vi.waitFor(async () => {
                const option = page.getByRole('option', { name: 'Banana' })
                await expect.element(option).toBeInTheDocument()
            })
            const option = page.getByRole('option', { name: 'Banana' })
            await option.click()
            const selected = page.getByText('Banana')
            await expect.element(selected).toBeInTheDocument()
        })

        it('should close dropdown after selecting an item', async () => {
            render(Select, { items: defaultItems, open: true, portal: false })
            await vi.waitFor(async () => {
                const option = page.getByRole('option', { name: 'Apple' })
                await expect.element(option).toBeInTheDocument()
            })
            const option = page.getByRole('option', { name: 'Apple' })
            await option.click()
            expect(getTrigger()!.getAttribute('data-state')).toBe('closed')
        })
    })

    // ==================== ITEMS WITH SEPARATOR & LABEL ====================

    describe('items with separator and label', () => {
        it('should render separator', async () => {
            const items: SelectItemType[] = [
                { value: 'a', label: 'A' },
                { type: 'separator' },
                { value: 'b', label: 'B' }
            ]
            render(Select, { items, open: true, portal: false })
            await vi.waitFor(() => {
                const separator = document.querySelector('[role="separator"]')
                expect(separator).toBeTruthy()
            })
        })

        it('should render group label', async () => {
            const items: SelectItemType[] = [
                { type: 'label', label: 'Fruits' },
                { value: 'apple', label: 'Apple' }
            ]
            render(Select, { items, open: true, portal: false })
            await vi.waitFor(async () => {
                const label = page.getByText('Fruits')
                await expect.element(label).toBeInTheDocument()
            })
        })

        it('should render items with description', async () => {
            const items: SelectItemType[] = [
                { value: 'apple', label: 'Apple', description: 'A juicy fruit' }
            ]
            render(Select, { items, open: true, portal: false })
            await vi.waitFor(async () => {
                const desc = page.getByText('A juicy fruit')
                await expect.element(desc).toBeInTheDocument()
            })
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled', () => {
        it('should be disabled when disabled prop is true', () => {
            render(Select, { items: defaultItems, disabled: true })
            expect(getTrigger()!.disabled).toBe(true)
        })

        it('should not be disabled by default', () => {
            render(Select, { items: defaultItems })
            expect(getTrigger()!.disabled).toBe(false)
        })

        it('should not open dropdown when disabled', async () => {
            render(Select, { items: defaultItems, disabled: true, portal: false })
            getTrigger()!.click()
            expect(getTrigger()!.getAttribute('data-state')).toBe('closed')
        })

        it('should render disabled item in dropdown', async () => {
            const items: SelectItemType[] = [
                { value: 'a', label: 'A' },
                { value: 'b', label: 'B', disabled: true },
                { value: 'c', label: 'C' }
            ]
            render(Select, { items, open: true, portal: false })
            await vi.waitFor(() => {
                const disabledOption = document.querySelector('[role="option"][data-disabled]')
                expect(disabledOption).not.toBeNull()
            })
        })
    })

    // ==================== LOADING STATE ====================

    describe('loading', () => {
        it('should render loading icon when loading', async () => {
            render(Select, { items: defaultItems, loading: true })
            const root = getTrigger()!.closest('div')!
            await vi.waitFor(() => {
                expect(root.querySelector('svg')).not.toBeNull()
            })
        })

        it('should apply animate-spin class when loading without leading', async () => {
            render(Select, { items: defaultItems, loading: true })
            const root = getTrigger()!.closest('div')!
            await vi.waitFor(() => {
                const svg = root.querySelector('svg')
                expect(svg).not.toBeNull()
                expect(svg!.getAttribute('class') || '').toMatch(/animate-spin/)
            })
        })

        it('should apply animate-spin class when loading with leadingIcon', async () => {
            render(Select, {
                items: defaultItems,
                loading: true,
                leadingIcon: 'lucide:search'
            })
            const root = getTrigger()!.closest('div')!
            await vi.waitFor(() => {
                const svg = root.querySelector('span:first-child svg')
                expect(svg).not.toBeNull()
                expect(svg!.getAttribute('class') || '').toMatch(/animate-spin/)
            })
        })
    })

    // ==================== VARIANTS ====================

    describe('variants', () => {
        const variants = ['outline', 'soft', 'subtle', 'ghost', 'none'] as const

        for (const variant of variants) {
            it(`should render with variant="${variant}"`, () => {
                render(Select, { items: defaultItems, variant })
                expect(getTrigger()).not.toBeNull()
            })
        }

        it('should apply outline variant ring classes by default', () => {
            render(Select, { items: defaultItems })
            expect(getTrigger()!.className).toMatch(/ring/)
        })

        it('should apply ghost variant transparent background', () => {
            render(Select, { items: defaultItems, variant: 'ghost' })
            expect(getTrigger()!.className).toMatch(/bg-transparent/)
        })

        it('should apply soft variant container background', () => {
            render(Select, { items: defaultItems, variant: 'soft', color: 'primary' })
            expect(getTrigger()!.className).toMatch(/bg-primary-container/)
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
                render(Select, { items: defaultItems, color })
                expect(getTrigger()!.className).toMatch(new RegExp(`ring-${color}`))
            })
        }

        it('should apply surface color', () => {
            render(Select, { items: defaultItems, color: 'surface' })
            expect(getTrigger()!.className).toMatch(/ring-outline/)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size classes', () => {
            render(Select, { items: defaultItems, size: 'xs' })
            expect(getTrigger()!.className).toMatch(/text-xs/)
        })

        it('should apply sm size classes', () => {
            render(Select, { items: defaultItems, size: 'sm' })
            expect(getTrigger()!.className).toMatch(/text-xs/)
        })

        it('should apply md size classes by default', () => {
            render(Select, { items: defaultItems })
            expect(getTrigger()!.className).toMatch(/text-sm/)
        })

        it('should apply lg size classes', () => {
            render(Select, { items: defaultItems, size: 'lg' })
            expect(getTrigger()!.className).toMatch(/text-sm/)
        })

        it('should apply xl size classes', () => {
            render(Select, { items: defaultItems, size: 'xl' })
            expect(getTrigger()!.className).toMatch(/text-base/)
        })

        it('should apply xs padding', () => {
            render(Select, { items: defaultItems, size: 'xs' })
            expect(getTrigger()!.className).toMatch(/px-2/)
        })

        it('should apply xl padding', () => {
            render(Select, { items: defaultItems, size: 'xl' })
            expect(getTrigger()!.className).toMatch(/px-5/)
        })
    })

    // ==================== HIGHLIGHT ====================

    describe('highlight', () => {
        it('should apply highlight ring classes', () => {
            render(Select, { items: defaultItems, highlight: true, color: 'error' })
            expect(getTrigger()!.className).toMatch(/ring-2/)
            expect(getTrigger()!.className).toMatch(/ring-error/)
        })

        it('should not apply highlight by default', () => {
            render(Select, { items: defaultItems })
            const classes = getTrigger()!.className.split(' ')
            expect(classes).not.toContain('ring-2')
        })
    })

    // ==================== ICONS ====================

    describe('icons', () => {
        it('should render trailing icon by default', () => {
            render(Select, { items: defaultItems })
            const root = getRootWrapper()!
            const trailingSpan = root.querySelector('span:last-child') as HTMLElement
            expect(trailingSpan.querySelector('svg')).not.toBeNull()
        })

        it('should render leading icon when leadingIcon is set', () => {
            render(Select, { items: defaultItems, leadingIcon: 'lucide:search' })
            const root = getRootWrapper()!
            const leadingSpan = root.querySelector('span:first-child') as HTMLElement
            expect(leadingSpan).not.toBeNull()
        })

        it('should adjust padding when leading icon is present', () => {
            render(Select, { items: defaultItems, leadingIcon: 'lucide:search' })
            expect(getTrigger()!.className).toMatch(/ps-9/)
        })

        it('should always have trailing padding', () => {
            render(Select, { items: defaultItems })
            expect(getTrigger()!.className).toMatch(/pe-9/)
        })
    })

    // ==================== AVATAR ====================

    describe('avatar', () => {
        it('should render avatar with alt initials as fallback', () => {
            const { container } = render(Select, {
                items: defaultItems,
                avatar: { alt: 'John Doe' }
            })
            expect(container.textContent).toContain('JD')
        })

        it('should apply leading padding when avatar is present', () => {
            render(Select, { items: defaultItems, avatar: { alt: 'User' } })
            expect(getTrigger()!.className).toMatch(/ps-9/)
        })

        it('should render selected item avatar when value is set', () => {
            const items: SelectItemType[] = [
                { value: 'user1', label: 'User One', avatar: { alt: 'Jane Smith' } }
            ]
            const { container } = render(Select, { items, value: 'user1' })
            expect(container.textContent).toContain('JS')
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root element', () => {
            const { container } = render(Select, {
                items: defaultItems,
                class: 'my-custom-class'
            })
            const root = container.querySelector('.my-custom-class')
            expect(root).not.toBeNull()
        })

        it('should apply ui slot override to base', () => {
            render(Select, { items: defaultItems, ui: { base: 'my-base-class' } })
            expect(getTrigger()!.className).toContain('my-base-class')
        })

        it('should apply ui slot override to root', () => {
            const { container } = render(Select, {
                items: defaultItems,
                ui: { root: 'my-root-class' }
            })
            const root = container.querySelector('.my-root-class')
            expect(root).not.toBeNull()
        })

        it('should apply ui slot override to placeholder', () => {
            render(Select, {
                items: defaultItems,
                placeholder: 'Pick',
                ui: { placeholder: 'my-placeholder-class' }
            })
            const placeholderEl = document.querySelector('.my-placeholder-class')
            expect(placeholderEl).not.toBeNull()
        })

        it('should apply ui slot override to value', () => {
            render(Select, {
                items: defaultItems,
                value: 'apple',
                ui: { value: 'my-value-class' }
            })
            const valueEl = document.querySelector('.my-value-class')
            expect(valueEl).not.toBeNull()
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should render trigger with data-select-trigger', () => {
            render(Select, { items: defaultItems })
            expect(getTrigger()).not.toBeNull()
        })

        it('should set data-state="closed" when closed', () => {
            render(Select, { items: defaultItems })
            expect(getTrigger()!.getAttribute('data-state')).toBe('closed')
        })

        it('should have aria-expanded="false" when closed', () => {
            render(Select, { items: defaultItems })
            expect(getTrigger()!.getAttribute('aria-expanded')).toBe('false')
        })

        it('should have aria-haspopup="listbox"', () => {
            render(Select, { items: defaultItems })
            expect(getTrigger()!.getAttribute('aria-haspopup')).toBe('listbox')
        })

        it('should set aria-invalid when highlight is true', () => {
            render(Select, { items: defaultItems, highlight: true })
            expect(getTrigger()!.getAttribute('aria-invalid')).toBe('true')
        })

        it('should not set aria-invalid by default', () => {
            render(Select, { items: defaultItems })
            expect(getTrigger()!.getAttribute('aria-invalid')).toBeNull()
        })

        it('should render without errors when required is true', () => {
            render(Select, { items: defaultItems, required: true })
            expect(getTrigger()).not.toBeNull()
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with value, placeholder, and disabled', async () => {
            render(Select, {
                items: defaultItems,
                value: 'cherry',
                placeholder: 'Pick',
                disabled: true
            })
            const selected = page.getByText('Cherry')
            await expect.element(selected).toBeInTheDocument()
            expect(getTrigger()!.disabled).toBe(true)
        })

        it('should render with variant, color, and size combined', () => {
            render(Select, {
                items: defaultItems,
                variant: 'soft',
                color: 'success',
                size: 'xl'
            })
            const trigger = getTrigger()!
            expect(trigger.className).toMatch(/bg-success-container/)
            expect(trigger.className).toMatch(/text-base/)
        })

        it('should render with highlight and error color', () => {
            render(Select, {
                items: defaultItems,
                highlight: true,
                color: 'error'
            })
            const trigger = getTrigger()!
            expect(trigger.className).toMatch(/ring-2/)
            expect(trigger.className).toMatch(/ring-error/)
        })

        it('should render with all props combined', async () => {
            render(Select, {
                items: defaultItems,
                value: 'apple',
                color: 'error',
                size: 'lg',
                variant: 'outline',
                highlight: true,
                id: 'full-select',
                name: 'full-fruit'
            })
            const trigger = getTrigger()!
            expect(trigger.id).toBe('full-select')
            expect(trigger.className).toMatch(/ring-error/)
            expect(trigger.className).toMatch(/text-sm/)
            const label = page.getByText('Apple')
            await expect.element(label).toBeInTheDocument()
        })
    })
})
