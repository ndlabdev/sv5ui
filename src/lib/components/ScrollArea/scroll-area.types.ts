import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { ScrollArea } from 'bits-ui'
import type {
    ScrollAreaVariantProps,
    ScrollAreaSlots,
    ScrollAreaOrientation,
    ScrollAreaType
} from './scroll-area.variants.js'

/**
 * Props inherited from bits-ui's ScrollArea root, minus the ones re-declared below.
 */
type ScrollAreaRootProps = Omit<
    ScrollArea.RootProps,
    'class' | 'child' | 'children' | 'type' | 'scrollHideDelay'
>

export type { ScrollAreaOrientation, ScrollAreaType }

export type ScrollAreaProps = ScrollAreaRootProps & {
    /**
     * Which axes render a custom scrollbar.
     * Only the enabled axes can scroll: the other one is clipped.
     * @default 'vertical'
     */
    orientation?: ScrollAreaOrientation

    /**
     * When the scrollbar is shown.
     * - `hover`: while the pointer is over the scroll area, then hidden after `scrollHideDelay`
     * - `scroll`: while scrolling, then hidden after `scrollHideDelay`
     * - `auto`: whenever the content overflows, like a native scrollbar
     * - `always`: permanently visible
     * @default 'hover'
     */
    type?: ScrollAreaType

    /**
     * Delay in milliseconds before hiding the scrollbar.
     * Only applies to the `hover` and `scroll` types.
     * @default 600
     */
    scrollHideDelay?: number

    /**
     * Sets the color scheme applied to the thumb.
     * @default 'surface'
     */
    color?: NonNullable<ScrollAreaVariantProps['color']>

    /**
     * Controls the thickness of the scrollbar.
     * @default 'sm'
     */
    size?: NonNullable<ScrollAreaVariantProps['size']>

    /**
     * Whether the scrollbar track is always tinted instead of only on hover.
     * @default false
     */
    track?: NonNullable<ScrollAreaVariantProps['track']>

    /**
     * Whether the scrollbar fades in and out.
     * @default true
     */
    transition?: NonNullable<ScrollAreaVariantProps['transition']>

    /**
     * Reference to the scrolling element.
     * Bind it to drive `scrollTo`, restore a scroll position, or attach `useInfiniteScroll`.
     */
    viewportRef?: HTMLDivElement | null

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific scroll area slots.
     */
    ui?: Partial<Record<ScrollAreaSlots, ClassNameValue>>

    /**
     * Content rendered inside the scrolling viewport.
     */
    children?: Snippet
}

/**
 * Behavior options forwarded to a nested scroll area by components that scroll
 * internally (Table, Sidebar, Slideover, NavigationMenu, Lightbox).
 * Styling stays on the host component's own `ui` slots.
 */
export type ScrollAreaOptions = Omit<
    ScrollAreaProps,
    'children' | 'class' | 'ui' | 'ref' | 'viewportRef'
>
