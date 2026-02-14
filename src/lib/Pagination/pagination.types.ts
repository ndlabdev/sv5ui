import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { PaginationSlots, PaginationVariantProps } from './pagination.variants.js'

// ============================================================================
// Slot Props Types
// ============================================================================

/**
 * Props passed to navigation button snippet slots (first, prev, next, last).
 */
export interface PaginationNavSlotProps {
    /** The current active page number */
    page: number
    /** Whether this navigation button is disabled */
    disabled: boolean
}

/**
 * Props passed to the page item snippet slot.
 */
export interface PaginationItemSlotProps {
    /** The page number this item represents */
    page: number
    /** Whether this page is currently selected */
    selected: boolean
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for the Pagination component.
 *
 * Wraps bits-ui's Pagination primitives with enhanced styling,
 * data-driven rendering, and configurable navigation controls.
 *
 * @example
 * ```svelte
 * <Pagination
 *   total={100}
 *   itemsPerPage={10}
 *   bind:page={currentPage}
 *   activeColor="primary"
 * />
 * ```
 *
 * @see https://bits-ui.com/docs/components/pagination
 */
export interface PaginationProps {
    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    /**
     * The currently active page number.
     * Use `bind:page` for two-way binding.
     * @default 1
     */
    page?: number

    /**
     * The default active page when uncontrolled.
     * Used as the initial value when `page` is not provided.
     * @default 1
     */
    defaultPage?: number

    /**
     * Total number of items to paginate.
     * @default 0
     */
    total?: number

    /**
     * Number of items displayed per page.
     * @default 10
     */
    itemsPerPage?: number

    /**
     * Number of page buttons shown adjacent to the current page on each side.
     * @default 1
     */
    siblingCount?: number

    // -------------------------------------------------------------------------
    // Behavior
    // -------------------------------------------------------------------------

    /**
     * Whether to show first/last page navigation buttons.
     * @default false
     */
    showEdges?: boolean

    /**
     * Whether to show previous/next page navigation buttons.
     * @default true
     */
    showControls?: boolean

    /**
     * Whether all pagination controls are disabled.
     * @default false
     */
    disabled?: boolean

    // -------------------------------------------------------------------------
    // Callbacks
    // -------------------------------------------------------------------------

    /**
     * Callback fired when the active page changes.
     * Receives the new page number.
     */
    onPageChange?: (page: number) => void

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Size variant controlling button dimensions, text size, and icon sizes.
     * @default 'md'
     */
    size?: NonNullable<PaginationVariantProps['size']>

    /**
     * Color applied to the currently selected page button.
     * @default 'primary'
     */
    activeColor?: NonNullable<PaginationVariantProps['activeColor']>

    // -------------------------------------------------------------------------
    // Icons
    // -------------------------------------------------------------------------

    /**
     * Icon for the "first page" button.
     * @default 'lucide:chevrons-left'
     */
    firstIcon?: string

    /**
     * Icon for the "previous page" button.
     * @default 'lucide:chevron-left'
     */
    prevIcon?: string

    /**
     * Icon for the "next page" button.
     * @default 'lucide:chevron-right'
     */
    nextIcon?: string

    /**
     * Icon for the "last page" button.
     * @default 'lucide:chevrons-right'
     */
    lastIcon?: string

    /**
     * Icon displayed in the ellipsis placeholder.
     * @default 'lucide:ellipsis'
     */
    ellipsisIcon?: string

    // -------------------------------------------------------------------------
    // Styling Overrides
    // -------------------------------------------------------------------------

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override classes for pagination component slots.
     *
     * @example
     * ```ts
     * ui={{
     *   list: 'gap-2',
     *   item: 'rounded-full',
     *   prev: 'rounded-full'
     * }}
     * ```
     */
    ui?: Partial<Record<PaginationSlots, ClassNameValue>>

    // -------------------------------------------------------------------------
    // Slots (Snippets)
    // -------------------------------------------------------------------------

    /**
     * Custom snippet for the first page button.
     * @param props - Contains `{ page, disabled }`
     */
    firstSlot?: Snippet<[PaginationNavSlotProps]>

    /**
     * Custom snippet for the previous page button.
     * @param props - Contains `{ page, disabled }`
     */
    prevSlot?: Snippet<[PaginationNavSlotProps]>

    /**
     * Custom snippet for the next page button.
     * @param props - Contains `{ page, disabled }`
     */
    nextSlot?: Snippet<[PaginationNavSlotProps]>

    /**
     * Custom snippet for the last page button.
     * @param props - Contains `{ page, disabled }`
     */
    lastSlot?: Snippet<[PaginationNavSlotProps]>

    /**
     * Custom snippet for the ellipsis indicator.
     */
    ellipsisSlot?: Snippet

    /**
     * Custom snippet for individual page buttons.
     * @param props - Contains `{ page, selected }`
     */
    itemSlot?: Snippet<[PaginationItemSlotProps]>
}
