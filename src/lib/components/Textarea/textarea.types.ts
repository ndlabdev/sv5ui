import type { Snippet } from 'svelte'
import type { HTMLTextareaAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { TextareaVariantProps, TextareaSlots } from './textarea.variants.js'

export type TextareaProps = Omit<HTMLTextareaAttributes, 'class' | 'size'> & {
    /**
     * Bind a reference to the underlying HTMLTextAreaElement.
     */
    ref?: HTMLTextAreaElement | null

    /**
     * The current value of the textarea. Supports two-way binding with `bind:value`.
     */
    value?: string

    /**
     * Controls the visual style of the textarea.
     * @default 'outline'
     */
    variant?: NonNullable<TextareaVariantProps['variant']>

    /**
     * Sets the color scheme for focus ring and highlight.
     * @default 'primary'
     */
    color?: NonNullable<TextareaVariantProps['color']>

    /**
     * Controls the dimensions and text size of the textarea.
     * @default 'md'
     */
    size?: NonNullable<TextareaVariantProps['size']>

    /**
     * Emphasizes ring color like focus state, even when not focused.
     * Automatically enabled when used inside a FormField with an error.
     * @default false
     */
    highlight?: boolean

    /**
     * Renders a loading spinner and optionally disables interaction.
     * @default false
     */
    loading?: boolean

    /**
     * Icon displayed as the loading indicator.
     * Supports any valid Iconify icon name.
     * @default Uses `icons.loading` from app config
     */
    loadingIcon?: string

    /**
     * Icon displayed on the leading or trailing side.
     * Position controlled by the `trailing` prop.
     * Supports any valid Iconify icon name.
     */
    icon?: string

    /**
     * Icon placed before the textarea value.
     * Supports any valid Iconify icon name.
     */
    leadingIcon?: string

    /**
     * Icon placed after the textarea value.
     * Supports any valid Iconify icon name.
     */
    trailingIcon?: string

    /**
     * Moves the icon to the trailing (right) side.
     * Only takes effect when using the `icon` prop.
     * @default false
     */
    trailing?: boolean

    /**
     * Custom content rendered before the textarea.
     * Takes precedence over `leadingIcon`.
     */
    leadingSlot?: Snippet

    /**
     * Custom content rendered after the textarea.
     * Takes precedence over `trailingIcon`.
     */
    trailingSlot?: Snippet

    /**
     * Automatically adjusts textarea height based on content.
     * Disables manual resizing when enabled.
     * @default false
     */
    autoresize?: boolean

    /**
     * The number of visible text lines.
     * @default 3
     */
    rows?: number

    /**
     * Maximum number of rows when autoresizing.
     * Set to 0 for unlimited growth.
     * @default 0
     */
    maxrows?: number

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific textarea slots.
     */
    ui?: Partial<Record<TextareaSlots, ClassNameValue>>
}
