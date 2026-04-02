/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Snippet } from 'svelte'
import type { Action } from 'svelte/action'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { TableVariantProps, TableSlots } from './table.variants.js'

// ============================================================================
// Column Definition
// ============================================================================

export interface TableColumn<T> {
    /** Data accessor key. */
    key: keyof T & string

    /** Header label text. Defaults to capitalized `key`. */
    label?: string

    /** Enable sorting on this column. @default false */
    sortable?: boolean

    /** Custom sort comparator. Receives two rows, returns -1/0/1. */
    sortFn?: (a: T, b: T) => number

    /** Enable column-level filtering. @default false */
    filterable?: boolean

    /** Custom filter function. */
    filterFn?: (row: T, filterValue: string) => boolean

    /** Pin this column to left or right. */
    pinned?: 'left' | 'right'

    /** Enable drag-resize on this column. @default false */
    resizable?: boolean

    /** Initial column width in px. */
    width?: number

    /** Minimum column width in px. @default 50 */
    minWidth?: number

    /** Maximum column width in px. */
    maxWidth?: number

    /** Text alignment. @default 'left' */
    align?: 'left' | 'center' | 'right'

    /** Header cell colspan. */
    colspan?: number

    /** Header cell rowspan. */
    rowspan?: number

    /** Data cell colspan. */
    cellColspan?: number

    /** Data cell rowspan. */
    cellRowspan?: number

    /** Column visibility. @default true */
    visible?: boolean

    /** Additional CSS class for this column's header cell. */
    headerClass?: ClassNameValue

    /** Additional CSS class for this column's data cell. */
    cellClass?: ClassNameValue

    /** Custom header snippet for this column. */
    header?: Snippet<[TableHeaderSlotProps<T>]>

    /** Custom cell snippet for this column. */
    cell?: Snippet<[TableCellSlotProps<T>]>

    /** Custom footer snippet for this column. */
    footer?: Snippet<[TableFooterSlotProps<T>]>
}

// ============================================================================
// Slot Props
// ============================================================================

export interface TableHeaderSlotProps<T> {
    column: TableColumn<T>
    columnIndex: number
    sortDirection: 'asc' | 'desc' | null
    toggleSort: () => void
}

export interface TableCellSlotProps<T> {
    row: T
    column: TableColumn<T>
    rowIndex: number
    columnIndex: number
    value: unknown
}

export interface TableFooterSlotProps<T> {
    column: TableColumn<T>
    columnIndex: number
    rows: T[]
}

export interface TableRowSlotProps<T> {
    row: T
    rowIndex: number
    selected: boolean
    expanded: boolean
    toggleExpand: () => void
    toggleSelect: () => void
}

// ============================================================================
// Sort State
// ============================================================================

export type SortDirection = 'asc' | 'desc'

export interface SortItem {
    key: string
    direction: SortDirection
}

export type SortState = SortItem[]

// ============================================================================
// Component Props
// ============================================================================

