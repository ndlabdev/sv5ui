import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { SelectVariantProps, SelectSlots } from './select.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'
import type { SelectRootPropsWithoutHTML, SelectContentPropsWithoutHTML } from 'bits-ui'

// ============================================================================
// Item Types
// ============================================================================

/**
 * A single selectable option within the Select.
 */
export interface SelectItem {
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
export interface SelectItemSeparator {
    type: 'separator'
}

/**
 * A non-selectable group label/heading.
 */
export interface SelectItemLabel {
    type: 'label'

    /**
     * The text displayed as the group label.
     */
    label: string
}

/**
 * Union type for all possible select items.
 */
export type SelectItemType = SelectItem | SelectItemSeparator | SelectItemLabel

// ============================================================================
// Slot Props Types
// ============================================================================

/**
 * Props passed to select item snippet slots.
 */
export interface SelectItemSlotProps {
    /** The current select item data */
    item: SelectItem
    /** Zero-based index of the item */
    index: number
    /** Whether the item is currently selected */
    selected?: boolean
}

// ============================================================================
// Component Props
// ============================================================================

type RootProps = Pick<
    SelectRootPropsWithoutHTML,
    'open' | 'onOpenChange' | 'name' | 'required' | 'disabled'
>

type ContentProps = Pick<
    SelectContentPropsWithoutHTML,
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
    | 'loop'
>

/**
 * Props for the Select component.
 *
 * @example
 * ```svelte
 * <Select
 *   items={[
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana' },
 *   ]}
 *   placeholder="Pick a fruit"
 * />
 * ```
 *
 * @see https://bits-ui.com/docs/components/select
 */
export interface SelectProps extends RootProps, ContentProps {
    // -------------------------------------------------------------------------
    // Data
    // -------------------------------------------------------------------------

    /**
     * The currently selected value. Supports two-way binding with `bind:value`.
     */
    value?: string

    /**
     * The default selected value when uncontrolled.
     */
    defaultValue?: string

    /**
     * Array of items to display in the select dropdown.
     */
    items?: SelectItemType[]

    /**
     * Placeholder text shown when no value is selected.
     */
    placeholder?: string

    // -------------------------------------------------------------------------
    // Visual
    // -------------------------------------------------------------------------

    /**
     * Controls the visual style of the select trigger.
     * @default 'outline'
     */
    variant?: NonNullable<SelectVariantProps['variant']>

    /**
     * Sets the color scheme for focus ring and highlight.
     * @default 'primary'
     */
    color?: NonNullable<SelectVariantProps['color']>

    /**
     * Controls the dimensions and text size.
     * @default 'md'
     */
    size?: NonNullable<SelectVariantProps['size']>

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
    // Behavior
    // -------------------------------------------------------------------------

    /**
     * Animate the dropdown on open and close.
     * @default true
     */
    transition?: SelectVariantProps['transition']

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
     * Override classes for specific select slots.
     */
    ui?: Partial<Record<SelectSlots, ClassNameValue>>

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
     * Custom snippet for rendering individual items in the dropdown.
     * When provided, replaces the default item rendering.
     */
    item?: Snippet<[SelectItemSlotProps]>

    /**
     * Custom snippet for the leading section of items.
     * Replaces the default icon/avatar when provided.
     */
    itemLeading?: Snippet<[SelectItemSlotProps]>

    /**
     * Custom snippet for the label section of items.
     * Replaces the default label text when provided.
     */
    itemLabel?: Snippet<[SelectItemSlotProps]>

    /**
     * Custom snippet for the trailing section of items (selected indicator area).
     * Replaces the default check icon when provided.
     */
    itemTrailing?: Snippet<[SelectItemSlotProps]>

    /**
     * Custom dropdown content.
     * When provided, replaces the default items rendering entirely.
     */
    content?: Snippet<[{ open: boolean }]>
}
