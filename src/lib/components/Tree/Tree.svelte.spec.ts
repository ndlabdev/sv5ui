import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Tree from './Tree.svelte'
import type { TreeApi, TreeItem } from './tree.types.js'

describe('Tree', () => {
    const sampleItems: TreeItem[] = [
        {
            label: 'src',
            children: [{ label: 'lib', children: [{ label: 'index.ts' }] }, { label: 'app.ts' }]
        },
        { label: 'static', children: [{ label: 'favicon.png' }] },
        { label: 'locked', disabled: true, children: [{ label: 'secret' }] },
        { label: 'README.md' }
    ]

    const checkboxItems: TreeItem[] = [
        {
            label: 'docs',
            defaultExpanded: true,
            children: [{ label: 'read' }, { label: 'write' }]
        }
    ]

    const getTree = (container: Element) =>
        container.querySelector('[data-tree]') as HTMLUListElement
    const getItems = (container: Element) =>
        container.querySelectorAll('[data-tree-item]') as NodeListOf<HTMLLIElement>
    const getItem = (container: Element, key: string) =>
        container.querySelector(`[data-tree-item][data-key="${key}"]`) as HTMLLIElement | null
    const getLink = (container: Element, key: string) =>
        container.querySelector(`[data-tree-link][data-key="${key}"]`) as HTMLElement | null

    const pressKey = (el: Element, key: string) =>
        el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))

    const renderWithApi = (props: Record<string, unknown>) => {
        let api: TreeApi | undefined
        const result = render(Tree, {
            ...props,
            get api() {
                return api
            },
            set api(v: TreeApi | undefined) {
                api = v
            }
        })
        return { ...result, getApi: () => api }
    }

    // ==================== RENDERING ====================

    describe('rendering', () => {
        it('renders a role=tree root', () => {
            const { container } = render(Tree, { items: sampleItems })
            expect(getTree(container).getAttribute('role')).toBe('tree')
        })

        it('renders only top-level items when collapsed', () => {
            const { container } = render(Tree, { items: sampleItems })
            expect(getItems(container).length).toBe(4)
        })

        it('expands nodes listed in defaultExpanded', () => {
            const { container } = render(Tree, { items: sampleItems, defaultExpanded: ['src'] })
            expect(getItems(container).length).toBe(6)
            expect(getItem(container, 'src')?.getAttribute('aria-expanded')).toBe('true')
        })

        it('expands nodes marked item.defaultExpanded', () => {
            const { container } = render(Tree, { items: checkboxItems })
            expect(getItems(container).length).toBe(3)
        })

        it('renders labels via custom labelKey', () => {
            interface NamedItem extends TreeItem {
                name: string
            }
            const items: NamedItem[] = [{ name: 'Custom Node' }]
            const { container } = render(Tree, { items, labelKey: 'name' } as never)
            expect(container.textContent).toContain('Custom Node')
        })

        it('treats leaves and empty children as non-expandable', () => {
            const { container } = render(Tree, {
                items: [{ label: 'leaf' }, { label: 'empty', children: [] }]
            })
            expect(getItem(container, 'leaf')?.hasAttribute('aria-expanded')).toBe(false)
            expect(getItem(container, 'empty')?.hasAttribute('aria-expanded')).toBe(false)
        })

        it('sets aria-level, aria-setsize and aria-posinset on nested items', () => {
            const { container } = render(Tree, {
                items: sampleItems,
                defaultExpanded: ['src', 'lib']
            })
            const lib = getItem(container, 'lib')
            expect(lib?.getAttribute('aria-level')).toBe('2')
            expect(lib?.getAttribute('aria-setsize')).toBe('2')
            expect(lib?.getAttribute('aria-posinset')).toBe('1')
            const index = getItem(container, 'index.ts')
            expect(index?.getAttribute('aria-level')).toBe('3')
        })

        it('sets aria-multiselectable only when multiple', () => {
            const single = render(Tree, { items: sampleItems })
            expect(getTree(single.container).hasAttribute('aria-multiselectable')).toBe(false)
            const multi = render(Tree, { items: sampleItems, multiple: true })
            expect(getTree(multi.container).getAttribute('aria-multiselectable')).toBe('true')
        })

        it('resolves duplicate keys to index paths', () => {
            const { container } = render(Tree, {
                items: [{ label: 'same' }, { label: 'same' }]
            })
            expect(getItem(container, 'same')).not.toBeNull()
            expect(getItem(container, '1')).not.toBeNull()
        })

        it('keeps keys unique when the index-path fallback also collides', () => {
            const { container } = render(Tree, {
                items: [{ label: '1' }, { label: '1' }]
            })
            expect(getItems(container).length).toBe(2)
            expect(getItem(container, '1')).not.toBeNull()
            expect(getItem(container, '#1')).not.toBeNull()
        })
    })

    // ==================== EXPANSION ====================

    describe('expansion', () => {
        it('toggles a parent on click', async () => {
            const { container } = render(Tree, { items: sampleItems })
            await getLink(container, 'src')!.click()
            await vi.waitFor(() => {
                expect(getItem(container, 'src')?.getAttribute('aria-expanded')).toBe('true')
                expect(getItem(container, 'app.ts')).not.toBeNull()
            })
            await getLink(container, 'src')!.click()
            await vi.waitFor(() => {
                expect(getItem(container, 'src')?.getAttribute('aria-expanded')).toBe('false')
                expect(getItem(container, 'app.ts')).toBeNull()
            })
        })

        it('fires onExpandedChange with the new keys', async () => {
            const onExpandedChange = vi.fn()
            const { container } = render(Tree, { items: sampleItems, onExpandedChange })
            await getLink(container, 'src')!.click()
            await vi.waitFor(() => {
                expect(onExpandedChange).toHaveBeenCalledWith(['src'])
            })
        })

        it('controlled expanded=[] overrides item.defaultExpanded', () => {
            const { container } = render(Tree, { items: checkboxItems, expanded: [] })
            expect(getItems(container).length).toBe(1)
        })

        it('calls item.onToggle with the new state', async () => {
            const onToggle = vi.fn()
            const items: TreeItem[] = [
                { label: 'parent', onToggle, children: [{ label: 'child' }] }
            ]
            const { container } = render(Tree, { items })
            await getLink(container, 'parent')!.click()
            await vi.waitFor(() => {
                expect(onToggle).toHaveBeenCalledWith(true)
            })
            await getLink(container, 'parent')!.click()
            await vi.waitFor(() => {
                expect(onToggle).toHaveBeenCalledWith(false)
            })
        })

        it('does not expand or select disabled parents', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Tree, { items: sampleItems, onValueChange })
            await getLink(container, 'locked')!.click()
            expect(getItem(container, 'locked')?.getAttribute('aria-expanded')).toBe('false')
            expect(onValueChange).not.toHaveBeenCalled()
        })

        it('does not expand disabled parents via keyboard or api', async () => {
            const { container, getApi } = renderWithApi({ items: sampleItems })
            await vi.waitFor(() => expect(getApi()).toBeDefined())
            const locked = getItem(container, 'locked')!
            locked.focus()
            pressKey(locked, 'ArrowRight')
            expect(locked.getAttribute('aria-expanded')).toBe('false')
            getApi()?.toggle('locked')
            expect(getApi()?.isExpanded('locked')).toBe(false)
        })

        it('ignores defaultExpanded on disabled parents', () => {
            const { container } = render(Tree, {
                items: [
                    {
                        label: 'locked',
                        disabled: true,
                        defaultExpanded: true,
                        children: [{ label: 'secret' }]
                    }
                ]
            })
            expect(getItems(container).length).toBe(1)
            expect(getItem(container, 'locked')?.getAttribute('aria-expanded')).toBe('false')
        })

        it('api.expandAll and api.collapseAll toggle every parent', async () => {
            const { container, getApi } = renderWithApi({ items: sampleItems })
            await vi.waitFor(() => expect(getApi()).toBeDefined())
            getApi()?.expandAll()
            await vi.waitFor(() => {
                expect(getItem(container, 'index.ts')).not.toBeNull()
            })
            expect(getApi()?.isExpanded('src')).toBe(true)
            getApi()?.collapseAll()
            await vi.waitFor(() => {
                expect(getItem(container, 'src')?.getAttribute('aria-expanded')).toBe('false')
            })
        })
    })

    // ==================== SELECTION ====================

    describe('selection', () => {
        it('selects a leaf on click and fires onValueChange', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Tree, { items: sampleItems, onValueChange })
            await getLink(container, 'README.md')!.click()
            await vi.waitFor(() => {
                expect(getItem(container, 'README.md')?.getAttribute('aria-selected')).toBe('true')
                expect(onValueChange).toHaveBeenCalledWith('README.md')
            })
        })

        it('deselects on second click in single toggle mode', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Tree, { items: sampleItems, onValueChange })
            await getLink(container, 'README.md')!.click()
            await getLink(container, 'README.md')!.click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(undefined)
                expect(getItem(container, 'README.md')?.hasAttribute('aria-selected')).toBe(false)
            })
        })

        it('keeps the selection on re-click with selectionBehavior=replace', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Tree, {
                items: sampleItems,
                selectionBehavior: 'replace',
                onValueChange
            })
            await getLink(container, 'README.md')!.click()
            await getLink(container, 'README.md')!.click()
            await vi.waitFor(() => {
                expect(getItem(container, 'README.md')?.getAttribute('aria-selected')).toBe('true')
            })
            expect(onValueChange).toHaveBeenCalledTimes(1)
        })

        it('replaces the previous selection in single mode', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Tree, { items: sampleItems, onValueChange })
            await getLink(container, 'README.md')!.click()
            await getLink(container, 'static')!.click()
            await vi.waitFor(() => {
                expect(getItem(container, 'README.md')?.hasAttribute('aria-selected')).toBe(false)
                expect(getItem(container, 'static')?.getAttribute('aria-selected')).toBe('true')
            })
        })

        it('toggles membership in multiple mode', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Tree, {
                items: sampleItems,
                multiple: true,
                onValueChange
            })
            await getLink(container, 'README.md')!.click()
            await getLink(container, 'static')!.click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(['README.md', 'static'])
            })
            await getLink(container, 'README.md')!.click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(['static'])
            })
        })

        it('replaces the whole set with selectionBehavior=replace in multiple mode', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Tree, {
                items: sampleItems,
                multiple: true,
                selectionBehavior: 'replace',
                onValueChange
            })
            await getLink(container, 'README.md')!.click()
            await getLink(container, 'static')!.click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(['static'])
            })
        })

        it('propagateSelect selects all selectable descendants', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Tree, {
                items: checkboxItems,
                multiple: true,
                propagateSelect: true,
                onValueChange
            })
            await getLink(container, 'docs')!.click()
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(['docs', 'read', 'write'])
            })
        })

        it('bubbleSelect selects the parent once all children are selected and marks partial parents indeterminate', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Tree, {
                items: checkboxItems,
                multiple: true,
                propagateSelect: true,
                bubbleSelect: true,
                onValueChange
            })
            await getLink(container, 'read')!.click()
            await vi.waitFor(() => {
                expect(getItem(container, 'docs')?.getAttribute('aria-checked')).toBe('mixed')
                expect(getItem(container, 'docs')?.hasAttribute('data-indeterminate')).toBe(true)
            })
            await getLink(container, 'write')!.click()
            await vi.waitFor(() => {
                expect(getItem(container, 'docs')?.getAttribute('aria-checked')).toBe('true')
            })
            await getLink(container, 'read')!.click()
            await vi.waitFor(() => {
                expect(getItem(container, 'docs')?.getAttribute('aria-checked')).toBe('mixed')
                expect(getItem(container, 'docs')?.hasAttribute('data-indeterminate')).toBe(true)
            })
        })

        it('honors defaultValue', () => {
            const { container } = render(Tree, { items: sampleItems, defaultValue: 'README.md' })
            expect(getItem(container, 'README.md')?.getAttribute('aria-selected')).toBe('true')
        })
    })

    // ==================== KEYBOARD ====================

    describe('keyboard', () => {
        it('ArrowDown and ArrowUp move focus through visible items, skipping disabled', async () => {
            const { container } = render(Tree, { items: sampleItems })
            const src = getItem(container, 'src')!
            src.focus()
            pressKey(src, 'ArrowDown')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem(container, 'static'))
            })
            pressKey(getItem(container, 'static')!, 'ArrowDown')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem(container, 'README.md'))
            })
            pressKey(getItem(container, 'README.md')!, 'ArrowUp')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem(container, 'static'))
            })
        })

        it('ArrowRight expands, then moves into the first child', async () => {
            const { container } = render(Tree, { items: sampleItems })
            const src = getItem(container, 'src')!
            src.focus()
            pressKey(src, 'ArrowRight')
            await vi.waitFor(() => {
                expect(getItem(container, 'src')?.getAttribute('aria-expanded')).toBe('true')
            })
            pressKey(getItem(container, 'src')!, 'ArrowRight')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem(container, 'lib'))
            })
        })

        it('ArrowLeft collapses, then moves to the parent', async () => {
            const { container } = render(Tree, {
                items: sampleItems,
                defaultExpanded: ['src']
            })
            const appTs = getItem(container, 'app.ts')!
            appTs.focus()
            pressKey(appTs, 'ArrowLeft')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem(container, 'src'))
            })
            pressKey(getItem(container, 'src')!, 'ArrowLeft')
            await vi.waitFor(() => {
                expect(getItem(container, 'src')?.getAttribute('aria-expanded')).toBe('false')
            })
        })

        it('Home and End jump to the first and last visible item', async () => {
            const { container } = render(Tree, { items: sampleItems })
            const staticItem = getItem(container, 'static')!
            staticItem.focus()
            pressKey(staticItem, 'End')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem(container, 'README.md'))
            })
            pressKey(getItem(container, 'README.md')!, 'Home')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem(container, 'src'))
            })
        })

        it('Enter and Space select the focused item', async () => {
            const onValueChange = vi.fn()
            const { container } = render(Tree, {
                items: sampleItems,
                multiple: true,
                onValueChange
            })
            const readme = getItem(container, 'README.md')!
            readme.focus()
            pressKey(readme, 'Enter')
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(['README.md'])
            })
            const staticItem = getItem(container, 'static')!
            staticItem.focus()
            pressKey(staticItem, ' ')
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(['README.md', 'static'])
            })
        })

        it('typeahead focuses the next matching label', async () => {
            const { container } = render(Tree, { items: sampleItems })
            const src = getItem(container, 'src')!
            src.focus()
            pressKey(src, 'r')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem(container, 'README.md'))
            })
        })

        it('* expands every sibling parent', async () => {
            const { container } = render(Tree, { items: sampleItems })
            const src = getItem(container, 'src')!
            src.focus()
            pressKey(src, '*')
            await vi.waitFor(() => {
                expect(getItem(container, 'src')?.getAttribute('aria-expanded')).toBe('true')
                expect(getItem(container, 'static')?.getAttribute('aria-expanded')).toBe('true')
            })
            expect(getItem(container, 'locked')?.getAttribute('aria-expanded')).toBe('false')
        })

        it('keeps exactly one item in the tab order', async () => {
            const { container } = render(Tree, { items: sampleItems, defaultExpanded: ['src'] })
            expect(container.querySelectorAll('[data-tree-item][tabindex="0"]').length).toBe(1)
            const staticItem = getItem(container, 'static')!
            staticItem.focus()
            await vi.waitFor(() => {
                expect(container.querySelectorAll('[data-tree-item][tabindex="0"]').length).toBe(1)
                expect(staticItem.getAttribute('tabindex')).toBe('0')
            })
        })
    })

    // ==================== API ====================

    describe('api', () => {
        it('select, deselect and clearSelection update the value', async () => {
            const onValueChange = vi.fn()
            const { getApi } = renderWithApi({
                items: sampleItems,
                multiple: true,
                onValueChange
            })
            await vi.waitFor(() => expect(getApi()).toBeDefined())
            getApi()?.select('README.md')
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(['README.md'])
                expect(getApi()?.isSelected('README.md')).toBe(true)
            })
            getApi()?.deselect('README.md')
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith([])
            })
            getApi()?.select('static')
            getApi()?.clearSelection()
            await vi.waitFor(() => {
                expect(getApi()?.isSelected('static')).toBe(false)
            })
        })

        it('exposes expanded and selected getters', async () => {
            const { getApi } = renderWithApi({
                items: sampleItems,
                defaultExpanded: ['src'],
                defaultValue: 'app.ts'
            })
            await vi.waitFor(() => expect(getApi()).toBeDefined())
            expect(getApi()?.expanded).toEqual(['src'])
            expect(getApi()?.selected).toBe('app.ts')
        })

        it('api.deselect keeps propagate/bubble selection consistent', async () => {
            const onValueChange = vi.fn()
            const { getApi } = renderWithApi({
                items: checkboxItems,
                multiple: true,
                propagateSelect: true,
                bubbleSelect: true,
                onValueChange
            })
            await vi.waitFor(() => expect(getApi()).toBeDefined())
            getApi()?.select('docs')
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(['docs', 'read', 'write'])
            })
            getApi()?.deselect('read')
            await vi.waitFor(() => {
                expect(onValueChange).toHaveBeenLastCalledWith(['write'])
            })
        })

        it('api.focus moves keyboard focus to a visible node', async () => {
            const { container, getApi } = renderWithApi({ items: sampleItems })
            await vi.waitFor(() => expect(getApi()).toBeDefined())
            getApi()?.focus('static')
            await vi.waitFor(() => {
                expect(document.activeElement).toBe(getItem(container, 'static'))
            })
        })
    })

    // ==================== STYLING ====================

    describe('styling', () => {
        it('applies ui overrides and item classes', () => {
            const items: TreeItem[] = [
                { label: 'styled', class: 'item-extra', ui: { link: 'link-extra' } }
            ]
            const { container } = render(Tree, {
                items,
                class: 'root-extra',
                ui: { root: 'root-ui' }
            })
            expect(getTree(container).classList.contains('root-extra')).toBe(true)
            expect(getTree(container).classList.contains('root-ui')).toBe(true)
            expect(getItem(container, 'styled')?.classList.contains('item-extra')).toBe(true)
            expect(getLink(container, 'styled')?.classList.contains('link-extra')).toBe(true)
        })

        it('marks selected and disabled state via data attributes', async () => {
            const { container } = render(Tree, {
                items: sampleItems,
                defaultValue: 'README.md'
            })
            expect(getLink(container, 'README.md')?.getAttribute('data-selected')).toBe('true')
            expect(getItem(container, 'locked')?.hasAttribute('data-disabled')).toBe(true)
        })
    })
})
