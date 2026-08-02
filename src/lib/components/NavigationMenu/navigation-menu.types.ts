import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { HTMLAttributes } from 'svelte/elements'
import type { NavigationMenuSlots, NavigationMenuVariantProps } from './navigation-menu.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'
import type { BadgeProps } from '../Badge/badge.types.js'
import type { ChipProps } from '../Chip/chip.types.js'
import type { TooltipProps } from '../Tooltip/tooltip.types.js'
import type { PopoverProps } from '../Popover/popover.types.js'
import type { DrawerProps } from '../Drawer/drawer.types.js'

// ============================================================================
// Value / behavior types
// ============================================================================

/**
 * The open value(s) of the menu.
 * A single value string when `type='single'`, an array when `type='multiple'`
 * (vertical only).
 */
export type NavigationMenuValue = string | string[]

/** Per-item semantic role. Defaults to `'link'`. */
export type NavigationMenuItemType = 'label' | 'trigger' | 'link'

// ============================================================================
// Item types
// ============================================================================

/**
 * A leaf entry inside a dropdown / mega-menu (an item's `children`).
 */
export interface NavigationMenuChildItem {
    /** Text shown as the child link label. */
    label: string
    /** Secondary text under the label (mega-menu descriptions). */
    description?: string
    /** Iconify icon name shown before the label. */
    icon?: string
    /** Destination URL. Rendered as a real `<a href>` for SEO. */
    href?: string
    /** Anchor target (e.g. `'_blank'`). External links get `rel` automatically. */
    target?: string
    /** Whether this child represents the current page (sets `aria-current`). */
    active?: boolean
    /** Exact-match route detection for `active`. @default true */
    exact?: boolean
    /** Fired on select. Call `event.preventDefault()` to keep the menu open. */
    onSelect?: (event: Event) => void
    /**
     * Nested links. When set, this entry renders as a labeled group/column
     * inside the mega-menu (a section header plus its links) instead of a
     * single link. One level of nesting is supported.
     */
    children?: NavigationMenuChildItem[]
    /** Extra classes for the child link. */
    class?: ClassNameValue
}

/**
 * A top-level navigation entry.
 *
 * Nodes with `children` render as a dropdown (horizontal) or an inline
 * disclosure (vertical). Leaf nodes with `href` render as real anchors.
 *
 * Note: Nuxt UI's per-item `slot` field is intentionally dropped. Svelte has
 * no dynamic named slots, so branch on `item` inside the shared `item`
 * snippet instead (same decision as the Tree component).
 */
export interface NavigationMenuItem {
    /** Text shown as the item label. */
    label?: string
    /** Iconify icon name shown before the label. */
    icon?: string
    /** Avatar shown before the label (takes precedence over `icon`). */
    avatar?: AvatarProps
    /** Badge shown after the label (count / status). */
    badge?: string | number | BadgeProps
    /** Chip dot overlaid on the leading avatar/icon. */
    chip?: boolean | ChipProps
    /** Tooltip config used when the menu is `collapsed` (icons-only). */
    tooltip?: boolean | TooltipProps
    /** Popover config used when the menu is `collapsed` (icons-only). */
    popover?: boolean | PopoverProps
    /** Iconify name for the trailing expand/dropdown chevron. */
    trailingIcon?: string
    /** Semantic role; defaults to `'link'` (or `'trigger'` when `children` set). */
    type?: NavigationMenuItemType
    /** Whether the dropdown/disclosure starts open (uncontrolled). */
    defaultOpen?: boolean
    /** Force the open state of this item's dropdown/disclosure. */
    open?: boolean
    /** Unique value used as the open key. Falls back to the item index. */
    value?: string
    /** Whether the item is non-interactive. */
    disabled?: boolean
    /** Whether the item represents the current page (sets `aria-current`). */
    active?: boolean
    /** Exact-match route detection for `active`. Overrides the menu-level `exact`. */
    exact?: boolean
    /** Fired on select. Call `event.preventDefault()` to keep the menu open. */
    onSelect?: (event: Event) => void
    /** Nested dropdown / mega-menu entries. */
    children?: NavigationMenuChildItem[]
    /** Destination URL (leaf items). Rendered as a real `<a href>` for SEO. */
    href?: string
    /** Anchor target (e.g. `'_blank'`). External links get `rel` automatically. */
    target?: string
    /** Secondary text (used by custom snippets). */
    description?: string
    /** Extra classes for this item's `<li>`. */
    class?: ClassNameValue
    /** Per-item slot class overrides. */
    ui?: Partial<Record<NavigationMenuSlots, ClassNameValue>>
}

// ============================================================================
// Slot props
// ============================================================================

/** Context passed to the item-level snippets. */
export interface NavigationMenuItemSlotProps {
    /** The item data. */
    item: NavigationMenuItem
    /** Zero-based index within its group. */
    index: number
    /** Whether the item is the active route. */
    active: boolean
    /** Whether the item's dropdown/disclosure is open. */
    open: boolean
}

/** Context passed to the `itemContent` snippet. */
export interface NavigationMenuContentSlotProps {
    /** The parent item data. */
    item: NavigationMenuItem
    /** Zero-based index within its group. */
    index: number
}

// ============================================================================
// Component props
// ============================================================================

/**
 * Props for the NavigationMenu component.
 *
 * Wraps the bits-ui NavigationMenu primitive for the horizontal (mega-menu)
 * path and a wrapper-managed inline disclosure for the vertical path. Renders
 * real anchor links (SEO), a nav landmark, and an optional baked-in mobile
 * drawer below a breakpoint.
 */
export interface NavigationMenuProps extends Omit<
    HTMLAttributes<HTMLElement>,
    'class' | 'children' | 'onselect' | 'popover' | 'dir'
