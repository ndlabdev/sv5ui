import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { DropdownMenuSlots, DropdownMenuVariantProps } from './dropdown-menu.variants.js'
import type { KbdProps } from '../Kbd/kbd.types.js'
import type {
    DropdownMenuRootPropsWithoutHTML,
    DropdownMenuContentPropsWithoutHTML,
    DropdownMenuArrowPropsWithoutHTML
} from 'bits-ui'

// ============================================================================
// Item Types
// ============================================================================

/**
 * Base item properties shared across all item types.
 */
interface DropdownMenuItemBase {
    /**
     * The visible text displayed in the menu item.
     */
    label?: string

    /**
     * Icon displayed before the label (leading position).
     * Supports any Iconify icon name (e.g., 'lucide:home', 'mdi:account').
     */
    icon?: string

    /**
     * Whether this item is disabled.
     * @default false
     */
    disabled?: boolean

    /**
     * Keyboard shortcut(s) displayed on the trailing side.
     * Can be an array of key strings or KbdProps objects.
     * @example ['meta', 'k'] or [{ value: 'meta' }, { value: 'k' }]
     */
    kbds?: (string | Pick<KbdProps, 'value' | 'size' | 'variant' | 'color'>)[]

    /**
     * Additional CSS classes applied to this item.
     */
    class?: ClassNameValue
}

/**
 * Standard clickable menu item.
 */
export interface DropdownMenuItemAction extends DropdownMenuItemBase {
    type?: 'item'

    /**
     * Callback fired when the item is selected.
     */
    onSelect?: () => void

    /**
     * Whether to close the menu after selection.
     * @default true
     */
    closeOnSelect?: boolean

    /**
     * Color variant for the item (useful for destructive actions).
     */
    color?: DropdownMenuVariantProps['color']
}

/**
 * Checkbox menu item for toggling boolean state.
 */
export interface DropdownMenuItemCheckbox extends DropdownMenuItemBase {
    type: 'checkbox'

    /**
     * Whether the checkbox is checked.
     */
    checked?: boolean

    /**
     * Callback fired when the checkbox state changes.
     */
    onCheckedChange?: (checked: boolean) => void

    /**
     * Whether to close the menu after selection.
     * @default true
     */
    closeOnSelect?: boolean
}

/**
 * Radio menu item for single selection within a group.
 */
export interface DropdownMenuItemRadio extends DropdownMenuItemBase {
    type: 'radio'

    /**
     * Unique value for this radio item within its group.
     */
    value: string

    /**
     * Whether to close the menu after selection.
     * @default true
     */
    closeOnSelect?: boolean
}

/**
 * Visual separator between menu items.
 */
export interface DropdownMenuItemSeparator {
    type: 'separator'
}

/**
 * Group label/heading for organizing items.
 */
export interface DropdownMenuItemLabel {
    type: 'label'

    /**
     * The text displayed as the group label.
     */
    label: string
}

/**
 * Submenu item that opens a nested dropdown menu.
 */
export interface DropdownMenuItemSub extends DropdownMenuItemBase {
    type: 'sub'

    /**
     * Nested items in the submenu.
     */
    items: DropdownMenuItem[]

    /**
     * Submenu open state (for controlled behavior).
     */
    open?: boolean

    /**
     * Callback when submenu open state changes.
     */
    onOpenChange?: (open: boolean) => void
}

/**
 * Union type for all possible dropdown menu items.
 */
export type DropdownMenuItem =
    | DropdownMenuItemAction
    | DropdownMenuItemCheckbox
    | DropdownMenuItemRadio
    | DropdownMenuItemSeparator
    | DropdownMenuItemLabel
    | DropdownMenuItemSub

/**
 * Configuration for a radio group within the dropdown menu.
 */
export interface DropdownMenuRadioGroup {
    /**
     * Unique identifier for the radio group.
     */
    name: string

    /**
     * Currently selected value in the group.
     */
    value?: string

    /**
     * Callback fired when the selected value changes.
     */
    onValueChange?: (value: string) => void
}

// ============================================================================
// Slot Props Types
// ============================================================================

/**
 * Props passed to dropdown menu item snippet slots.
 */
