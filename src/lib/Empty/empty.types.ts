import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { EmptyVariantProps, EmptySlots } from './empty.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'
import type { ButtonProps } from '../Button/button.types.js'

export type EmptyProps = Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'title'> & {
    /**
     * Renders the empty state as a different HTML element.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific empty slots (root, icon, avatar, title, description, actions).
     */
    ui?: Partial<Record<EmptySlots, ClassNameValue>>

    /**
     * Icon to display in the empty state (e.g., 'lucide:inbox', 'lucide:file-x').
     * Takes precedence over avatar when both are provided.
     */
    icon?: string

    /**
     * Avatar configuration to display instead of an icon.
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
     * Controls the color scheme applied to the empty state.
     * @default 'surface'
     */
    color?: NonNullable<EmptyVariantProps['color']>

    /**
     * Controls the visual style and background treatment.
     * @default 'outline'
     */
    variant?: NonNullable<EmptyVariantProps['variant']>

    /**
     * Controls the overall dimensions, icon size, and typography scale.
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
}
