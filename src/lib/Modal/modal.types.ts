import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { ModalSlots, ModalVariantProps } from './modal.variants.js'
import type {
    DialogRootPropsWithoutHTML,
    DialogContentPropsWithoutHTML
} from 'bits-ui'
import type { ButtonVariantProps } from '../Button/button.variants.js'

/**
 * Props inherited from bits-ui's Dialog root.
 */
type RootProps = Pick<
    DialogRootPropsWithoutHTML,
    | 'open'
    | 'onOpenChange'
    | 'onOpenChangeComplete'
>

/**
 * Props inherited from bits-ui's Dialog content.
 */
type ContentProps = Pick<
    DialogContentPropsWithoutHTML,
    | 'trapFocus'
    | 'preventScroll'
    | 'onOpenAutoFocus'
    | 'onCloseAutoFocus'
    | 'onEscapeKeydown'
    | 'onInteractOutside'
    | 'forceMount'
    | 'restoreScrollDelay'
>

/**
 * Props for customizing the close button appearance.
 */
export interface ModalCloseProps {
    /** Button color scheme. */
    color?: NonNullable<ButtonVariantProps['color']>
    /** Button visual style. */
    variant?: NonNullable<ButtonVariantProps['variant']>
    /** Button size. */
    size?: NonNullable<ButtonVariantProps['size']>
    /** Icon displayed inside the close button. Supports any Iconify icon name. */
    icon?: string
}

export interface ModalProps extends RootProps, ContentProps {
    // --- Content ---

    /**
     * Title text displayed in the modal header.
     * Rendered inside an accessible `Dialog.Title` element.
     */
    title?: string

    /**
     * Description text displayed below the title.
     * Rendered inside an accessible `Dialog.Description` element.
     */
    description?: string

    // --- Variants ---

    /**
     * Render a backdrop overlay behind the modal.
     * @default true
     */
    overlay?: ModalVariantProps['overlay']

    /**
     * Enable scrollable overlay mode where the entire modal
     * scrolls within the overlay instead of only the body.
     * @default false
     */
    scrollable?: ModalVariantProps['scrollable']

    /**
     * Animate the modal on open and close.
     * @default true
     */
    transition?: ModalVariantProps['transition']

    /**
     * Expand the modal to fill the entire viewport.
     * @default false
     */
    fullscreen?: ModalVariantProps['fullscreen']

    // --- Behavior ---

    /**
     * Render the modal content in a portal appended to `<body>`.
     * @default true
     */
    portal?: boolean

    /**
     * Display a close button in the modal header.
     * Pass `true` for the default close button, or an object
     * to customize the button appearance.
     *
     * @example
     * ```svelte
     * <!-- Default close button -->
     * <Modal close title="Title" />
     *
     * <!-- Customized close button -->
     * <Modal close={{ color: 'error', size: 'xs' }} title="Title" />
     * ```
     *
     * @default true
     */
    close?: boolean | ModalCloseProps

    /**
     * Allow dismissing the modal by clicking outside or pressing Escape.
     * When `false`, only programmatic close or the close button can dismiss.
     * @default true
     */
    dismissible?: boolean

    // --- Styling ---

    /**
     * Override classes for specific modal slots.
     */
    ui?: Partial<Record<ModalSlots, ClassNameValue>>

    /**
     * Additional CSS classes for the trigger element,
     * or the content element when no trigger is provided.
     */
    class?: ClassNameValue

    // --- Slots ---

    /**
     * Default slot content used as the trigger element.
     * When provided, clicking this element opens the modal.
     */
    children?: Snippet

    /**
     * Custom content slot that replaces the entire default layout
     * (header, body, footer). Title and description are rendered
     * in a screen-reader-only container for accessibility.
     */
    content?: Snippet

    /**
     * Custom header slot that replaces the default header
     * containing title, description, and close button.
     */
    header?: Snippet

    /**
     * Custom title slot. Overrides the `title` prop when provided.
     */
    titleSlot?: Snippet

    /**
     * Custom description slot. Overrides the `description` prop when provided.
     */
    descriptionSlot?: Snippet

    /**
     * Body content rendered between the header and footer.
     */
    body?: Snippet

    /**
     * Footer content rendered at the bottom of the modal.
     */
    footer?: Snippet

    /**
     * Custom close button slot. Overrides the default close button entirely.
     */
    closeSlot?: Snippet
}
