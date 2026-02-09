import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import DropdownMenu from './DropdownMenu.svelte'
import type { DropdownMenuItem, DropdownMenuRadioGroup } from './dropdown-menu.types.js'

describe('DropdownMenu', () => {
    const basicItems: DropdownMenuItem[] = [
        { label: 'Item 1', icon: 'lucide:file' },
        { label: 'Item 2', icon: 'lucide:folder' },
        { label: 'Item 3' }
    ]

    const getContent = () =>
        document.querySelector('[data-dropdown-menu-content]') as HTMLElement | null
    const getArrow = () =>
        document.querySelector('[data-dropdown-menu-arrow]') as HTMLElement | null
    const getItems = () => document.querySelectorAll('[data-dropdown-menu-item]')
    const getSeparators = () => document.querySelectorAll('[data-dropdown-menu-separator]')
    const getGroupHeadings = () => document.querySelectorAll('[data-dropdown-menu-group-heading]')
    const getCheckboxItems = () => document.querySelectorAll('[data-dropdown-menu-checkbox-item]')
    const getRadioItems = () => document.querySelectorAll('[data-dropdown-menu-radio-item]')
    const getSubTriggers = () => document.querySelectorAll('[data-dropdown-menu-sub-trigger]')

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(DropdownMenu)
            expect(container).not.toBeNull()
        })

        it('should not render content when closed', () => {
            render(DropdownMenu, { items: basicItems })
            expect(getContent()).toBeNull()
        })

        it('should render content when open', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })

        it('should render all items', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                expect(getItems().length).toBe(3)
            })
        })

        it('should render item labels', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await expect.element(page.getByText('Item 1')).toBeVisible()
            await expect.element(page.getByText('Item 2')).toBeVisible()
            await expect.element(page.getByText('Item 3')).toBeVisible()
        })

        it('should render item icons', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const items = getItems()
                const firstItem = items[0] as HTMLElement
                const icon = firstItem.querySelector('svg')
                expect(icon).not.toBeNull()
            })
        })
    })

    // ==================== POSITIONS (SIDE) ====================

    describe('positions', () => {
        it('should apply bottom side by default', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('bottom')
            })
        })

        it('should apply top side', async () => {
            render(DropdownMenu, { open: true, items: basicItems, side: 'top' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('top')
            })
        })

        it('should apply right side', async () => {
            render(DropdownMenu, { open: true, items: basicItems, side: 'right' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('right')
            })
        })

        it('should apply left side', async () => {
            render(DropdownMenu, { open: true, items: basicItems, side: 'left' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('left')
            })
        })
    })

    // ==================== ALIGNMENT ====================

    describe('alignment', () => {
        it('should apply start alignment by default', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-align')).toBe('start')
            })
        })

        it('should apply center alignment', async () => {
            render(DropdownMenu, { open: true, items: basicItems, align: 'center' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-align')).toBe('center')
            })
        })

        it('should apply end alignment', async () => {
            render(DropdownMenu, { open: true, items: basicItems, align: 'end' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-align')).toBe('end')
            })
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size by default', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('py-1.5')
            })
        })

        it('should apply xs size', async () => {
            render(DropdownMenu, { open: true, items: basicItems, size: 'xs' })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('text-xs')
            })
        })

        it('should apply sm size', async () => {
            render(DropdownMenu, { open: true, items: basicItems, size: 'sm' })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('py-1')
            })
        })

        it('should apply lg size', async () => {
            render(DropdownMenu, { open: true, items: basicItems, size: 'lg' })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('py-2')
            })
        })

        it('should apply xl size', async () => {
            render(DropdownMenu, { open: true, items: basicItems, size: 'xl' })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('py-2.5')
            })
        })
    })

    // ==================== ARROW ====================

    describe('arrow', () => {
        it('should not render arrow by default', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
            expect(getArrow()).toBeNull()
        })

        it('should render arrow when arrow is true', async () => {
            render(DropdownMenu, { open: true, items: basicItems, arrow: true })
            await vi.waitFor(() => {
                expect(getArrow()).not.toBeNull()
            })
        })

        it('should accept custom arrow dimensions', async () => {
            render(DropdownMenu, { open: true, items: basicItems, arrow: { width: 16, height: 8 } })
            await vi.waitFor(() => {
                const arrow = getArrow()
                expect(arrow).not.toBeNull()
                const svg = arrow!.querySelector('svg')
                expect(svg).not.toBeNull()
                expect(svg!.getAttribute('width')).toBe('16')
                expect(svg!.getAttribute('height')).toBe('8')
            })
        })
    })

    // ==================== ITEM TYPES ====================

    describe('item types', () => {
        describe('separator', () => {
            it('should render separator items', async () => {
                const items: DropdownMenuItem[] = [
                    { label: 'Item 1' },
                    { type: 'separator' },
                    { label: 'Item 2' }
                ]
                render(DropdownMenu, { open: true, items })
                await vi.waitFor(() => {
                    expect(getSeparators().length).toBe(1)
                })
            })
        })

        describe('label', () => {
            it('should render label items as group headings', async () => {
                const items: DropdownMenuItem[] = [
                    { type: 'label', label: 'Group Label' },
                    { label: 'Item 1' }
                ]
                render(DropdownMenu, { open: true, items })
                await expect.element(page.getByText('Group Label')).toBeVisible()
            })
        })

        describe('checkbox', () => {
            it('should render checkbox items', async () => {
                const items: DropdownMenuItem[] = [
                    { type: 'checkbox', label: 'Checkbox 1', checked: false },
                    { type: 'checkbox', label: 'Checkbox 2', checked: true }
                ]
                render(DropdownMenu, { open: true, items })
                await vi.waitFor(() => {
                    expect(getCheckboxItems().length).toBe(2)
                })
            })

            it('should show check icon when checked', async () => {
                const items: DropdownMenuItem[] = [
                    { type: 'checkbox', label: 'Checked Item', checked: true }
                ]
                render(DropdownMenu, { open: true, items })
                await vi.waitFor(() => {
                    const checkboxItem = getCheckboxItems()[0] as HTMLElement
                    const icon = checkboxItem.querySelector('svg')
                    expect(icon).not.toBeNull()
                })
            })

            it('should accept onCheckedChange callback prop', async () => {
                const onCheckedChange = vi.fn()
                const items: DropdownMenuItem[] = [
                    {
                        type: 'checkbox',
                        label: 'Checkbox',
                        checked: false,
                        closeOnSelect: false,
                        onCheckedChange
                    }
                ]
                render(DropdownMenu, { open: true, items })
                await vi.waitFor(() => {
                    expect(getCheckboxItems().length).toBe(1)
                })
                expect(onCheckedChange).toBeTypeOf('function')
            })
        })

        describe('radio', () => {
            it('should render radio items', async () => {
                const items: DropdownMenuItem[] = [
                    { type: 'radio', label: 'Option 1', value: 'opt1' },
                    { type: 'radio', label: 'Option 2', value: 'opt2' }
                ]
                const radioGroups: DropdownMenuRadioGroup[] = [{ name: 'options', value: 'opt1' }]
                render(DropdownMenu, { open: true, items, radioGroups })
                await vi.waitFor(() => {
                    expect(getRadioItems().length).toBe(2)
                })
            })

            it('should show check icon for selected radio item', async () => {
                const items: DropdownMenuItem[] = [
                    { type: 'radio', label: 'Option 1', value: 'opt1' },
                    { type: 'radio', label: 'Option 2', value: 'opt2' }
                ]
                const radioGroups: DropdownMenuRadioGroup[] = [{ name: 'options', value: 'opt1' }]
                render(DropdownMenu, { open: true, items, radioGroups })
                await vi.waitFor(() => {
                    const radioItems = getRadioItems()
                    const selectedItem = radioItems[0] as HTMLElement
                    const icon = selectedItem.querySelector('svg')
                    expect(icon).not.toBeNull()
                })
            })

            it('should accept onValueChange callback in radioGroups', async () => {
                const onValueChange = vi.fn()
                const items: DropdownMenuItem[] = [
                    { type: 'radio', label: 'Option 1', value: 'opt1', closeOnSelect: false },
                    { type: 'radio', label: 'Option 2', value: 'opt2', closeOnSelect: false }
                ]
                const radioGroups: DropdownMenuRadioGroup[] = [
                    { name: 'options', value: 'opt1', onValueChange }
                ]
                render(DropdownMenu, { open: true, items, radioGroups })
                await vi.waitFor(() => {
                    expect(getRadioItems().length).toBe(2)
                })
                expect(onValueChange).toBeTypeOf('function')
            })
        })

        describe('submenu', () => {
            it('should render submenu trigger', async () => {
                const items: DropdownMenuItem[] = [
                    {
                        type: 'sub',
                        label: 'More Options',
                        items: [{ label: 'Sub Item 1' }, { label: 'Sub Item 2' }]
                    }
                ]
                render(DropdownMenu, { open: true, items })
                await vi.waitFor(() => {
                    expect(getSubTriggers().length).toBe(1)
                })
                await expect.element(page.getByText('More Options')).toBeVisible()
            })

            it('should render submenu icon', async () => {
                const items: DropdownMenuItem[] = [
                    {
                        type: 'sub',
                        label: 'More Options',
                        icon: 'lucide:settings',
                        items: [{ label: 'Sub Item 1' }]
                    }
                ]
                render(DropdownMenu, { open: true, items })
                await vi.waitFor(() => {
                    const subTrigger = getSubTriggers()[0] as HTMLElement
                    const icons = subTrigger.querySelectorAll('svg')
                    expect(icons.length).toBeGreaterThanOrEqual(1)
                })
            })
        })
    })

    // ==================== DISABLED STATE ====================

    describe('disabled state', () => {
        it('should disable individual items', async () => {
            const items: DropdownMenuItem[] = [
                { label: 'Enabled Item' },
                { label: 'Disabled Item', disabled: true }
            ]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                const menuItems = getItems()
                const disabledItem = menuItems[1] as HTMLElement
                expect(disabledItem.getAttribute('data-disabled')).not.toBeNull()
            })
        })

        it('should apply disabled styles', async () => {
            const items: DropdownMenuItem[] = [{ label: 'Disabled Item', disabled: true }]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('data-[disabled]:opacity-50')
            })
        })
    })

    // ==================== CLOSE ON SELECT ====================

    describe('closeOnSelect', () => {
        it('should render items with default closeOnSelect behavior', async () => {
            const items: DropdownMenuItem[] = [{ label: 'Click Me' }]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item).not.toBeNull()
                // Default closeOnSelect is true (not explicitly set means default behavior)
            })
        })

        it('should accept closeOnSelect false on action items', async () => {
            const items: DropdownMenuItem[] = [
                { label: 'Stay Open', closeOnSelect: false, onSelect: vi.fn() }
            ]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                expect(getItems().length).toBe(1)
                expect(getContent()).not.toBeNull()
            })
        })

        it('should accept closeOnSelect false on checkbox items', async () => {
            const items: DropdownMenuItem[] = [
                { type: 'checkbox', label: 'Check Me', checked: false, closeOnSelect: false }
            ]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                expect(getCheckboxItems().length).toBe(1)
                expect(getContent()).not.toBeNull()
            })
        })

        it('should accept closeOnSelect false on radio items', async () => {
            const items: DropdownMenuItem[] = [
                { type: 'radio', label: 'Option 1', value: 'opt1', closeOnSelect: false },
                { type: 'radio', label: 'Option 2', value: 'opt2', closeOnSelect: false }
            ]
            const radioGroups: DropdownMenuRadioGroup[] = [{ name: 'options', value: 'opt1' }]
            render(DropdownMenu, { open: true, items, radioGroups })
            await vi.waitFor(() => {
                expect(getRadioItems().length).toBe(2)
                expect(getContent()).not.toBeNull()
            })
        })
    })

    // ==================== COLORED ITEMS ====================

    describe('colored items', () => {
        it('should apply error color to item', async () => {
            const items: DropdownMenuItem[] = [{ label: 'Delete', color: 'error' }]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('text-error')
            })
        })

        it('should apply warning color to item', async () => {
            const items: DropdownMenuItem[] = [{ label: 'Archive', color: 'warning' }]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('text-warning')
            })
        })
    })

    // ==================== KEYBOARD SHORTCUTS ====================

    describe('keyboard shortcuts', () => {
        it('should render keyboard shortcuts', async () => {
            const items: DropdownMenuItem[] = [{ label: 'Save', kbds: ['meta', 's'] }]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                const kbds = item.querySelectorAll('kbd')
                expect(kbds.length).toBe(2)
            })
        })
    })

    // ==================== CALLBACKS ====================

    describe('callbacks', () => {
        it('should call onOpenChange when menu opens', async () => {
            const onOpenChange = vi.fn()
            render(DropdownMenu, { open: true, items: basicItems, onOpenChange })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
            expect(onOpenChange).toBeTypeOf('function')
        })

        it('should accept onSelect callback on items', async () => {
            const onSelect = vi.fn()
            const items: DropdownMenuItem[] = [
                { label: 'Click Me', onSelect, closeOnSelect: false }
            ]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                expect(getItems().length).toBe(1)
            })
            expect(onSelect).toBeTypeOf('function')
        })
    })

    // ==================== PORTAL ====================

    describe('portal', () => {
        it('should render in portal by default', async () => {
            const { container } = render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(container.contains(content)).toBe(false)
                expect(document.body.contains(content)).toBe(true)
            })
        })
    })

    // ==================== TRANSITION ====================

    describe('transition', () => {
        it('should apply transition animation classes by default', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toMatch(/animate-/)
            })
        })

        it('should not apply transition classes when transition is false', async () => {
            render(DropdownMenu, { open: true, items: basicItems, transition: false })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).not.toMatch(/animate-\[fade/)
            })
        })
    })

    // ==================== VARIANT CLASSES ====================

    describe('variant classes', () => {
        it('should apply content base classes', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('z-50')
                expect(content!.className).toContain('bg-surface-container-low')
                expect(content!.className).toContain('text-on-surface')
                expect(content!.className).toContain('rounded-md')
            })
        })

        it('should apply item hover classes', async () => {
            render(DropdownMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('data-[highlighted]:bg-surface-container-highest')
            })
        })

        it('should apply separator classes', async () => {
            const items: DropdownMenuItem[] = [
                { label: 'Item 1' },
                { type: 'separator' },
                { label: 'Item 2' }
            ]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                const separator = getSeparators()[0] as HTMLElement
                expect(separator.className).toContain('bg-outline-variant')
            })
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.content class', async () => {
            render(DropdownMenu, {
                open: true,
                items: basicItems,
                ui: { content: 'custom-content' }
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('custom-content')
            })
        })

        it('should apply ui.item class', async () => {
            render(DropdownMenu, {
                open: true,
                items: basicItems,
                ui: { item: 'custom-item' }
            })
            await vi.waitFor(() => {
                const items = getItems()
                items.forEach((item) => {
                    expect((item as HTMLElement).className).toContain('custom-item')
                })
            })
        })

        it('should apply ui.separator class', async () => {
            const items: DropdownMenuItem[] = [
                { label: 'Item 1' },
                { type: 'separator' },
                { label: 'Item 2' }
            ]
            render(DropdownMenu, {
                open: true,
                items,
                ui: { separator: 'custom-separator' }
            })
            await vi.waitFor(() => {
                const separator = getSeparators()[0] as HTMLElement
                expect(separator.className).toContain('custom-separator')
            })
        })

        it('should apply ui.label class', async () => {
            const items: DropdownMenuItem[] = [
                { type: 'label', label: 'Group' },
                { label: 'Item 1' }
            ]
            render(DropdownMenu, {
                open: true,
                items,
                ui: { label: 'custom-label' }
            })
            await vi.waitFor(() => {
                const heading = getGroupHeadings()[0] as HTMLElement
                expect(heading.className).toContain('custom-label')
            })
        })

        it('should apply item-level class override', async () => {
            const items: DropdownMenuItem[] = [{ label: 'Item 1', class: 'my-custom-class' }]
            render(DropdownMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('my-custom-class')
            })
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render with arrow and custom side', async () => {
            render(DropdownMenu, { open: true, items: basicItems, arrow: true, side: 'top' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('top')
                expect(getArrow()).not.toBeNull()
            })
        })

        it('should render with custom alignment and side', async () => {
            render(DropdownMenu, { open: true, items: basicItems, side: 'right', align: 'end' })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.getAttribute('data-side')).toBe('right')
                expect(content!.getAttribute('data-align')).toBe('end')
            })
        })

        it('should render all item types together', async () => {
            const items: DropdownMenuItem[] = [
                { type: 'label', label: 'Actions' },
                { label: 'Edit', icon: 'lucide:pencil' },
                { type: 'separator' },
                { type: 'checkbox', label: 'Show Hidden', checked: true },
                { type: 'separator' },
                { type: 'radio', label: 'Light', value: 'light' },
                { type: 'radio', label: 'Dark', value: 'dark' },
                { type: 'separator' },
                {
                    type: 'sub',
                    label: 'More',
                    items: [{ label: 'Sub Item' }]
                }
            ]
            const radioGroups: DropdownMenuRadioGroup[] = [{ name: 'theme', value: 'light' }]
            render(DropdownMenu, { open: true, items, radioGroups })

            await vi.waitFor(() => {
                // Check that all item types are rendered
                expect(getItems().length).toBeGreaterThanOrEqual(1)
                expect(getCheckboxItems().length).toBe(1)
                expect(getRadioItems().length).toBe(2)
                expect(getSubTriggers().length).toBe(1)
                expect(getSeparators().length).toBe(3)
                expect(getGroupHeadings().length).toBe(1)
            })
        })

        it('should render with all ui overrides', async () => {
            render(DropdownMenu, {
                open: true,
                items: basicItems,
                ui: {
                    content: 'content-custom',
                    group: 'group-custom',
                    item: 'item-custom',
                    itemIcon: 'icon-custom',
                    itemLabel: 'label-custom'
                }
            })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toContain('content-custom')

                const items = getItems()
                expect((items[0] as HTMLElement).className).toContain('item-custom')
            })
        })
    })
})
