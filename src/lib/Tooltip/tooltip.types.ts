import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { TooltipSlots, TooltipVariantProps } from './tooltip.variants.js'
import type {
    TooltipRootPropsWithoutHTML,
    TooltipContentPropsWithoutHTML,
    TooltipArrowPropsWithoutHTML,
    TooltipProviderPropsWithoutHTML
} from 'bits-ui'
import type { KbdProps } from '../Kbd/kbd.types.js'

export type TooltipAlign = 'start' | 'center' | 'end'

type ProviderProps = Pick<
    TooltipProviderPropsWithoutHTML,
    'delayDuration' | 'disableHoverableContent'
>

type RootProps = Pick<
    TooltipRootPropsWithoutHTML,
    'open' | 'onOpenChange' | 'disableCloseOnTriggerClick' | 'ignoreNonKeyboardFocus' | 'disabled'
>

type ContentProps = Pick<
    TooltipContentPropsWithoutHTML,
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
    | 'forceMount'
>

export interface TooltipProps extends ProviderProps, RootProps, ContentProps {
    /**
     * Bindable reference to the content DOM element.
     */
    ref?: HTMLElement | null
    /**
     * The text content of the tooltip.
     */
    text?: string

    /**
     * The keyboard keys to display in the tooltip.
     * Can be an array of key strings or KbdProps objects.
     * @example ['meta', 'k'] or [{ value: 'meta' }, { value: 'k' }]
     */
    kbds?: (string | Pick<KbdProps, 'value' | 'size' | 'variant' | 'color'>)[]

    /**
     * Display an arrow alongside the tooltip.
     * Can be a boolean or arrow props for customization.
     * @default false
     */
    arrow?: boolean | Pick<TooltipArrowPropsWithoutHTML, 'width' | 'height'>

    /**
     * Animate the tooltip on open and close.
     * @default true
     */
    transition?: TooltipVariantProps['transition']

    /**
     * Render the tooltip in a portal.
     * @default true
     */
    portal?: boolean

    /**
     * Additional CSS class for the trigger wrapper.
     */
    class?: ClassNameValue

    /**
     * Override classes for tooltip slots.
     */
    ui?: Partial<Record<TooltipSlots, ClassNameValue>>

    /**
     * Trigger content (the element that triggers the tooltip).
     */
    children?: Snippet<[{ open: boolean }]>

    /**
     * Custom tooltip content.
     */
    content?: Snippet
}
