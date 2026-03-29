import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { CommandRootPropsWithoutHTML } from 'bits-ui'
import type { CommandSlots, CommandVariantProps } from './command.variants.js'

// ============================================================================
// Item Types
// ============================================================================

/**
 * Configuration for an individual command item.
 */
export interface CommandItem {
    /** Unique identifier and search value for this item. */
    value: string
    /** Display label. */
    label?: string
    /** Optional description shown below the label. */
    description?: string
    /** Leading icon name (Iconify). */
    icon?: string
    /** Additional search aliases for filtering. */
    keywords?: string[]
    /** Whether this item is disabled. */
    disabled?: boolean
    /** Callback when item is selected. */
    onSelect?: () => void
    /** Additional CSS classes for this item. */
    class?: ClassNameValue
}

/**
 * Configuration for a command group.
 */
export interface CommandGroup {
    /** Unique group identifier. */
    id: string
    /** Group heading label. */
    label?: string
    /** Items in this group. */
    items: CommandItem[]
}

// ============================================================================
// Slot Props
// ============================================================================

export interface CommandItemSlotProps {
    item: CommandItem
    index: number
}

// ============================================================================
// Component Props
// ============================================================================

/**
 * Props for the Command component.
 *
 * Wraps bits-ui Command primitives with a themed, items-based API.
 *
 * @example
 * ```svelte
 * <Command
 *   placeholder="Search..."
 *   groups={[
 *     { id: 'actions', label: 'Actions', items: [
 *       { value: 'new-file', label: 'New File', icon: 'lucide:file-plus' }
 *     ]}
 *   ]}
 * />
 * ```
 *
 * @see https://bits-ui.com/docs/components/command
 */
export interface CommandProps extends Pick<
    CommandRootPropsWithoutHTML,
    'value' | 'onValueChange' | 'filter' | 'shouldFilter' | 'loop' | 'vimBindings' | 'label'
> {
    // -------------------------------------------------------------------------
    // Refs
    // -------------------------------------------------------------------------

    /** Bindable reference to the root DOM element. */
    ref?: HTMLElement | null

    // -------------------------------------------------------------------------
    // Content
    // -------------------------------------------------------------------------

    /** Array of grouped command items. */
    groups?: CommandGroup[]

    /** Placeholder text for the search input. */
    placeholder?: string

    /**
     * The current search term. Use `bind:search` for two-way binding.
     * @default ''
     */
    search?: string

    /** Loading state — shows a loading indicator instead of items. */
    loading?: boolean

    /** Text shown when no results match the search query. */
    emptyText?: string

    /** Leading icon for the search input. */
    icon?: string

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /** Size variant. */
    size?: NonNullable<CommandVariantProps['size']>

    /** Override classes for component slots. */
    ui?: Partial<Record<CommandSlots, ClassNameValue>>

    /** Additional CSS classes for the root element. */
    class?: ClassNameValue

    // -------------------------------------------------------------------------
    // Slots (Snippets)
    // -------------------------------------------------------------------------

    /** Custom snippet for rendering each item. Replaces default item rendering. */
    item?: Snippet<[CommandItemSlotProps]>

    /** Custom snippet for the item leading section (icon area). */
    itemLeading?: Snippet<[CommandItemSlotProps]>

    /** Custom snippet for the item label section. */
    itemLabel?: Snippet<[CommandItemSlotProps]>

    /** Custom snippet for the item trailing section. */
    itemTrailing?: Snippet<[CommandItemSlotProps]>

    /** Custom snippet for the empty state. */
    empty?: Snippet<[{ search: string }]>

    /** Custom snippet for the footer area below the list. */
    footer?: Snippet
}