export interface TableProps<T extends Record<string, any> = Record<string, any>> extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'class'
> {
    /** Bindable reference to the root wrapper DOM element. */
    ref?: HTMLElement | null

    /**
     * The HTML element the root should render as.
     * @default 'div'
     */
    as?: 'div' | 'section' | 'article' | 'aside' | 'main'

    // ---- Data & Columns ----

    /** Array of row data objects. @default [] */
    data?: T[]

    /** Column definitions. Auto-generated from data keys if omitted. */
    columns?: TableColumn<T>[]

    /** Unique row identifier key. Falls back to row index. */
    rowKey?: keyof T & string

    // ---- Caption ----

    /** Table caption text (rendered as sr-only for accessibility). */
    caption?: string

    // ---- Sorting ----

    /** Current sort state. Use `bind:sorting` for two-way binding. */
    sorting?: SortState

    /** Allow multi-column sorting via shift+click. @default false */
    multiSort?: boolean

    /** Disable client-side sorting (for server-side). @default false */
    manualSorting?: boolean

    /** Callback fired when sort state changes. */
    onSortingChange?: (sorting: SortState) => void

    // ---- Global Filter ----

    /** Global filter search string. Use `bind:globalFilter`. */
    globalFilter?: string

    /** Limit global filter to specific column keys. Defaults to all string columns. */
    globalFilterKeys?: (keyof T & string)[]

    /** Disable client-side filtering. @default false */
    manualFiltering?: boolean

    /** Callback fired when global filter changes. */
    onGlobalFilterChange?: (value: string) => void

    // ---- Column Filters ----

    /** Per-column filter values. Use `bind:columnFilters`. */
    columnFilters?: Record<string, string>

    /** Callback fired when column filters change. */
    onColumnFiltersChange?: (filters: Record<string, string>) => void

    // ---- Pagination ----

    /** Current page index (0-based). Use `bind:page`. */
    page?: number

    /** Rows per page. @default 10 */
    pageSize?: number

    /** Disable client-side pagination. @default false */
    manualPagination?: boolean

    /** Total row count (required for manualPagination). */
    total?: number

    /** Callback fired when page changes. */
    onPageChange?: (page: number) => void

    // ---- Row Selection ----

    /** Selection mode. undefined = disabled. */
    selection?: 'single' | 'multiple'

    /** Currently selected rows. Use `bind:selectedRows`. */
    selectedRows?: T[]

    /** Callback fired when selection changes. */
    onSelectionChange?: (rows: T[]) => void

    // ---- Column Visibility ----

    /** Column visibility map. Use `bind:columnVisibility`. */
    columnVisibility?: Record<string, boolean>

    /** Callback fired when visibility changes. */
    onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void

    // ---- Column Pinning ----

    /** Column pinning configuration. Use `bind:columnPinning`. */
    columnPinning?: { left?: string[]; right?: string[] }

    // ---- Row Pinning ----

    /** Row keys to pin at the top of the table. Use `bind:pinnedRows`. */
    pinnedRows?: (string | number)[]

    /** Callback fired when pinned rows change. */
    onPinnedRowsChange?: (keys: (string | number)[]) => void

    // ---- Row Expanding ----

    /** Expanded row keys. Use `bind:expandedRows`. */
    expandedRows?: (string | number)[]

    /** Callback fired when expanded rows change. */
    onExpandedChange?: (keys: (string | number)[]) => void

    // ---- Column Resizing ----

    /** Column width overrides (key -> px). Use `bind:columnSizing`. */
    columnSizing?: Record<string, number>

    /** Callback fired when column sizing changes. */
    onColumnSizingChange?: (sizing: Record<string, number>) => void

    // ---- Visual ----

    /** Show loading progress bar. @default false */
    loading?: boolean

    /** Loading bar color. @default 'primary' */
    loadingColor?: NonNullable<TableVariantProps['loadingColor']>

    /** Loading bar animation. @default 'carousel' */
    loadingAnimation?: NonNullable<TableVariantProps['loadingAnimation']>

    /** Text shown when data is empty. @default 'No data.' */
    empty?: string

    /** Alternate row background colors. @default false */
    striped?: boolean

    /** Show hover effect on interactive rows. @default true */
    hoverable?: boolean

    /** Sticky header/footer. @default false */
    sticky?: boolean | 'header' | 'footer'

    /** Svelte action to apply on the root scroll container (e.g. infinite scroll). */
    action?: Action<HTMLElement>

    // ---- Callbacks ----

    /** Callback fired when a row is clicked. */
    onRowClick?: (row: T, index: number, event: MouseEvent) => void

    /** Callback fired when pointer enters/leaves a row. Passes `null` on leave. */
    onRowHover?: (row: T | null, index: number, event: PointerEvent) => void

    /** Callback fired on row right-click. */
    onRowContextmenu?: (row: T, index: number, event: MouseEvent) => void

    // ---- Styling ----

    /** Additional CSS classes for the root element. */
    class?: ClassNameValue

    /** Override styles for specific table slots. */
    ui?: Partial<Record<TableSlots, ClassNameValue>>

    // ---- Snippet Slots ----

    /** Custom caption snippet. */
    captionSlot?: Snippet

    /** Custom empty state snippet. */
    emptySlot?: Snippet

    /** Custom loading state snippet. */
    loadingSlot?: Snippet

    /** Custom expanded row content. */
    expandedSlot?: Snippet<[{ row: T; rowIndex: number }]>

    /** Custom content rendered before data rows in tbody. */
    bodyTopSlot?: Snippet

    /** Custom content rendered after data rows in tbody. */
    bodyBottomSlot?: Snippet

    /** Global header override snippet. */
    headerSlot?: Snippet<[TableHeaderSlotProps<T>]>

    /** Global cell override snippet. */
    cellSlot?: Snippet<[TableCellSlotProps<T>]>
}
