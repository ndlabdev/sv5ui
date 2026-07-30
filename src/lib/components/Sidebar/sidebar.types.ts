import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { SidebarSlots, SidebarVariantProps } from './sidebar.variants.js'
import type { ButtonProps } from '../Button/button.types.js'
import type {
    NavigationMenuItem,
    NavigationMenuProps
} from '../NavigationMenu/navigation-menu.types.js'

export type SidebarSide = NonNullable<SidebarVariantProps['side']>
export type SidebarBreakpoint = NonNullable<SidebarVariantProps['breakpoint']>
export type SidebarVariant = NonNullable<SidebarVariantProps['variant']>
export type SidebarCollapsible = 'icon' | 'offcanvas' | 'none'
export type SidebarMode = 'slideover' | 'drawer'
export type SidebarState = 'expanded' | 'collapsed'

export type SidebarPersist =
    | boolean
    | {
          /**
           * localStorage key used to remember the collapsed state.
           * @default 'sidebar'
           */
          key?: string
      }

export type SidebarProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * Renders the sidebar as a different HTML element.
     * @default 'aside'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Visual style of the sidebar.
     * - `sidebar` — flush to the edge with a divider border.
     * - `floating` — a detached, rounded, elevated panel.
     * - `inset` — transparent, for use inside an inset dashboard layout.
     * @default 'sidebar'
     */
    variant?: SidebarVariant

    /**
     * Which edge the sidebar is docked to.
     * @default 'left'
     */
    side?: SidebarSide

    /**
     * Desktop collapse behaviour.
     * - `icon` — collapses to an icon-only rail with label tooltips and flyout groups.
     * - `offcanvas` — collapses fully off-screen.
     * - `none` — cannot be collapsed.
     * @default 'icon'
     */
    collapsible?: SidebarCollapsible

    /**
     * Breakpoint below which the sidebar becomes a mobile overlay drawer.
     * @default 'lg'
     */
    breakpoint?: SidebarBreakpoint

    /**
     * Bindable desktop collapsed state.
     * @default false
     */
    collapsed?: boolean

    /**
     * Bindable mobile overlay open state.
     * @default false
     */
    open?: boolean

    /**
     * How the mobile menu opens below `breakpoint`. Both slide in from `side`.
     * @default 'slideover'
     */
    mode?: SidebarMode

    /**
     * Header title text, rendered when no `header` snippet is provided.
     */
    title?: string

    /**
     * Header description text shown below the title.
     */
    description?: string

    /**
     * Header close button that collapses the sidebar. Customize with ButtonProps
     * or hide with false. Only rendered when `collapsible` is not 'none'.
     * @default false
     */
    close?: boolean | ButtonProps

    /**
     * Icon for the header close button.
     */
    closeIcon?: string

    /**
     * Show an interactive edge rail that toggles the collapsed state on click.
     * Only rendered when `collapsible` is not 'none'.
     * @default false
     */
    rail?: boolean

    /**
     * Enable collapse/expand and group animations.
     * @default true
     */
    transition?: boolean

    /**
     * Called when the collapsed state changes.
     */
    onCollapse?: (collapsed: boolean) => void

    /**
     * Called when the mobile overlay open state changes.
     */
    onOpenChange?: (open: boolean) => void

    /**
     * Navigation entries, rendered through an internal vertical NavigationMenu.
     * Pass an array of arrays to render separated groups.
     */
    items?: NavigationMenuItem[] | NavigationMenuItem[][]

    /**
     * Extra props forwarded to the internal NavigationMenu (variant, color,
     * highlight, exact, type, tooltip, popover, ...). Overrides the defaults
     * Sidebar sets.
     */
    menu?: Partial<NavigationMenuProps>

    /**
     * Expanded width in pixels.
     * @default 256
     */
    width?: number

    /**
     * Collapsed rail width in pixels. Applies when `collapsible` is 'icon'.
     * @default 64
     */
    collapsedWidth?: number

    /**
     * Persist the collapsed state to localStorage.
     * @default false
     */
    persist?: SidebarPersist

    /**
     * Close the mobile overlay automatically when the route changes.
     * @default true
     */
    autoClose?: boolean

    /**
     * Show a collapse toggle button at the bottom of the footer. Customize with
     * ButtonProps. Prefer `rail` or `close` for collapsing; this is opt-in.
     * Not rendered when `collapsible` is 'none'.
     * @default false
     */
    toggle?: boolean | ButtonProps

    /**
     * Override styles for specific sidebar slots.
     *
     * Layout alignment uses CSS variables: the header row is
     * `--ui-sidebar-header-height` tall (falls back to `--ui-header-height`,
     * then 4rem) so it lines up with a sibling Header, and the footer row is at
     * least `--ui-sidebar-footer-height` (4rem) tall.
     */
    ui?: Partial<Record<SidebarSlots, ClassNameValue>>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Replaces the entire default header (title, description, actions, close).
     * Typically a brand/logo or team selector.
     */
    header?: Snippet<[{ collapsed: boolean; state: SidebarState }]>

    /**
     * Custom title rendering in the default header.
     */
    titleSlot?: Snippet<[{ collapsed: boolean }]>

    /**
     * Custom description rendering in the default header.
     */
    descriptionSlot?: Snippet<[{ collapsed: boolean }]>

    /**
     * Header action buttons, placed before the close button.
     */
    actions?: Snippet<[{ collapsed: boolean }]>

    /**
     * Custom close button in the default header.
     */
    closeSlot?: Snippet<[{ collapsed: boolean }]>

    /**
     * Content in the footer area, below the navigation. Typically a user menu.
     */
    footer?: Snippet<[{ collapsed: boolean; state: SidebarState }]>

    /**
     * Extra content rendered inside the scrollable body, after the navigation.
     */
    children?: Snippet<[{ collapsed: boolean; state: SidebarState }]>

    /**
     * Custom navigation entry renderer, forwarded to the internal NavigationMenu.
     */
    item?: NavigationMenuProps['item']

    /**
     * Custom snippet that replaces the default collapse toggle button.
     */
    toggleSlot?: Snippet<[{ collapsed: boolean }]>

    /**
     * Custom edge rail element, replacing the default rail.
     */
    railSlot?: Snippet<[{ collapsed: boolean }]>
}
