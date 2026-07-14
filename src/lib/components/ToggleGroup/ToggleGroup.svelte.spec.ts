import { page, userEvent } from 'vitest/browser'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import ToggleGroup from './ToggleGroup.svelte'

const getRoot = () => document.querySelector('[role="group"]') as HTMLElement | null
const getItems = () =>
    Array.from(document.querySelectorAll('button[data-value]')) as HTMLButtonElement[]
const getItem = (value: string) =>
    document.querySelector(`button[data-value="${value}"]`) as HTMLButtonElement | null

const viewItems = [
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'columns', label: 'Columns' }
]

const iconItems = [
    { value: 'bold', icon: 'lucide:bold', ariaLabel: 'Bold' },
    { value: 'italic', icon: 'lucide:italic', ariaLabel: 'Italic' }
]

describe('ToggleGroup', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a group with items', async () => {
            render(ToggleGroup, { items: viewItems })
            const group = page.getByRole('group')
            await expect.element(group).toBeInTheDocument()
            expect(getItems().length).toBe(3)
        })

        it('should render item labels', async () => {
            render(ToggleGroup, { items: viewItems })
            const label = page.getByText('Grid')
            await expect.element(label).toBeInTheDocument()
        })

        it('should render all items unpressed by default', () => {
            render(ToggleGroup, { items: viewItems })
            for (const item of getItems()) {
                expect(item.getAttribute('data-state')).toBe('off')
            }
        })

        it('should render icon-only items', async () => {
            render(ToggleGroup, { items: iconItems })
            await vi.waitFor(() => {
                expect(getItem('bold')!.querySelector('svg')).not.toBeNull()
            })
        })

        it('should render no items for empty group', () => {
            render(ToggleGroup)
            expect(getItems().length).toBe(0)
        })
    })

    // ==================== SINGLE MODE ====================

    describe('single mode', () => {
        it('should press the item matching value', () => {
            render(ToggleGroup, { items: viewItems, value: 'grid' })
            expect(getItem('grid')!.getAttribute('data-state')).toBe('on')
            expect(getItem('list')!.getAttribute('data-state')).toBe('off')
        })

        it('should press item on click', async () => {
            render(ToggleGroup, { items: viewItems })
            await page.getByText('Grid').click()
            expect(getItem('grid')!.getAttribute('data-state')).toBe('on')
        })

        it('should release the previous item when another is pressed', async () => {
            render(ToggleGroup, { items: viewItems, value: 'list' })
            await page.getByText('Grid').click()
            expect(getItem('grid')!.getAttribute('data-state')).toBe('on')
            expect(getItem('list')!.getAttribute('data-state')).toBe('off')
        })

        it('should call onValueChange with the pressed value', async () => {
            const onValueChange = vi.fn()
            render(ToggleGroup, { items: viewItems, onValueChange })
            await page.getByText('Columns').click()
            expect(onValueChange).toHaveBeenCalledWith('columns')
        })
    })

    // ==================== MULTIPLE MODE ====================

    describe('multiple mode', () => {
        it('should press all items matching value', () => {
            render(ToggleGroup, {
                type: 'multiple',
                items: viewItems,
                value: ['list', 'grid']
            })
            expect(getItem('list')!.getAttribute('data-state')).toBe('on')
            expect(getItem('grid')!.getAttribute('data-state')).toBe('on')
            expect(getItem('columns')!.getAttribute('data-state')).toBe('off')
        })

        it('should keep other items pressed when pressing another', async () => {
            render(ToggleGroup, {
                type: 'multiple',
                items: viewItems,
                value: ['list']
            })
            await page.getByText('Grid').click()
            expect(getItem('list')!.getAttribute('data-state')).toBe('on')
            expect(getItem('grid')!.getAttribute('data-state')).toBe('on')
        })

        it('should call onValueChange with the array of pressed values', async () => {
            const onValueChange = vi.fn()
            render(ToggleGroup, {
                type: 'multiple',
                items: viewItems,
                value: ['list'],
                onValueChange
            })
            await page.getByText('Grid').click()
            expect(onValueChange).toHaveBeenCalledWith(['list', 'grid'])
        })

        it('should release an item when clicked again', async () => {
            render(ToggleGroup, {
                type: 'multiple',
                items: viewItems,
                value: ['list', 'grid']
            })
            await page.getByText('Grid').click()
            expect(getItem('grid')!.getAttribute('data-state')).toBe('off')
            expect(getItem('list')!.getAttribute('data-state')).toBe('on')
        })
    })

    // ==================== DISABLED ====================

    describe('disabled', () => {
        it('should disable all items when group is disabled', async () => {
            render(ToggleGroup, { items: viewItems, disabled: true })
            for (const item of getItems()) {
                expect(item.disabled).toBe(true)
            }
        })

        it('should disable a single item via item.disabled', () => {
            render(ToggleGroup, {
                items: [...viewItems, { value: 'extra', label: 'Extra', disabled: true }]
            })
            expect(getItem('extra')!.disabled).toBe(true)
            expect(getItem('list')!.disabled).toBe(false)
        })

        it('should not change value when clicking a disabled item', async () => {
            render(ToggleGroup, {
                items: [{ value: 'only', label: 'Only', disabled: true }]
            })
            await page.getByText('Only').click({ force: true })
            expect(getItem('only')!.getAttribute('data-state')).toBe('off')
        })
    })

    // ==================== VARIANTS, COLORS & SIZES ====================

    describe('variants, colors & sizes', () => {
        it('should apply ghost variant by default', () => {
            render(ToggleGroup, { items: viewItems })
            expect(getItem('list')!.className).toMatch(/hover:bg-surface-container-highest/)
        })

        it('should apply outline variant to every item', () => {
            render(ToggleGroup, { items: viewItems, variant: 'outline' })
            for (const item of getItems()) {
                expect(item.className).toMatch(/ring-outline-variant/)
            }
        })

        it('should apply pressed color classes to items', () => {
            render(ToggleGroup, { items: viewItems, color: 'success' })
            expect(getItem('list')!.className).toMatch(/data-\[state=on\]:bg-success-container/)
        })

        it('should apply size classes to items', () => {
            render(ToggleGroup, { items: viewItems, size: 'xl' })
            expect(getItem('list')!.className).toMatch(/px-5/)
        })

        it('should apply square padding to icon-only items', () => {
            render(ToggleGroup, { items: iconItems })
            expect(getItem('bold')!.className).toMatch(/p-1\.5/)
        })

        it('should not apply square padding to labeled items', () => {
            render(ToggleGroup, { items: viewItems })
            expect(getItem('list')!.className).toMatch(/px-3/)
        })
    })

    // ==================== ATTACHED ====================

    describe('attached', () => {
        it('should apply gap between items by default', () => {
            render(ToggleGroup, { items: viewItems })
            expect(getRoot()!.className).toMatch(/gap-1/)
        })

        it('should overlap items when attached', () => {
            render(ToggleGroup, { items: viewItems, attached: true })
            expect(getRoot()!.className).toMatch(/-space-x-px/)
            expect(getRoot()!.className).not.toMatch(/gap-1/)
        })

        it('should apply corner-rounding classes to attached items', () => {
            render(ToggleGroup, { items: viewItems, attached: true })
            expect(getItem('list')!.className).toMatch(/rounded-e-none/)
        })

        it('should overlap vertically when attached and vertical', () => {
            render(ToggleGroup, {
                items: viewItems,
                attached: true,
                orientation: 'vertical'
            })
            expect(getRoot()!.className).toMatch(/-space-y-px/)
            expect(getItem('list')!.className).toMatch(/rounded-b-none/)
        })
    })

    // ==================== ORIENTATION & BLOCK ====================

    describe('orientation & block', () => {
        it('should set horizontal orientation by default', () => {
            render(ToggleGroup, { items: viewItems })
            expect(getRoot()!.getAttribute('data-orientation')).toBe('horizontal')
        })

        it('should set vertical orientation', () => {
            render(ToggleGroup, { items: viewItems, orientation: 'vertical' })
            expect(getRoot()!.getAttribute('data-orientation')).toBe('vertical')
            expect(getRoot()!.className).toMatch(/flex-col/)
        })

        it('should stretch group and items with block', () => {
            render(ToggleGroup, { items: viewItems, block: true })
            expect(getRoot()!.className).toMatch(/w-full/)
            expect(getItem('list')!.className).toMatch(/flex-1/)
        })
    })

    // ==================== KEYBOARD NAVIGATION ====================

    describe('keyboard navigation', () => {
        it('should move focus between items with arrow keys', async () => {
            render(ToggleGroup, { items: viewItems })
            getItem('list')!.focus()
            await userEvent.keyboard('{ArrowRight}')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem('grid'))
            })
        })

        it('should loop from last item back to first', async () => {
            render(ToggleGroup, { items: viewItems })
            getItem('columns')!.focus()
            await userEvent.keyboard('{ArrowRight}')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem('list'))
            })
        })

        it('should press the focused item with Space', async () => {
            render(ToggleGroup, { items: viewItems })
            getItem('grid')!.focus()
            await userEvent.keyboard(' ')
            await vi.waitFor(() => {
                expect(getItem('grid')!.getAttribute('data-state')).toBe('on')
            })
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root element', () => {
            render(ToggleGroup, { items: viewItems, class: 'my-custom-class' })
            expect(getRoot()!.className).toContain('my-custom-class')
        })

        it('should apply ui slot override to root', () => {
            render(ToggleGroup, { items: viewItems, ui: { root: 'my-root-class' } })
            expect(getRoot()!.className).toContain('my-root-class')
        })

        it('should apply ui slot override to items', () => {
            render(ToggleGroup, { items: viewItems, ui: { item: 'my-item-class' } })
            for (const item of getItems()) {
                expect(item.className).toContain('my-item-class')
            }
        })

        it('should apply ui slot override to labels', () => {
            render(ToggleGroup, { items: viewItems, ui: { label: 'my-label-class' } })
            const label = getItem('list')!.querySelector('span') as HTMLElement
            expect(label.className).toContain('my-label-class')
        })
    })

    // ==================== ACCESSIBILITY ====================

    describe('accessibility', () => {
        it('should have role="group"', async () => {
            render(ToggleGroup, { items: viewItems })
            const group = page.getByRole('group')
            await expect.element(group).toBeInTheDocument()
        })

        it('should set aria-pressed on items in multiple mode', () => {
            render(ToggleGroup, {
                type: 'multiple',
                items: viewItems,
                value: ['grid']
            })
            expect(getItem('grid')!.getAttribute('aria-pressed')).toBe('true')
            expect(getItem('list')!.getAttribute('aria-pressed')).toBe('false')
        })

        it('should apply aria-label to icon-only items', () => {
            render(ToggleGroup, { items: iconItems })
            expect(getItem('bold')!.getAttribute('aria-label')).toBe('Bold')
        })

        it('should pass through aria-label to the group', () => {
            render(ToggleGroup, { items: viewItems, 'aria-label': 'View mode' })
            expect(getRoot()!.getAttribute('aria-label')).toBe('View mode')
        })
    })
})
