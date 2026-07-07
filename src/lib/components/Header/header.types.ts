import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { HeaderSlots, HeaderVariantProps } from './header.variants.js'
import type { ButtonProps } from '../Button/button.types.js'
import type { SlideoverProps } from '../Slideover/slideover.types.js'
import type { DrawerProps } from '../Drawer/drawer.types.js'

export type HeaderMode = 'modal' | 'slideover' | 'drawer'

export type HeaderMenuProps = {
    /**
     * Side the menu opens from when mode is 'slideover'.
     * @default 'right'
     */
    side?: SlideoverProps['side']

    /**
     * Direction the menu opens from when mode is 'drawer'.
     */
    direction?: DrawerProps['direction']

    /**
     * Render a backdrop overlay behind the menu.
     */
    overlay?: boolean

    /**
     * Allow dismissing the menu by clicking outside or pressing Escape.
     * Not supported by mode 'drawer'.
     */
    dismissible?: boolean
}

export type HeaderProps = Omit<HTMLAttributes<HTMLElement>, 'class' | 'title'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * Renders the header as a different HTML element.
     * @default 'header'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific header slots.
     */
    ui?: Partial<Record<HeaderSlots, ClassNameValue>>

    /**
     * Brand title text rendered as a link in the left area.
     */
    title?: string

    /**
     * Navigation target of the brand title link.
     * @default '/'
     */
    to?: string

    /**
     * How the mobile menu opens, composing the corresponding overlay component.
     * @default 'modal'
     */
    mode?: HeaderMode

    /**
     * Options forwarded to the overlay the mobile menu is built from.
     */
    menu?: HeaderMenuProps

    /**
     * Mobile menu toggle button shown below the lg breakpoint.
     * Customize with ButtonProps or hide with false.
     * Not rendered when there is no body or content to show.
     * @default true
     */
    toggle?: boolean | ButtonProps

    /**
     * Which side of the header the toggle button is placed on.
     * @default 'right'
     */
    toggleSide?: NonNullable<HeaderVariantProps['toggleSide']>

    /**
     * Bindable open state of the mobile menu.
     * @default false
     */
    open?: boolean

    /**
     * Close the mobile menu automatically when the route changes.
     * @default true
     */
    autoClose?: boolean

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Custom content to replace the default brand title link.
     */
    titleSlot?: Snippet

    /**
     * Extra content in the left area, after the brand title.
     */
    left?: Snippet

    /**
     * Center area content, hidden below the lg breakpoint.
     * Typically navigation links.
     */
    children?: Snippet

    /**
     * Content in the right area, before the toggle button.
     */
    right?: Snippet

    /**
     * Custom content to replace the default toggle button.
     */
    toggleSlot?: Snippet

    /**
     * Content rendered above the main header row.
     */
    top?: Snippet

    /**
     * Content rendered below the main header row.
     */
    bottom?: Snippet

    /**
     * Mobile menu content rendered inside the overlay body.
     */
    body?: Snippet

    /**
     * Custom content that replaces the entire mobile menu layout.
     */
    content?: Snippet
}
