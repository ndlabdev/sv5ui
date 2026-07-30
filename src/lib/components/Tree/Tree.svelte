<script lang="ts" module>
    import type { TreeItem as TreeItemType, TreeProps } from './tree.types.js'

    export type Props<T extends TreeItemType = TreeItemType> = TreeProps<T>
</script>

<script lang="ts" generics="T extends TreeItem">
    import type { ClassNameValue } from 'tailwind-merge'
    import { untrack } from 'svelte'
    import { SvelteSet } from 'svelte/reactivity'
    import { slide } from 'svelte/transition'
    import { treeVariants, treeDefaults } from './tree.variants.js'
    import type { TreeApi, TreeItem, TreeValue } from './tree.types.js'
    import { getComponentConfig, iconsDefaults } from '../../config.js'
    import Icon from '../Icon/Icon.svelte'

    const config = getComponentConfig('tree', treeDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        items = [],
        getKey,
        labelKey = 'label' as keyof T & string,
        value = $bindable(),
        defaultValue,
        onValueChange,
        expanded = $bindable(),
        defaultExpanded,
        onExpandedChange,
        api = $bindable(),
        multiple = false,
        selectionBehavior = 'toggle',
        propagateSelect = false,
        bubbleSelect = false,
        disabled = false,
        color = config.defaultVariants.color ?? 'primary',
        size = config.defaultVariants.size ?? 'md',
        trailingIcon = icons.chevronDown,
        expandedIcon = icons.folderOpen,
        collapsedIcon = icons.folder,
        class: className,
        ui,
        item: itemSnippet,
        itemLeading,
        itemLabel,
        itemTrailing,
        onclick,
        onkeydown,
        onpointerdown,
        onfocusout,
        ...restProps
    }: TreeProps<T> = $props()

    interface FlatNode {
        item: T
        key: string
        parentKey: string | null
        level: number
        index: number
        setsize: number
        posinset: number
        hasChildren: boolean
        childKeys: string[]
        selectableDescendantKeys: string[]
    }

    interface NodeIndex {
        byKey: Map<string, FlatNode>
        topLevelKeys: string[]
        parentKeys: string[]
    }

    function resolveKey(item: T, indexPath: string): string {
        if (getKey) return getKey(item, indexPath)
        if (item.value !== undefined) return item.value
        const label = item[labelKey]
        if (typeof label === 'string' && label) return label
        return indexPath
    }

    const nodeIndex = $derived.by((): NodeIndex => {
        const entries: [string, FlatNode][] = []
        const seen: Record<string, true> = Object.create(null)
        const parentKeys: string[] = []

        const walk = (
            levelItems: T[],
            parentKey: string | null,
            level: number,
            parentPath: string
        ): { childKeys: string[]; selectable: string[] } => {
            const childKeys: string[] = []
            const selectable: string[] = []

            levelItems.forEach((levelItem, index) => {
                const indexPath = parentPath ? `${parentPath}.${index}` : String(index)
                let key = resolveKey(levelItem, indexPath)
                if (seen[key]) {
                    key = indexPath
                    while (seen[key]) key = `#${key}`
                }
                seen[key] = true

                const children = Array.isArray(levelItem.children) ? levelItem.children : []
                const node: FlatNode = {
                    item: levelItem,
                    key,
                    parentKey,
                    level,
                    index,
                    setsize: levelItems.length,
                    posinset: index + 1,
                    hasChildren: children.length > 0,
                    childKeys: [],
                    selectableDescendantKeys: []
                }
                entries.push([key, node])
                childKeys.push(key)

                if (node.hasChildren) {
                    parentKeys.push(key)
                    const sub = walk(children, key, level + 1, indexPath)
                    node.childKeys = sub.childKeys
                    node.selectableDescendantKeys = sub.selectable
                }

                if (levelItem.disabled !== true) {
                    selectable.push(key, ...node.selectableDescendantKeys)
                }
            })

            return { childKeys, selectable }
        }

        const root = walk(items, null, 0, '')
        return { byKey: new Map(entries), topLevelKeys: root.childKeys, parentKeys }
    })

    if (expanded === undefined) {
        expanded = untrack(() => {
            if (defaultExpanded) return defaultExpanded
            const keys: string[] = []
            for (const node of nodeIndex.byKey.values()) {
                if (node.item.defaultExpanded === true && node.item.disabled !== true) {
                    keys.push(node.key)
                }
            }
            return keys
        })
    }

    if (value === undefined) {
        value = untrack(() => defaultValue ?? (multiple ? [] : undefined))
    }

    const expandedSet = $derived(new Set(expanded ?? []))

    const selectedKeys = $derived.by((): string[] => {
        if (multiple) return Array.isArray(value) ? value : []
        return typeof value === 'string' ? [value] : []
    })

    const selectedSet = $derived(new Set(selectedKeys))

    const checkboxSelection = $derived(multiple && (propagateSelect || bubbleSelect))

    const visibleKeys = $derived.by(() => {
        const out: string[] = []
        const visit = (keys: string[]) => {
            for (const key of keys) {
                out.push(key)
                const node = nodeIndex.byKey.get(key)
                if (node?.hasChildren && node.item.disabled !== true && expandedSet.has(key)) {
                    visit(node.childKeys)
                }
            }
        }
        visit(nodeIndex.topLevelKeys)
        return out
    })

    const indeterminateSet = $derived.by(() => {
        if (!multiple || (!propagateSelect && !bubbleSelect)) return new Set<string>()
        const keys = nodeIndex.parentKeys.filter((key) => {
            if (selectedSet.has(key)) return false
            const node = nodeIndex.byKey.get(key)
            return node?.selectableDescendantKeys.some((k) => selectedSet.has(k)) === true
        })
        return new Set(keys)
    })

    let focusedKey = $state<string | null>(null)
    let keyboardActive = $state(false)
    const itemEls: Record<string, HTMLElement> = Object.create(null)

    function isNodeDisabled(key: string): boolean {
        return disabled || nodeIndex.byKey.get(key)?.item.disabled === true
    }

    const rovingKey = $derived.by(() => {
        if (
            focusedKey !== null &&
            !isNodeDisabled(focusedKey) &&
            visibleKeys.includes(focusedKey)
        ) {
            return focusedKey
        }
        return visibleKeys.find((key) => !isNodeDisabled(key)) ?? null
    })

    function registerItem(key: string) {
        return (el: HTMLElement) => {
            itemEls[key] = el
            return () => {
                delete itemEls[key]
            }
        }
    }

    function moveFocus(key: string | null) {
        if (key === null) return
        focusedKey = key
        itemEls[key]?.focus()
    }

    function getLabel(node: FlatNode): string {
        const label = node.item[labelKey]
        return typeof label === 'string' ? label : ''
    }

    function isDescendantOf(key: string, ancestorKey: string): boolean {
        let current = nodeIndex.byKey.get(key)?.parentKey ?? null
        while (current !== null) {
            if (current === ancestorKey) return true
            current = nodeIndex.byKey.get(current)?.parentKey ?? null
        }
        return false
    }

    function setExpanded(next: string[]) {
        expanded = next
        onExpandedChange?.(next)
    }

    function toggleExpand(key: string) {
        const node = nodeIndex.byKey.get(key)
        if (!node?.hasChildren || isNodeDisabled(key)) return
        const isOpen = expandedSet.has(key)
        if (isOpen) {
            setExpanded((expanded ?? []).filter((k) => k !== key))
            if (focusedKey !== null && isDescendantOf(focusedKey, key)) moveFocus(key)
        } else {
            setExpanded([...(expanded ?? []), key])
        }
        node.item.onToggle?.(!isOpen)
    }

    function setValue(next: TreeValue | undefined) {
        value = next
        onValueChange?.(next)
    }

    function handleSelectSingle(node: FlatNode, wasSelected: boolean) {
        if (!wasSelected) {
            setValue(node.key)
            node.item.onSelect?.(true)
        } else if (selectionBehavior === 'toggle') {
            setValue(undefined)
            node.item.onSelect?.(false)
        }
    }

    function applyPropagate(node: FlatNode, next: Set<string>, nowSelected: boolean) {
        for (const k of node.selectableDescendantKeys) {
            if (nowSelected) next.add(k)
            else next.delete(k)
        }
    }

    function applyBubble(node: FlatNode, next: Set<string>) {
        let parentKey = node.parentKey
        while (parentKey !== null) {
            const parent = nodeIndex.byKey.get(parentKey)
            if (!parent) break
            if (parent.item.disabled !== true) {
                const selectableChildKeys = parent.childKeys.filter(
                    (k) => nodeIndex.byKey.get(k)?.item.disabled !== true
                )
                const allSelected =
                    selectableChildKeys.length > 0 && selectableChildKeys.every((k) => next.has(k))
                if (allSelected) next.add(parent.key)
                else next.delete(parent.key)
            }
            parentKey = parent.parentKey
        }
    }

    function handleSelectMultiple(node: FlatNode, wasSelected: boolean) {
        const next = new SvelteSet(selectionBehavior === 'replace' ? [node.key] : selectedSet)
        if (selectionBehavior !== 'replace') {
            if (wasSelected) next.delete(node.key)
            else next.add(node.key)
        }

        const nowSelected = next.has(node.key)
        if (propagateSelect) applyPropagate(node, next, nowSelected)
        if (bubbleSelect) applyBubble(node, next)

        const changed = next.size !== selectedSet.size || [...next].some((k) => !selectedSet.has(k))
        if (changed) setValue([...next])
        if (wasSelected !== nowSelected) node.item.onSelect?.(nowSelected)
    }

    function handleSelect(key: string) {
        const node = nodeIndex.byKey.get(key)
        if (!node || disabled || node.item.disabled) return
        const wasSelected = selectedSet.has(key)
        if (multiple) handleSelectMultiple(node, wasSelected)
        else handleSelectSingle(node, wasSelected)
    }

    function findEnabled(start: number, dir: 1 | -1): string | null {
        for (let i = start; i >= 0 && i < visibleKeys.length; i += dir) {
            const key = visibleKeys[i]
            if (!isNodeDisabled(key)) return key
        }
        return null
    }

    let typeaheadQuery = ''
    let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

    function handleTypeahead(char: string, currentIndex: number) {
        clearTimeout(typeaheadTimer)
        typeaheadQuery += char.toLowerCase()
        typeaheadTimer = setTimeout(() => {
            typeaheadQuery = ''
        }, 500)

        const total = visibleKeys.length
        const start = typeaheadQuery.length > 1 ? currentIndex : currentIndex + 1
        for (let offset = 0; offset < total; offset++) {
            const key = visibleKeys[(start + offset + total) % total]
            if (isNodeDisabled(key)) continue
            const node = nodeIndex.byKey.get(key)
            if (node && getLabel(node).toLowerCase().startsWith(typeaheadQuery)) {
                moveFocus(key)
                return
            }
        }
    }

    function moveIntoChildren(node: FlatNode) {
        if (!node.hasChildren) return
        if (!expandedSet.has(node.key)) {
            toggleExpand(node.key)
        } else {
            const firstChild = node.childKeys.find((k) => !isNodeDisabled(k))
            if (firstChild) moveFocus(firstChild)
        }
    }

    function moveOutOfChildren(node: FlatNode) {
        if (node.hasChildren && expandedSet.has(node.key)) {
            toggleExpand(node.key)
        } else if (node.parentKey !== null && !isNodeDisabled(node.parentKey)) {
            moveFocus(node.parentKey)
        }
    }

    function expandSiblings(node: FlatNode) {
        const siblings =
            node.parentKey !== null
                ? (nodeIndex.byKey.get(node.parentKey)?.childKeys ?? [])
                : nodeIndex.topLevelKeys
        const toExpand = siblings.filter((k) => {
            const sibling = nodeIndex.byKey.get(k)
            return sibling?.hasChildren === true && !expandedSet.has(k) && !isNodeDisabled(k)
        })
        if (toExpand.length > 0) setExpanded([...(expanded ?? []), ...toExpand])
    }

    function handleNavigationKey(key: string, currentIndex: number, node: FlatNode): boolean {
        switch (key) {
            case 'ArrowDown':
                moveFocus(findEnabled(currentIndex + 1, 1))
                return true
            case 'ArrowUp':
                moveFocus(findEnabled(currentIndex - 1, -1))
                return true
            case 'Home':
                moveFocus(findEnabled(0, 1))
                return true
            case 'End':
                moveFocus(findEnabled(visibleKeys.length - 1, -1))
                return true
            case 'ArrowRight':
                moveIntoChildren(node)
                return true
            case 'ArrowLeft':
                moveOutOfChildren(node)
                return true
            default:
                return false
        }
    }

    function handleActionKey(e: KeyboardEvent, currentIndex: number, node: FlatNode): boolean {
        switch (e.key) {
            case 'Enter':
                handleSelect(node.key)
                return true
            case ' ':
                if (typeaheadQuery.length > 0) handleTypeahead(' ', currentIndex)
                else handleSelect(node.key)
                return true
            case '*':
                expandSiblings(node)
                return true
            default:
                if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    handleTypeahead(e.key, currentIndex)
                    return true
                }
                return false
        }
    }

    function handleKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLUListElement }) {
        onkeydown?.(e)
        if (e.defaultPrevented || disabled) return
        const target = (e.target as HTMLElement).closest<HTMLElement>('[data-tree-item]')
        const currentKey = target?.dataset.key
        if (!currentKey) return
        const currentIndex = visibleKeys.indexOf(currentKey)
        const node = nodeIndex.byKey.get(currentKey)
        if (currentIndex === -1 || !node) return

        if (
            handleNavigationKey(e.key, currentIndex, node) ||
            handleActionKey(e, currentIndex, node)
        ) {
            keyboardActive = true
            e.preventDefault()
        }
    }

    function handlePointerdown(
        e: PointerEvent & { currentTarget: EventTarget & HTMLUListElement }
    ) {
        onpointerdown?.(e)
        keyboardActive = false
    }

    function handleFocusout(e: FocusEvent & { currentTarget: EventTarget & HTMLUListElement }) {
        onfocusout?.(e)
        if (!ref?.contains(e.relatedTarget as Node)) keyboardActive = false
    }

    const INTERACTIVE_SELECTOR =
        'input, button, a, select, textarea, [role="checkbox"], [role="switch"], [role="button"]'
    const TOGGLE_CONTROL_SELECTOR = 'input[type="checkbox"], [role="checkbox"], [role="switch"]'

    function nestedControl(target: HTMLElement, linkEl: HTMLElement): HTMLElement | null {
        const control = target.closest<HTMLElement>(INTERACTIVE_SELECTOR)
        return control !== null && linkEl.contains(control) ? control : null
    }

    interface ClickTarget {
        node: FlatNode
        key: string
        control: HTMLElement | null
    }

    function resolveClickTarget(e: MouseEvent): ClickTarget | null {
        if (disabled) return null
        const target = e.target as HTMLElement
        const linkEl = target.closest<HTMLElement>('[data-tree-link]')
        const key = linkEl?.dataset.key
        if (linkEl === null || key === undefined) return null
        const node = nodeIndex.byKey.get(key)
        if (!node || node.item.disabled) return null
        return { node, key, control: nestedControl(target, linkEl) }
    }

    function handleClick(e: MouseEvent & { currentTarget: EventTarget & HTMLUListElement }) {
        onclick?.(e)
        const hit = resolveClickTarget(e)
        if (hit === null) return
        const { node, key, control } = hit

        if (control !== null) {
            if (control.matches(TOGGLE_CONTROL_SELECTOR)) {
                moveFocus(key)
                handleSelect(key)
            }
            return
        }

        moveFocus(key)
        if (node.hasChildren) toggleExpand(key)
        handleSelect(key)
    }

    const apiInstance: TreeApi = {
        expand(key) {
            if (!expandedSet.has(key)) toggleExpand(key)
        },
        collapse(key) {
            if (expandedSet.has(key)) toggleExpand(key)
        },
        toggle(key) {
            toggleExpand(key)
        },
        expandAll() {
            setExpanded([...nodeIndex.parentKeys])
        },
        collapseAll() {
            const hadFocus = ref?.contains(document.activeElement) === true
            setExpanded([])
            if (hadFocus && focusedKey !== null && !visibleKeys.includes(focusedKey)) {
                moveFocus(rovingKey)
            }
        },
        select(key) {
            if (!selectedSet.has(key)) handleSelect(key)
        },
        deselect(key) {
            const node = nodeIndex.byKey.get(key)
            if (!node || !selectedSet.has(key)) return
            if (!multiple) {
                setValue(undefined)
                return
            }
            const next = new SvelteSet(selectedSet)
            next.delete(key)
            if (propagateSelect) applyPropagate(node, next, false)
            if (bubbleSelect) applyBubble(node, next)
            setValue([...next])
        },
        clearSelection() {
            setValue(multiple ? [] : undefined)
        },
        focus(key) {
            if (visibleKeys.includes(key) && !isNodeDisabled(key)) moveFocus(key)
        },
        isExpanded(key) {
            return expandedSet.has(key)
        },
        isSelected(key) {
            return selectedSet.has(key)
        },
        get expanded() {
            return expanded ?? []
        },
        get selected() {
            return value
        }
    }

    api = apiInstance

    const variantSlots = $derived(treeVariants({ color, size }))

    type ItemUi = TreeItem['ui']

    const classes = $derived.by(() => {
        const c = config.slots
        const slots = variantSlots
        const u = ui ?? {}

        const _item = slots.item({ class: [c.item, u.item] })
        const _itemParent = slots.item({
            class: [c.item, u.item, c.itemWithChildren, u.itemWithChildren]
        })
        const _listWithChildren = slots.listWithChildren({
            class: [c.listWithChildren, u.listWithChildren]
        })
        const _link = slots.link({ class: [c.link, u.link] })
        const _linkLeadingIcon = slots.linkLeadingIcon({
            class: [c.linkLeadingIcon, u.linkLeadingIcon]
        })
        const _linkLabel = slots.linkLabel({ class: [c.linkLabel, u.linkLabel] })
        const _linkTrailing = slots.linkTrailing({ class: [c.linkTrailing, u.linkTrailing] })
        const _linkTrailingIcon = slots.linkTrailingIcon({
            class: [c.linkTrailingIcon, u.linkTrailingIcon]
        })

        return {
            root: slots.root({ class: [c.root, className, u.root] }),
            item: (hasChildren: boolean, itemClass?: ClassNameValue, itemUi?: ItemUi) =>
                itemClass || itemUi
                    ? slots.item({
                          class: [
                              c.item,
                              u.item,
                              itemUi?.item,
                              hasChildren
                                  ? [
                                        c.itemWithChildren,
                                        u.itemWithChildren,
                                        itemUi?.itemWithChildren
                                    ]
                                  : undefined,
                              itemClass
                          ]
                      })
                    : hasChildren
                      ? _itemParent
                      : _item,
            listWithChildren: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.listWithChildren({
                          class: [c.listWithChildren, u.listWithChildren, itemUi.listWithChildren]
                      })
                    : _listWithChildren,
            link: (itemUi?: ItemUi) =>
                itemUi ? slots.link({ class: [c.link, u.link, itemUi.link] }) : _link,
            linkLeadingIcon: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.linkLeadingIcon({
                          class: [c.linkLeadingIcon, u.linkLeadingIcon, itemUi.linkLeadingIcon]
                      })
                    : _linkLeadingIcon,
            linkLabel: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.linkLabel({ class: [c.linkLabel, u.linkLabel, itemUi.linkLabel] })
                    : _linkLabel,
            linkTrailing: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.linkTrailing({
                          class: [c.linkTrailing, u.linkTrailing, itemUi.linkTrailing]
                      })
                    : _linkTrailing,
            linkTrailingIcon: (itemUi?: ItemUi) =>
                itemUi
                    ? slots.linkTrailingIcon({
                          class: [c.linkTrailingIcon, u.linkTrailingIcon, itemUi.linkTrailingIcon]
                      })
                    : _linkTrailingIcon
        }
    })
