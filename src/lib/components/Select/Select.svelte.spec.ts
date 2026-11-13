import { page } from 'vitest/browser'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { createRawSnippet } from 'svelte'
import Select from './Select.svelte'
import type { SelectItemType } from './select.types.js'
import { FORM_FIELD_CONTEXT_KEY } from '../../hooks/useFormField/index.js'

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

    // ==================== MULTIPLE ====================

    describe('multiple', () => {
        it('should display comma-separated labels when multiple values selected', async () => {
            render(Select, {
                items: defaultItems,
                multiple: true,
                value: ['apple', 'banana']
            })
            await expect.element(page.getByText('Apple, Banana')).toBeInTheDocument()
        })

        it('should use custom separator when provided', async () => {
            render(Select, {
                items: defaultItems,
                multiple: true,
                value: ['apple', 'cherry'],
                separator: ' | '
            })
            await expect.element(page.getByText('Apple | Cherry')).toBeInTheDocument()
        })

        it('should show placeholder when no values are selected', async () => {
            render(Select, {
                items: defaultItems,
                multiple: true,
                value: [],
                placeholder: 'Pick fruits'
            })
            await expect.element(page.getByText('Pick fruits')).toBeInTheDocument()
        })

        it('should keep dropdown open after selecting an item', async () => {
            render(Select, {
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
            expect(getTrigger()!.getAttribute('data-state')).toBe('open')
        })

        it('should mark all selected items in dropdown', async () => {
            render(Select, {
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

    // ==================== NATIVE ATTRIBUTES ====================

    describe('native attributes', () => {
        it('should forward id, aria-label and data-* to the trigger', () => {
            render(Select, {
                items: defaultItems,
                id: 'fruit-select',
                'aria-label': 'Fruit',
                'data-testid': 'fruit-trigger'
            })
            const trigger = getTrigger()
            expect(trigger).not.toBeNull()
            expect(trigger!.id).toBe('fruit-select')
            expect(trigger!.getAttribute('aria-label')).toBe('Fruit')
            expect(trigger!.getAttribute('data-testid')).toBe('fruit-trigger')
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

describe('Select form submission, #255', () => {
    const forms: HTMLFormElement[] = []

    const makeForm = () => {
        const form = document.createElement('form')
        document.body.append(form)
        forms.push(form)
        return form
    }

    const renderInForm = (props: Record<string, unknown>, context?: Map<unknown, unknown>) => {
        const form = makeForm()
        render(Select, {
            target: form,
            props: { items: defaultItems, ...props },
            ...(context ? { context } : {})
        })
        return form
    }

    const submitted = (form: HTMLFormElement, name = 'fruit') => new FormData(form).getAll(name)

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

    it('submits the option the user picks', async () => {
        const form = renderInForm({ name: 'fruit', value: 'apple', open: true, portal: false })
        await page.getByRole('option', { name: 'Cherry' }).click()
        await vi.waitFor(() => expect(submitted(form)).toEqual(['cherry']))
    })

    it('uses the name from the surrounding FormField', () => {
        const form = renderInForm(
            { value: 'banana' },
            new Map([[FORM_FIELD_CONTEXT_KEY, { name: 'field-fruit', size: 'md', ariaId: 'f' }]])
        )
        expect(submitted(form, 'field-fruit')).toEqual(['banana'])
    })

    it('renders no input without a name', () => {
        const form = renderInForm({ value: 'banana' })
        expect(form.querySelector('input')).toBeNull()
    })

    it('does not put the name on the trigger button', () => {
        renderInForm({ name: 'fruit', value: 'banana' })
        expect(getTrigger()!.hasAttribute('name')).toBe(false)
    })

    it('keeps the input inside the root so the root stays the last child of its parent', () => {
        const form = renderInForm({ name: 'fruit', value: 'banana' })
        expect(form.lastElementChild).toBe(getRootWrapper())
        expect(getRootWrapper()!.querySelector('input[name="fruit"]')).not.toBeNull()
    })

    it('keeps multiple inputs inside the root as well', () => {
        const form = renderInForm({ name: 'fruit', multiple: true, value: ['apple', 'cherry'] })
        expect(form.lastElementChild).toBe(getRootWrapper())
    })

    it('follows a value changed from outside', async () => {
        const form = makeForm()
        const { rerender } = render(Select, {
            target: form,
            props: { items: defaultItems, name: 'fruit', value: 'apple' }
        })
        await rerender({ value: 'cherry' })
        await vi.waitFor(() => expect(submitted(form)).toEqual(['cherry']))
    })

    it('follows values changed from outside with multiple', async () => {
        const form = makeForm()
        const { rerender } = render(Select, {
            target: form,
            props: { items: defaultItems, name: 'fruit', multiple: true, value: ['apple'] }
        })
        await rerender({ value: ['apple', 'cherry'] })
        await vi.waitFor(() => expect(submitted(form)).toEqual(['apple', 'cherry']))
    })

    it('blocks native submission while required and empty', () => {
        expect(renderInForm({ name: 'fruit', required: true }).checkValidity()).toBe(false)
    })

    it('passes native validation while required and filled', () => {
        const form = renderInForm({ name: 'fruit', required: true, value: 'banana' })
        expect(form.checkValidity()).toBe(true)
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

    it('moves focus to the trigger when native validation fails', async () => {
        const form = renderInForm({ name: 'fruit', required: true })
        form.requestSubmit()
        await vi.waitFor(() => expect(document.activeElement).toBe(getTrigger()))
    })

    it('clears the selection on form reset', async () => {
        const form = renderInForm({ name: 'fruit', value: 'banana' })
        form.reset()
        await vi.waitFor(() => expect(submitted(form)).toEqual(['']))
        await vi.waitFor(() => expect(getTrigger()!.textContent).not.toContain('Banana'))
    })

    it('clears the selection on form reset with multiple', async () => {
        const form = renderInForm({ name: 'fruit', multiple: true, value: ['apple', 'cherry'] })
        form.reset()
        await vi.waitFor(() => expect(submitted(form)).toEqual([]))
        await vi.waitFor(() => expect(getTrigger()!.textContent).not.toContain('Apple'))
    })

    it('rejects a value that is not one of the items', async () => {
        const form = renderInForm({ name: 'fruit', value: 'banana' })
        const input = form.querySelector<HTMLInputElement>('input[name="fruit"]')!
        input.value = 'not-an-item'
        input.dispatchEvent(new Event('input', { bubbles: true }))
        await vi.waitFor(() => expect(submitted(form)).toEqual(['banana']))
        expect(getTrigger()!.textContent).toContain('Banana')
    })

    it('opts every text input out of browser autofill', () => {
        for (const props of [{}, { multiple: true }]) {
            const form = renderInForm({ name: 'fruit', ...props })
            const input = form.querySelector<HTMLInputElement>('input:not([type="hidden"])')!
            expect(input.autocomplete).toBe('off')
        }
    })
})

describe('Select leading and trailing slots, #237', () => {
    const base = { items: [{ label: 'Option A', value: 'a' }] }

    it.each(['leadingSlot', 'trailingSlot'])(
        'shows the spinner instead of a %s while loading',
        async (slot) => {
            const { container } = render(Select, {
                ...base,
                loading: true,
                [slot]: slotSnippet('slot-btn')
            })
            await vi.waitFor(() => expect(container.querySelector('.animate-spin')).not.toBeNull())
            expect(container.querySelector('#slot-btn')).toBeNull()
        }
    )

    it('renders both slots when not loading', () => {
        const { container } = render(Select, {
            ...base,
            leadingSlot: slotSnippet('lead-btn'),
            trailingSlot: slotSnippet('trail-btn')
        })
        expect(container.querySelector('#lead-btn')).not.toBeNull()
        expect(container.querySelector('#trail-btn')).not.toBeNull()
        expect(container.querySelector('.animate-spin')).toBeNull()
    })

    it('keeps slot content click through, since it belongs to the trigger', () => {
        const { container } = render(Select, {
            ...base,
            leadingSlot: slotSnippet('lead-btn'),
            trailingSlot: slotSnippet('trail-btn')
        })
        expect(wrapperOf(container, 'lead-btn').className).toMatch(/\bpointer-events-none\b/)
        expect(wrapperOf(container, 'trail-btn').className).toMatch(/\bpointer-events-none\b/)
    })
})
