import { page } from 'vitest/browser'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import SelectMenu from './SelectMenu.svelte'
import SelectMenuFormFieldTestWrapper from './SelectMenuFormFieldTestWrapper.svelte'
import type { SelectMenuItem, SelectMenuItemType } from './select-menu.types.js'

const defaultItems: SelectMenuItem[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' }
]

const getTrigger = (container: Element) =>
    container.querySelector('[data-combobox-trigger]') as HTMLElement | null

const getRootWrapper = (container: Element) =>
    getTrigger(container)?.parentElement as HTMLDivElement | null

describe('SelectMenu form submission, #255', () => {
    const forms: HTMLFormElement[] = []

    const makeForm = () => {
        const form = document.createElement('form')
        document.body.append(form)
        forms.push(form)
        return form
    }

    const renderInForm = (props: Record<string, unknown>) => {
        const form = makeForm()
        render(SelectMenu, { target: form, props: { items: defaultItems, ...props } })
        return form
    }

    const submitted = (form: HTMLFormElement) => new FormData(form).getAll('fruit')

    afterEach(() => {
        forms.splice(0).forEach((form) => form.remove())
    })

    it('submits the selected value', () => {
        const form = renderInForm({ name: 'fruit', value: 'banana' })
        expect(submitted(form)).toEqual(['banana'])
    })

    it('submits one entry per selected value with multiple', () => {
        const form = renderInForm({ name: 'fruit', multiple: true, value: ['apple', 'cherry'] })
        expect(submitted(form)).toEqual(['apple', 'cherry'])
    })

    it('submits an empty string when nothing is selected', () => {
        const form = renderInForm({ name: 'fruit' })
        expect(submitted(form)).toEqual([''])
    })

    it('submits nothing when nothing is selected with multiple', () => {
        const form = renderInForm({ name: 'fruit', multiple: true })
        expect(submitted(form)).toEqual([])
    })

    it('does not submit while disabled', () => {
        const form = renderInForm({ name: 'fruit', value: 'banana', disabled: true })
        expect(submitted(form)).toEqual([])
    })

    it('renders no named input without a name', () => {
        const form = renderInForm({ value: 'banana' })
        expect(form.querySelector('input[name]')).toBeNull()
    })

    it('submits the option the user picks', async () => {
        const form = renderInForm({ name: 'fruit', value: 'apple', open: true, portal: false })
        await page.getByRole('option', { name: 'Cherry' }).click()
        await vi.waitFor(() => expect(submitted(form)).toEqual(['cherry']))
    })

    it('blocks native submission while required and empty', () => {
        expect(renderInForm({ name: 'fruit', required: true }).checkValidity()).toBe(false)
    })

    it('passes native validation while required and filled', () => {
        const form = renderInForm({ name: 'fruit', required: true, value: 'banana' })
        expect(form.checkValidity()).toBe(true)
    })

    it('moves focus to the combobox when native validation fails', async () => {
        const form = renderInForm({ name: 'fruit', required: true })
        form.requestSubmit()
        await vi.waitFor(() =>
            expect(document.activeElement).toBe(form.querySelector('input[role="combobox"]'))
        )
    })

    it('clears the selection on form reset', async () => {
        const form = renderInForm({ name: 'fruit', value: 'banana' })
        form.reset()
        await vi.waitFor(() => expect(submitted(form)).toEqual(['']))
        await vi.waitFor(() => expect(getTrigger(form)!.textContent).not.toContain('Banana'))
    })

    it('keeps inputs inside the root so the root stays the last child of its parent', () => {
        const form = renderInForm({ name: 'fruit', value: 'banana' })
        expect(form.lastElementChild).toBe(getRootWrapper(form))
    })

    it('keeps multiple inputs inside the root as well', () => {
        const form = renderInForm({ name: 'fruit', multiple: true, value: ['apple', 'cherry'] })
        expect(form.lastElementChild).toBe(getRootWrapper(form))
    })

    it('follows a value changed from outside', async () => {
        const form = makeForm()
        const { rerender } = render(SelectMenu, {
            target: form,
            props: { items: defaultItems, name: 'fruit', value: 'apple' }
        })
        await rerender({ value: 'cherry' })
        await vi.waitFor(() => expect(submitted(form)).toEqual(['cherry']))
    })

    it('follows values changed from outside with multiple', async () => {
        const form = makeForm()
        const { rerender } = render(SelectMenu, {
            target: form,
            props: { items: defaultItems, name: 'fruit', multiple: true, value: ['apple'] }
        })
        await rerender({ value: ['apple', 'cherry'] })
        await vi.waitFor(() => expect(submitted(form)).toEqual(['apple', 'cherry']))
    })

    it('blocks native submission while required and empty with multiple', () => {
        const form = renderInForm({ name: 'fruit', required: true, multiple: true })
        expect(form.checkValidity()).toBe(false)
    })

    it('passes native validation while required and filled with multiple', () => {
        const form = renderInForm({
            name: 'fruit',
            required: true,
            multiple: true,
            value: ['apple']
        })
        expect(form.checkValidity()).toBe(true)
    })

    it('clears the selection on form reset with multiple', async () => {
        const form = renderInForm({ name: 'fruit', multiple: true, value: ['apple', 'cherry'] })
        form.reset()
        await vi.waitFor(() => expect(submitted(form)).toEqual([]))
        await vi.waitFor(() => expect(getTrigger(form)!.textContent).not.toContain('Apple'))
    })

    it('submits an item created by the user', async () => {
        const form = renderInForm({ name: 'fruit', createItem: true, open: true, portal: false })
        await page
            .getByPlaceholder(/search/i)
            .first()
            .fill('mango')
        await page.getByRole('option', { name: /Create "mango"/ }).click()
        await vi.waitFor(() => expect(submitted(form)).toEqual(['mango']))
    })

    it('does not submit a value passed in that is not one of the items', () => {
        const form = renderInForm({ name: 'fruit', value: 'not-an-item' })
        expect(submitted(form)).toEqual([''])
    })

    it('fails native validation while required and only an unknown value is set', () => {
        const form = renderInForm({ name: 'fruit', value: 'not-an-item', required: true })
        expect(form.checkValidity()).toBe(false)
    })

    it('submits only the values that are items with multiple', () => {
        const form = renderInForm({
            name: 'fruit',
            multiple: true,
            value: ['apple', 'not-an-item']
        })
        expect(submitted(form)).toEqual(['apple'])
    })

    it('submits the value once the items include it', async () => {
        const form = makeForm()
        const { rerender } = render(SelectMenu, {
            target: form,
            props: { name: 'fruit', items: [], value: 'banana' }
        })
        expect(submitted(form)).toEqual([''])
        await rerender({ items: defaultItems })
        await vi.waitFor(() => expect(submitted(form)).toEqual(['banana']))
    })

    it('rejects a value that is not one of the items', async () => {
        const form = renderInForm({ name: 'fruit', value: 'banana' })
        const input = form.querySelector<HTMLInputElement>('input[name="fruit"]')!
        input.value = 'not-an-item'
        input.dispatchEvent(new Event('input', { bubbles: true }))
        await vi.waitFor(() => expect(submitted(form)).toEqual(['banana']))
        expect(getTrigger(form)!.textContent).toContain('Banana')
    })

    it('opts every text input out of browser autofill', () => {
        for (const props of [{}, { multiple: true }]) {
            const form = renderInForm({ name: 'fruit', ...props })
            const input = form.querySelector<HTMLInputElement>(
                'input:not([type="hidden"]):not([role="combobox"])'
            )!
            expect(input.autocomplete).toBe('off')
        }
    })
})

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
            const { container } = render(SelectMenu, { items: defaultItems, portal: false })
            getTrigger(container)!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
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
            const { container } = render(SelectMenu, {
                items: defaultItems,
                portal: false,
                onOpenChange
            })
            getTrigger(container)!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
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
            expect(getTrigger(container)!.hasAttribute('disabled')).toBe(true)
        })

        it('should not be disabled by default', () => {
            const { container } = render(SelectMenu, { items: defaultItems })
            expect(getTrigger(container)!.hasAttribute('disabled')).toBe(false)
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
            expect(getTrigger(container)!.hasAttribute('disabled')).toBe(true)
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

    // ==================== MULTIPLE ====================

    describe('multiple', () => {
        it('should display comma-separated labels when multiple values selected', async () => {
            render(SelectMenu, {
                items: defaultItems,
                multiple: true,
                value: ['apple', 'banana']
            })
            await expect.element(page.getByText('Apple, Banana')).toBeInTheDocument()
        })

        it('should use custom separator when provided', async () => {
            render(SelectMenu, {
                items: defaultItems,
                multiple: true,
                value: ['apple', 'cherry'],
                separator: ' / '
            })
            await expect.element(page.getByText('Apple / Cherry')).toBeInTheDocument()
        })

        it('should show placeholder when no values are selected', async () => {
            render(SelectMenu, {
                items: defaultItems,
                multiple: true,
                value: [],
                placeholder: 'Pick fruits'
            })
            await expect.element(page.getByText('Pick fruits')).toBeInTheDocument()
        })

        it('should keep dropdown open after selecting an item', async () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                multiple: true,
                value: [],
                open: true,
                portal: false
            })
            await vi.waitFor(async () => {
                const option = page.getByRole('option', { name: 'Apple' })
                await expect.element(option).toBeInTheDocument()
            })
            await page.getByRole('option', { name: 'Apple' }).click()
            expect(getTrigger(container)!.getAttribute('data-state')).toBe('open')
        })

        it('should mark all selected items in dropdown', async () => {
            render(SelectMenu, {
                items: defaultItems,
                multiple: true,
                value: ['apple', 'cherry'],
                open: true,
                portal: false
            })
            await vi.waitFor(() => {
                const selected = document.querySelectorAll('[role="option"][data-selected]')
                expect(selected.length).toBe(2)
            })
        })
    })

    // ==================== CREATE ITEM ====================

    describe('createItem', () => {
        const findCreateOption = (
            predicate: (txt: string) => boolean = (t) => /^Create\s+"/.test(t)
        ) =>
            Array.from(document.querySelectorAll('[role="option"]')).find((el) =>
                predicate((el.textContent ?? '').trim())
            ) as HTMLElement | undefined

        const typeSearch = (value: string) => {
            const input = Array.from(document.querySelectorAll('input')).find(
                (i) => i.type === 'text' && !i.hasAttribute('data-combobox-input')
            ) as HTMLInputElement | undefined
            if (!input) throw new Error('Search input not found')
            input.focus()
            input.value = value
            input.dispatchEvent(new Event('input', { bubbles: true }))
        }

        it('should not show create option when createItem is false', async () => {
            render(SelectMenu, { items: defaultItems, open: true, portal: false })
            typeSearch('mango')
            await vi.waitFor(() => {
                expect(findCreateOption()).toBeUndefined()
            })
        })

        it('should show create option when no item matches (lazy mode)', async () => {
            render(SelectMenu, {
                items: defaultItems,
                createItem: true,
                open: true,
                portal: false
            })
            typeSearch('mango')
            await vi.waitFor(() => {
                expect(findCreateOption()?.textContent).toContain('Create "mango"')
            })
        })

        it('should hide create option when search exactly matches an existing item', async () => {
            render(SelectMenu, {
                items: defaultItems,
                createItem: true,
                open: true,
                portal: false
            })
            typeSearch('Apple')
            await vi.waitFor(() => {
                expect(findCreateOption()).toBeUndefined()
            })
        })

        it("should always show create option in 'always' mode even with matches", async () => {
            render(SelectMenu, {
                items: defaultItems,
                createItem: 'always',
                open: true,
                portal: false
            })
            typeSearch('app')
            await vi.waitFor(() => {
                expect(findCreateOption()?.textContent).toContain('Create "app"')
            })
        })

        it('should call onCreate callback with the trimmed value', async () => {
            const onCreate = vi.fn()
            render(SelectMenu, {
                items: defaultItems,
                createItem: true,
                onCreate,
                open: true,
                portal: false
            })
            typeSearch('  mango  ')
            await vi.waitFor(() => {
                expect(findCreateOption()).toBeDefined()
            })
            await page.getByRole('option', { name: /Create "mango"/ }).click()
            await vi.waitFor(() => {
                expect(onCreate).toHaveBeenCalledWith('mango')
            })
        })

        it('should append to value in multiple mode and keep dropdown open', async () => {
            const { container } = render(SelectMenu, {
                items: defaultItems,
                multiple: true,
                value: ['apple'],
                createItem: true,
                open: true,
                portal: false
            })
            typeSearch('mango')
            await vi.waitFor(() => {
                expect(findCreateOption()).toBeDefined()
            })
            await page.getByRole('option', { name: /Create "mango"/ }).click()
            const trigger = container.querySelector('[data-combobox-trigger]') as HTMLElement
            expect(trigger.getAttribute('data-state')).toBe('open')
        })

        it('should render custom createItemLabel from function', async () => {
            render(SelectMenu, {
                items: defaultItems,
                createItem: true,
                createItemLabel: (v: string) => `Add ${v} now`,
                open: true,
                portal: false
            })
            typeSearch('mango')
            await vi.waitFor(() => {
                expect(findCreateOption((t) => /Add mango now/.test(t))).toBeDefined()
            })
        })

        it('should hide empty state when create option is shown', async () => {
            render(SelectMenu, {
                items: defaultItems,
                createItem: true,
                emptyText: 'No results found.',
                open: true,
                portal: false
            })
            typeSearch('mango')
            await vi.waitFor(() => {
                expect(findCreateOption()).toBeDefined()
            })
            expect(document.body.textContent).not.toContain('No results found.')
        })

        it('should not fire onCreate twice for the same value in always mode', async () => {
            const onCreate = vi.fn()
            render(SelectMenu, {
                items: defaultItems,
                multiple: true,
                value: [],
                createItem: 'always',
                onCreate,
                open: true,
                portal: false
            })

            typeSearch('mango')
            await vi.waitFor(() => {
                expect(findCreateOption()).toBeDefined()
            })
            await page.getByRole('option', { name: /Create "mango"/ }).click()
            await vi.waitFor(() => {
                expect(onCreate).toHaveBeenCalledTimes(1)
            })

            typeSearch('mango')
            await vi.waitFor(() => {
                expect(findCreateOption()).toBeDefined()
            })
            await page.getByRole('option', { name: /Create "mango"/ }).click()
            await new Promise((r) => setTimeout(r, 50))
            expect(onCreate).toHaveBeenCalledTimes(1)
        })

        it('should create on Enter from search input', async () => {
            const onCreate = vi.fn()
            render(SelectMenu, {
                items: defaultItems,
                createItem: true,
                onCreate,
                open: true,
                portal: false
            })
            const input = Array.from(document.querySelectorAll('input')).find(
                (i) => i.type === 'text' && !i.hasAttribute('data-combobox-input')
            ) as HTMLInputElement
            input.focus()
            input.value = 'mango'
            input.dispatchEvent(new Event('input', { bubbles: true }))
            await vi.waitFor(() => {
                expect(findCreateOption()).toBeDefined()
            })
            input.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
            )
            await vi.waitFor(() => {
                expect(onCreate).toHaveBeenCalledWith('mango')
            })
        })

        it('should not create on Enter when no create option is offered', async () => {
            const onCreate = vi.fn()
            render(SelectMenu, {
                items: defaultItems,
                createItem: true,
                onCreate,
                open: true,
                portal: false
            })
            const input = Array.from(document.querySelectorAll('input')).find(
                (i) => i.getAttribute('aria-hidden') !== 'true'
            ) as HTMLInputElement
            input.focus()
            input.value = 'Apple'
            input.dispatchEvent(new Event('input', { bubbles: true }))
            await vi.waitFor(() => {
                expect(findCreateOption()).toBeUndefined()
            })
            input.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
            )
            await new Promise((r) => setTimeout(r, 50))
            expect(onCreate).not.toHaveBeenCalled()
        })

        it('should select existing item (not create) when search matches case-insensitively', async () => {
            const onCreate = vi.fn()
            const items: SelectMenuItem[] = [{ value: 'React', label: 'React' }]
            render(SelectMenu, {
                items,
                multiple: true,
                value: [],
                createItem: 'always',
                onCreate,
                open: true,
                portal: false
            })
            typeSearch('react')
            await vi.waitFor(() => {
                expect(findCreateOption()).toBeDefined()
            })
            await page.getByRole('option', { name: /Create "react"/ }).click()
            await new Promise((r) => setTimeout(r, 50))
            expect(onCreate).not.toHaveBeenCalled()
        })
    })

    // ==================== FORMFIELD INTEGRATION ====================

    describe('FormField integration', () => {
        it('should not share the FormField id between the trigger and the search input', async () => {
            render(SelectMenuFormFieldTestWrapper, {
                items: [{ value: 'apple', label: 'Apple' }]
            })
            await vi.waitFor(() => {
                expect(document.querySelector('input[placeholder="Search..."]')).not.toBeNull()
            })
            const withFieldId = document.querySelectorAll('[id="form-field-fruit"]')
            expect(withFieldId.length).toBe(1)
            expect((withFieldId[0] as HTMLElement).hasAttribute('data-combobox-trigger')).toBe(true)
            const search = document.querySelector(
                'input[placeholder="Search..."]'
            ) as HTMLInputElement
            expect(search.id).not.toBe('form-field-fruit')
        })
    })
})

