<script lang="ts" module>
    import type { TableProps } from './table.types.js'

    export type Props = TableProps
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<script lang="ts" generics="T extends Record<string, any>">
    import type { SortItem, SortState, TableColumn } from './table.types.js'
    import { tableVariants, tableDefaults } from './table.variants.js'
    import { getComponentConfig, iconsDefaults } from '../config.js'
    import Icon from '../Icon/Icon.svelte'
    import Button from '../Button/Button.svelte'
    import Checkbox from '../Checkbox/Checkbox.svelte'
    import {
        autoGenerateColumns,
        getRowKey,
        sortData,
        filterByGlobal,
        filterByColumns,
        paginateData,
        resolveVisibleColumns,
        computePinOffsets,
        formatCellValue
    } from './table.utils.js'

    const config = getComponentConfig('table', tableDefaults)
    const icons = getComponentConfig('icons', iconsDefaults)

    let {
        ref = $bindable(null),
        as = 'div',
        data = [] as T[],
        columns: columnsProp,
        rowKey,
        caption,

        // Sorting
        sorting = $bindable([]),
        multiSort = false,
        manualSorting = false,
        onSortingChange,

        // Global Filter
        globalFilter = $bindable(''),
        globalFilterKeys,
        manualFiltering = false,
        onGlobalFilterChange,

        // Column Filters
        columnFilters = $bindable({}),
        onColumnFiltersChange,

        // Pagination
        page = $bindable(0),
        pageSize = 10,
        manualPagination = false,
        onPageChange,

        // Row Selection
        selection,
        selectedRows = $bindable([]),
        onSelectionChange,

        // Column Visibility
        columnVisibility = $bindable(),
        onColumnVisibilityChange,

        // Column Pinning
        columnPinning = $bindable(),

        // Row Pinning
        pinnedRows = $bindable([]),
        onPinnedRowsChange,

        // Row Expanding
        expandedRows = $bindable([]),
        onExpandedChange,

        // Column Resizing
        columnSizing = $bindable({}),
        onColumnSizingChange,

        // Visual
        loading = false,
        loadingColor = config.defaultVariants.loadingColor ?? 'primary',
        loadingAnimation = config.defaultVariants.loadingAnimation ?? 'carousel',
        empty = 'No data.',
        striped = false,
        hoverable = config.defaultVariants.hoverable ?? true,
        sticky = false,

        // Callbacks
        onRowClick,
        onRowHover,
        onRowContextmenu,

        // Styling
        ui,
        class: className,

        // Slots
        captionSlot,
        emptySlot,
        loadingSlot,
        expandedSlot,
        bodyTopSlot,
        bodyBottomSlot,
        headerSlot,
        cellSlot,

        ...restProps
    }: TableProps<T> = $props()

    // =========================================================================
    // Change notifications — skip initial mount, fire only on subsequent changes
    // =========================================================================
    let _prevGlobalFilter = globalFilter
    let _prevColumnFilters = columnFilters
    let _prevPage = page
    let _prevColumnVisibility = columnVisibility
    let _prevPinnedRows = pinnedRows
    let _prevExpandedRows = expandedRows

    $effect(() => {
        if (globalFilter !== _prevGlobalFilter) {
            _prevGlobalFilter = globalFilter
            onGlobalFilterChange?.(globalFilter)
        }
    })
    $effect(() => {
        if (columnFilters !== _prevColumnFilters) {
            _prevColumnFilters = columnFilters
            onColumnFiltersChange?.(columnFilters)
        }
    })
    $effect(() => {
        if (page !== _prevPage) {
            _prevPage = page
            onPageChange?.(page)
        }
    })
    $effect(() => {
        if (columnVisibility !== _prevColumnVisibility) {
            _prevColumnVisibility = columnVisibility
            if (columnVisibility !== undefined) onColumnVisibilityChange?.(columnVisibility)
        }
    })
    $effect(() => {
        if (pinnedRows !== _prevPinnedRows) {
            _prevPinnedRows = pinnedRows
            onPinnedRowsChange?.(pinnedRows)
        }
    })
    $effect(() => {
        if (expandedRows !== _prevExpandedRows) {
            _prevExpandedRows = expandedRows
            onExpandedChange?.(expandedRows)
        }
    })

    // =========================================================================
    // Resolved Columns
    // =========================================================================
    const resolvedColumns = $derived.by((): TableColumn<T>[] => {
        if (columnsProp && columnsProp.length > 0) return columnsProp
        return autoGenerateColumns(data)
    })

    const visibleColumns = $derived(
        resolveVisibleColumns(resolvedColumns, columnVisibility, columnPinning)
    )

    const hasFooter = $derived(visibleColumns.some((col) => col.footer))
    const totalColspan = $derived(visibleColumns.length + (selection === 'multiple' ? 1 : 0))

    // =========================================================================
    // Data Pipeline: filter → sort → paginate
    // =========================================================================
    const filteredData = $derived.by(() => {
        if (manualFiltering) return data
        let result = data
        if (globalFilter) {
            result = filterByGlobal(result, globalFilter, globalFilterKeys)
        }
        if (columnFilters && Object.keys(columnFilters).length > 0) {
            result = filterByColumns(result, columnFilters, resolvedColumns)
        }
        return result
    })

    const sortedData = $derived.by(() => {
        if (manualSorting || sorting.length === 0) return filteredData
        return sortData(filteredData, sorting, resolvedColumns)
    })

    const paginatedData = $derived.by(() => {
        if (manualPagination) return sortedData
        if (pageSize <= 0) return sortedData
        return paginateData(sortedData, page, pageSize)
    })

    // =========================================================================
    // Row Pinning — split paginated data into pinned (top) + unpinned
    // =========================================================================
    const pinnedKeySet = $derived(new Set(pinnedRows))

    const pinnedData = $derived.by(() => {
        if (pinnedRows.length === 0) return []
        return sortedData.filter((row, i) => pinnedKeySet.has(getRowKey(row, rowKey, i)))
    })

    const unpinnedPaginatedData = $derived.by(() => {
        if (pinnedRows.length === 0) return paginatedData
        return paginatedData.filter((row, i) => {
            const absIdx = manualPagination ? i : page * pageSize + i
            return !pinnedKeySet.has(getRowKey(row, rowKey, absIdx))
        })
    })

    const hasVisibleRows = $derived(pinnedData.length > 0 || unpinnedPaginatedData.length > 0)

    // =========================================================================
    // Sorting
    // =========================================================================
    function getSortDirection(key: string): 'asc' | 'desc' | null {
        const item = sorting.find((s) => s.key === key)
        return item ? item.direction : null
    }

    function toggleSort(key: string, event?: MouseEvent) {
        const current = getSortDirection(key)
        let next: SortItem | null

        if (current === null) next = { key, direction: 'asc' }
        else if (current === 'asc') next = { key, direction: 'desc' }
        else next = null

        let newSorting: SortState

        if (multiSort && event?.shiftKey) {
            const without = sorting.filter((s) => s.key !== key)
            newSorting = next ? [...without, next] : without
        } else {
            newSorting = next ? [next] : []
        }

        sorting = newSorting
        onSortingChange?.(newSorting)
    }

    // =========================================================================
    // Row Selection — uses actual visible rows (pinned + unpinned on page)
    // =========================================================================
    const selectedKeySet = $derived.by(() => {
        if (!selection) return new Set<string | number>()
        return new Set(selectedRows.map((row, i) => getRowKey(row, rowKey, i)))
    })

    const actualVisibleRows = $derived.by((): { row: T; absIdx: number }[] => {
        const rows: { row: T; absIdx: number }[] = []
        for (let i = 0; i < pinnedData.length; i++) {
            rows.push({ row: pinnedData[i], absIdx: i })
        }
        for (let i = 0; i < unpinnedPaginatedData.length; i++) {
            const absIdx = manualPagination ? i : page * pageSize + i
            rows.push({ row: unpinnedPaginatedData[i], absIdx })
        }
        return rows
    })

    function isRowSelected(row: T, index: number): boolean {
        return selectedKeySet.has(getRowKey(row, rowKey, index))
    }

    function toggleRowSelect(row: T, index: number) {
        if (!selection) return
        const key = getRowKey(row, rowKey, index)

        if (selection === 'single') {
            const isSelected = selectedKeySet.has(key)
            const next = isSelected ? [] : [row]
            selectedRows = next
            onSelectionChange?.(next)
            return
        }

        const isSelected = selectedKeySet.has(key)
        let next: T[]
        if (isSelected) {
            next = selectedRows.filter((r, i) => getRowKey(r, rowKey, i) !== key)
        } else {
            next = [...selectedRows, row]
        }
        selectedRows = next
        onSelectionChange?.(next)
    }

    const allVisibleSelected = $derived(
        selection === 'multiple' &&
            actualVisibleRows.length > 0 &&
            actualVisibleRows.every(({ row, absIdx }) => isRowSelected(row, absIdx))
    )

    const someVisibleSelected = $derived(
        selection === 'multiple' &&
            actualVisibleRows.length > 0 &&
            actualVisibleRows.some(({ row, absIdx }) => isRowSelected(row, absIdx)) &&
            !allVisibleSelected
    )

    function toggleSelectAll() {
        if (!selection || selection !== 'multiple') return

        let next: T[]
        if (allVisibleSelected) {
            const visibleKeys = new Set(
                actualVisibleRows.map(({ row, absIdx }) => getRowKey(row, rowKey, absIdx))
            )
            next = selectedRows.filter((r, i) => !visibleKeys.has(getRowKey(r, rowKey, i)))
        } else {
            const existing = new Set(selectedRows.map((r, i) => getRowKey(r, rowKey, i)))
            const toAdd = actualVisibleRows
                .filter(({ row, absIdx }) => !existing.has(getRowKey(row, rowKey, absIdx)))
                .map(({ row }) => row)
            next = [...selectedRows, ...toAdd]
        }
        selectedRows = next
        onSelectionChange?.(next)
    }

    // =========================================================================
    // Row Expanding
    // =========================================================================
    function isRowExpanded(key: string | number): boolean {
        return expandedRows.includes(key)
    }

    // =========================================================================
    // Column Resizing
    // =========================================================================
    let resizing = $state<{ key: string; startX: number; startWidth: number } | null>(null)

    function onResizeStart(e: MouseEvent, col: TableColumn<T>) {
        e.preventDefault()
        const currentWidth = columnSizing[col.key] ?? col.width ?? 150
        resizing = { key: col.key, startX: e.clientX, startWidth: currentWidth }

        const onMove = (ev: MouseEvent) => {
            if (!resizing) return
            const diff = ev.clientX - resizing.startX
            let newWidth = resizing.startWidth + diff
            const min = col.minWidth ?? 50
            const max = col.maxWidth ?? Infinity
            newWidth = Math.max(min, Math.min(max, newWidth))
            columnSizing = { ...columnSizing, [resizing.key]: newWidth }
            onColumnSizingChange?.(columnSizing)
        }

        const onUp = () => {
            resizing = null
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onUp)
        }

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onUp)
    }

    // =========================================================================
    // Row Interactions
    // =========================================================================
    const isSelectable = $derived(!!onRowClick || !!selection || !!onRowHover || !!onRowContextmenu)

    function handleRowClick(e: MouseEvent, row: T, index: number) {
        const target = e.target as HTMLElement
        if (target.closest('button, a, input, select, textarea, [role="checkbox"]')) return
        if (selection) toggleRowSelect(row, index)
        onRowClick?.(row, index, e)
    }

    function handleRowKeyDown(e: KeyboardEvent, row: T, index: number) {
        if (!onRowClick && !selection) return
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (selection) toggleRowSelect(row, index)
            onRowClick?.(row, index, e as unknown as MouseEvent)
        }
    }

    function handleRowPointerEnter(e: PointerEvent, row: T, index: number) {
        onRowHover?.(row, index, e)
    }

    function handleRowPointerLeave(e: PointerEvent, row: T, index: number) {
        onRowHover?.(null, index, e)
    }

    function handleRowContextmenu(e: MouseEvent, row: T, index: number) {
        onRowContextmenu?.(row, index, e)
    }

    // =========================================================================
    // Column Pinning
    // =========================================================================
    const pinOffsets = $derived(computePinOffsets(visibleColumns, columnSizing, columnPinning))

    function getPinStyle(key: string): string {
        const pin = pinOffsets.get(key)
        if (!pin) return ''
        return `${pin.side}: ${pin.offset}px`
    }

    function isPinned(key: string): boolean {
        return pinOffsets.has(key)
    }

    // =========================================================================
    // Column Width Style
    // =========================================================================
    function getColWidth(col: TableColumn<T>): string | undefined {
        const w = columnSizing[col.key] ?? col.width
        return w ? `${w}px` : undefined
    }

    // =========================================================================
    // Align class
    // =========================================================================
    function getAlignClass(align?: 'left' | 'center' | 'right'): string {
        if (align === 'center') return 'text-center'
        if (align === 'right') return 'text-right'
        return ''
    }

    // =========================================================================
    // Variant Classes
    // =========================================================================
    const variantSlots = $derived(
        tableVariants({
            hoverable: hoverable || undefined,
            striped: striped || undefined,
            sticky: sticky || undefined,
            loading: loading || undefined,
            loadingColor,
            loadingAnimation
        } as Parameters<typeof tableVariants>[0])
    )

    const pinnedVariantSlots = $derived(
        tableVariants({ pinned: true } as Parameters<typeof tableVariants>[0])
    )

    const classes = $derived({
        root: variantSlots.root({ class: [config.slots.root, className, ui?.root] }),
        base: variantSlots.base({ class: [config.slots.base, ui?.base] }),
        caption: variantSlots.caption({ class: [config.slots.caption, ui?.caption] }),
        thead: variantSlots.thead({ class: [config.slots.thead, ui?.thead] }),
        tbody: variantSlots.tbody({ class: [config.slots.tbody, ui?.tbody] }),
        tfoot: variantSlots.tfoot({ class: [config.slots.tfoot, ui?.tfoot] }),
        tr: variantSlots.tr({ class: [config.slots.tr, ui?.tr] }),
        th: variantSlots.th({ class: [config.slots.th, ui?.th] }),
        thPinned: pinnedVariantSlots.th({ class: [config.slots.th, ui?.th] }),
        td: variantSlots.td({ class: [config.slots.td, ui?.td] }),
        tdPinned: pinnedVariantSlots.td({ class: [config.slots.td, ui?.td] }),
        separator: variantSlots.separator({ class: [config.slots.separator, ui?.separator] }),
        empty: variantSlots.empty({ class: [config.slots.empty, ui?.empty] }),
        loading: variantSlots.loading({ class: [config.slots.loading, ui?.loading] })
    })

    function thClass(key: string): string {
        return isPinned(key) ? classes.thPinned : classes.th
    }

    function tdClass(key: string): string {
        return isPinned(key) ? classes.tdPinned : classes.td
    }
