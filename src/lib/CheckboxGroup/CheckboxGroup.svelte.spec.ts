import { page } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import CheckboxGroup from './CheckboxGroup.svelte'
import type { CheckboxGroupItem } from './checkbox-group.types.js'

const defaultItems: CheckboxGroupItem[] = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
    { value: 'c', label: 'Option C' }
]

const getCheckboxes = () =>
    document.querySelectorAll('button[role="checkbox"]') as NodeListOf<HTMLButtonElement>

const getCheckbox = (index = 0) => getCheckboxes()[index] ?? null

describe('CheckboxGroup', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render checkbox items', async () => {
            render(CheckboxGroup, { items: defaultItems })
            await expect.element(page.getByRole('checkbox').first()).toBeInTheDocument()
            expect(getCheckboxes().length).toBe(3)
        })

        it('should render all items unchecked by default', () => {
            render(CheckboxGroup, { items: defaultItems })
            for (const cb of getCheckboxes()) {
                expect(cb.getAttribute('data-state')).toBe('unchecked')
            }
        })

        it('should render with pre-selected values', () => {
            render(CheckboxGroup, { items: defaultItems, value: ['a', 'c'] })
            expect(getCheckbox(0).getAttribute('data-state')).toBe('checked')
            expect(getCheckbox(1).getAttribute('data-state')).toBe('unchecked')
            expect(getCheckbox(2).getAttribute('data-state')).toBe('checked')
        })

        it('should render with name attribute', () => {
            const { container } = render(CheckboxGroup, { items: defaultItems, name: 'my-group' })
            const hidden = container.querySelector('input[name="my-group"]')
            expect(hidden).toBeTruthy()
        })

        it('should render item ids with prefix', () => {
            render(CheckboxGroup, { items: defaultItems, id: 'test' })
            expect(getCheckbox(0).id).toBe('test-a')
            expect(getCheckbox(1).id).toBe('test-b')
        })

        it('should auto-generate ids', () => {
            render(CheckboxGroup, { items: defaultItems })
            expect(getCheckbox(0).id).toBeTruthy()
        })

        it('should render empty when no items provided', () => {
            render(CheckboxGroup)
            expect(getCheckboxes().length).toBe(0)
        })

        it('should render fieldset element', () => {
            const { container } = render(CheckboxGroup, { items: defaultItems })
            expect(container.querySelector('fieldset')).toBeTruthy()
        })
    })

    // ==================== VALUE CHANGE ====================

    describe('value change', () => {
        it('should check item on click', async () => {
            render(CheckboxGroup, { items: defaultItems })
            await page.getByRole('checkbox').first().click()
            expect(getCheckbox(0).getAttribute('data-state')).toBe('checked')
        })

        it('should uncheck already-checked item on click', async () => {
            render(CheckboxGroup, { items: defaultItems, value: ['a'] })
            await page.getByRole('checkbox').first().click()
            expect(getCheckbox(0).getAttribute('data-state')).toBe('unchecked')
        })

        it('should allow selecting multiple items independently', async () => {
            render(CheckboxGroup, { items: defaultItems })
            await page.getByRole('checkbox').first().click()
            await page.getByRole('checkbox').nth(2).click()
            expect(getCheckbox(0).getAttribute('data-state')).toBe('checked')
            expect(getCheckbox(1).getAttribute('data-state')).toBe('unchecked')
            expect(getCheckbox(2).getAttribute('data-state')).toBe('checked')
        })

        it('should call onValueChange when checking an item', async () => {
            const onValueChange = vi.fn()
            render(CheckboxGroup, { items: defaultItems, onValueChange })
            await page.getByRole('checkbox').nth(1).click()
            expect(onValueChange).toHaveBeenCalledWith(['b'])
        })

        it('should call onValueChange when unchecking an item', async () => {
            const onValueChange = vi.fn()
            render(CheckboxGroup, { items: defaultItems, value: ['a', 'b'], onValueChange })
            await page.getByRole('checkbox').first().click()
            expect(onValueChange).toHaveBeenCalledWith(['b'])
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled', () => {
        it('should disable all items when disabled is true', async () => {
            render(CheckboxGroup, { items: defaultItems, disabled: true })
            await expect.element(page.getByRole('checkbox').first()).toBeDisabled()
            await expect.element(page.getByRole('checkbox').nth(1)).toBeDisabled()
            await expect.element(page.getByRole('checkbox').nth(2)).toBeDisabled()
        })

        it('should not check when group is disabled', async () => {
            render(CheckboxGroup, { items: defaultItems, disabled: true })
            await page.getByRole('checkbox').first().click({ force: true })
            expect(getCheckbox(0).getAttribute('data-state')).toBe('unchecked')
        })

        it('should disable individual items', async () => {
            const items: CheckboxGroupItem[] = [
                { value: 'a', label: 'Option A' },
                { value: 'b', label: 'Option B', disabled: true },
                { value: 'c', label: 'Option C' }
            ]
            render(CheckboxGroup, { items })
            await expect.element(page.getByRole('checkbox').nth(1)).toBeDisabled()
            await expect.element(page.getByRole('checkbox').first()).not.toBeDisabled()
        })

        it('should not check per-item disabled on click', async () => {
            const items: CheckboxGroupItem[] = [{ value: 'a', label: 'Option A', disabled: true }]
            render(CheckboxGroup, { items })
            await page.getByRole('checkbox').first().click({ force: true })
            expect(getCheckbox(0).getAttribute('data-state')).toBe('unchecked')
        })
    })

    // ==================== LOADING STATE ====================

    describe('loading', () => {
        it('should disable all items when loading', async () => {
            render(CheckboxGroup, { items: defaultItems, loading: true })
            await expect.element(page.getByRole('checkbox').first()).toBeDisabled()
        })

        it('should not check when loading', async () => {
            render(CheckboxGroup, { items: defaultItems, loading: true })
            await page.getByRole('checkbox').first().click({ force: true })
            expect(getCheckbox(0).getAttribute('data-state')).toBe('unchecked')
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
            it(`should apply color="${color}" on checked state`, () => {
                render(CheckboxGroup, { items: defaultItems, value: ['a'], color })
                expect(getCheckbox(0).className).toMatch(new RegExp(`bg-${color}`))
            })
        }
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply xs size', () => {
            render(CheckboxGroup, { items: defaultItems, size: 'xs' })
            expect(getCheckbox().className).toMatch(/size-3\.5/)
        })

        it('should apply md size by default', () => {
            render(CheckboxGroup, { items: defaultItems })
            expect(getCheckbox().className).toMatch(/size-4\.5/)
        })

        it('should apply xl size', () => {
            render(CheckboxGroup, { items: defaultItems, size: 'xl' })
            expect(getCheckbox().className).toMatch(/size-5\.5/)
        })
    })

    // ==================== ORIENTATION ====================

    describe('orientation', () => {
        it('should render vertical by default', () => {
            const { container } = render(CheckboxGroup, { items: defaultItems })
            const fieldset = container.querySelector('fieldset')
            expect(fieldset!.className).toMatch(/flex-col/)
        })

        it('should render horizontal', () => {
            const { container } = render(CheckboxGroup, {
                items: defaultItems,
                orientation: 'horizontal'
            })
            const fieldset = container.querySelector('fieldset')
            expect(fieldset!.className).toMatch(/flex-row/)
        })
    })

    // ==================== LEGEND ====================

    describe('legend', () => {
        it('should render legend text', async () => {
            render(CheckboxGroup, { items: defaultItems, legend: 'Choose options' })
            await expect.element(page.getByText('Choose options')).toBeInTheDocument()
        })

        it('should not render legend element when not provided', () => {
            const { container } = render(CheckboxGroup, { items: defaultItems })
            expect(container.querySelector('legend')).toBeNull()
        })
    })

    // ==================== LABEL & DESCRIPTION ====================

    describe('label & description', () => {
        it('should render label for each item', async () => {
            render(CheckboxGroup, { items: defaultItems })
            await expect.element(page.getByText('Option A')).toBeInTheDocument()
            await expect.element(page.getByText('Option B')).toBeInTheDocument()
            await expect.element(page.getByText('Option C')).toBeInTheDocument()
        })

        it('should render description text', async () => {
            const items: CheckboxGroupItem[] = [
                { value: 'a', label: 'Option A', description: 'First description' }
            ]
            render(CheckboxGroup, { items })
            await expect.element(page.getByText('First description')).toBeInTheDocument()
        })

        it('should associate label with checkbox via for attribute', () => {
            render(CheckboxGroup, { items: defaultItems, id: 'grp' })
            const label = document.querySelector('label[for="grp-a"]')
            expect(label).toBeTruthy()
            expect(label!.textContent?.trim()).toBe('Option A')
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should have role="checkbox" on each item', () => {
            render(CheckboxGroup, { items: defaultItems })
            expect(getCheckboxes().length).toBe(3)
        })

        it('should set data-state="checked" on selected items only', () => {
            render(CheckboxGroup, { items: defaultItems, value: ['a', 'c'] })
            expect(getCheckbox(0).getAttribute('data-state')).toBe('checked')
            expect(getCheckbox(1).getAttribute('data-state')).toBe('unchecked')
            expect(getCheckbox(2).getAttribute('data-state')).toBe('checked')
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root element', () => {
            const { container } = render(CheckboxGroup, {
                items: defaultItems,
                class: 'my-group'
            })
            const root = container.firstElementChild as HTMLElement
            expect(root.className).toContain('my-group')
        })

        it('should apply ui.base override to checkbox buttons', () => {
            render(CheckboxGroup, { items: defaultItems, ui: { base: 'my-base' } })
            expect(getCheckbox().className).toContain('my-base')
        })

        it('should apply ui.fieldset override', () => {
            const { container } = render(CheckboxGroup, {
                items: defaultItems,
                ui: { fieldset: 'my-fieldset' }
            })
            expect(container.querySelector('fieldset')!.className).toContain('my-fieldset')
        })
    })

    // ==================== COMBINED PROPS ====================

    describe('combined props', () => {
        it('should render with value, legend, and required', async () => {
            render(CheckboxGroup, {
                items: defaultItems,
                value: ['b'],
                legend: 'Pick some',
                required: true
            })
            expect(getCheckbox(1).getAttribute('data-state')).toBe('checked')
            await expect.element(page.getByText('Pick some')).toBeInTheDocument()
        })

        it('should render with color, size, and orientation combined', () => {
            render(CheckboxGroup, {
                items: defaultItems,
                value: ['a'],
                color: 'success',
                size: 'lg',
                orientation: 'horizontal'
            })
            expect(getCheckbox(0).className).toMatch(/bg-success/)
            expect(getCheckbox(0).className).toMatch(/size-5/)
        })
    })
})
