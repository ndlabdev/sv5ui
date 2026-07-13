import type { Snippet } from 'svelte'
import type { HTMLInputAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { InputTagsSlots } from './input-tags.variants.js'
import type { InputVariantProps, InputSlots } from '../Input/input.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'
import type { BadgeProps } from '../Badge/badge.types.js'

/**
 * Slot names accepted by the `ui` prop: the InputTags-specific slots plus the
 * leading/trailing slots shared with `<Input>`.
 */
export type InputTagsUISlots =
    | Exclude<InputTagsSlots, 'tagSize'>
    | Exclude<InputSlots, 'root' | 'base' | 'leadingAvatarSize'>

export type InputTagsProps = Omit<
    HTMLInputAttributes,
    'class' | 'size' | 'value' | 'type' | 'max' | 'maxlength' | 'children'
> & {
    /**
     * Bind a reference to the underlying HTMLInputElement.
     */
    ref?: HTMLInputElement | null

    /**
     * The current list of tags. Supports two-way binding with `bind:value`.
     * @default []
     */
    value?: string[]

    /**
     * Called whenever a tag is added or removed.
     */
    onValueChange?: (value: string[]) => void

    /**
     * The maximum number of tags. Adding is a no-op once reached.
     */
    max?: number

    /**
     * The maximum length of a single tag. Longer entries are rejected and
     * the limit is applied to the text input via the native `maxlength`.
     */
    maxLength?: number

    /**
     * Character that commits the current text as a tag while typing, and
     * splits pasted text into multiple tags. Set to `''` to disable
     * delimiter handling (Enter still commits).
     * @default ','
     */
    delimiter?: string

    /**
     * Split pasted text by `delimiter` and newlines, adding each part as a
     * tag instead of inserting the raw text.
     * @default true
     */
    addOnPaste?: boolean

    /**
     * Commit the current text as a tag when Tab is pressed (prevents the
     * focus move when text is present).
     * @default false
     */
    addOnTab?: boolean

    /**
     * Commit the current text as a tag when the input loses focus.
     * @default false
     */
    addOnBlur?: boolean

    /**
     * Allow the same tag to appear more than once. When `false`, duplicate
     * entries are rejected and the typed text stays in the input.
     * @default false
     */
    allowDuplicates?: boolean

    /**
     * Icon for the per-tag delete button.
     * Supports any valid Iconify icon name.
     * @default Uses `icons.close` from app config
     */
    deleteIcon?: string

    /**
     * Accessible label prefix for the per-tag delete button; the tag text is
     * appended (e.g. `Remove vue`).
     * @default 'Remove'
     */
    deleteAriaLabel?: string

    /**
     * Props forwarded to each tag `<Badge>`, merged over the defaults
     * (`color: 'surface'`, `variant: 'soft'`, size mapped from the field
     * size). The highlighted tag switches to the `solid` variant.
     *
     * @example { color: 'primary', variant: 'subtle' }
     */
    tag?: BadgeProps

    /**
     * Custom content for each tag, replacing the default text label.
     * Receives the tag string and its index.
     */
    tagSlot?: Snippet<[{ tag: string; index: number }]>

    /**
     * Icon displayed on the leading or trailing side.
     * Position controlled by the `trailing` prop.
     * Supports any valid Iconify icon name.
     */
    icon?: string

    /**
     * Icon placed before the tags.
     * Supports any valid Iconify icon name.
     */
    leadingIcon?: string

    /**
     * Icon placed after the input.
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
     * Avatar displayed before the tags.
     * Takes precedence over `leadingIcon`.
     */
    avatar?: AvatarProps

    /**
     * Custom content rendered before the tags.
     * Takes precedence over `avatar` and `leadingIcon`.
     */
    leadingSlot?: Snippet

    /**
     * Custom content rendered after the input.
     * Takes precedence over `trailingIcon`.
     */
    trailingSlot?: Snippet

    /**
     * The HTML `id` attribute for the input element. Used by a parent
     * `<FormField>` so the label's `for` attribute can target the field.
     */
    id?: string

    /**
     * The name used for the hidden inputs carrying the tags (one per tag),
     * enabling native form submission via `FormData.getAll(name)`. Also used
     * by a parent `<Form>` to look up validation state.
     */
    name?: string

    /**
     * Marks the text input as required while no tags are present.
     * @default false
     */
    required?: boolean

    /** @default false */
    disabled?: boolean

    /** @default false */
    readonly?: boolean

    /**
     * Controls the visual style of the field, mirroring `<Input>` variants.
     * @default 'outline'
     */
    variant?: NonNullable<InputVariantProps['variant']>

    /**
     * Sets the color scheme for focus ring and highlight.
     * @default 'primary'
     */
    color?: NonNullable<InputVariantProps['color']>

    /**
     * Controls the dimensions and text size of the field.
     * @default 'md'
     */
    size?: NonNullable<InputVariantProps['size']>

    /**
     * Emphasizes ring color like focus state, even when not focused.
     * Automatically enabled when used inside a FormField with an error.
     * @default false
     */
    highlight?: boolean

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific slots.
     */
    ui?: Partial<Record<InputTagsUISlots, ClassNameValue>>
}
