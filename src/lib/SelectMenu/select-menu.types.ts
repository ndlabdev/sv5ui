import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { SelectMenuVariantProps, SelectMenuSlots } from './select-menu.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'
import type { ComboboxContentPropsWithoutHTML, ComboboxTriggerProps } from 'bits-ui'

// ============================================================================
// Item Types (reuse from Select)
// ============================================================================

/**
 * A single selectable option within the SelectMenu.
 */
export interface SelectMenuItem {
    /**
     * The value submitted on form submission or returned via binding.
     */
    value: string

    /**
     * The display text for this item.
     * Falls back to `value` when not provided.
     */
    label?: string

    /**
     * Optional description shown below the label.
     */
    description?: string

    /**
     * Icon displayed before the label.
     * Supports any Iconify icon name.
     */
    icon?: string

    /**
     * Avatar displayed before the label.
     * Takes precedence over `icon`.
     */
    avatar?: AvatarProps

    /**
     * Whether this item is disabled.
     * @default false
     */
    disabled?: boolean
}

/**
 * A visual separator between items.
 */
export interface SelectMenuItemSeparator {
    type: 'separator'
}

/**
 * A non-selectable group label/heading.
 */
export interface SelectMenuItemLabel {
    type: 'label'

    /**
     * The text displayed as the group label.
     */
    label: string
}

/**
 * Union type for all possible select menu items.
 */
export type SelectMenuItemType = SelectMenuItem | SelectMenuItemSeparator | SelectMenuItemLabel

// ============================================================================
// Slot Props Types
// ============================================================================

/**
 * Props passed to select menu item snippet slots.
 */
export interface SelectMenuItemSlotProps {
    /** The current select menu item data */
    item: SelectMenuItem
    /** Zero-based index of the item */
    index: number
    /** Whether the item is currently selected */
    selected?: boolean
}

/**
 * Props passed to the `selected` snippet when `multiple` is true.
 */
export interface SelectMenuSelectedSlotProps {
    /** The full list of currently selected items resolved from values. */
    items: SelectMenuItem[]
    /** Remove a value from the current selection. */
    remove: (value: string) => void
    /** Clear all selected values. */
    clear: () => void
}

// ============================================================================
// Component Props
// ============================================================================

type ContentProps = Pick<
    ComboboxContentPropsWithoutHTML,
    | 'side'
    | 'sideOffset'
    | 'align'
    | 'alignOffset'
    | 'avoidCollisions'
    | 'collisionBoundary'
    | 'collisionPadding'
    | 'onEscapeKeydown'
    | 'onInteractOutside'
    | 'forceMount'
>

/**
 * Props for the SelectMenu component.
 *
 * A searchable select dropdown built on bits-ui Combobox.
 * Supports filtering, icons, avatars, groups, and empty states.
 *
 * @see https://bits-ui.com/docs/components/combobox
 */
type TriggerHTMLProps = Pick<
    ComboboxTriggerProps,
    | 'style'
    | 'title'
    | 'role'
    | 'tabindex'
    | 'aria-label'
    | 'aria-labelledby'
    | 'onclick'
    | 'onkeydown'
    | 'onmouseenter'
    | 'onmouseleave'
    | 'onfocus'
    | 'onblur'
>

export interface SelectMenuProps extends ContentProps, TriggerHTMLProps {
    /** Custom data attributes are forwarded to the trigger element. */
    [key: `data-${string}`]: unknown

    // -------------------------------------------------------------------------
    // Ref
    // -------------------------------------------------------------------------

    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    // -------------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------------

    /**
     * The currently selected value. Supports two-way binding with `bind:value`.
     *
     * - When `multiple` is `false`/omitted, this is a `string`.
     * - When `multiple` is `true`, this is a `string[]`.
     */
    value?: string | string[]

    /**
     * Whether multiple items can be selected at once.
     * When `true`, `value` becomes a `string[]` and the dropdown stays open
     * after each selection. The trigger displays a comma-separated list of
     * selected labels by default; use the `selected` snippet for chips/tags.
     * @default false
     */
    multiple?: boolean

    /**
     * Separator used to join selected labels in the trigger when `multiple` is `true`.
     * Ignored when the `selected` snippet is provided.
     * @default ', '
     */
    separator?: string

    /**
     * Whether the dropdown is open. Supports two-way binding with `bind:open`.
     * @default false
     */
    open?: boolean

    /**
     * Callback fired when open state changes.
     */
    onOpenChange?: (open: boolean) => void

    /**
     * Array of items to display in the select menu dropdown.
     */
    items?: SelectMenuItemType[]

    /**
     * Placeholder text shown when no value is selected.
     */
    placeholder?: string

    /**
     * The search input placeholder text.
     * @default 'Search...'
     */
    searchPlaceholder?: string

    /**
     * The form field name attribute.
     */
    name?: string

    /**
     * Whether the field is required.
     * @default false
     */
    required?: boolean

    /**
     * Whether the select menu is disabled.
     * @default false
     */
    disabled?: boolean

    // -------------------------------------------------------------------------
    // Visual
    // -------------------------------------------------------------------------

    /**
     * Controls the visual style of the select trigger.
     * @default 'outline'
     */
    variant?: NonNullable<SelectMenuVariantProps['variant']>

