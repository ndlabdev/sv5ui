import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import CommandTestWrapper from './CommandTestWrapper.svelte'
import type { CommandGroup } from './command.types.js'

const getRoot = () => document.querySelector('[data-command-root]') as HTMLElement | null
const getInput = () => document.querySelector('[data-command-input]') as HTMLInputElement | null
const getList = () => document.querySelector('[data-command-list]') as HTMLElement | null
const getItems = () => Array.from(document.querySelectorAll('[data-command-item]')) as HTMLElement[]
const getEmpty = () => document.querySelector('[data-command-empty]') as HTMLElement | null
const getGroups = () =>
    Array.from(document.querySelectorAll('[data-command-group]')) as HTMLElement[]
const getGroupHeadings = () =>
    Array.from(document.querySelectorAll('[data-command-group-heading]')) as HTMLElement[]

const sampleGroups: CommandGroup[] = [
    {
        id: 'actions',
        label: 'Actions',
        items: [
            { value: 'new-file', label: 'New File', icon: 'lucide:file-plus' },
            { value: 'open-file', label: 'Open File', icon: 'lucide:folder-open' },
            { value: 'save', label: 'Save', icon: 'lucide:save' }
        ]
    }
]

const multiGroups: CommandGroup[] = [
    {
        id: 'files',
        label: 'Files',
        items: [
            { value: 'new', label: 'New File' },
            { value: 'open', label: 'Open File' }
        ]
    },
    {
        id: 'edit',
        label: 'Edit',
        items: [
            { value: 'copy', label: 'Copy' },
            { value: 'paste', label: 'Paste' }
        ]
    }
]

