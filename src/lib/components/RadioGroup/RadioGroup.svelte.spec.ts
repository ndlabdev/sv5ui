import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import RadioGroup from './RadioGroup.svelte'
import type { RadioGroupItem } from './radio-group.types.js'

const defaultItems: RadioGroupItem[] = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' }
]

const getRadios = () =>
    document.querySelectorAll('button[role="radio"]') as NodeListOf<HTMLButtonElement>

const getRadio = (index = 0) => getRadios()[index] ?? null

describe('RadioGroup', () => {
    // ==================== RENDERING ====================
    describe('rendering', () => {
        it('should render radio items', async () => {
            render(RadioGroup, { items: defaultItems })
            const radios = page.getByRole('radio')
            await expect.element(radios.first()).toBeInTheDocument()
            expect(getRadios().length).toBe(3)
        })

        it('should render all items unchecked by default', () => {
            render(RadioGroup, { items: defaultItems })
            const radios = getRadios()
            for (const radio of radios) {
                expect(radio.getAttribute('data-state')).toBe('unchecked')
            }
        })

        it('should render with value pre-selected', () => {
            render(RadioGroup, { items: defaultItems, value: 'b' })
            expect(getRadio(1)!.getAttribute('data-state')).toBe('checked')
        })

        it('should render with third item selected', () => {
            render(RadioGroup, { items: defaultItems, value: 'c' })
            expect(getRadio(2)!.getAttribute('data-state')).toBe('checked')
        })

        it('should render with name attribute', () => {
            const { container } = render(RadioGroup, {
                items: defaultItems,
                name: 'my-radio'
            })
            const hidden = container.querySelector('input[name="my-radio"]')
            expect(hidden).toBeTruthy()
        })

        it('should render with id', () => {
            render(RadioGroup, { items: defaultItems, id: 'my-group' })
            const radios = getRadios()
            expect(radios[0]!.id).toBe('my-group-a')
            expect(radios[1]!.id).toBe('my-group-b')
        })

        it('should generate ids automatically', () => {
            render(RadioGroup, { items: defaultItems })
            expect(getRadio()!.id).toBeTruthy()
        })

        it('should render empty when no items', () => {
            render(RadioGroup)
            expect(getRadios().length).toBe(0)
        })
    })

    // ==================== VALUE CHANGE ====================
    describe('value change', () => {
        it('should select item on click', async () => {
            render(RadioGroup, { items: defaultItems })
            const radio = page.getByRole('radio').nth(0)
            await radio.click()
            expect(getRadio(0)!.getAttribute('data-state')).toBe('checked')
        })

        it('should call onValueChange callback', async () => {
            const onValueChange = vi.fn()
            render(RadioGroup, { items: defaultItems, onValueChange })
            const radio = page.getByRole('radio').nth(1)
            await radio.click()
            expect(onValueChange).toHaveBeenCalledWith('b')
        })

        it('should deselect previous item when selecting new one', async () => {
            render(RadioGroup, { items: defaultItems, value: 'a' })
            expect(getRadio(0)!.getAttribute('data-state')).toBe('checked')
            const radio = page.getByRole('radio').nth(1)
            await radio.click()
            expect(getRadio(0)!.getAttribute('data-state')).toBe('unchecked')
            expect(getRadio(1)!.getAttribute('data-state')).toBe('checked')
        })
    })

    // ==================== DISABLED STATE ====================
    describe('disabled', () => {
        it('should disable all items when disabled prop is true', async () => {
            render(RadioGroup, { items: defaultItems, disabled: true })
            const radios = page.getByRole('radio')
            await expect.element(radios.first()).toBeDisabled()
            await expect.element(radios.nth(1)).toBeDisabled()
            await expect.element(radios.nth(2)).toBeDisabled()
        })

        it('should not select when disabled', async () => {
            render(RadioGroup, { items: defaultItems, disabled: true })
            const radio = page.getByRole('radio').first()
            await radio.click({ force: true })
            expect(getRadio(0)!.getAttribute('data-state')).toBe('unchecked')
        })

        it('should disable individual items', async () => {
            const items: RadioGroupItem[] = [
                { value: 'a', label: 'Option A' },
                { value: 'b', label: 'Option B', disabled: true },
                { value: 'c', label: 'Option C' }
            ]
            render(RadioGroup, { items })
            const radios = page.getByRole('radio')
            await expect.element(radios.nth(1)).toBeDisabled()
            await expect.element(radios.first()).not.toBeDisabled()
        })
    })

    // ==================== LOADING STATE ====================
    describe('loading', () => {
        it('should be disabled when loading', async () => {
            render(RadioGroup, { items: defaultItems, loading: true })
            const radios = page.getByRole('radio')
            await expect.element(radios.first()).toBeDisabled()
        })

        it('should not select when loading', async () => {
            render(RadioGroup, { items: defaultItems, loading: true })
            const radio = page.getByRole('radio').first()
            await radio.click({ force: true })
            expect(getRadio(0)!.getAttribute('data-state')).toBe('unchecked')
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
                render(RadioGroup, { items: defaultItems, color, value: 'a' })
                expect(getRadio(0)!.className).toMatch(new RegExp(`bg-${color}`))
            })
        }
    })

    // ==================== SIZES ====================
    describe('sizes', () => {
        it('should apply xs size classes', () => {
            render(RadioGroup, { items: defaultItems, size: 'xs' })
            expect(getRadio()!.className).toMatch(/size-3\.5/)
        })

        it('should apply md size classes by default', () => {
            render(RadioGroup, { items: defaultItems })
            expect(getRadio()!.className).toMatch(/size-4\.5/)
        })

        it('should apply xl size classes', () => {
            render(RadioGroup, { items: defaultItems, size: 'xl' })
            expect(getRadio()!.className).toMatch(/size-5\.5/)
        })
    })

    // ==================== ORIENTATION ====================
    describe('orientation', () => {
        it('should render vertical by default', () => {
            render(RadioGroup, { items: defaultItems })
            const group = document.querySelector('[role="radiogroup"]')
            expect(group!.className).toMatch(/flex-col/)
        })

        it('should render horizontal', () => {
            render(RadioGroup, { items: defaultItems, orientation: 'horizontal' })
            const group = document.querySelector('[role="radiogroup"]')
            expect(group!.className).toMatch(/flex-row/)
        })

        it('should set data-orientation attribute', () => {
            render(RadioGroup, { items: defaultItems, orientation: 'horizontal' })
            const group = document.querySelector('[role="radiogroup"]')
            expect(group!.getAttribute('data-orientation')).toBe('horizontal')
        })
    })

    // ==================== LEGEND ====================
    describe('legend', () => {
        it('should render legend text', async () => {
            render(RadioGroup, { items: defaultItems, legend: 'Choose one' })
            const legend = page.getByText('Choose one')
            await expect.element(legend).toBeInTheDocument()
        })

        it('should not render legend when not provided', () => {
            render(RadioGroup, { items: defaultItems })
            const legends = document.querySelectorAll('legend, .legend')
            // Should not have a legend element with text content
            expect(Array.from(legends).filter((l) => l.textContent?.trim())).toHaveLength(0)
        })
    })

    // ==================== LABEL & DESCRIPTION ====================
    describe('label & description', () => {
        it('should render label text for each item', async () => {
            render(RadioGroup, { items: defaultItems })
            const labelA = page.getByText('Option A')
            const labelB = page.getByText('Option B')
            await expect.element(labelA).toBeInTheDocument()
            await expect.element(labelB).toBeInTheDocument()
        })

        it('should render description text', async () => {
            const items: RadioGroupItem[] = [
                { value: 'a', label: 'Option A', description: 'First option desc' }
            ]
            render(RadioGroup, { items })
            const desc = page.getByText('First option desc')
            await expect.element(desc).toBeInTheDocument()
        })

        it('should associate label with radio via for attribute', () => {
            render(RadioGroup, { items: defaultItems, id: 'test-group' })
            const label = document.querySelector('label[for="test-group-a"]')
            expect(label).toBeTruthy()
            expect(label!.textContent).toBe('Option A')
        })
    })

    // ==================== ACCESSIBILITY ====================
    describe('accessibility', () => {
        it('should have role="radiogroup" on root', async () => {
            render(RadioGroup, { items: defaultItems })
            const group = page.getByRole('radiogroup')
            await expect.element(group).toBeInTheDocument()
        })

        it('should have role="radio" on each item', () => {
            render(RadioGroup, { items: defaultItems })
            expect(getRadios().length).toBe(3)
        })

        it('should set data-state="checked" on selected item', () => {
            render(RadioGroup, { items: defaultItems, value: 'b' })
            expect(getRadio(0)!.getAttribute('data-state')).toBe('unchecked')
            expect(getRadio(1)!.getAttribute('data-state')).toBe('checked')
            expect(getRadio(2)!.getAttribute('data-state')).toBe('unchecked')
        })

        it('should set aria-required when required', () => {
            render(RadioGroup, { items: defaultItems, required: true })
            const group = document.querySelector('[role="radiogroup"]')
            expect(group!.getAttribute('aria-required')).toBe('true')
        })
    })
})
