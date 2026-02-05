import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { PopoverSlots, PopoverVariantProps } from './popover.variants.js'
import type {
    PopoverRootPropsWithoutHTML,
    PopoverContentPropsWithoutHTML,
    PopoverArrowPropsWithoutHTML
} from 'bits-ui'

type RootProps = Pick<PopoverRootPropsWithoutHTML, 'open' | 'onOpenChange' | 'onOpenChangeComplete'>

type ContentProps = Pick<
    PopoverContentPropsWithoutHTML,
    | 'side'
    | 'sideOffset'
    | 'align'
    | 'alignOffset'
    | 'avoidCollisions'
    | 'collisionBoundary'
    | 'collisionPadding'
    | 'sticky'
    | 'hideWhenDetached'
    | 'trapFocus'
    | 'preventScroll'
    | 'onOpenAutoFocus'
    | 'onCloseAutoFocus'
    | 'onEscapeKeydown'
    | 'onInteractOutside'
    | 'forceMount'
>

export interface PopoverProps extends RootProps, ContentProps {
    /**
     * Display an arrow alongside the popover.
     * Can be a boolean or arrow props for customization.
     * @default false
     */
    arrow?: boolean | Pick<PopoverArrowPropsWithoutHTML, 'width' | 'height'>

    /**
     * Animate the popover on open and close.
     * @default true
     */
    transition?: PopoverVariantProps['transition']

    /**
     * Render the popover content in a portal.
     * @default true
     */
    portal?: boolean

    /**
     * Allow dismissing the popover by clicking outside or pressing Escape.
     * @default true
     */
    dismissible?: boolean

    /**
     * Additional CSS class for the trigger wrapper.
     */
    class?: ClassNameValue

    /**
     * Override classes for popover slots.
     */
    ui?: Partial<Record<PopoverSlots, ClassNameValue>>

    /**
     * Default slot content used as the trigger element.
     * When provided, clicking this element opens the popover.
     */
    children?: Snippet<[{ open: boolean }]>

    /**
     * Custom popover content.
     */
    content?: Snippet<[{ open: boolean; close: () => void }]>
}