    /**
     * Sets the color scheme for focus ring and highlight.
     * @default 'primary'
     */
    color?: NonNullable<SelectMenuVariantProps['color']>

    /**
     * Controls the dimensions and text size.
     * @default 'md'
     */
    size?: NonNullable<SelectMenuVariantProps['size']>

    /**
     * Emphasizes ring color like focus state, even when not focused.
     * Automatically enabled when used inside a FormField with an error.
     * @default false
     */
    highlight?: boolean

    // -------------------------------------------------------------------------
    // Icons & Avatars
    // -------------------------------------------------------------------------

    /**
     * Icon displayed on the leading side of the trigger.
     * Supports any valid Iconify icon name.
     */
    icon?: string

    /**
     * Icon placed before the selected value.
     * Supports any valid Iconify icon name.
     */
    leadingIcon?: string

    /**
     * Icon placed after the selected value (chevron area).
     * @default 'lucide:chevron-down'
     */
    trailingIcon?: string

    /**
     * Icon displayed next to selected items in the dropdown.
     * @default 'lucide:check'
     */
    selectedIcon?: string

    /**
     * Renders a loading spinner.
     * @default false
     */
    loading?: boolean

    /**
     * Icon displayed as the loading indicator.
     * @default Uses `icons.loading` from app config
     */
    loadingIcon?: string

    /**
     * Avatar displayed before the selected value on the trigger.
     * Takes precedence over `leadingIcon`.
     */
    avatar?: AvatarProps

    // -------------------------------------------------------------------------
    // Search & Filtering
    // -------------------------------------------------------------------------

    /**
     * Fields to search when filtering items.
     * @default ['label', 'value']
     */
    filterFields?: string[]

    /**
     * Disables the default filtering. Use this for server-side / custom filtering.
     * @default false
     */
    ignoreFilter?: boolean

    /**
     * Text to display when no items match the search.
     * @default 'No results found.'
     */
    emptyText?: string

    // -------------------------------------------------------------------------
    // Create item
    // -------------------------------------------------------------------------

    /**
     * Allow the user to create a new item by typing in the search input.
     * - `false` (default): the feature is disabled.
     * - `true` / `'lazy'`: the create option only appears when no existing item
     *   matches the current search term (case-insensitive on `value` or `label`).
     * - `'always'`: the create option is shown whenever the search term is
     *   non-empty, regardless of existing matches.
     * @default false
     */
    createItem?: boolean | 'always' | 'lazy'

    /**
     * Label rendered on the "create" option. Receives the trimmed search term.
     * @default (value) => `Create "${value}"`
     */
    createItemLabel?: string | ((value: string) => string)

    /**
     * Icon shown before the create option label. Pass `false` (or omit) to
     * render no icon.
     * @default undefined
     */
    createItemIcon?: string | false

    /**
     * Called when the user picks the "create" option. The new value is also
     * tracked internally so the trigger can render its label even if the
     * caller does not push it into `items`.
     */
    onCreate?: (value: string) => void

    // -------------------------------------------------------------------------
    // Behavior
    // -------------------------------------------------------------------------

    /**
     * Animate the dropdown on open and close.
     * @default true
     */
    transition?: SelectMenuVariantProps['transition']

    /**
     * Render the dropdown content in a portal.
     * @default true
     */
    portal?: boolean

    /**
     * The HTML `id` attribute for the trigger element.
     */
    id?: string

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Additional CSS classes for the root wrapper.
     */
    class?: ClassNameValue

    /**
     * Override classes for specific select menu slots.
     */
    ui?: Partial<Record<SelectMenuSlots, ClassNameValue>>

    // -------------------------------------------------------------------------
    // Slots (Snippets)
    // -------------------------------------------------------------------------

    /**
     * Custom content rendered before the selected value in the trigger.
     * Takes precedence over `avatar` and `leadingIcon`.
     */
    leadingSlot?: Snippet

    /**
     * Custom content rendered after the selected value in the trigger.
     * Takes precedence over `trailingIcon`.
     */
    trailingSlot?: Snippet

    /**
     * Custom rendering for the selected value(s) displayed in the trigger.
     * Useful in `multiple` mode to render chips/tags instead of the default
     * comma-separated label list.
     */
    selected?: Snippet<[SelectMenuSelectedSlotProps]>

    /**
     * Custom snippet for rendering individual items in the dropdown.
     * When provided, replaces the default item rendering.
     */
    item?: Snippet<[SelectMenuItemSlotProps]>

    /**
     * Custom snippet for the leading section of items.
     * Replaces the default icon/avatar when provided.
     */
    itemLeading?: Snippet<[SelectMenuItemSlotProps]>

    /**
     * Custom snippet for the label section of items.
     * Replaces the default label text when provided.
     */
    itemLabel?: Snippet<[SelectMenuItemSlotProps]>

    /**
     * Custom snippet for the trailing section of items (selected indicator area).
     * Replaces the default check icon when provided.
     */
    itemTrailing?: Snippet<[SelectMenuItemSlotProps]>

    /**
     * Custom empty state snippet.
     */
    empty?: Snippet<[{ searchTerm: string }]>

    /**
     * Custom dropdown content.
     * When provided, replaces the default items rendering entirely.
     */
    content?: Snippet<[{ open: boolean; searchTerm: string }]>
}