</script>

{#snippet tableRow(row: T, absIdx: number, rowKeyVal: string | number, rowPinned: boolean)}
    {@const selected = isRowSelected(row, absIdx)}
    {@const expanded = isRowExpanded(rowKeyVal)}
    <tr
        class={classes.tr}
        data-selected={selected || undefined}
        data-selectable={isSelectable || undefined}
        data-expanded={expanded || undefined}
        data-pinned-row={rowPinned || undefined}
        aria-selected={selection ? selected : undefined}
        tabindex={onRowClick || selection ? 0 : undefined}
        onclick={isSelectable ? (e) => handleRowClick(e, row, absIdx) : undefined}
        onkeydown={onRowClick || selection ? (e) => handleRowKeyDown(e, row, absIdx) : undefined}
        onpointerenter={onRowHover ? (e) => handleRowPointerEnter(e, row, absIdx) : undefined}
        onpointerleave={onRowHover ? (e) => handleRowPointerLeave(e, row, absIdx) : undefined}
        oncontextmenu={onRowContextmenu ? (e) => handleRowContextmenu(e, row, absIdx) : undefined}
    >
        {#if selection === 'multiple'}
            <td class={classes.td} style="width: 48px">
                <Checkbox
                    checked={selected}
                    onCheckedChange={() => toggleRowSelect(row, absIdx)}
                    size="sm"
                    aria-label="Select row {absIdx + 1}"
                />
            </td>
        {/if}

        {#each visibleColumns as col, colIdx (col.key)}
            <td
                class="{tdClass(col.key)} {getAlignClass(col.align)} {col.cellClass ?? ''}"
                data-pinned={isPinned(col.key) || undefined}
                style={getPinStyle(col.key)}
                colspan={col.cellColspan}
                rowspan={col.cellRowspan}
            >
                {#if col.cell}
                    {@render col.cell({
                        row,
                        column: col,
                        rowIndex: absIdx,
                        columnIndex: colIdx,
                        value: row[col.key]
                    })}
                {:else if cellSlot}
                    {@render cellSlot({
                        row,
                        column: col,
                        rowIndex: absIdx,
                        columnIndex: colIdx,
                        value: row[col.key]
                    })}
                {:else}
                    {formatCellValue(row[col.key])}
                {/if}
            </td>
        {/each}
    </tr>

    {#if expanded && expandedSlot}
        <tr class={classes.tr}>
            <td class={classes.td} colspan={totalColspan}>
                {@render expandedSlot({ row, rowIndex: absIdx })}
            </td>
        </tr>
    {/if}
{/snippet}

<svelte:element
    this={as}
    bind:this={ref}
    class={classes.root}
    role="region"
    aria-label={caption ?? 'Data table'}
    {...restProps}
>
    <table class={classes.base}>
        {#if captionSlot}
            <caption class={classes.caption}>
                {@render captionSlot()}
            </caption>
        {:else if caption}
            <caption class={classes.caption}>{caption}</caption>
        {/if}

        {#if visibleColumns.length > 0}
            <colgroup>
                {#if selection === 'multiple'}
                    <col style="width: 48px" />
                {/if}
                {#each visibleColumns as col (col.key)}
                    <col style:width={getColWidth(col)} />
                {/each}
            </colgroup>
        {/if}

        <!-- THEAD -->
        <thead class={classes.thead}>
            <tr class={classes.tr}>
                {#if selection === 'multiple'}
                    <th
                        class={classes.th}
                        scope="col"
                        style="width: 48px"
                        aria-label="Select all rows"
                    >
                        <Checkbox
                            checked={allVisibleSelected}
                            indeterminate={someVisibleSelected}
                            onCheckedChange={toggleSelectAll}
                            size="sm"
                        />
                    </th>
                {/if}

                {#each visibleColumns as col, colIdx (col.key)}
                    {@const sortDir = getSortDirection(col.key)}
                    {@const sortable = col.sortable === true}
                    <th
                        class="{thClass(col.key)} {getAlignClass(col.align)} {col.headerClass ??
                            ''}"
                        scope="col"
                        data-pinned={isPinned(col.key) || undefined}
                        style="{getPinStyle(col.key)}{getColWidth(col)
                            ? `; width: ${getColWidth(col)}`
                            : ''}"
                        aria-sort={sortDir === 'asc'
                            ? 'ascending'
                            : sortDir === 'desc'
                              ? 'descending'
                              : undefined}
                        colspan={col.colspan}
                        rowspan={col.rowspan}
                    >
                        {#if col.header}
                            {@render col.header({
                                column: col,
                                columnIndex: colIdx,
                                sortDirection: sortDir,
                                toggleSort: () => toggleSort(col.key)
                            })}
                        {:else if headerSlot}
                            {@render headerSlot({
                                column: col,
                                columnIndex: colIdx,
                                sortDirection: sortDir,
                                toggleSort: () => toggleSort(col.key)
                            })}
                        {:else if sortable}
                            <Button
                                variant="ghost"
                                color="surface"
                                size="xs"
                                label={col.label ?? col.key}
                                trailingIcon={sortDir === 'asc'
                                    ? icons.sortAsc
                                    : sortDir === 'desc'
                                      ? icons.sortDesc
                                      : icons.sortDefault}
                                onclick={(e) => toggleSort(col.key, e)}
                                aria-label="Sort by {col.label ?? col.key}"
                                class="-ms-2 font-semibold tracking-wider uppercase {sortDir
                                    ? ''
                                    : '*:last:opacity-30'}"
                            />
                        {:else}
                            {col.label ?? col.key}
                        {/if}

                        {#if col.resizable}
                            <!-- svelte-ignore a11y_no_static_element_interactions -->
                            <span
                                class="group/resize absolute top-0 -right-px flex h-full w-4 cursor-col-resize touch-none items-center justify-center select-none"
                                onmousedown={(e) => onResizeStart(e, col)}
                            >
                                <span
                                    class="h-4 w-0.5 rounded-full bg-outline-variant/50 transition-all group-hover/resize:h-5 group-hover/resize:bg-primary group-active/resize:bg-primary"
                                ></span>
                            </span>
                        {/if}
                    </th>
                {/each}
            </tr>
        </thead>

        <!-- TBODY -->
        <tbody class={classes.tbody}>
            {#if bodyTopSlot}
                {@render bodyTopSlot()}
            {/if}

            {#if hasVisibleRows}
                <!-- Pinned rows at top -->
                {#each pinnedData as row, rowIdx (getRowKey(row, rowKey, rowIdx))}
                    {@const rowKeyVal = getRowKey(row, rowKey, rowIdx)}
                    {@render tableRow(row, rowIdx, rowKeyVal, true)}
                {/each}

                <!-- Separator between pinned and unpinned -->
                {#if pinnedData.length > 0 && unpinnedPaginatedData.length > 0}
                    <tr><td colspan={totalColspan} class="h-0.5 bg-primary/20 p-0"></td></tr>
                {/if}

                <!-- Regular rows -->
                {#each unpinnedPaginatedData as row, rowIdx (getRowKey(row, rowKey, page * pageSize + rowIdx))}
                    {@const absIdx = manualPagination ? rowIdx : page * pageSize + rowIdx}
                    {@const rowKeyVal = getRowKey(row, rowKey, absIdx)}
                    {@render tableRow(row, absIdx, rowKeyVal, false)}
                {/each}
            {:else if loading && loadingSlot}
                <tr>
                    <td colspan={totalColspan} class={classes.loading}>
                        {@render loadingSlot()}
                    </td>
                </tr>
            {:else}
                <tr>
                    <td colspan={totalColspan} class={classes.empty}>
                        {#if emptySlot}
                            {@render emptySlot()}
                        {:else}
                            {empty}
                        {/if}
                    </td>
                </tr>
            {/if}

            {#if bodyBottomSlot}
                {@render bodyBottomSlot()}
            {/if}
        </tbody>

        <!-- TFOOT -->
        {#if hasFooter}
            <tfoot class={classes.tfoot}>
                <tr class={classes.tr}>
                    {#if selection === 'multiple'}
                        <th class={classes.th}></th>
                    {/if}

                    {#each visibleColumns as col, colIdx (col.key)}
                        <th
                            class="{thClass(col.key)} {getAlignClass(col.align)}"
                            data-pinned={isPinned(col.key) || undefined}
                            style={getPinStyle(col.key)}
                        >
                            {#if col.footer}
                                {@render col.footer({
                                    column: col,
                                    columnIndex: colIdx,
                                    rows: sortedData
                                })}
                            {/if}
                        </th>
                    {/each}
                </tr>
            </tfoot>
        {/if}
    </table>

    {#if loading && hasVisibleRows}
        <div
            class="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-surface/60 backdrop-blur-[1px] transition-opacity duration-200"
            role="status"
            aria-label="Loading"
        >
            {#if loadingSlot}
                {@render loadingSlot()}
            {:else}
                <Icon name={icons.loading} class="size-6 animate-spin text-primary" />
            {/if}
        </div>
    {/if}
</svelte:element>