> {
    /** Bindable reference to the root element. */
    ref?: HTMLElement | null

    /** The root element for the vertical path. @default 'nav' */
    as?: keyof HTMLElementTagNameMap

    /**
     * Selection model for vertical inline disclosures.
     * `'multiple'` allows several open at once. @default 'multiple'
     */
    type?: 'single' | 'multiple'

    /** Open value(s). Use `bind:value` for two-way binding. */
    value?: NavigationMenuValue

    /** Initial open value(s) when uncontrolled. */
    defaultValue?: NavigationMenuValue

    /** Fired when the open value(s) change. */
    onValueChange?: (value: NavigationMenuValue | undefined) => void

    /** Top-level items, or an array of arrays to render separated groups. */
    items?: NavigationMenuItem[] | NavigationMenuItem[][]

    /** Layout direction. @default 'horizontal' */
    orientation?: NonNullable<NavigationMenuVariantProps['orientation']>

    /** Icons-only rail (vertical). Labels/children surface via tooltip/popover. */
    collapsed?: boolean

    /** Whether expandable groups can be toggled (vertical). @default true */
    collapsible?: boolean

    /**
     * Show a sliding active-route highlight bar. Ignored for the `pill`
     * variant, whose filled background already marks the active item.
     * @default false
     */
    highlight?: boolean

    /**
     * Stack each item's icon above a small label. With `orientation='horizontal'`
     * this yields a mobile-style bottom tab bar (equal-width tabs); with
     * `orientation='vertical'` a compact rail that keeps labels under the icons.
     * @default false
     */
    stacked?: boolean

    /** Visual style of items. @default 'pill' */
    variant?: NonNullable<NavigationMenuVariantProps['variant']>

    /** Color for active/highlight state and focus ring. @default 'primary' */
    color?: NonNullable<NavigationMenuVariantProps['color']>

    /** Iconify name for the dropdown chevron. @default icons.chevronDown */
    trailingIcon?: string

    /** External-link icon; `true` uses the default, a string overrides, `false` hides. */
    externalIcon?: boolean | string

    /** Show an arrow pointing at the open trigger (horizontal). @default false */
    arrow?: boolean

    /** Default tooltip config for collapsed items. */
    tooltip?: boolean | TooltipProps

    /** Default popover config for collapsed items. */
    popover?: boolean | PopoverProps

    /** Layout of the mega-menu content (horizontal only). @default 'horizontal' */
    contentOrientation?: NonNullable<NavigationMenuVariantProps['contentOrientation']>

    /** Item field used as the label. @default 'label' */
    labelKey?: string

    /**
     * Exact-match route auto-detection for active state. When `false`, a link
     * is active for any route starting with its `href` (highlights parent
     * routes). `aria-current="page"` remains exact-only. @default true
     */
    exact?: boolean

    /** ms before a dropdown opens on hover. @default 0 */
    delayDuration?: number

    /** ms window to reopen instantly after leaving. */
    skipDelayDuration?: number

    /** Disable opening dropdowns on trigger click. @default false */
    disableClickTrigger?: boolean

    /** Disable opening dropdowns on hover. @default false */
    disableHoverTrigger?: boolean

    /**
     * When `true`, hidden dropdown content is removed from the DOM.
     * Set to `false` to keep it mounted (present but hidden) so crawlers
     * can index the links. @default true
     */
    unmountOnHide?: boolean

    /** Whether the whole menu is disabled. @default false */
    disabled?: boolean

    // -------------------------------------------------------------------------
    // Responsive drawer
    // -------------------------------------------------------------------------

    /** Collapse into a mobile drawer below `mobileBreakpoint`. @default false */
    drawer?: boolean

    /** Bindable open state of the mobile drawer. */
    drawerOpen?: boolean

    /** Media query that triggers the mobile drawer. @default '(max-width: 767px)' */
    mobileBreakpoint?: string

    /**
     * CSS width of the mobile drawer panel. A fixed width prevents the drawer
     * from reflowing when inline sections expand/collapse.
     * @default 'min(20rem, 80vw)'
     */
    drawerWidth?: string

    /** Extra props forwarded to the mobile Drawer. */
    drawerProps?: Partial<DrawerProps>

    // -------------------------------------------------------------------------
    // Styling
    // -------------------------------------------------------------------------

    /** Extra classes for the root element. */
    class?: ClassNameValue

    /** Slot class overrides. */
    ui?: Partial<Record<NavigationMenuSlots, ClassNameValue>>

    // -------------------------------------------------------------------------
    // Snippets
    // -------------------------------------------------------------------------

    /** Full custom row renderer. */
    item?: Snippet<[NavigationMenuItemSlotProps]>
    /** Custom leading content (icon/avatar). */
    itemLeading?: Snippet<[NavigationMenuItemSlotProps]>
    /** Custom label renderer. */
    itemLabel?: Snippet<[NavigationMenuItemSlotProps]>
    /** Custom trailing content (badge/chevron), rendered inside the link. */
    itemTrailing?: Snippet<[NavigationMenuItemSlotProps]>
    /**
     * Interactive row actions (e.g. a DropdownMenu) shown on hover. Vertical
     * only. Rendered as a sibling of the anchor (never nested inside it) so
     * buttons/menus stay valid; also renders beside a `type: 'label'` header.
     */
    itemActions?: Snippet<[NavigationMenuItemSlotProps]>
    /** Custom dropdown/mega-menu content renderer. */
    itemContent?: Snippet<[NavigationMenuContentSlotProps]>
    /** Content before the list. */
    listLeading?: Snippet<[]>
    /** Content after the list. */
    listTrailing?: Snippet<[]>
}