const slotSnippet = (id: string) =>
    createRawSnippet(() => ({
        render: () => `<button type="button" id="${id}">x</button>`,
        setup: () => {}
    }))

const wrapperOf = (container: Element, id: string) =>
    container.querySelector(`#${id}`)?.parentElement as HTMLElement

describe('SelectMenu leading and trailing slots, #237', () => {
    const base = { items: [{ label: 'Option A', value: 'a' }] }

    it.each(['leadingSlot', 'trailingSlot'])(
        'shows the spinner instead of a %s while loading',
        async (slot) => {
            const { container } = render(SelectMenu, {
                ...base,
                loading: true,
                [slot]: slotSnippet('slot-btn')
            })
            await vi.waitFor(() => expect(container.querySelector('.animate-spin')).not.toBeNull())
            expect(container.querySelector('#slot-btn')).toBeNull()
        }
    )

    it('renders both slots when not loading', () => {
        const { container } = render(SelectMenu, {
            ...base,
            leadingSlot: slotSnippet('lead-btn'),
            trailingSlot: slotSnippet('trail-btn')
        })
        expect(container.querySelector('#lead-btn')).not.toBeNull()
        expect(container.querySelector('#trail-btn')).not.toBeNull()
        expect(container.querySelector('.animate-spin')).toBeNull()
    })

    it('keeps slot content click through, since it belongs to the trigger', () => {
        const { container } = render(SelectMenu, {
            ...base,
            leadingSlot: slotSnippet('lead-btn'),
            trailingSlot: slotSnippet('trail-btn')
        })
        expect(wrapperOf(container, 'lead-btn').className).toMatch(/\bpointer-events-none\b/)
        expect(wrapperOf(container, 'trail-btn').className).toMatch(/\bpointer-events-none\b/)
    })
})