describe('Command', () => {
    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('should render a command root element', () => {
            render(CommandTestWrapper, { groups: sampleGroups })
            expect(getRoot()).not.toBeNull()
        })

        it('should render a search input', () => {
            render(CommandTestWrapper, { groups: sampleGroups })
            expect(getInput()).not.toBeNull()
        })

        it('should render a list element', () => {
            render(CommandTestWrapper, { groups: sampleGroups })
            expect(getList()).not.toBeNull()
        })

        it('should render items from groups', () => {
            render(CommandTestWrapper, { groups: sampleGroups })
            expect(getItems()).toHaveLength(3)
        })

        it('should render placeholder text', () => {
            render(CommandTestWrapper, { groups: sampleGroups, placeholder: 'Search here...' })
            expect(getInput()!.placeholder).toBe('Search here...')
        })
    })

    // ==================== GROUPS ====================

    describe('groups', () => {
        it('should render group containers', () => {
            render(CommandTestWrapper, { groups: multiGroups })
            expect(getGroups()).toHaveLength(2)
        })

        it('should render group headings', () => {
            render(CommandTestWrapper, { groups: multiGroups })
            const headings = getGroupHeadings()
            expect(headings).toHaveLength(2)
            expect(headings[0]!.textContent).toContain('Files')
            expect(headings[1]!.textContent).toContain('Edit')
        })

        it('should render all items across groups', () => {
            render(CommandTestWrapper, { groups: multiGroups })
            expect(getItems()).toHaveLength(4)
        })

        it('should not render heading when group has no label', () => {
            render(CommandTestWrapper, {
                groups: [{ id: 'no-label', items: [{ value: 'test', label: 'Test' }] }]
            })
            expect(getGroupHeadings()).toHaveLength(0)
        })
    })

    // ==================== SEARCH / FILTERING ====================

    describe('filtering', () => {
        it('should filter items based on search input', async () => {
            render(CommandTestWrapper, { groups: sampleGroups })
            const input = getInput()!
            input.focus()
            input.value = 'New'
            input.dispatchEvent(new Event('input', { bubbles: true }))
            await vi.waitFor(() => {
                const visibleItems = getItems().filter(
                    (el) => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true'
                )
                expect(visibleItems.length).toBeLessThan(3)
            })
        })

        it('should show empty state when no results match', async () => {
            render(CommandTestWrapper, { groups: sampleGroups, emptyText: 'Nothing found' })
            const input = getInput()!
            input.focus()
            input.value = 'zzzzzzzzz'
            input.dispatchEvent(new Event('input', { bubbles: true }))
            await vi.waitFor(() => {
                const empty = getEmpty()
                expect(empty).not.toBeNull()
            })
        })

        it('should not filter when shouldFilter=false', () => {
            render(CommandTestWrapper, { groups: sampleGroups, shouldFilter: false })
            expect(getItems()).toHaveLength(3)
        })
    })

    // ==================== DISABLED ITEMS ====================

    describe('disabled items', () => {
        it('should render data-disabled on disabled items', () => {
            const groups: CommandGroup[] = [
                {
                    id: 'test',
                    items: [
                        { value: 'enabled', label: 'Enabled' },
                        { value: 'disabled', label: 'Disabled', disabled: true }
                    ]
                }
            ]
            render(CommandTestWrapper, { groups })
            const items = getItems()
            const disabledItem = items.find((el) => el.hasAttribute('data-disabled'))
            expect(disabledItem).not.toBeUndefined()
        })
    })

    // ==================== ITEM SELECTION ====================

    describe('selection', () => {
        it('should call onSelect when item is selected', async () => {
            const onSelect = vi.fn()
            const groups: CommandGroup[] = [
                {
                    id: 'test',
                    items: [{ value: 'click-me', label: 'Click Me', onSelect }]
                }
            ]
            render(CommandTestWrapper, { groups })
            const item = getItems()[0]!
            item.click()
            await vi.waitFor(() => {
                expect(onSelect).toHaveBeenCalled()
            })
        })
    })

    // ==================== LOADING ====================

    describe('loading', () => {
        it('should show loading state when loading=true', () => {
            render(CommandTestWrapper, { groups: [], loading: true })
            const loading = document.querySelector('[data-command-loading]')
            expect(loading).not.toBeNull()
        })

        it('should not show items when loading', () => {
            render(CommandTestWrapper, { groups: sampleGroups, loading: true })
            expect(getItems()).toHaveLength(0)
        })
    })

    // ==================== SIZES ====================

    describe('sizes', () => {
        it('should apply md size classes by default', () => {
            render(CommandTestWrapper, { groups: sampleGroups })
            expect(getInput()!.className).toMatch(/h-12/)
        })

        it('should apply xs size classes', () => {
            render(CommandTestWrapper, { groups: sampleGroups, size: 'xs' })
            expect(getInput()!.className).toMatch(/h-9/)
        })

        it('should apply xl size classes', () => {
            render(CommandTestWrapper, { groups: sampleGroups, size: 'xl' })
            expect(getInput()!.className).toMatch(/h-14/)
        })
    })

    // ==================== CUSTOM CLASS & UI ====================

    describe('custom class & ui', () => {
        it('should apply custom class to root', () => {
            render(CommandTestWrapper, { groups: sampleGroups, class: 'my-command' })
            expect(getRoot()!.className).toContain('my-command')
        })

        it('should apply ui.root override', () => {
            render(CommandTestWrapper, { groups: sampleGroups, ui: { root: 'custom-root' } })
            expect(getRoot()!.className).toContain('custom-root')
        })

        it('should apply ui.input override', () => {
            render(CommandTestWrapper, { groups: sampleGroups, ui: { input: 'custom-input' } })
            expect(getInput()!.className).toContain('custom-input')
        })
    })

    // ==================== COMBINED ====================

    describe('combined', () => {
        it('should render multiple groups with size and custom class', () => {
            render(CommandTestWrapper, {
                groups: multiGroups,
                size: 'lg',
                class: 'combined-test'
            })
            expect(getGroups()).toHaveLength(2)
            expect(getRoot()!.className).toContain('combined-test')
            expect(getInput()!.className).toMatch(/h-13/)
        })
    })
})