export interface DropdownMenuItemSlotProps {
    /** The current dropdown menu item data */
    item: DropdownMenuItem
    /** Zero-based index of the item */
    index: number
    /** Whether the item is currently highlighted/focused */
    highlighted?: boolean
}

// ============================================================================
// Component Props
// ============================================================================

type RootProps = Pick<DropdownMenuRootPropsWithoutHTML, 'open' | 'onOpenChange'>

type ContentProps = Pick<
    DropdownMenuContentPropsWithoutHTML,
    | 'side'
    | 'sideOffset'
    | 'align'
    | 'alignOffset'
    | 'avoidCollisions'
    | 'collisionBoundary'
    | 'collisionPadding'
    | 'sticky'
    | 'hideWhenDetached'
    | 'onEscapeKeydown'
    | 'onInteractOutside'
    | 'onCloseAutoFocus'
    | 'forceMount'
    | 'loop'
>

/**
 * Props for the DropdownMenu component.
 *
 * @example
 * ```svelte
 * <DropdownMenu items={menuItems}>
 *   <Button>Open Menu</Button>
 * </DropdownMenu>
 * ```
 *
 * @see https://bits-ui.com/docs/components/dropdown-menu
 */
export interface DropdownMenuProps extends RootProps, ContentProps {
    // -------------------------------------------------------------------------
    // Content
    // -------------------------------------------------------------------------

    /**
     * Array of menu items to render.
     * Each item can be an action, checkbox, radio, separator, label, or submenu.
     */
    items?: DropdownMenuItem[]

    /**
     * Radio groups configuration for managing radio item selections.
     * @example [{ name: 'theme', value: 'dark', onValueChange: (v) => theme = v }]
     */
    radioGroups?: DropdownMenuRadioGroup[]

    /**
     * Icon displayed when a checkbox item is checked.
     * @default 'lucide:check'
     */
    checkedIcon?: string

    /**
     * Icon displayed for submenu indicators.
     * @default 'lucide:chevron-right'
     */
    submenuIcon?: string

    // -------------------------------------------------------------------------
    // Behavior
    // -------------------------------------------------------------------------

    /**
     * Display an arrow alongside the dropdown.
     * Can be a boolean or arrow props for customization.
     * @default false
     */
    arrow?: boolean | Pick<DropdownMenuArrowPropsWithoutHTML, 'width' | 'height'>

    /**
     * Animate the dropdown on open and close.
     * @default true
     */
    transition?: DropdownMenuVariantProps['transition']

    /**
     * Render the dropdown content in a portal.
     * @default true
     */
    portal?: boolean

    /**
     * Size variant for the dropdown menu.
     * @default 'md'
     */
    size?: DropdownMenuVariantProps['size']

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Additional CSS class for the trigger wrapper.
     */
    class?: ClassNameValue

    /**
     * Override classes for dropdown menu slots.
     */
    ui?: Partial<Record<DropdownMenuSlots, ClassNameValue>>

    // -------------------------------------------------------------------------
    // Slots (Snippets)
    // -------------------------------------------------------------------------

    /**
     * Default slot content used as the trigger element.
     * When provided, clicking this element opens the dropdown.
     */
    children?: Snippet<[{ open: boolean }]>

    /**
     * Custom content to render at the top of the dropdown menu.
     */
    header?: Snippet<[{ close: () => void }]>

    /**
     * Custom content to render at the bottom of the dropdown menu.
     */
    footer?: Snippet<[{ close: () => void }]>

    /**
     * Custom snippet for rendering individual items.
     * When provided, replaces the default item rendering.
     */
    item?: Snippet<[DropdownMenuItemSlotProps]>

    /**
     * Custom snippet for the leading section of items.
     * Replaces the default icon when provided.
     */
    itemLeading?: Snippet<[DropdownMenuItemSlotProps]>

    /**
     * Custom snippet for the label section of items.
     * Replaces the default label text when provided.
     */
    itemLabel?: Snippet<[DropdownMenuItemSlotProps]>

    /**
     * Custom snippet for the trailing section of items.
     * Replaces the default keyboard shortcuts when provided.
     */
    itemTrailing?: Snippet<[DropdownMenuItemSlotProps]>

    /**
     * Custom dropdown content.
     * When provided, replaces the default items rendering entirely.
     */
    content?: Snippet<[{ open: boolean; close: () => void }]>
}
