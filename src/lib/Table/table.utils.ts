/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TableColumn, SortState } from './table.types.js'

/**
 * Auto-generate columns from the first data row's keys.
 */
export function autoGenerateColumns<T extends Record<string, any>>(data: T[]): TableColumn<T>[] {
    if (data.length === 0) return []
    return Object.keys(data[0]).map((key) => ({
        key: key as keyof T & string,
        label: key.charAt(0).toUpperCase() + key.slice(1)
    }))
}

/**
 * Resolve a row's unique key.
 */
export function getRowKey<T extends Record<string, any>>(
    row: T,
    rowKey: (keyof T & string) | undefined,
    index: number
): string | number {
    if (rowKey && row[rowKey] !== undefined) return row[rowKey] as string | number
    return index
}

/**
 * Default sort comparator — handles string, number, boolean, null/undefined.
 */
function defaultCompare(a: unknown, b: unknown): number {
    if (a === b) return 0
    if (a === null || a === undefined) return 1
    if (b === null || b === undefined) return -1

    if (typeof a === 'number' && typeof b === 'number') return a - b
    if (typeof a === 'boolean' && typeof b === 'boolean') return a === b ? 0 : a ? -1 : 1

    return String(a).localeCompare(String(b))
}

/**
 * Sort data by the given sort state, supporting multi-column sort.
 */
export function sortData<T extends Record<string, any>>(
    data: T[],
    sorting: SortState,
    columns: TableColumn<T>[]
): T[] {
    if (sorting.length === 0) return data

    const columnMap = new Map(columns.map((c) => [c.key, c]))
    const sorted = [...data]

    sorted.sort((a, b) => {
        for (const { key, direction } of sorting) {
            const col = columnMap.get(key as keyof T & string)
            const multiplier = direction === 'desc' ? -1 : 1

            let result: number
            if (col?.sortFn) {
                result = col.sortFn(a, b)
            } else {
                result = defaultCompare(a[key], b[key])
            }

            if (result !== 0) return result * multiplier
        }
        return 0
    })

    return sorted
}

/**
 * Filter data by global filter string across specified keys.
 */
export function filterByGlobal<T extends Record<string, any>>(
    data: T[],
    globalFilter: string,
    filterKeys?: (keyof T & string)[]
): T[] {
    if (!globalFilter) return data
    const search = globalFilter.toLowerCase()

    return data.filter((row) => {
        const keys = filterKeys ?? (Object.keys(row) as (keyof T & string)[])
        return keys.some((key) => {
            const val = row[key]
            if (val === null || val === undefined) return false
            return String(val).toLowerCase().includes(search)
        })
    })
}

/**
 * Filter data by per-column filter values.
 */
export function filterByColumns<T extends Record<string, any>>(
    data: T[],
    columnFilters: Record<string, string>,
    columns: TableColumn<T>[]
): T[] {
    const activeFilters = Object.entries(columnFilters).filter(([, v]) => v !== '')
    if (activeFilters.length === 0) return data

    const columnMap = new Map(columns.map((c) => [c.key, c]))

    return data.filter((row) =>
        activeFilters.every(([key, filterValue]) => {
            const col = columnMap.get(key as keyof T & string)
            if (col?.filterFn) return col.filterFn(row, filterValue)

            const val = row[key]
            if (val === null || val === undefined) return false
            return String(val).toLowerCase().includes(filterValue.toLowerCase())
        })
    )
}

/**
 * Paginate data — returns a slice for the given page.
 */
export function paginateData<T>(data: T[], page: number, pageSize: number): T[] {
    const start = page * pageSize
    return data.slice(start, start + pageSize)
}

/**
 * Compute total pages.
 */
export function getTotalPages(totalRows: number, pageSize: number): number {
    return Math.max(1, Math.ceil(totalRows / pageSize))
}

/**
 * Order columns: left-pinned first, unpinned in original order, right-pinned last.
 * Also filter by visibility.
 */
export function resolveVisibleColumns<T extends Record<string, any>>(
    columns: TableColumn<T>[],
    columnVisibility?: Record<string, boolean>,
    columnPinning?: { left?: string[]; right?: string[] }
): TableColumn<T>[] {
    const visible = columns.filter((col) => {
        if (col.visible === false) return false
        if (columnVisibility && columnVisibility[col.key] === false) return false
        return true
    })

    if (!columnPinning) return visible

    const leftKeys = new Set(columnPinning.left ?? [])
    const rightKeys = new Set(columnPinning.right ?? [])

    const left = visible.filter((c) => leftKeys.has(c.key))
    const center = visible.filter((c) => !leftKeys.has(c.key) && !rightKeys.has(c.key))
    const right = visible.filter((c) => rightKeys.has(c.key))

    return [...left, ...center, ...right]
}

/**
 * Compute cumulative left/right offsets for pinned columns.
 */
export function computePinOffsets<T extends Record<string, any>>(
    columns: TableColumn<T>[],
    columnSizing: Record<string, number>,
    columnPinning?: { left?: string[]; right?: string[] }
): Map<string, { side: 'left' | 'right'; offset: number }> {
    const offsets = new Map<string, { side: 'left' | 'right'; offset: number }>()
    if (!columnPinning) return offsets

    const leftKeys = columnPinning.left ?? []
    const rightKeys = columnPinning.right ?? []

    let leftOffset = 0
    for (const key of leftKeys) {
        const col = columns.find((c) => c.key === key)
        if (!col) continue
        offsets.set(key, { side: 'left', offset: leftOffset })
        leftOffset += columnSizing[key] ?? col.width ?? 150
    }

    let rightOffset = 0
    for (let i = rightKeys.length - 1; i >= 0; i--) {
        const key = rightKeys[i]
        const col = columns.find((c) => c.key === key)
        if (!col) continue
        offsets.set(key, { side: 'right', offset: rightOffset })
        rightOffset += columnSizing[key] ?? col.width ?? 150
    }

    return offsets
}

/**
 * Format cell value for display — handles null/undefined/empty string.
 */
export function formatCellValue(value: unknown): string {
    if (value === null || value === undefined || value === '') return '\u00A0'
    return String(value)
}
