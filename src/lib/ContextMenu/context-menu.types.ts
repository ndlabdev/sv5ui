import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { ContextMenuSlots, ContextMenuVariantProps } from './context-menu.variants.js'
import type { KbdProps } from '../Kbd/kbd.types.js'
import type { ContextMenuRootPropsWithoutHTML, ContextMenuContentPropsWithoutHTML } from 'bits-ui'

// ============================================================================
// Item Types
// ============================================================================

/**
 * Base item properties shared across all item types.
 */
interface ContextMenuItemBase {
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
export interface ContextMenuItemAction extends ContextMenuItemBase {
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
    color?: ContextMenuVariantProps['color']
}

/**
 * Checkbox menu item for toggling boolean state.
 */
export interface ContextMenuItemCheckbox extends ContextMenuItemBase {
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
export interface ContextMenuItemRadio extends ContextMenuItemBase {
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
export interface ContextMenuItemSeparator {
    type: 'separator'
}

/**
 * Group label/heading for organizing items.
 */
export interface ContextMenuItemLabel {
    type: 'label'

    /**
     * The text displayed as the group label.
     */
    label: string
}

/**
 * Submenu item that opens a nested context menu.
 */
export interface ContextMenuItemSub extends ContextMenuItemBase {
    type: 'sub'

    /**
     * Nested items in the submenu.
     */
    items: ContextMenuItem[]

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
 * Union type for all possible context menu items.
 */
export type ContextMenuItem =
    | ContextMenuItemAction
    | ContextMenuItemCheckbox
    | ContextMenuItemRadio
    | ContextMenuItemSeparator
    | ContextMenuItemLabel
    | ContextMenuItemSub

/**
 * Configuration for a radio group within the context menu.
 */
export interface ContextMenuRadioGroup {
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
 * Props passed to context menu item snippet slots.
 */
export interface ContextMenuItemSlotProps {
    /** The current context menu item data */
    item: ContextMenuItem
    /** Zero-based index of the item */
    index: number
    /** Whether the item is currently highlighted/focused */
    highlighted?: boolean
}

// ============================================================================
// Component Props
// ============================================================================

type RootProps = Pick<ContextMenuRootPropsWithoutHTML, 'open' | 'onOpenChange'>

type ContentProps = Pick<
    ContextMenuContentPropsWithoutHTML,
    | 'sideOffset'
    | 'alignOffset'
    | 'avoidCollisions'
    | 'collisionBoundary'
    | 'collisionPadding'
    | 'hideWhenDetached'
    | 'onEscapeKeydown'
    | 'onInteractOutside'
    | 'onCloseAutoFocus'
    | 'forceMount'
    | 'loop'
>

/**
 * Props for the ContextMenu component.
 *
 * @example
 * ```svelte
 * <ContextMenu items={menuItems}>
 *   <div class="p-8 border">Right-click here</div>
 * </ContextMenu>
 * ```
 *
 * @see https://bits-ui.com/docs/components/context-menu
 */
export interface ContextMenuProps extends RootProps, ContentProps {
    // -------------------------------------------------------------------------
    // Content
    // -------------------------------------------------------------------------

    /**
     * Array of menu items to render.
     * Each item can be an action, checkbox, radio, separator, label, or submenu.
     */
    items?: ContextMenuItem[]

    /**
     * Radio groups configuration for managing radio item selections.
     * @example [{ name: 'theme', value: 'dark', onValueChange: (v) => theme = v }]
     */
    radioGroups?: ContextMenuRadioGroup[]

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
     * Animate the context menu on open and close.
     * @default true
     */
    transition?: ContextMenuVariantProps['transition']

    /**
     * Render the context menu content in a portal.
     * @default true
     */
    portal?: boolean

    /**
     * Size variant for the context menu.
     * @default 'md'
     */
    size?: ContextMenuVariantProps['size']

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /**
     * Additional CSS class for the trigger wrapper.
     */
    class?: ClassNameValue

    /**
     * Override classes for context menu slots.
     */
    ui?: Partial<Record<ContextMenuSlots, ClassNameValue>>

    // -------------------------------------------------------------------------
    // Slots (Snippets)
    // -------------------------------------------------------------------------

    /**
     * Default slot content used as the right-click trigger area.
     * Right-clicking this element opens the context menu.
     */
    children?: Snippet<[{ open: boolean }]>

    /**
     * Custom content to render at the top of the context menu.
     */
    header?: Snippet<[{ close: () => void }]>

    /**
     * Custom content to render at the bottom of the context menu.
     */
    footer?: Snippet<[{ close: () => void }]>

    /**
     * Custom snippet for rendering individual items.
     * When provided, replaces the default item rendering.
     */
    item?: Snippet<[ContextMenuItemSlotProps]>

    /**
     * Custom snippet for the leading section of items.
     * Replaces the default icon when provided.
     */
    itemLeading?: Snippet<[ContextMenuItemSlotProps]>

    /**
     * Custom snippet for the label section of items.
     * Replaces the default label text when provided.
     */
    itemLabel?: Snippet<[ContextMenuItemSlotProps]>

    /**
     * Custom snippet for the trailing section of items.
     * Replaces the default keyboard shortcuts when provided.
     */
    itemTrailing?: Snippet<[ContextMenuItemSlotProps]>

    /**
     * Custom context menu content.
     * When provided, replaces the default items rendering entirely.
     */
    content?: Snippet<[{ open: boolean; close: () => void }]>
}