</script>

<ul
    bind:this={ref}
    role="tree"
    aria-multiselectable={multiple ? true : undefined}
    aria-disabled={disabled ? true : undefined}
    data-tree=""
    class={classes.root}
    onkeydown={handleKeydown}
    onclick={handleClick}
    onpointerdown={handlePointerdown}
    onfocusout={handleFocusout}
    {...restProps}
>
    {@render treeLevel(nodeIndex.topLevelKeys)}
</ul>

{#snippet treeLevel(keys: string[])}
    {#each keys as key (key)}
        {@const node = nodeIndex.byKey.get(key)}
        {#if node}
            {@const itemDisabled = disabled || node.item.disabled === true}
            {@const isExpanded =
                node.hasChildren && node.item.disabled !== true && expandedSet.has(key)}
            {@const isSelected = selectedSet.has(key)}
            {@const isIndeterminate = indeterminateSet.has(key)}
            {@const slotProps = {
                item: node.item,
                key,
                index: node.index,
                level: node.level,
                expanded: isExpanded,
                selected: isSelected,
                indeterminate: isIndeterminate,
                hasChildren: node.hasChildren,
                select: () => handleSelect(key),
                toggle: () => toggleExpand(key)
            }}
            <li
                role="treeitem"
                aria-level={node.level + 1}
                aria-setsize={node.setsize}
                aria-posinset={node.posinset}
                aria-expanded={node.hasChildren ? isExpanded : undefined}
                aria-selected={checkboxSelection
                    ? undefined
                    : multiple
                      ? isSelected
                      : isSelected || undefined}
                aria-checked={checkboxSelection
                    ? isIndeterminate
                        ? 'mixed'
                        : isSelected
                    : undefined}
                aria-disabled={itemDisabled ? true : undefined}
                tabindex={rovingKey === key ? 0 : -1}
                data-tree-item=""
                data-key={key}
                data-level={node.level}
                data-expanded={node.hasChildren ? isExpanded : undefined}
                data-selected={isSelected}
                data-indeterminate={isIndeterminate ? '' : undefined}
                data-disabled={itemDisabled ? '' : undefined}
                class={classes.item(node.hasChildren, node.item.class, node.item.ui)}
                {@attach registerItem(key)}
                onfocus={() => (focusedKey = key)}
            >
                <div
                    class={classes.link(node.item.ui)}
                    data-tree-link=""
                    data-key={key}
                    data-selected={isSelected}
                    data-expanded={node.hasChildren ? isExpanded : undefined}
                    data-disabled={itemDisabled ? '' : undefined}
                    data-keyboard-focus={keyboardActive && rovingKey === key ? '' : undefined}
                >
                    {#if itemSnippet}
                        {@render itemSnippet(slotProps)}
                    {:else}
                        {#if itemLeading}
                            {@render itemLeading(slotProps)}
                        {:else}
                            {@const leadingIcon =
                                node.item.icon ??
                                (node.hasChildren
                                    ? isExpanded
                                        ? expandedIcon
                                        : collapsedIcon
                                    : undefined)}
                            {#if leadingIcon}
                                <Icon
                                    name={leadingIcon}
                                    class={classes.linkLeadingIcon(node.item.ui)}
                                />
                            {/if}
                        {/if}

                        {#if itemLabel}
                            {@render itemLabel(slotProps)}
                        {:else}
                            <span class={classes.linkLabel(node.item.ui)}>{getLabel(node)}</span>
                        {/if}

                        {#if itemTrailing}
                            {@render itemTrailing(slotProps)}
                        {:else if node.hasChildren}
                            <span class={classes.linkTrailing(node.item.ui)}>
                                <Icon
                                    name={node.item.trailingIcon ?? trailingIcon}
                                    class={classes.linkTrailingIcon(node.item.ui)}
                                />
                            </span>
                        {/if}
                    {/if}
                </div>

                {#if node.hasChildren && isExpanded}
                    <ul
                        role="group"
                        class={classes.listWithChildren(node.item.ui)}
                        transition:slide={{ duration: 200 }}
                    >
                        {@render treeLevel(node.childKeys)}
                    </ul>
                {/if}
            </li>
        {/if}
    {/each}
{/snippet}
