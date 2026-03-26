import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { EmptyVariantProps, EmptySlots } from './empty.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'
import type { ButtonProps } from '../Button/button.types.js'

export type EmptyProps = Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'title'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * Renders the empty state as a different HTML element.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific empty slots.
     */
    ui?: Partial<Record<EmptySlots, ClassNameValue>>

    /**
     * Icon to display in the header area.
     * Takes precedence over avatar when both are provided.
     */
    icon?: string

    /**
     * Avatar configuration to display in the header area.
     * Only visible when icon is not specified.
     */
    avatar?: AvatarProps

    /**
     * Main heading text for the empty state.
     */
    title?: string

    /**
     * Supporting description text below the title.
     */
    description?: string

    /**
     * Array of button configurations to render as action buttons.
     */
    actions?: ButtonProps[]

    /**
     * Controls the visual style and background treatment.
     * @default 'outline'
     */
    variant?: NonNullable<EmptyVariantProps['variant']>

    /**
     * Controls the overall dimensions and typography scale.
     * @default 'md'
     */
    size?: NonNullable<EmptyVariantProps['size']>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Custom content to replace the default icon/avatar area.
     */
    leading?: Snippet

    /**
     * Custom content to replace the default title rendering.
     */
    titleSlot?: Snippet

    /**
     * Custom content to replace the default description rendering.
     */
    descriptionSlot?: Snippet

    /**
     * Custom content to replace the default action buttons.
     */
    actionsSlot?: Snippet

    /**
     * Custom header slot content.
     * Replaces the entire header area (leading/icon/avatar + title + description).
     */
    header?: Snippet

    /**
     * Custom body slot content.
     * Replaces the entire body area (actions).
     */
    body?: Snippet

    /**
     * Custom footer slot content.
     */
    footer?: Snippet

    /**
     * Default slot content rendered in the body area.
     */
    children?: Snippet
}
