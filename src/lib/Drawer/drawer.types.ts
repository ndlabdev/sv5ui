import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { DrawerSlots } from './drawer.variants.js'
import type { DrawerDirection, DrawerRootPropsWithoutHTML } from 'vaul-svelte'

/**
 * Props inherited from vaul-svelte's DrawerRootPropsWithoutHTML.
 */
type VaulRootProps = Pick<
    DrawerRootPropsWithoutHTML,
    | 'open'
    | 'onOpenChange'
    | 'direction'
    | 'dismissible'
    | 'modal'
    | 'shouldScaleBackground'
    | 'setBackgroundColorOnScale'
    | 'closeThreshold'
    | 'scrollLockTimeout'
    | 'snapPoints'
    | 'fadeFromIndex'
    | 'activeSnapPoint'
    | 'onActiveSnapPointChange'
    | 'handleOnly'
    | 'noBodyStyles'
    | 'onDrag'
    | 'onRelease'
    | 'onClose'
    | 'nested'
    | 'fixed'
    | 'defaultOpen'
    | 'disablePreventScroll'
    | 'repositionInputs'
    | 'snapToSequentialPoint'
    | 'container'
    | 'onAnimationEnd'
    | 'preventScrollRestoration'
    | 'autoFocus'
>

export type { DrawerDirection }

export type DrawerProps = VaulRootProps & {
    /**
     * Whether to inset the drawer from the edges with rounded corners.
     * @default false
     */
    inset?: boolean

    /**
     * Title text displayed in the drawer header.
     */
    title?: string

    /**
     * Description text displayed in the drawer header.
     */
    description?: string

    /**
     * Whether to render an overlay behind the drawer.
     * @default true
     */
    overlay?: boolean

    /**
     * Whether to render a drag handle on the drawer.
     * @default true
     */
    handle?: boolean

    /**
     * Whether to render in a portal.
     * @default true
     */
    portal?: boolean

    /**
     * Override styles for specific drawer slots.
     */
    ui?: Partial<Record<DrawerSlots, ClassNameValue>>

    /**
     * Additional CSS classes for the trigger element or content (when no trigger).
     */
    class?: ClassNameValue

    /**
     * Default slot renders the trigger element.
     */
    children?: Snippet

    /**
     * Custom content slot (replaces default layout with header/body/footer).
     */
    content?: Snippet

    /**
     * Custom header slot.
     */
    header?: Snippet

    /**
     * Custom title slot.
     */
    titleSlot?: Snippet

    /**
     * Custom description slot.
     */
    descriptionSlot?: Snippet

    /**
     * Custom body slot.
     */
    body?: Snippet

    /**
     * Custom footer slot.
     */
    footer?: Snippet
}
