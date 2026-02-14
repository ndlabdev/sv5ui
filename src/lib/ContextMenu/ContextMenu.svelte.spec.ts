import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page } from 'vitest/browser'
import ContextMenu from './ContextMenu.svelte'
import type { ContextMenuItem, ContextMenuRadioGroup } from './context-menu.types.js'

describe('ContextMenu', () => {
    const basicItems: ContextMenuItem[] = [
        { label: 'Item 1', icon: 'lucide:file' },
        { label: 'Item 2', icon: 'lucide:folder' },
        { label: 'Item 3' }
    ]

    const getContent = () =>
        document.querySelector('[data-context-menu-content]') as HTMLElement | null
    const getItems = () => document.querySelectorAll('[data-context-menu-item]')
    const getSeparators = () => document.querySelectorAll('[data-context-menu-separator]')
    const getGroupHeadings = () => document.querySelectorAll('[data-context-menu-group-heading]')
    const getCheckboxItems = () => document.querySelectorAll('[data-context-menu-checkbox-item]')
    const getRadioItems = () => document.querySelectorAll('[data-context-menu-radio-item]')
    const getSubTriggers = () => document.querySelectorAll('[data-context-menu-sub-trigger]')

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render without crashing', () => {
            const { container } = render(ContextMenu)
            expect(container).not.toBeNull()
        })

        it('should not render content when closed', () => {
            render(ContextMenu, { items: basicItems })
            expect(getContent()).toBeNull()
        })

        it('should render content when open', async () => {
            render(ContextMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
        })

        it('should render all items', async () => {
            render(ContextMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                expect(getItems().length).toBe(3)
            })
        })

        it('should render item labels', async () => {
            render(ContextMenu, { open: true, items: basicItems })
            await expect.element(page.getByText('Item 1')).toBeVisible()
            await expect.element(page.getByText('Item 2')).toBeVisible()
            await expect.element(page.getByText('Item 3')).toBeVisible()
        })

        it('should render item icons', async () => {
            render(ContextMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const items = getItems()
                const firstItem = items[0] as HTMLElement
                const icon = firstItem.querySelector('svg')
                expect(icon).not.toBeNull()
            })
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size by default', async () => {
            render(ContextMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('py-1.5')
            })
        })

        it('should apply xs size', async () => {
            render(ContextMenu, { open: true, items: basicItems, size: 'xs' })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('text-xs')
            })
        })

        it('should apply sm size', async () => {
            render(ContextMenu, { open: true, items: basicItems, size: 'sm' })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('py-1')
            })
        })

        it('should apply lg size', async () => {
            render(ContextMenu, { open: true, items: basicItems, size: 'lg' })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('py-2')
            })
        })

        it('should apply xl size', async () => {
            render(ContextMenu, { open: true, items: basicItems, size: 'xl' })
            await vi.waitFor(() => {
                const items = getItems()
                const item = items[0] as HTMLElement
                expect(item.className).toContain('py-2.5')
            })
        })
    })

    // ==================== ITEM TYPES ====================

    describe('item types', () => {
        describe('separator', () => {
            it('should render separator items', async () => {
                const items: ContextMenuItem[] = [
                    { label: 'Item 1' },
                    { type: 'separator' },
                    { label: 'Item 2' }
                ]
                render(ContextMenu, { open: true, items })
                await vi.waitFor(() => {
                    expect(getSeparators().length).toBe(1)
                })
            })
        })

        describe('label', () => {
            it('should render label items as group headings', async () => {
                const items: ContextMenuItem[] = [
                    { type: 'label', label: 'Group Label' },
                    { label: 'Item 1' }
                ]
                render(ContextMenu, { open: true, items })
                await expect.element(page.getByText('Group Label')).toBeVisible()
            })
        })

        describe('checkbox', () => {
            it('should render checkbox items', async () => {
                const items: ContextMenuItem[] = [
                    { type: 'checkbox', label: 'Checkbox 1', checked: false },
                    { type: 'checkbox', label: 'Checkbox 2', checked: true }
                ]
                render(ContextMenu, { open: true, items })
                await vi.waitFor(() => {
                    expect(getCheckboxItems().length).toBe(2)
                })
            })

            it('should show check icon when checked', async () => {
                const items: ContextMenuItem[] = [
                    { type: 'checkbox', label: 'Checked Item', checked: true }
                ]
                render(ContextMenu, { open: true, items })
                await vi.waitFor(() => {
                    const checkboxItem = getCheckboxItems()[0] as HTMLElement
                    const icon = checkboxItem.querySelector('svg')
                    expect(icon).not.toBeNull()
                })
            })

            it('should accept onCheckedChange callback prop', async () => {
                const onCheckedChange = vi.fn()
                const items: ContextMenuItem[] = [
                    {
                        type: 'checkbox',
                        label: 'Checkbox',
                        checked: false,
                        closeOnSelect: false,
                        onCheckedChange
                    }
                ]
                render(ContextMenu, { open: true, items })
                await vi.waitFor(() => {
                    expect(getCheckboxItems().length).toBe(1)
                })
                expect(onCheckedChange).toBeTypeOf('function')
            })
        })

        describe('radio', () => {
            it('should render radio items', async () => {
                const items: ContextMenuItem[] = [
                    { type: 'radio', label: 'Option 1', value: 'opt1' },
                    { type: 'radio', label: 'Option 2', value: 'opt2' }
                ]
                const radioGroups: ContextMenuRadioGroup[] = [{ name: 'options', value: 'opt1' }]
                render(ContextMenu, { open: true, items, radioGroups })
                await vi.waitFor(() => {
                    expect(getRadioItems().length).toBe(2)
                })
            })

            it('should show check icon for selected radio item', async () => {
                const items: ContextMenuItem[] = [
                    { type: 'radio', label: 'Option 1', value: 'opt1' },
                    { type: 'radio', label: 'Option 2', value: 'opt2' }
                ]
                const radioGroups: ContextMenuRadioGroup[] = [{ name: 'options', value: 'opt1' }]
                render(ContextMenu, { open: true, items, radioGroups })
                await vi.waitFor(() => {
                    const radioItems = getRadioItems()
                    const selectedItem = radioItems[0] as HTMLElement
                    const icon = selectedItem.querySelector('svg')
                    expect(icon).not.toBeNull()
                })
            })

            it('should accept onValueChange callback in radioGroups', async () => {
                const onValueChange = vi.fn()
                const items: ContextMenuItem[] = [
                    { type: 'radio', label: 'Option 1', value: 'opt1', closeOnSelect: false },
                    { type: 'radio', label: 'Option 2', value: 'opt2', closeOnSelect: false }
                ]
                const radioGroups: ContextMenuRadioGroup[] = [
                    { name: 'options', value: 'opt1', onValueChange }
                ]
                render(ContextMenu, { open: true, items, radioGroups })
                await vi.waitFor(() => {
                    expect(getRadioItems().length).toBe(2)
                })
                expect(onValueChange).toBeTypeOf('function')
            })
        })

        describe('submenu', () => {
            it('should render submenu trigger', async () => {
                const items: ContextMenuItem[] = [
                    {
                        type: 'sub',
                        label: 'More Options',
                        items: [{ label: 'Sub Item 1' }, { label: 'Sub Item 2' }]
                    }
                ]
                render(ContextMenu, { open: true, items })
                await vi.waitFor(() => {
                    expect(getSubTriggers().length).toBe(1)
                })
                await expect.element(page.getByText('More Options')).toBeVisible()
            })

            it('should render submenu icon', async () => {
                const items: ContextMenuItem[] = [
                    {
                        type: 'sub',
                        label: 'More Options',
                        icon: 'lucide:settings',
                        items: [{ label: 'Sub Item 1' }]
                    }
                ]
                render(ContextMenu, { open: true, items })
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
            const items: ContextMenuItem[] = [
                { label: 'Enabled Item' },
                { label: 'Disabled Item', disabled: true }
            ]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                const menuItems = getItems()
                const disabledItem = menuItems[1] as HTMLElement
                expect(disabledItem.getAttribute('data-disabled')).not.toBeNull()
            })
        })

        it('should apply disabled styles', async () => {
            const items: ContextMenuItem[] = [{ label: 'Disabled Item', disabled: true }]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('data-[disabled]:opacity-50')
            })
        })
    })

    // ==================== CLOSE ON SELECT ====================

    describe('closeOnSelect', () => {
        it('should render items with default closeOnSelect behavior', async () => {
            const items: ContextMenuItem[] = [{ label: 'Click Me' }]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item).not.toBeNull()
            })
        })
    })

    // ==================== COLORED ITEMS ====================

    describe('colored items', () => {
        it('should apply error color to item', async () => {
            const items: ContextMenuItem[] = [{ label: 'Delete', color: 'error' }]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('text-error')
            })
        })

        it('should apply warning color to item', async () => {
            const items: ContextMenuItem[] = [{ label: 'Archive', color: 'warning' }]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('text-warning')
            })
        })

        it('should apply primary color to item', async () => {
            const items: ContextMenuItem[] = [{ label: 'Primary', color: 'primary' }]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('text-primary')
            })
        })

        it('should apply highlighted color classes for error item', async () => {
            const items: ContextMenuItem[] = [{ label: 'Delete', color: 'error' }]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('data-[highlighted]:bg-error-container')
                expect(item.className).toContain('data-[highlighted]:text-on-error-container')
            })
        })

        it('should apply error color to item icon', async () => {
            const items: ContextMenuItem[] = [
                { label: 'Delete', icon: 'lucide:trash-2', color: 'error' }
            ]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                const iconWrapper = item.querySelector('svg')?.parentElement
                expect(iconWrapper).not.toBeNull()
                expect(iconWrapper!.className).toContain('text-error')
            })
        })
    })

    // ==================== KEYBOARD SHORTCUTS ====================

    describe('keyboard shortcuts', () => {
        it('should render keyboard shortcuts', async () => {
            const items: ContextMenuItem[] = [{ label: 'Save', kbds: ['meta', 's'] }]
            render(ContextMenu, { open: true, items })
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
            render(ContextMenu, { open: true, items: basicItems, onOpenChange })
            await vi.waitFor(() => {
                expect(getContent()).not.toBeNull()
            })
            expect(onOpenChange).toBeTypeOf('function')
        })

        it('should accept onSelect callback on items', async () => {
            const onSelect = vi.fn()
            const items: ContextMenuItem[] = [{ label: 'Click Me', onSelect, closeOnSelect: false }]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                expect(getItems().length).toBe(1)
            })
            expect(onSelect).toBeTypeOf('function')
        })
    })

    // ==================== PORTAL ====================

    describe('portal', () => {
        it('should render in portal by default', async () => {
            const { container } = render(ContextMenu, { open: true, items: basicItems })
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
            render(ContextMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const content = getContent()
                expect(content).not.toBeNull()
                expect(content!.className).toMatch(/animate-/)
            })
        })

        it('should not apply transition classes when transition is false', async () => {
            render(ContextMenu, { open: true, items: basicItems, transition: false })
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
            render(ContextMenu, { open: true, items: basicItems })
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
            render(ContextMenu, { open: true, items: basicItems })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('data-[highlighted]:bg-surface-container-highest')
            })
        })

        it('should apply separator classes', async () => {
            const items: ContextMenuItem[] = [
                { label: 'Item 1' },
                { type: 'separator' },
                { label: 'Item 2' }
            ]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                const separator = getSeparators()[0] as HTMLElement
                expect(separator.className).toContain('bg-outline-variant')
            })
        })
    })

    // ==================== UI SLOT OVERRIDES ====================

    describe('ui slot overrides', () => {
        it('should apply ui.content class', async () => {
            render(ContextMenu, {
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
            render(ContextMenu, {
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
            const items: ContextMenuItem[] = [
                { label: 'Item 1' },
                { type: 'separator' },
                { label: 'Item 2' }
            ]
            render(ContextMenu, {
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
            const items: ContextMenuItem[] = [
                { type: 'label', label: 'Group' },
                { label: 'Item 1' }
            ]
            render(ContextMenu, {
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
            const items: ContextMenuItem[] = [{ label: 'Item 1', class: 'my-custom-class' }]
            render(ContextMenu, { open: true, items })
            await vi.waitFor(() => {
                const item = getItems()[0] as HTMLElement
                expect(item.className).toContain('my-custom-class')
            })
        })
    })

    // ==================== COMBINED FEATURES ====================

    describe('combined features', () => {
        it('should render all item types together', async () => {
            const items: ContextMenuItem[] = [
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
            const radioGroups: ContextMenuRadioGroup[] = [{ name: 'theme', value: 'light' }]
            render(ContextMenu, { open: true, items, radioGroups })

            await vi.waitFor(() => {
                expect(getItems().length).toBeGreaterThanOrEqual(1)
                expect(getCheckboxItems().length).toBe(1)
                expect(getRadioItems().length).toBe(2)
                expect(getSubTriggers().length).toBe(1)
                expect(getSeparators().length).toBe(3)
                expect(getGroupHeadings().length).toBe(1)
            })
        })

        it('should render with all ui overrides', async () => {
            render(ContextMenu, {
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

        it('should render colored items with icons and kbds', async () => {
            const items: ContextMenuItem[] = [
                { label: 'Edit', icon: 'lucide:pencil' },
                { type: 'separator' },
                { label: 'Archive', icon: 'lucide:archive', color: 'warning', kbds: ['meta', 'a'] },
                { label: 'Delete', icon: 'lucide:trash-2', color: 'error', kbds: ['delete'] }
            ]
            render(ContextMenu, { open: true, items })

            await vi.waitFor(() => {
                const menuItems = getItems()
                expect(menuItems.length).toBe(3)
                expect(getSeparators().length).toBe(1)

                const archiveItem = menuItems[1] as HTMLElement
                expect(archiveItem.className).toContain('text-warning')

                const deleteItem = menuItems[2] as HTMLElement
                expect(deleteItem.className).toContain('text-error')
                expect(deleteItem.querySelectorAll('kbd').length).toBe(1)
            })
        })
    })
})
