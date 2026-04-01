import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { NavigationMenuVariantProps, NavigationMenuSlots } from './navigation-menu.variants.js'

// ============================================================================
// Item Types
// ============================================================================

export interface NavigationMenuBadge {
    /** Badge label text. */
    label: string
    /** Badge color. @default 'primary' */
    color?:
        | 'primary'
        | 'secondary'
        | 'tertiary'
        | 'success'
        | 'warning'
        | 'error'
        | 'info'
        | 'surface'
    /** Badge variant. @default 'soft' */
    variant?: 'solid' | 'outline' | 'soft' | 'subtle'
}

export interface NavigationMenuItem {
    /** Display label for the menu item. Required except for separator type. */
    label?: string

    /** Leading icon name (Iconify format). */
    icon?: string

    /** Trailing icon name. Auto-set to chevron when item has children. */
    trailingIcon?: string

    /** Badge displayed in the trailing area. */
    badge?: NavigationMenuBadge

    /** Avatar displayed before the label (takes precedence over icon). */
    avatar?: { src?: string; alt?: string }

    /** Navigation URL. Renders as a link when provided. */
    href?: string

    /** Unique value identifier. Defaults to label. */
    value?: string

    /** Whether this item is disabled. @default false */
    disabled?: boolean

    /** Nested children items. Renders as accordion (vertical) or dropdown (horizontal). */
    children?: NavigationMenuItem[]

    /** Additional CSS classes for this item. */
    class?: ClassNameValue

    /** Render as a visual separator instead of a menu item. */
    type?: 'separator'

    /** Description text for child items in horizontal dropdown. */
    description?: string

    /** Open state for items with children. */
    defaultOpen?: boolean
}

// ============================================================================
// Slot Props
// ============================================================================

export interface NavigationMenuSlotProps {
    /** The current menu item. */
    item: NavigationMenuItem
    /** Zero-based index. */
    index: number
    /** Whether this item is currently active. */
    active: boolean
}

// ============================================================================
// Component Props
// ============================================================================

export interface NavigationMenuProps extends Omit<
    HTMLAttributes<HTMLElement>,
    'class' | 'children'
> {
    /** Bindable reference to the root DOM element. */
    ref?: HTMLElement | null

    /** Array of menu items to render. */
    items?: NavigationMenuItem[]

    /** Layout orientation. @default 'horizontal' */
    orientation?: NonNullable<NavigationMenuVariantProps['orientation']>

    /** Visual style variant. @default 'pill' */
    variant?: NonNullable<NavigationMenuVariantProps['variant']>

    /** Color theme for active items. @default 'primary' */
    color?: NonNullable<NavigationMenuVariantProps['color']>

    /** Collapse to icon-only mode (vertical only). @default false */
    collapsed?: boolean

    /** Disable all items. @default false */
    disabled?: boolean

    /** Whether to show a highlight on active items. @default true */
    highlight?: boolean

    /** Additional CSS classes for the root element. */
    class?: ClassNameValue

    /** Override styles for specific slots. */
    ui?: Partial<Record<NavigationMenuSlots, ClassNameValue>>

    // ---- Snippet Slots ----

    /** Custom leading content for all items. */
    leading?: Snippet<[NavigationMenuSlotProps]>

    /** Custom label content for all items. */
    label?: Snippet<[NavigationMenuSlotProps]>

    /** Custom trailing content for all items. */
    trailing?: Snippet<[NavigationMenuSlotProps]>
}
